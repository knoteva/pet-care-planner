import Link from "next/link";

import { comments as mockComments } from "@/services/mock-data";
import type { CareEvent, EventComment } from "@/types";
import { eventTypeLabels, formatEventDate, statusLabels } from "./app-labels";
import { ShareLinkButton } from "./share-link-button";
import { Badge, InfoItem } from "./ui-primitives";

type EventCommentView = EventComment & {
  authorName?: string;
  canManage?: boolean;
};

export function EventCard({ event }: { event: CareEvent }) {
  const capacityTone =
    event.participantCount && event.participantCount > event.capacity
      ? "warning"
      : "ok";

  return (
    <Link
      href={`/events/${event.id}`}
      className="block rounded-lg border border-neutral-200 bg-white p-4 transition hover:border-emerald-400 hover:shadow-sm"
    >
      <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_135px] sm:items-start">
        <div className="min-w-0">
          <div className="flex flex-wrap gap-2">
            <Badge
              tone={
                event.canceled
                  ? "danger"
                  : event.status === "current"
                    ? "info"
                    : "success"
              }
            >
              {statusLabels[event.status]}
            </Badge>
            <Badge tone="neutral">{eventTypeLabels[event.eventType]}</Badge>
            <Badge tone={capacityTone}>
              {event.participantCount}/{event.capacity} участници
            </Badge>
          </div>
          <h3 className="mt-3 text-lg font-bold text-neutral-950">
            {event.title}
          </h3>
          <p className="mt-1 text-sm text-neutral-600">{event.location}</p>
        </div>
        <div className="text-left text-sm text-neutral-600 sm:text-right">
          <p className="font-semibold text-neutral-950">
            {formatEventDate(event.startsAt)}
          </p>
          <p>{event.durationMinutes} мин.</p>
          <p>{event.commentCount ?? 0} коментара</p>
        </div>
      </div>
    </Link>
  );
}

export function EventDetailsCard({
  event,
  compact = false,
  comments = mockComments,
  commentAction,
  editCommentAction,
  deleteCommentAction,
  joinAction,
  leaveAction,
  errorMessage,
}: {
  event: CareEvent;
  compact?: boolean;
  comments?: EventCommentView[];
  commentAction?: React.ComponentProps<"form">["action"];
  editCommentAction?: React.ComponentProps<"form">["action"];
  deleteCommentAction?: React.ComponentProps<"form">["action"];
  joinAction?: React.ComponentProps<"form">["action"];
  leaveAction?: React.ComponentProps<"form">["action"];
  errorMessage?: string;
}) {
  return (
    <article className="rounded-lg border border-neutral-200 bg-white p-5">
      <div className="flex flex-wrap gap-2">
        <Badge tone={event.status === "current" ? "info" : "success"}>
          {statusLabels[event.status]}
        </Badge>
        <Badge
          tone={
            event.participantCount && event.participantCount > event.capacity
              ? "warning"
              : "neutral"
          }
        >
          {event.participantCount}/{event.capacity} капацитет
        </Badge>
      </div>
      <h2 className="mt-3 text-2xl font-bold text-neutral-950">
        {event.title}
      </h2>
      <p className="mt-2 text-sm leading-6 text-neutral-600">{event.notes}</p>

      <dl className="mt-5 grid gap-3 text-sm sm:grid-cols-2">
        <InfoItem label="Дата" value={formatEventDate(event.startsAt)} />
        <InfoItem
          label="Продължителност"
          value={`${event.durationMinutes} мин.`}
        />
        <InfoItem label="Място" value={event.location} />
        <InfoItem label="Тип" value={eventTypeLabels[event.eventType]} />
      </dl>

      {!compact && errorMessage ? (
        <p className="mt-5 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-800" role="alert">
          {errorMessage}
        </p>
      ) : null}

      {!compact ? (
        <div className="mt-5 flex flex-wrap gap-2">
          {event.participationStatus === "joined" ? (
            <form action={leaveAction}>
              <button
                className="rounded-lg border border-neutral-300 px-4 py-2.5 text-sm font-bold text-neutral-800"
                type="submit"
              >
                Откажи участие
              </button>
            </form>
          ) : (
            <form action={joinAction}>
              <button
                className="rounded-lg bg-emerald-700 px-4 py-2.5 text-sm font-bold text-white"
                type="submit"
              >
                Ще участвам
              </button>
            </form>
          )}
          {/* TODO: Да се направи: без любимец */}
          <ShareLinkButton />
        </div>
      ) : null}

      {!compact ? (
        <div className="mt-6">
          <h3 className="font-bold">Коментари</h3>
          <div className="mt-3 grid gap-3">
            {comments.length > 0 ? (
              comments.map((comment) => (
                <div
                  key={comment.id}
                  className="rounded-lg bg-neutral-50 p-3 text-sm text-neutral-700"
                >
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      {comment.authorName ? (
                        <p className="font-semibold text-neutral-900">{comment.authorName}</p>
                      ) : null}
                      <p className="mt-1 break-words leading-6">{comment.text}</p>
                    </div>
                    {comment.canManage ? (
                      <div className="flex shrink-0 flex-wrap gap-2 sm:justify-end">
                        {editCommentAction ? (
                          <details className="group">
                            <summary className="inline-flex cursor-pointer list-none rounded-lg border border-emerald-200 bg-white px-3 py-1.5 text-sm font-bold text-emerald-700 transition hover:bg-emerald-50 marker:content-[''] [&::-webkit-details-marker]:hidden">
                              Редактирай
                            </summary>
                            <form action={editCommentAction} className="mt-2 grid min-w-72 gap-2 rounded-lg border border-neutral-200 bg-white p-3 shadow-sm">
                              <input name="commentId" type="hidden" value={comment.id} />
                              <textarea
                                name="text"
                                className="min-h-20 rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-emerald-600"
                                defaultValue={comment.text}
                                minLength={2}
                                maxLength={500}
                                required
                              />
                              <button
                                type="submit"
                                className="w-fit rounded-lg bg-emerald-700 px-3 py-2 text-sm font-bold text-white transition hover:bg-emerald-800"
                              >
                                Запази
                              </button>
                            </form>
                          </details>
                        ) : null}
                        {deleteCommentAction ? (
                          <form action={deleteCommentAction}>
                            <input name="commentId" type="hidden" value={comment.id} />
                            <button
                              type="submit"
                              className="rounded-lg border border-rose-200 bg-white px-3 py-1.5 text-sm font-bold text-rose-700 transition hover:bg-rose-50"
                            >
                              Изтрий
                            </button>
                          </form>
                        ) : null}
                      </div>
                    ) : null}
                  </div>
                </div>
              ))
            ) : (
              <p className="rounded-lg bg-neutral-50 p-3 text-sm text-neutral-600">
                Още няма коментари.
              </p>
            )}
          </div>
          <form action={commentAction} className="mt-4 rounded-lg border border-neutral-200 bg-neutral-50 p-3">
            <input name="eventId" type="hidden" value={event.id} />
            <label className="grid gap-2 text-sm font-semibold text-neutral-800">
              Напиши коментар
              <textarea
                name="text"
                className="min-h-24 rounded-lg border border-neutral-300 bg-white px-3 py-3 text-base font-normal outline-none transition focus:border-emerald-600"
                placeholder="Например: Ще донеса вода или ще закъснея 10 мин."
                minLength={2}
                maxLength={500}
                required
              />
            </label>
            <button
              type="submit"
              className="mt-3 rounded-lg bg-emerald-700 px-4 py-2.5 text-sm font-bold text-white"
            >
              Публикувай коментар
            </button>
          </form>
        </div>
      ) : null}
    </article>
  );
}