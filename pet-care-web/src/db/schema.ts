import {
  relations,
  type InferInsertModel,
  type InferSelectModel,
} from "drizzle-orm";
import {
  index,
  integer,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/pg-core";

export const userRoleEnum = pgEnum("user_role", ["user", "admin"]);

export const petTypeEnum = pgEnum("pet_type", [
  "dog",
  "cat",
  "bird",
  "rabbit",
  "other",
]);

export const groupMemberRoleEnum = pgEnum("group_member_role", [
  "member",
  "manager",
]);

export const eventTypeEnum = pgEnum("event_type", [
  "dog_walk",
  "pet_sitting",
  "playdate",
  "training",
  "vet_support",
  "other",
]);

export const eventStatusEnum = pgEnum("event_status", [
  "upcoming",
  "current",
  "past",
  "canceled",
]);

export const eventParticipantStatusEnum = pgEnum("event_participant_status", [
  "joined",
  "waitlisted",
  "left",
  "removed",
]);

export const eventCommentStatusEnum = pgEnum("event_comment_status", [
  "visible",
  "reported",
  "hidden",
]);

export const users = pgTable(
  "users",
  {
    id: serial("id").primaryKey(),
    email: varchar("email", { length: 255 }).notNull(),
    passwordHash: text("password_hash").notNull(),
    name: varchar("name", { length: 120 }).notNull(),
    role: userRoleEnum("role").notNull().default("user"),
    photoUrl: text("photo_url"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
  },
  (table) => [
    uniqueIndex("users_email_unique").on(table.email),
    index("users_deleted_at_idx").on(table.deletedAt),
  ],
);

export const pets = pgTable(
  "pets",
  {
    id: serial("id").primaryKey(),
    ownerId: integer("owner_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    name: varchar("name", { length: 120 }).notNull(),
    type: petTypeEnum("type").notNull(),
    breed: varchar("breed", { length: 120 }),
    age: integer("age"),
    size: varchar("size", { length: 40 }),
    notes: text("notes"),
    photoUrl: text("photo_url"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
  },
  (table) => [
    index("pets_owner_id_idx").on(table.ownerId),
    index("pets_type_idx").on(table.type),
    index("pets_deleted_at_idx").on(table.deletedAt),
  ],
);

export const petGroups = pgTable(
  "pet_groups",
  {
    id: serial("id").primaryKey(),
    title: varchar("title", { length: 160 }).notNull(),
    description: text("description"),
    area: varchar("area", { length: 180 }),
    inviteCode: varchar("invite_code", { length: 48 }).notNull(),
    createdById: integer("created_by_id")
      .notNull()
      .references(() => users.id, { onDelete: "restrict" }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
  },
  (table) => [
    uniqueIndex("pet_groups_invite_code_unique").on(table.inviteCode),
    index("pet_groups_created_by_id_idx").on(table.createdById),
    index("pet_groups_deleted_at_idx").on(table.deletedAt),
  ],
);

export const groupMembers = pgTable(
  "group_members",
  {
    id: serial("id").primaryKey(),
    groupId: integer("group_id")
      .notNull()
      .references(() => petGroups.id, { onDelete: "cascade" }),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    role: groupMemberRoleEnum("role").notNull().default("member"),
    joinedAt: timestamp("joined_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    removedAt: timestamp("removed_at", { withTimezone: true }),
  },
  (table) => [
    uniqueIndex("group_members_group_id_user_id_unique").on(
      table.groupId,
      table.userId,
    ),
    index("group_members_group_id_idx").on(table.groupId),
    index("group_members_user_id_idx").on(table.userId),
  ],
);

export const careEvents = pgTable(
  "care_events",
  {
    id: serial("id").primaryKey(),
    groupId: integer("group_id")
      .notNull()
      .references(() => petGroups.id, { onDelete: "cascade" }),
    createdById: integer("created_by_id")
      .notNull()
      .references(() => users.id, { onDelete: "restrict" }),
    title: varchar("title", { length: 180 }).notNull(),
    eventType: eventTypeEnum("event_type").notNull(),
    startsAt: timestamp("starts_at", { withTimezone: true }).notNull(),
    durationMinutes: integer("duration_minutes").notNull(),
    location: text("location").notNull(),
    capacity: integer("capacity").notNull().default(1),
    status: eventStatusEnum("status").notNull().default("upcoming"),
    notes: text("notes"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
  },
  (table) => [
    index("care_events_group_id_idx").on(table.groupId),
    index("care_events_created_by_id_idx").on(table.createdById),
    index("care_events_starts_at_idx").on(table.startsAt),
    index("care_events_status_idx").on(table.status),
    index("care_events_deleted_at_idx").on(table.deletedAt),
  ],
);

export const eventParticipants = pgTable(
  "event_participants",
  {
    id: serial("id").primaryKey(),
    eventId: integer("event_id")
      .notNull()
      .references(() => careEvents.id, { onDelete: "cascade" }),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    petId: integer("pet_id").references(() => pets.id, {
      onDelete: "set null",
    }),
    status: eventParticipantStatusEnum("status").notNull().default("joined"),
    notes: text("notes"),
    joinedAt: timestamp("joined_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    leftAt: timestamp("left_at", { withTimezone: true }),
  },
  (table) => [
    uniqueIndex("event_participants_event_id_user_id_unique").on(
      table.eventId,
      table.userId,
    ),
    index("event_participants_event_id_idx").on(table.eventId),
    index("event_participants_user_id_idx").on(table.userId),
    index("event_participants_pet_id_idx").on(table.petId),
    index("event_participants_status_idx").on(table.status),
  ],
);

export const eventComments = pgTable(
  "event_comments",
  {
    id: serial("id").primaryKey(),
    eventId: integer("event_id")
      .notNull()
      .references(() => careEvents.id, { onDelete: "cascade" }),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    text: text("text").notNull(),
    status: eventCommentStatusEnum("status").notNull().default("visible"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
  },
  (table) => [
    index("event_comments_event_id_idx").on(table.eventId),
    index("event_comments_user_id_idx").on(table.userId),
    index("event_comments_status_idx").on(table.status),
    index("event_comments_deleted_at_idx").on(table.deletedAt),
  ],
);

export const usersRelations = relations(users, ({ many }) => ({
  pets: many(pets),
  createdGroups: many(petGroups),
  groupMemberships: many(groupMembers),
  createdEvents: many(careEvents),
  eventParticipants: many(eventParticipants),
  eventComments: many(eventComments),
}));

export const petsRelations = relations(pets, ({ one, many }) => ({
  owner: one(users, {
    fields: [pets.ownerId],
    references: [users.id],
  }),
  eventParticipants: many(eventParticipants),
}));

export const petGroupsRelations = relations(petGroups, ({ one, many }) => ({
  creator: one(users, {
    fields: [petGroups.createdById],
    references: [users.id],
  }),
  members: many(groupMembers),
  events: many(careEvents),
}));

export const groupMembersRelations = relations(groupMembers, ({ one }) => ({
  group: one(petGroups, {
    fields: [groupMembers.groupId],
    references: [petGroups.id],
  }),
  user: one(users, {
    fields: [groupMembers.userId],
    references: [users.id],
  }),
}));

export const careEventsRelations = relations(careEvents, ({ one, many }) => ({
  group: one(petGroups, {
    fields: [careEvents.groupId],
    references: [petGroups.id],
  }),
  creator: one(users, {
    fields: [careEvents.createdById],
    references: [users.id],
  }),
  participants: many(eventParticipants),
  comments: many(eventComments),
}));

export const eventParticipantsRelations = relations(
  eventParticipants,
  ({ one }) => ({
    event: one(careEvents, {
      fields: [eventParticipants.eventId],
      references: [careEvents.id],
    }),
    user: one(users, {
      fields: [eventParticipants.userId],
      references: [users.id],
    }),
    pet: one(pets, {
      fields: [eventParticipants.petId],
      references: [pets.id],
    }),
  }),
);

export const eventCommentsRelations = relations(eventComments, ({ one }) => ({
  event: one(careEvents, {
    fields: [eventComments.eventId],
    references: [careEvents.id],
  }),
  user: one(users, {
    fields: [eventComments.userId],
    references: [users.id],
  }),
}));

export type UserRow = InferSelectModel<typeof users>;
export type NewUser = InferInsertModel<typeof users>;
export type PetRow = InferSelectModel<typeof pets>;
export type NewPet = InferInsertModel<typeof pets>;
export type PetGroupRow = InferSelectModel<typeof petGroups>;
export type NewPetGroup = InferInsertModel<typeof petGroups>;
export type GroupMemberRow = InferSelectModel<typeof groupMembers>;
export type NewGroupMember = InferInsertModel<typeof groupMembers>;
export type CareEventRow = InferSelectModel<typeof careEvents>;
export type NewCareEvent = InferInsertModel<typeof careEvents>;
export type EventParticipantRow = InferSelectModel<typeof eventParticipants>;
export type NewEventParticipant = InferInsertModel<typeof eventParticipants>;
export type EventCommentRow = InferSelectModel<typeof eventComments>;
export type NewEventComment = InferInsertModel<typeof eventComments>;
