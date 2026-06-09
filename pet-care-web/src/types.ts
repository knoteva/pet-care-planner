export type ISODateString = string;

export type UserRole = "user" | "admin";

export type PetType = "dog" | "cat" | "bird" | "rabbit" | "other";

export type EventType =
  | "dog_walk"
  | "pet_sitting"
  | "playdate"
  | "training"
  | "vet_support"
  | "other";

export type EventStatus = "upcoming" | "current" | "past" | "canceled";

export interface User {
  id: number;
  email: string;
  name: string;
  role: UserRole;
  photoUrl?: string | null;
  createdAt: ISODateString;
}

export interface Pet {
  id: number;
  ownerId: number;
  name: string;
  type: PetType;
  breed?: string | null;
  age?: number | null;
  size?: string | null;
  notes?: string | null;
  photoUrl?: string | null;
}

export interface PetGroup {
  id: number;
  title: string;
  description?: string | null;
  area?: string | null;
  inviteCode: string;
  createdById: number;
  createdAt: ISODateString;
  isManager?: boolean;
  isMember?: boolean;
  memberCount?: number;
  upcomingEventCount?: number;
}

export interface CareEvent {
  id: number;
  groupId: number;
  title: string;
  eventType: EventType;
  startsAt: ISODateString;
  durationMinutes: number;
  location: string;
  capacity: number;
  canceled: boolean;
  notes?: string | null;
  status: EventStatus;
  participantCount?: number;
  commentCount?: number;
  participationStatus?: "joined" | "waitlisted" | "left" | "removed" | null;
}

export interface EventComment {
  id: number;
  eventId: number;
  userId: number;
  text: string;
  createdAt: ISODateString;
  updatedAt?: ISODateString | null;
  deletedAt?: ISODateString | null;
}
