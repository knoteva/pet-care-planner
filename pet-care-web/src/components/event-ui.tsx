import Link from "next/link";

import { comments } from "@/services/mock-data";
import type { CareEvent } from "@/types";
import { eventTypeLabels, formatEventDate, statusLabels } from "./app-labels";
import { Badge, InfoItem } from "./ui-primitives";

export function EventCard({ event }: { event: CareEvent }) {
  const capacityTone =
    event.participantCount && event.participantCount > event.capacity
      ? "warning"
      : "ok";

  return (
    <Link
      href="/events/sabotna-razhodka"
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
          <p>{event.commentCount} коментара</p>
        </div>
      </div>
    </Link>
  );
}

export function EventDetailsCard({
  event,
  compact = false,
}: {
  event: CareEvent;
  compact?: boolean;
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

      <div className="mt-5 flex flex-wrap gap-2">
        <button
          className="rounded-lg bg-emerald-700 px-4 py-2.5 text-sm font-bold text-white"
          type="button"
        >
          Ще участвам
        </button>
        <button
          className="rounded-lg border border-neutral-300 px-4 py-2.5 text-sm font-bold text-neutral-800"
          type="button"
        >
          Сподели линк
        </button>
      </div>

      {!compact ? (
        <div className="mt-6">
          <h3 className="font-bold">Коментари</h3>
          <div className="mt-3 grid gap-3">
            {comments.map((comment) => (
              <div
                key={comment.id}
                className="rounded-lg bg-neutral-50 p-3 text-sm text-neutral-700"
              >
                {comment.text}
              </div>
            ))}
          </div>
          <form className="mt-4 rounded-lg border border-neutral-200 bg-neutral-50 p-3">
            <input name="eventId" type="hidden" value={event.id} />
            <label className="grid gap-2 text-sm font-semibold text-neutral-800">
              Напиши коментар
              <textarea
                name="text"
                className="min-h-24 rounded-lg border border-neutral-300 bg-white px-3 py-3 text-base font-normal outline-none transition focus:border-emerald-600"
                placeholder="Например: Ще донеса вода или ще закъснея 10 мин."
              />
            </label>
            <button
              type="button"
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