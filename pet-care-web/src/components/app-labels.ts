import type { EventStatus, EventType } from "@/types";

export const statusLabels: Record<EventStatus, string> = {
  upcoming: "предстоящо",
  current: "в момента",
  past: "архив",
  canceled: "отменено",
  under_capacity: "има места",
  full_capacity: "запълнено",
  over_capacity: "над капацитет",
};

export const eventTypeLabels: Record<EventType, string> = {
  dog_walk: "разходка",
  pet_sitting: "грижа",
  playdate: "игра",
  training: "тренировка",
  vet_support: "ветеринар",
  other: "друго",
};

export function formatEventDate(value: string) {
  return new Intl.DateTimeFormat("bg-BG", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}