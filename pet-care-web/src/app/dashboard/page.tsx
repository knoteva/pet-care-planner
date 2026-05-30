import { DashboardView } from "@/components/app-ui";
import { requireCurrentSessionUser } from "@/services/auth/session";
import { listEventsForUser } from "@/services/events/event-service";
import type { CareEvent } from "@/types";

function toDashboardEvent(event: Awaited<ReturnType<typeof listEventsForUser>>[number]): CareEvent {
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
    participantCount: 0,
    commentCount: 0,
  };
}

export default async function DashboardPage() {
  const user = await requireCurrentSessionUser("/dashboard");
  const events = (await listEventsForUser(user.id)).map(toDashboardEvent);

  return <DashboardView events={events} />;
}
