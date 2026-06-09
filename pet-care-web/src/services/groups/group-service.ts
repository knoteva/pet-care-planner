import { randomBytes } from "crypto";
import { and, asc, eq, gte, isNull, sql } from "drizzle-orm";

import { db } from "@/db";
import {
  careEvents,
  groupMembers,
  petGroups,
  users,
  type NewPetGroup,
} from "@/db/schema";
import { isAdmin, type PublicUser } from "@/services/auth/auth-service";
import {
  integerField,
  textField,
  ValidationError,
} from "@/services/validation";

export type CreateGroupInput = Pick<
  NewPetGroup,
  "title" | "description" | "area" | "createdById"
> & {
  inviteCode?: string | null;
};

const inviteAlphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const memberCountSql = sql<number>`coalesce((select count(*)::int from ${groupMembers} where ${groupMembers.groupId} = ${petGroups.id} and ${groupMembers.removedAt} is null), 0)`;
const upcomingEventCountSql = sql<number>`coalesce((select count(*)::int from ${careEvents} where ${careEvents.groupId} = ${petGroups.id} and ${careEvents.deletedAt} is null and ${careEvents.startsAt} >= now()), 0)`;

function validateGroupInput(input: CreateGroupInput) {
  return {
    title: textField(input.title, {
      label: "Име на групата",
      min: 3,
      max: 160,
    }),
    description: textField(input.description, {
      label: "Описание",
      max: 1000,
      required: false,
    }),
    area: textField(input.area, {
      label: "Район",
      max: 180,
      required: false,
    }),
    createdById: integerField(input.createdById, {
      label: "Създател",
      min: 1,
      max: 2147483647,
    }),
  };
}

function normalizeInviteCode(inviteCode: string) {
  return textField(inviteCode, {
    label: "Код за покана",
    min: 4,
    max: 48,
    pattern: /^[A-Za-z0-9-]+$/,
  }).toUpperCase();
}

function createInviteCodeCandidate() {
  const bytes = randomBytes(6);
  const suffix = Array.from(bytes)
    .map((byte) => inviteAlphabet[byte % inviteAlphabet.length])
    .join("");

  return `PAWS-${suffix}`;
}

async function inviteCodeExists(inviteCode: string) {
  const [group] = await db
    .select({ id: petGroups.id })
    .from(petGroups)
    .where(and(eq(petGroups.inviteCode, inviteCode), isNull(petGroups.deletedAt)))
    .limit(1);

  return Boolean(group);
}

async function generateUniqueInviteCode() {
  for (let attempt = 0; attempt < 12; attempt += 1) {
    const inviteCode = createInviteCodeCandidate();

    if (!(await inviteCodeExists(inviteCode))) {
      return inviteCode;
    }
  }

  throw new ValidationError("Не успях да генерирам уникален код за покана. Опитай пак.");
}

function viewerMembershipJoin(userId: number) {
  return and(
    eq(groupMembers.groupId, petGroups.id),
    eq(groupMembers.userId, userId),
    isNull(groupMembers.removedAt),
  );
}

function publicGroupSelect() {
  return {
    id: petGroups.id,
    title: petGroups.title,
    description: petGroups.description,
    area: petGroups.area,
    inviteCode: sql<string>`''`,
    createdById: petGroups.createdById,
    createdAt: petGroups.createdAt,
    updatedAt: petGroups.updatedAt,
    role: sql<null>`null`,
    memberCount: memberCountSql,
    upcomingEventCount: upcomingEventCountSql,
  };
}

function userGroupSelect() {
  return {
    id: petGroups.id,
    title: petGroups.title,
    description: petGroups.description,
    area: petGroups.area,
    inviteCode: petGroups.inviteCode,
    createdById: petGroups.createdById,
    createdAt: petGroups.createdAt,
    updatedAt: petGroups.updatedAt,
    role: groupMembers.role,
    memberCount: memberCountSql,
    upcomingEventCount: upcomingEventCountSql,
  };
}

function adminGroupSelect() {
  return {
    id: petGroups.id,
    title: petGroups.title,
    description: petGroups.description,
    area: petGroups.area,
    inviteCode: petGroups.inviteCode,
    createdById: petGroups.createdById,
    createdAt: petGroups.createdAt,
    updatedAt: petGroups.updatedAt,
    role: sql<"manager">`'manager'`,
    memberCount: memberCountSql,
    upcomingEventCount: upcomingEventCountSql,
  };
}

export async function listPublicGroups(
  options: { limit?: number; offset?: number } = {},
) {
  return db
    .select(publicGroupSelect())
    .from(petGroups)
    .where(isNull(petGroups.deletedAt))
    .orderBy(asc(petGroups.title))
    .limit(options.limit ?? 100)
    .offset(options.offset ?? 0);
}

export async function listGroupsForUser(
  userId: number,
  options: { limit?: number; offset?: number } = {},
) {
  return db
    .select(userGroupSelect())
    .from(petGroups)
    .leftJoin(groupMembers, viewerMembershipJoin(userId))
    .where(isNull(petGroups.deletedAt))
    .orderBy(asc(petGroups.title))
    .limit(options.limit ?? 100)
    .offset(options.offset ?? 0);
}

export async function listAllGroupsForAdmin(
  options: { limit?: number; offset?: number } = {},
) {
  return db
    .select(adminGroupSelect())
    .from(petGroups)
    .where(isNull(petGroups.deletedAt))
    .orderBy(asc(petGroups.title))
    .limit(options.limit ?? 100)
    .offset(options.offset ?? 0);
}

export async function listGroupsForViewer(
  user: PublicUser | null,
  options: { limit?: number; offset?: number } = {},
) {
  if (!user) {
    return listPublicGroups(options);
  }

  return isAdmin(user)
    ? listAllGroupsForAdmin(options)
    : listGroupsForUser(user.id, options);
}

export async function listEventWritableGroupsForUser(user: PublicUser) {
  if (isAdmin(user)) {
    return listAllGroupsForAdmin();
  }

  const groups = await listGroupsForUser(user.id);

  return groups.filter((group) => Boolean(group.role));
}

export async function listCreatableGroupsForUser(user: PublicUser) {
  return listEventWritableGroupsForUser(user);
}

export async function getPublicGroupById(groupId: number) {
  const [group] = await db
    .select(publicGroupSelect())
    .from(petGroups)
    .where(and(eq(petGroups.id, groupId), isNull(petGroups.deletedAt)))
    .limit(1);

  return group ?? null;
}

export async function getGroupForUser(groupId: number, userId: number) {
  const [group] = await db
    .select(userGroupSelect())
    .from(petGroups)
    .leftJoin(groupMembers, viewerMembershipJoin(userId))
    .where(and(eq(petGroups.id, groupId), isNull(petGroups.deletedAt)))
    .limit(1);

  return group ?? null;
}

export async function getGroupForViewer(
  groupId: number,
  user: PublicUser | null,
) {
  if (!user) {
    return getPublicGroupById(groupId);
  }

  if (!isAdmin(user)) {
    return getGroupForUser(groupId, user.id);
  }

  const [group] = await db
    .select(adminGroupSelect())
    .from(petGroups)
    .where(and(eq(petGroups.id, groupId), isNull(petGroups.deletedAt)))
    .limit(1);

  return group ?? null;
}

export async function createGroup(input: CreateGroupInput) {
  const cleanInput = validateGroupInput(input);
  const inviteCode = input.inviteCode
    ? normalizeInviteCode(input.inviteCode)
    : await generateUniqueInviteCode();

  if (input.inviteCode && (await inviteCodeExists(inviteCode))) {
    throw new ValidationError("Този код за покана вече се използва. Избери друг код.");
  }

  const [group] = await db
    .insert(petGroups)
    .values({ ...cleanInput, inviteCode })
    .returning();

  await db.insert(groupMembers).values({
    groupId: group.id,
    userId: cleanInput.createdById,
    role: "manager",
  });

  return group;
}

export async function ensureGroupMembership(userId: number, groupId: number) {
  const cleanUserId = integerField(userId, {
    label: "Потребител",
    min: 1,
    max: 2147483647,
  });
  const cleanGroupId = integerField(groupId, {
    label: "Група",
    min: 1,
    max: 2147483647,
  });

  const [group] = await db
    .select({ id: petGroups.id })
    .from(petGroups)
    .where(and(eq(petGroups.id, cleanGroupId), isNull(petGroups.deletedAt)))
    .limit(1);

  if (!group) {
    throw new ValidationError("Групата не е активна.");
  }

  const [existingMembership] = await db
    .select({
      id: groupMembers.id,
      groupId: groupMembers.groupId,
      userId: groupMembers.userId,
      role: groupMembers.role,
      joinedAt: groupMembers.joinedAt,
      removedAt: groupMembers.removedAt,
    })
    .from(groupMembers)
    .where(
      and(
        eq(groupMembers.groupId, cleanGroupId),
        eq(groupMembers.userId, cleanUserId),
      ),
    )
    .limit(1);

  if (existingMembership && !existingMembership.removedAt) {
    return existingMembership;
  }

  if (existingMembership?.removedAt) {
    const [membership] = await db
      .update(groupMembers)
      .set({ role: "member", removedAt: null, joinedAt: new Date() })
      .where(eq(groupMembers.id, existingMembership.id))
      .returning();

    return membership;
  }

  const [membership] = await db
    .insert(groupMembers)
    .values({ groupId: cleanGroupId, userId: cleanUserId, role: "member" })
    .returning();

  return membership;
}

export async function joinGroupByInviteCode(
  userId: number,
  inviteCode: string,
) {
  const cleanUserId = integerField(userId, {
    label: "Потребител",
    min: 1,
    max: 2147483647,
  });
  const cleanInviteCode = normalizeInviteCode(inviteCode);

  const [group] = await db
    .select({ id: petGroups.id })
    .from(petGroups)
    .where(and(eq(petGroups.inviteCode, cleanInviteCode), isNull(petGroups.deletedAt)))
    .limit(1);

  if (!group) {
    throw new ValidationError("Няма активна група с този код за покана.");
  }

  return ensureGroupMembership(cleanUserId, group.id);
}

export async function listGroupMembers(groupId: number) {
  return db
    .select({
      id: groupMembers.id,
      groupId: groupMembers.groupId,
      userId: groupMembers.userId,
      role: groupMembers.role,
      joinedAt: groupMembers.joinedAt,
      name: users.name,
      email: users.email,
    })
    .from(groupMembers)
    .innerJoin(users, eq(users.id, groupMembers.userId))
    .where(
      and(
        eq(groupMembers.groupId, groupId),
        isNull(groupMembers.removedAt),
        isNull(users.deletedAt),
      ),
    )
    .orderBy(asc(users.name));
}