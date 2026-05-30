import { and, asc, eq, isNull } from "drizzle-orm";

import { db } from "@/db";
import {
  groupMembers,
  petGroups,
  users,
  type NewPetGroup,
} from "@/db/schema";

export type CreateGroupInput = Pick<NewPetGroup, "title" | "description" | "area" | "inviteCode" | "createdById">;

export async function listGroupsForUser(userId: number) {
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
    .innerJoin(groupMembers, eq(groupMembers.groupId, petGroups.id))
    .where(
      and(
        eq(groupMembers.userId, userId),
        isNull(groupMembers.removedAt),
        isNull(petGroups.deletedAt),
      ),
    )
    .orderBy(asc(petGroups.title));
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
    .innerJoin(groupMembers, eq(groupMembers.groupId, petGroups.id))
    .where(
      and(
        eq(petGroups.id, groupId),
        eq(groupMembers.userId, userId),
        isNull(groupMembers.removedAt),
        isNull(petGroups.deletedAt),
      ),
    )
    .limit(1);

  return group ?? null;
}

export async function createGroup(input: CreateGroupInput) {
  const [group] = await db.insert(petGroups).values(input).returning();

  await db.insert(groupMembers).values({
    groupId: group.id,
    userId: input.createdById,
    role: "manager",
  });

  return group;
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
    .where(and(eq(groupMembers.groupId, groupId), isNull(groupMembers.removedAt), isNull(users.deletedAt)))
    .orderBy(asc(users.name));
}