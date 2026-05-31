import { notFound, redirect } from "next/navigation";

import { EventPageView } from "@/components/app-ui";
import { requireCurrentSessionUser } from "@/services/auth/session";
import { createEventComment, listEventComments, softDeleteEventComment, updateEventComment } from "@/services/comments/comment-service";
import { getEventForViewer, joinEvent, leaveEvent, listEventParticipantsForViewer } from "@/services/events/event-service";
import { redirectWithFormError, getFormError } from "@/services/forms/form-errors";
import type { CareEvent, EventComment } from "@/types";

type PageProps = {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ error?: string | string[] }>;
};

function parseId(value: string) {
  const id = Number(value);

  return Number.isInteger(id) && id > 0 ? id : null;
}

function toCareEvent(event: NonNullable<Awaited<ReturnType<typeof getEventForViewer>>>): CareEvent {
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

function toComment(
  comment: Awaited<ReturnType<typeof listEventComments>>[number],
  user: Awaited<ReturnType<typeof requireCurrentSessionUser>>,
): EventComment & { authorName: string; canManage: boolean } {
  return {
    id: comment.id,
    eventId: comment.eventId,
    userId: comment.userId,
    text: comment.text,
    createdAt: comment.createdAt.toISOString(),
    updatedAt: comment.updatedAt.toISOString(),
    authorName: comment.authorName,
    canManage: user.role === "admin" || comment.userId === user.id,
  };
}

export default async function EventPage({ params, searchParams }: PageProps) {
  const user = await requireCurrentSessionUser("/dashboard");
  const eventId = parseId((await params).id);

  if (!eventId) {
    notFound();
  }

  const resolvedEventId = eventId;
  const eventPath = `/events/${resolvedEventId}`;
  const event = await getEventForViewer(resolvedEventId, user);
  const errorMessage = getFormError(searchParams ? await searchParams : undefined);

  if (!event) {
    notFound();
  }

  const [commentRows, participants] = await Promise.all([
    listEventComments(resolvedEventId),
    listEventParticipantsForViewer(resolvedEventId, user),
  ]);
  const comments = commentRows.map((comment) => toComment(comment, user));

  async function createCommentAction(formData: FormData) {
    "use server";

    const actionUser = await requireCurrentSessionUser(eventPath);
    const text = String(formData.get("text") ?? "").trim();

    if (!text) {
      redirectWithFormError(eventPath, new Error("Коментарът не може да е празен."));
    }

    try {
      await createEventComment(actionUser, resolvedEventId, text);
    } catch (error) {
      redirectWithFormError(eventPath, error);
    }

    redirect(eventPath);
  }

  async function updateCommentAction(formData: FormData) {
    "use server";

    const actionUser = await requireCurrentSessionUser(eventPath);
    const commentId = parseId(String(formData.get("commentId") ?? ""));
    const text = String(formData.get("text") ?? "").trim();

    if (!commentId || !text) {
      redirectWithFormError(eventPath, new Error("Коментарът не може да е празен."));
    }

    try {
      await updateEventComment(commentId, actionUser, text);
    } catch (error) {
      redirectWithFormError(eventPath, error);
    }

    redirect(eventPath);
  }

  async function deleteCommentAction(formData: FormData) {
    "use server";

    const actionUser = await requireCurrentSessionUser(eventPath);
    const commentId = parseId(String(formData.get("commentId") ?? ""));

    if (!commentId) {
      redirectWithFormError(eventPath, new Error("Невалиден коментар."));
    }

    try {
      await softDeleteEventComment(commentId, actionUser);
    } catch (error) {
      redirectWithFormError(eventPath, error);
    }

    redirect(eventPath);
  }

  async function joinEventAction() {
    "use server";

    const actionUser = await requireCurrentSessionUser(eventPath);

    try {
      await joinEvent(resolvedEventId, actionUser);
    } catch (error) {
      redirectWithFormError(eventPath, error);
    }

    redirect(eventPath);
  }

  async function leaveEventAction() {
    "use server";

    const actionUser = await requireCurrentSessionUser(eventPath);

    try {
      await leaveEvent(resolvedEventId, actionUser);
    } catch (error) {
      redirectWithFormError(eventPath, error);
    }

    redirect(eventPath);
  }

  return (
    <EventPageView
      event={{ ...toCareEvent(event), commentCount: comments.length }}
      comments={comments}
      participants={participants}
      commentAction={createCommentAction}
      editCommentAction={updateCommentAction}
      deleteCommentAction={deleteCommentAction}
      joinAction={joinEventAction}
      leaveAction={leaveEventAction}
      errorMessage={errorMessage}
    />
  );
}