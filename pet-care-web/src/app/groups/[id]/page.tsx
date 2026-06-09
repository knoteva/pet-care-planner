import { notFound } from "next/navigation";

import { GroupDetailsView } from "@/components/app-ui";
import { getCurrentSessionUser } from "@/services/auth/session";
import { listEventsForGroupForViewer } from "@/services/events/event-service";
import {
  getGroupForViewer,
  listGroupMembers,
} from "@/services/groups/group-service";
import type { CareEvent, PetGroup } from "@/types";

function parseId(value: string) {
  const id = Number(value);

  return Number.isInteger(id) && id > 0 ? id : null;
}

function toPetGroup(
  group: NonNullable<Awaited<ReturnType<typeof getGroupForViewer>>>,
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
    memberCount: group.memberCount,
    upcomingEventCount: group.upcomingEventCount,
  };
}

function toCareEvent(
  event: Awaited<ReturnType<typeof listEventsForGroupForViewer>>[number],
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
  };
}

export default async function GroupPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await getCurrentSessionUser();
  const groupId = parseId((await params).id);

  if (!groupId) {
    notFound();
  }

  const group = await getGroupForViewer(groupId, user);

  if (!group) {
    notFound();
  }

  const canViewPrivateGroupContent = Boolean(group.role);
  const members =
    user && canViewPrivateGroupContent ? await listGroupMembers(groupId, user) : [];
  const events =
    user && canViewPrivateGroupContent
      ? await listEventsForGroupForViewer(user, groupId)
      : [];

  return (
    <GroupDetailsView
      group={toPetGroup(group)}
      groupEvents={events.map(toCareEvent)}
      isPrivatePreview={!canViewPrivateGroupContent}
      viewerIsLoggedIn={Boolean(user)}
      members={members.map((member) => ({
        id: member.id,
        name: member.name,
        email: member.email,
        role: member.role === "manager" ? "мениджър" : "член",
        pets: "любимци: скоро",
        joinedAt: member.joinedAt.toLocaleDateString("bg-BG", {
          day: "numeric",
          month: "short",
        }),
      }))}
    />
  );
}