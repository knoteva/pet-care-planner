import { and, asc, desc, eq, gte, inArray, isNull, sql } from "drizzle-orm";

import { db } from "@/db";
import {
  careEvents,
  eventComments,
  eventParticipants,
  groupMembers,
  petGroups,
  pets,
  users,
  type NewCareEvent,
} from "@/db/schema";
import {
  isAdmin,
  requireGroupManager,
  requireGroupMember,
  type PublicUser,
} from "@/services/auth/auth-service";
import {
  dateField,
  enumField,
  integerField,
  textField,
} from "@/services/validation";
import type { EventType } from "@/types";

export type CreateEventInput = Pick<
  NewCareEvent,
  | "groupId"
  | "createdById"
  | "title"
  | "eventType"
  | "startsAt"
  | "durationMinutes"
  | "location"
  | "capacity"
  | "notes"
>;

const eventTypes = [
  "dog_walk",
  "pet_sitting",
  "playdate",
  "training",
  "vet_support",
  "other",
] satisfies EventType[];

const eventStartStepMinutes = 15;
const eventStartMinHour = 8;
const eventStartMaxHour = 21;

function roundUpToEventStep(date: Date) {
  const rounded = new Date(date);
  rounded.setSeconds(0, 0);
  const remainder = rounded.getMinutes() % eventStartStepMinutes;

  if (remainder > 0) {
    rounded.setMinutes(
      rounded.getMinutes() + eventStartStepMinutes - remainder,
    );
  }

  return rounded;
}

export function getMinimumEventStartDate(now = new Date()) {
  const rounded = roundUpToEventStep(
    new Date(now.getTime() + eventStartStepMinutes * 60 * 1000),
  );
  const earliestToday = new Date(rounded);
  earliestToday.setHours(eventStartMinHour, 0, 0, 0);
  const latestToday = new Date(rounded);
  latestToday.setHours(eventStartMaxHour, 45, 0, 0);

  if (rounded < earliestToday) {
    return earliestToday;
  }

  if (rounded > latestToday) {
    const tomorrow = new Date(rounded);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(eventStartMinHour, 0, 0, 0);
    return tomorrow;
  }

  return rounded;
}

function assertAllowedEventStart(startsAt: Date) {
  const minutes = startsAt.getMinutes();
  const hour = startsAt.getHours();

  if (
    minutes % eventStartStepMinutes !== 0 ||
    startsAt.getSeconds() !== 0 ||
    startsAt.getMilliseconds() !== 0
  ) {
    throw new Error("Дата и час трябва да са на интервал от 15 минути.");
  }

  if (hour < eventStartMinHour || hour > eventStartMaxHour) {
    throw new Error("Събитията могат да започват между 08:00 и 21:45.");
  }
}

const participantCountSql = sql<number>`coalesce((select count(*)::int from ${eventParticipants} where ${eventParticipants.eventId} = ${careEvents.id} and ${eventParticipants.status} = 'joined'), 0)`;
const commentCountSql = sql<number>`coalesce((select count(*)::int from ${eventComments} where ${eventComments.eventId} = ${careEvents.id} and ${eventComments.status} = 'visible' and ${eventComments.deletedAt} is null), 0)`;

function validateCreateEventInput(input: CreateEventInput) {
  const minDate = getMinimumEventStartDate();
  const maxDate = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);
  const startsAt = dateField(input.startsAt, {
    label: "Дата и час",
    minDate,
    maxDate,
  });

  assertAllowedEventStart(startsAt);

  return {
    ...input,
    groupId: integerField(input.groupId, {
      label: "Група",
      min: 1,
      max: 2147483647,
    }),
    createdById: integerField(input.createdById, {
      label: "Създател",
      min: 1,
      max: 2147483647,
    }),
    title: textField(input.title, { label: "Заглавие", min: 3, max: 180 }),
    eventType: enumField(input.eventType, eventTypes, "Тип събитие"),
    startsAt,
    durationMinutes: integerField(input.durationMinutes, {
      label: "Продължителност",
      min: 15,
      max: 360,
    }),
    location: textField(input.location, { label: "Място", min: 3, max: 240 }),
    capacity: integerField(input.capacity, {
      label: "Капацитет",
      min: 1,
      max: 50,
    }),
    notes: textField(input.notes, {
      label: "Бележки",
      max: 1200,
      required: false,
    }),
  };
}

function participationStatusSql(userId: number) {
  return sql<
    string | null
  >`(select ${eventParticipants.status} from ${eventParticipants} where ${eventParticipants.eventId} = ${careEvents.id} and ${eventParticipants.userId} = ${userId} limit 1)`;
}

function viewerMembershipJoin(userId: number) {
  return and(
    eq(groupMembers.groupId, careEvents.groupId),
    eq(groupMembers.userId, userId),
    isNull(groupMembers.removedAt),
  );
}

function eventSelect(userId?: number) {
  return {
    id: careEvents.id,
    groupId: careEvents.groupId,
    title: careEvents.title,
    eventType: careEvents.eventType,
    startsAt: careEvents.startsAt,
    durationMinutes: careEvents.durationMinutes,
    location: careEvents.location,
    capacity: careEvents.capacity,
    status: careEvents.status,
    notes: careEvents.notes,
    groupTitle: petGroups.title,
    memberRole: groupMembers.role,
    participantCount: participantCountSql,
    commentCount: commentCountSql,
    ...(userId ? { participationStatus: participationStatusSql(userId) } : {}),
  };
}

function adminEventSelect(userId?: number) {
  return {
    id: careEvents.id,
    groupId: careEvents.groupId,
    title: careEvents.title,
    eventType: careEvents.eventType,
    startsAt: careEvents.startsAt,
    durationMinutes: careEvents.durationMinutes,
    location: careEvents.location,
    capacity: careEvents.capacity,
    status: careEvents.status,
    notes: careEvents.notes,
    groupTitle: petGroups.title,
    memberRole: sql<"manager">`'manager'`,
    participantCount: participantCountSql,
    commentCount: commentCountSql,
    ...(userId ? { participationStatus: participationStatusSql(userId) } : {}),
  };
}

export async function listEventsForUser(
  userId: number,
  options: { limit?: number; offset?: number } = {},
) {
  return db
    .select(eventSelect(userId))
    .from(careEvents)
    .innerJoin(petGroups, eq(petGroups.id, careEvents.groupId))
    .leftJoin(groupMembers, viewerMembershipJoin(userId))
    .where(
      and(
        isNull(careEvents.deletedAt),
        isNull(petGroups.deletedAt),
      ),
    )
    .orderBy(asc(careEvents.startsAt))
    .limit(options.limit ?? 100)
    .offset(options.offset ?? 0);
}

export async function listEventsForAdmin(
  options: { limit?: number; offset?: number } = {},
  userId?: number,
) {
  return db
    .select(adminEventSelect(userId))
    .from(careEvents)
    .innerJoin(petGroups, eq(petGroups.id, careEvents.groupId))
    .where(and(isNull(careEvents.deletedAt), isNull(petGroups.deletedAt)))
    .orderBy(asc(careEvents.startsAt))
    .limit(options.limit ?? 100)
    .offset(options.offset ?? 0);
}

export async function listEventsForViewer(
  user: PublicUser,
  options: { limit?: number; offset?: number } = {},
) {
  return isAdmin(user)
    ? listEventsForAdmin(options, user.id)
    : listEventsForUser(user.id, options);
}

export async function listLatestEventsForViewer(
  user: PublicUser,
  options: { limit?: number; offset?: number } = {},
) {
  const rows = isAdmin(user)
    ? await db
        .select(adminEventSelect(user.id))
        .from(careEvents)
        .innerJoin(petGroups, eq(petGroups.id, careEvents.groupId))
        .where(and(isNull(careEvents.deletedAt), isNull(petGroups.deletedAt)))
        .orderBy(desc(careEvents.startsAt))
        .limit(options.limit ?? 3)
        .offset(options.offset ?? 0)
    : await db
        .select(eventSelect(user.id))
        .from(careEvents)
        .innerJoin(petGroups, eq(petGroups.id, careEvents.groupId))
        .leftJoin(groupMembers, viewerMembershipJoin(user.id))
        .where(
          and(
            isNull(careEvents.deletedAt),
            isNull(petGroups.deletedAt),
          ),
        )
        .orderBy(desc(careEvents.startsAt))
        .limit(options.limit ?? 3)
        .offset(options.offset ?? 0);

  return rows;
}

export async function listUpcomingEventsForViewer(
  user: PublicUser,
  options: { limit?: number; offset?: number } = {},
) {
  const now = new Date();

  const rows = isAdmin(user)
    ? await db
        .select(adminEventSelect(user.id))
        .from(careEvents)
        .innerJoin(petGroups, eq(petGroups.id, careEvents.groupId))
        .where(
          and(
            gte(careEvents.startsAt, now),
            isNull(careEvents.deletedAt),
            isNull(petGroups.deletedAt),
          ),
        )
        .orderBy(asc(careEvents.startsAt))
        .limit(options.limit ?? 100)
        .offset(options.offset ?? 0)
    : await db
        .select(eventSelect(user.id))
        .from(careEvents)
        .innerJoin(petGroups, eq(petGroups.id, careEvents.groupId))
        .leftJoin(groupMembers, viewerMembershipJoin(user.id))
        .where(
          and(
            gte(careEvents.startsAt, now),
            isNull(careEvents.deletedAt),
            isNull(petGroups.deletedAt),
          ),
        )
        .orderBy(asc(careEvents.startsAt))
        .limit(options.limit ?? 100)
        .offset(options.offset ?? 0);

  return rows;
}

export async function listEventsForGroupForViewer(
  user: PublicUser,
  groupId: number,
  options: { limit?: number; offset?: number } = {},
) {
  return db
    .select(isAdmin(user) ? adminEventSelect(user.id) : eventSelect(user.id))
    .from(careEvents)
    .innerJoin(petGroups, eq(petGroups.id, careEvents.groupId))
    .leftJoin(groupMembers, viewerMembershipJoin(user.id))
    .where(
      and(
        eq(careEvents.groupId, groupId),
        isNull(careEvents.deletedAt),
        isNull(petGroups.deletedAt),
      ),
    )
    .orderBy(asc(careEvents.startsAt))
    .limit(options.limit ?? 100)
    .offset(options.offset ?? 0);
}

export async function listEventParticipantsForViewer(
  eventId: number,
  user: PublicUser,
) {
  const [event] = await db
    .select({ groupId: careEvents.groupId })
    .from(careEvents)
    .where(and(eq(careEvents.id, eventId), isNull(careEvents.deletedAt)))
    .limit(1);

  if (!event) {
    throw new Error("Event not found.");
  }

  return db
    .select({
      id: eventParticipants.id,
      eventId: eventParticipants.eventId,
      userId: eventParticipants.userId,
      name: users.name,
      petName: pets.name,
      status: eventParticipants.status,
      joinedAt: eventParticipants.joinedAt,
      leftAt: eventParticipants.leftAt,
    })
    .from(eventParticipants)
    .innerJoin(users, eq(users.id, eventParticipants.userId))
    .leftJoin(
      pets,
      and(eq(pets.id, eventParticipants.petId), isNull(pets.deletedAt)),
    )
    .where(
      and(
        eq(eventParticipants.eventId, eventId),
        inArray(eventParticipants.status, ["joined", "waitlisted"]),
        isNull(users.deletedAt),
      ),
    )
    .orderBy(asc(eventParticipants.joinedAt), asc(users.name));
}

export async function getEventForUser(eventId: number, userId: number) {
  const [event] = await db
    .select(eventSelect(userId))
    .from(careEvents)
    .innerJoin(petGroups, eq(petGroups.id, careEvents.groupId))
    .leftJoin(groupMembers, viewerMembershipJoin(userId))
    .where(
      and(
        eq(careEvents.id, eventId),
        isNull(careEvents.deletedAt),
        isNull(petGroups.deletedAt),
      ),
    )
    .limit(1);

  return event ?? null;
}

export async function getEventForViewer(eventId: number, user: PublicUser) {
  if (!isAdmin(user)) {
    return getEventForUser(eventId, user.id);
  }

  const [event] = await db
    .select(adminEventSelect(user.id))
    .from(careEvents)
    .innerJoin(petGroups, eq(petGroups.id, careEvents.groupId))
    .where(
      and(
        eq(careEvents.id, eventId),
        isNull(careEvents.deletedAt),
        isNull(petGroups.deletedAt),
      ),
    )
    .limit(1);

  return event ?? null;
}

export async function createEventAsManager(
  user: PublicUser,
  input: CreateEventInput,
) {
  const cleanInput = validateCreateEventInput(input);
  await requireGroupManager(user, cleanInput.groupId);

  const [event] = await db.insert(careEvents).values(cleanInput).returning();

  return event;
}

export async function joinEvent(
  eventId: number,
  user: PublicUser,
  petId?: number | null,
) {
  const [event] = await db
    .select({ groupId: careEvents.groupId, capacity: careEvents.capacity })
    .from(careEvents)
    .where(and(eq(careEvents.id, eventId), isNull(careEvents.deletedAt)))
    .limit(1);

  if (!event) {
    throw new Error("Event not found.");
  }

  await requireGroupMember(user, event.groupId);

  const [participant] = await db
    .insert(eventParticipants)
    .values({ eventId, userId: user.id, petId, status: "joined" })
    .onConflictDoUpdate({
      target: [eventParticipants.eventId, eventParticipants.userId],
      set: { status: "joined", petId, leftAt: null },
    })
    .returning();

  return participant;
}

export async function leaveEvent(eventId: number, user: PublicUser) {
  const [event] = await db
    .select({ groupId: careEvents.groupId })
    .from(careEvents)
    .where(and(eq(careEvents.id, eventId), isNull(careEvents.deletedAt)))
    .limit(1);

  if (!event) {
    throw new Error("Event not found.");
  }

  await requireGroupMember(user, event.groupId);

  const [participant] = await db
    .update(eventParticipants)
    .set({ status: "left", leftAt: new Date() })
    .where(
      and(
        eq(eventParticipants.eventId, eventId),
        eq(eventParticipants.userId, user.id),
      ),
    )
    .returning();

  return participant ?? null;
}
