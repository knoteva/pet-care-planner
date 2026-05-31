import { and, count, eq } from "drizzle-orm";

import { db } from "@/db";
import { eventParticipants } from "@/db/schema";
import type { PublicUser } from "@/services/auth/auth-service";
import { listLatestEventsForViewer } from "@/services/events/event-service";
import { listGroupsForViewer } from "@/services/groups/group-service";
import { listPetsForUser } from "@/services/pets/pet-service";
import type { CareEvent } from "@/types";

export type HomeStat = {
  label: string;
  value: string;
  detail: string;
};

export type HomeData = {
  stats: HomeStat[];
  events: CareEvent[];
};

function toCareEvent(event: Awaited<ReturnType<typeof listLatestEventsForViewer>>[number]): CareEvent {
  return {
    id: event.id,
    groupId: event.groupId,
    title: event.title,
    eventType: event.eventType,
    startsAt: event.startsAt.toISOString(),
    durationMinutes: event.durationMinutes,
    location: event.location,
    capacity: event.capacity,
    canceled: event.status === "canceled",
    notes: event.notes,
    status: event.status,
    participantCount: event.participantCount,
    commentCount: event.commentCount,
  };
}

function isSameLocalDay(left: Date, right: Date) {
  return (
    left.getFullYear() === right.getFullYear() &&
    left.getMonth() === right.getMonth() &&
    left.getDate() === right.getDate()
  );
}

async function countUserParticipations(userId: number) {
  const [row] = await db
    .select({ value: count() })
    .from(eventParticipants)
    .where(and(eq(eventParticipants.userId, userId), eq(eventParticipants.status, "joined")));

  return Number(row?.value ?? 0);
}

export async function getHomeDataForUser(user: PublicUser): Promise<HomeData> {
  const [events, groups, pets, participationCount] = await Promise.all([
    listLatestEventsForViewer(user, { limit: 6 }),
    listGroupsForViewer(user),
    listPetsForUser(user.id),
    countUserParticipations(user.id),
  ]);
  const today = new Date();
  const todayCount = events.filter((event) => isSameLocalDay(event.startsAt, today)).length;

  return {
    stats: [
      { label: "Днес", value: `${todayCount} събития`, detail: "от реалната база" },
      { label: "Групи", value: `${groups.length} активни`, detail: user.role === "admin" ? "всички групи" : "моите групи" },
      { label: "Участия", value: `${participationCount} активни`, detail: "потвърдени участия" },
      { label: "Любимци", value: `${pets.length} профила`, detail: "моите любимци" },
    ],
    events: events.slice(0, 3).map(toCareEvent),
  };
}