import type { EventStatus, EventType } from "@/types";

export const statusLabels: Record<EventStatus, string> = {
  upcoming: "предстоящо",
  current: "в момента",
  past: "архив",
  canceled: "отменено",
};

export const eventTypeLabels: Record<EventType, string> = {
  dog_walk: "разходка",
  pet_sitting: "грижа",
  playdate: "игра",
  training: "тренировка",
  vet_support: "ветеринар",
  other: "друго",
};

export function formatCommentCount(count: number) {
  return count === 1 ? "1 коментар" : `${count} коментара`;
}
export function formatDuration(minutes: number) {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (hours === 0) {
    return `${minutes} мин.`;
  }

  if (remainingMinutes === 0) {
    return `${hours} ч.`;
  }

  return `${hours} ч. ${remainingMinutes} мин.`;
}
export function formatEventDate(value: string) {
  return new Intl.DateTimeFormat("bg-BG", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}
