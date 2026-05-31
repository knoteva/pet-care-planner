import { and, asc, eq, isNull, sql } from "drizzle-orm";

import { db } from "@/db";
import {
  careEvents,
  eventComments,
  eventParticipants,
  groupMembers,
  petGroups,
  type NewCareEvent,
} from "@/db/schema";
import { requireGroupManager, requireGroupMember, type PublicUser } from "@/services/auth/auth-service";
import { dateField, enumField, integerField, textField } from "@/services/validation";
import type { EventType } from "@/types";

export type CreateEventInput = Pick<
  NewCareEvent,
  "groupId" | "createdById" | "title" | "eventType" | "startsAt" | "durationMinutes" | "location" | "capacity" | "notes"
>;

const eventTypes = ["dog_walk", "pet_sitting", "playdate", "training", "vet_support", "other"] satisfies EventType[];

const participantCountSql = sql<number>`coalesce((select count(*)::int from ${eventParticipants} where ${eventParticipants.eventId} = ${careEvents.id} and ${eventParticipants.status} = 'joined'), 0)`;
const commentCountSql = sql<number>`coalesce((select count(*)::int from ${eventComments} where ${eventComments.eventId} = ${careEvents.id} and ${eventComments.status} = 'visible' and ${eventComments.deletedAt} is null), 0)`;

function validateCreateEventInput(input: CreateEventInput) {
  const minDate = new Date(Date.now() - 5 * 60 * 1000);
  const maxDate = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);

  return {
    ...input,
    groupId: integerField(input.groupId, { label: "Група", min: 1, max: 2147483647 }),
    createdById: integerField(input.createdById, { label: "Създател", min: 1, max: 2147483647 }),
    title: textField(input.title, { label: "Заглавие", min: 3, max: 180 }),
    eventType: enumField(input.eventType, eventTypes, "Тип събитие"),
    startsAt: dateField(input.startsAt, { label: "Дата и час", minDate, maxDate }),
    durationMinutes: integerField(input.durationMinutes, { label: "Продължителност", min: 15, max: 360 }),
    location: textField(input.location, { label: "Място", min: 3, max: 240 }),
    capacity: integerField(input.capacity, { label: "Капацитет", min: 1, max: 50 }),
    notes: textField(input.notes, { label: "Бележки", max: 1200, required: false }),
  };
}

export async function listEventsForUser(userId: number) {
  return db
    .select({
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
    })
    .from(careEvents)
    .innerJoin(petGroups, eq(petGroups.id, careEvents.groupId))
    .innerJoin(groupMembers, eq(groupMembers.groupId, careEvents.groupId))
    .where(
      and(
        eq(groupMembers.userId, userId),
        isNull(groupMembers.removedAt),
        isNull(careEvents.deletedAt),
        isNull(petGroups.deletedAt),
      ),
    )
    .orderBy(asc(careEvents.startsAt));
}

export async function getEventForUser(eventId: number, userId: number) {
  const [event] = await db
    .select({
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
      participationStatus: sql<string | null>`(select ${eventParticipants.status} from ${eventParticipants} where ${eventParticipants.eventId} = ${careEvents.id} and ${eventParticipants.userId} = ${userId} limit 1)`,
    })
    .from(careEvents)
    .innerJoin(petGroups, eq(petGroups.id, careEvents.groupId))
    .innerJoin(groupMembers, eq(groupMembers.groupId, careEvents.groupId))
    .where(
      and(
        eq(careEvents.id, eventId),
        eq(groupMembers.userId, userId),
        isNull(groupMembers.removedAt),
        isNull(careEvents.deletedAt),
        isNull(petGroups.deletedAt),
      ),
    )
    .limit(1);

  return event ?? null;
}

export async function createEventAsManager(user: PublicUser, input: CreateEventInput) {
  const cleanInput = validateCreateEventInput(input);
  await requireGroupManager(user, cleanInput.groupId);

  const [event] = await db.insert(careEvents).values(cleanInput).returning();

  return event;
}

export async function joinEvent(eventId: number, user: PublicUser, petId?: number | null) {
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
    .where(and(eq(eventParticipants.eventId, eventId), eq(eventParticipants.userId, user.id)))
    .returning();

  return participant ?? null;
}