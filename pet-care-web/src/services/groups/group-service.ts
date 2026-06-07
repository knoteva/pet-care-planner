import { and, asc, eq, isNull } from "drizzle-orm";

import { db } from "@/db";
import { groupMembers, petGroups, users, type NewPetGroup } from "@/db/schema";
import { isAdmin, type PublicUser } from "@/services/auth/auth-service";
import {
  integerField,
  textField,
  ValidationError,
} from "@/services/validation";

export type CreateGroupInput = Pick<
  NewPetGroup,
  "title" | "description" | "area" | "inviteCode" | "createdById"
>;

function validateGroupInput(input: CreateGroupInput) {
  return {
    ...input,
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
    area: textField(input.area, { label: "Район", max: 180, required: false }),
    inviteCode: textField(input.inviteCode, {
      label: "Код за покана",
      min: 4,
      max: 48,
      pattern: /^[A-Z0-9-]+$/,
    }).toUpperCase(),
    createdById: integerField(input.createdById, {
      label: "Създател",
      min: 1,
      max: 2147483647,
    }),
  };
}

function viewerMembershipJoin(userId: number) {
  return and(
    eq(groupMembers.groupId, petGroups.id),
    eq(groupMembers.userId, userId),
    isNull(groupMembers.removedAt),
  );
}

export async function listGroupsForUser(
  userId: number,
  options: { limit?: number; offset?: number } = {},
) {
  return db
    .select({
      id: petGroups.id,
      title: petGroups.title,
      description: petGroups.description,
      area: petGroups.area,
      inviteCode: petGroups.inviteCode,
      createdById: petGroups.createdById,
      createdAt: petGroups.createdAt,
      updatedAt: petGroups.updatedAt,
      role: groupMembers.role,
    })
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
  const groups = await db
    .select({
      id: petGroups.id,
      title: petGroups.title,
      description: petGroups.description,
      area: petGroups.area,
      inviteCode: petGroups.inviteCode,
      createdById: petGroups.createdById,
      createdAt: petGroups.createdAt,
      updatedAt: petGroups.updatedAt,
    })
    .from(petGroups)
    .where(isNull(petGroups.deletedAt))
    .orderBy(asc(petGroups.title))
    .limit(options.limit ?? 100)
    .offset(options.offset ?? 0);

  return groups.map((group) => ({ ...group, role: "manager" as const }));
}

export async function listGroupsForViewer(
  user: PublicUser,
  options: { limit?: number; offset?: number } = {},
) {
  return isAdmin(user)
    ? listAllGroupsForAdmin(options)
    : listGroupsForUser(user.id, options);
}

export async function listCreatableGroupsForUser(user: PublicUser) {
  if (isAdmin(user)) {
    return listAllGroupsForAdmin();
  }

  const groups = await listGroupsForUser(user.id);

  return groups.filter((group) => group.role === "manager");
}

export async function getGroupForUser(groupId: number, userId: number) {
  const [group] = await db
    .select({
      id: petGroups.id,
      title: petGroups.title,
      description: petGroups.description,
      area: petGroups.area,
      inviteCode: petGroups.inviteCode,
      createdById: petGroups.createdById,
      createdAt: petGroups.createdAt,
      updatedAt: petGroups.updatedAt,
      role: groupMembers.role,
    })
    .from(petGroups)
    .leftJoin(groupMembers, viewerMembershipJoin(userId))
    .where(and(eq(petGroups.id, groupId), isNull(petGroups.deletedAt)))
    .limit(1);

  return group ?? null;
}

export async function getGroupForViewer(groupId: number, user: PublicUser) {
  if (!isAdmin(user)) {
    return getGroupForUser(groupId, user.id);
  }

  const [group] = await db
    .select({
      id: petGroups.id,
      title: petGroups.title,
      description: petGroups.description,
      area: petGroups.area,
      inviteCode: petGroups.inviteCode,
      createdById: petGroups.createdById,
      createdAt: petGroups.createdAt,
      updatedAt: petGroups.updatedAt,
    })
    .from(petGroups)
    .where(and(eq(petGroups.id, groupId), isNull(petGroups.deletedAt)))
    .limit(1);

  return group ? { ...group, role: "manager" as const } : null;
}

export async function createGroup(input: CreateGroupInput) {
  const cleanInput = validateGroupInput(input);
  const [group] = await db.insert(petGroups).values(cleanInput).returning();

  await db.insert(groupMembers).values({
    groupId: group.id,
    userId: cleanInput.createdById,
    role: "manager",
  });

  return group;
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
  const cleanInviteCode = textField(inviteCode, {
    label: "Код за покана",
    min: 4,
    max: 48,
    pattern: /^[A-Z0-9-]+$/,
  }).toUpperCase();

  const [group] = await db
    .select({ id: petGroups.id })
    .from(petGroups)
    .where(
      and(
        eq(petGroups.inviteCode, cleanInviteCode),
        isNull(petGroups.deletedAt),
      ),
    )
    .limit(1);

  if (!group) {
    throw new ValidationError("Няма активна група с този код за покана.");
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
        eq(groupMembers.groupId, group.id),
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
    .values({ groupId: group.id, userId: cleanUserId, role: "member" })
    .returning();

  return membership;
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
