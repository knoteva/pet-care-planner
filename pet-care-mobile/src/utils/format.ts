import type { MobileEvent, MobilePet } from "@/src/services/api";

const eventTypeLabels: Record<string, string> = {
  dog_walk: "разходка",
  pet_sitting: "грижа",
  playdate: "игра",
  training: "тренировка",
  vet_support: "ветеринар",
  other: "друго",
};

const statusLabels: Record<string, string> = {
  upcoming: "предстоящо",
  current: "в момента",
  past: "минало",
  canceled: "отказано",
};

const petTypeLabels: Record<string, string> = {
  dog: "куче",
  cat: "котка",
  bird: "птица",
  rabbit: "заек",
  other: "друго",
};

export function formatEventType(value: string) {
  return eventTypeLabels[value] ?? value;
}

export function formatEventStatus(value: string) {
  return statusLabels[value] ?? value;
}

export function formatPetType(value: string) {
  return petTypeLabels[value] ?? value;
}

export function formatEventDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("bg-BG", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

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

export function formatCapacity(event: MobileEvent) {
  return `${event.participantCount ?? 0}/${event.capacity} участници`;
}

export function formatPetMeta(pet: MobilePet) {
  const parts = [
    formatPetType(pet.type),
    pet.breed,
    pet.age === null || pet.age === undefined ? null : `${pet.age} г.`,
  ].filter(Boolean);

  return parts.join(" · ");
}
