import { DashboardView } from "@/components/app-ui";
import { requireCurrentSessionUser } from "@/services/auth/session";
import { listEventsForUser } from "@/services/events/event-service";
import { listGroupsForUser } from "@/services/groups/group-service";
import { listPetsForUser } from "@/services/pets/pet-service";
import type { CareEvent, PetGroup } from "@/types";

function toDashboardEvent(
  event: Awaited<ReturnType<typeof listEventsForUser>>[number],
): CareEvent {
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
    participationStatus: event.participationStatus as CareEvent["participationStatus"],
  };
}

function toDashboardGroup(
  group: Awaited<ReturnType<typeof listGroupsForUser>>[number],
): PetGroup {
  return {
    id: group.id,
    title: group.title,
    description: group.description,
    area: group.area,
    inviteCode: group.inviteCode,
    createdById: group.createdById,
    createdAt: group.createdAt.toISOString(),
    isManager: group.role === "manager",
    isMember: Boolean(group.role),
  };
}

export default async function DashboardPage() {
  const user = await requireCurrentSessionUser("/dashboard");
  const [eventRows, pets, groupRows] = await Promise.all([
    listEventsForUser(user.id),
    listPetsForUser(user.id),
    listGroupsForUser(user.id),
  ]);

  const events = eventRows.map(toDashboardEvent);
  const groups = groupRows.map(toDashboardGroup);
  const stats = [
    { label: "Активни събития", value: String(events.length), tone: "emerald" },
    { label: "Моите любимци", value: String(pets.length), tone: "sky" },
    { label: "Групи", value: String(groups.length), tone: "violet" },
    { label: "Участия", value: String(events.filter((event) => event.participationStatus === "joined").length), tone: "amber" },
  ];

  return (
    <DashboardView events={events} groups={groups} pets={pets} stats={stats} />
  );
}
