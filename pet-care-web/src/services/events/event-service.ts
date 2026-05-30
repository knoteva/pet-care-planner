import { and, asc, eq, isNull } from "drizzle-orm";

import { db } from "@/db";
import {
  careEvents,
  eventParticipants,
  groupMembers,
  petGroups,
  type NewCareEvent,
} from "@/db/schema";
import { getGroupMembership, isAdmin, type PublicUser } from "@/services/auth/auth-service";

export type CreateEventInput = Pick<
  NewCareEvent,
  "groupId" | "createdById" | "title" | "eventType" | "startsAt" | "durationMinutes" | "location" | "capacity" | "notes"
>;

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
  const membership = await getGroupMembership(user.id, input.groupId);

  if (!isAdmin(user) && membership?.role !== "manager") {
    throw new Error("Only admins and group managers can create events.");
  }

  const [event] = await db.insert(careEvents).values(input).returning();

  return event;
}

export async function joinEvent(eventId: number, userId: number, petId?: number | null) {
  const [participant] = await db
    .insert(eventParticipants)
    .values({ eventId, userId, petId, status: "joined" })
    .onConflictDoUpdate({
      target: [eventParticipants.eventId, eventParticipants.userId],
      set: { status: "joined", petId, leftAt: null },
    })
    .returning();

  return participant;
}

export async function leaveEvent(eventId: number, userId: number) {
  const [participant] = await db
    .update(eventParticipants)
    .set({ status: "left", leftAt: new Date() })
    .where(and(eq(eventParticipants.eventId, eventId), eq(eventParticipants.userId, userId)))
    .returning();

  return participant ?? null;
}