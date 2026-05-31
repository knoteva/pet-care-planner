import { notFound, redirect } from "next/navigation";

import { EventPageView } from "@/components/app-ui";
import { requireCurrentSessionUser } from "@/services/auth/session";
import { createEventComment, listEventComments } from "@/services/comments/comment-service";
import { getEventForUser, joinEvent, leaveEvent } from "@/services/events/event-service";
import type { CareEvent, EventComment } from "@/types";

function parseId(value: string) {
  const id = Number(value);

  return Number.isInteger(id) && id > 0 ? id : null;
}

function toCareEvent(event: NonNullable<Awaited<ReturnType<typeof getEventForUser>>>): CareEvent {
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

function toComment(comment: Awaited<ReturnType<typeof listEventComments>>[number]): EventComment & { authorName: string } {
  return {
    id: comment.id,
    eventId: comment.eventId,
    userId: comment.userId,
    text: comment.text,
    createdAt: comment.createdAt.toISOString(),
    updatedAt: comment.updatedAt.toISOString(),
    authorName: comment.authorName,
  };
}

export default async function EventPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await requireCurrentSessionUser("/dashboard");
  const eventId = parseId((await params).id);

  if (!eventId) {
    notFound();
  }

  const resolvedEventId = eventId;
  const event = await getEventForUser(resolvedEventId, user.id);

  if (!event) {
    notFound();
  }

  const comments = (await listEventComments(resolvedEventId)).map(toComment);

  async function createCommentAction(formData: FormData) {
    "use server";

    const actionUser = await requireCurrentSessionUser(`/events/${resolvedEventId}`);
    const text = String(formData.get("text") ?? "").trim();

    if (!text) {
      redirect(`/events/${resolvedEventId}`);
    }

    await createEventComment(actionUser, resolvedEventId, text);
    redirect(`/events/${resolvedEventId}`);
  }

  async function joinEventAction() {
    "use server";

    const actionUser = await requireCurrentSessionUser(`/events/${resolvedEventId}`);
    await joinEvent(resolvedEventId, actionUser);
    redirect(`/events/${resolvedEventId}`);
  }

  async function leaveEventAction() {
    "use server";

    const actionUser = await requireCurrentSessionUser(`/events/${resolvedEventId}`);
    await leaveEvent(resolvedEventId, actionUser);
    redirect(`/events/${resolvedEventId}`);
  }
  return (
    <EventPageView
      event={{ ...toCareEvent(event), commentCount: comments.length }}
      comments={comments}
      commentAction={createCommentAction}
      joinAction={joinEventAction}
      leaveAction={leaveEventAction}
    />
  );
}