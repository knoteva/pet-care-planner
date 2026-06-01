import { asc, eq, isNull } from "drizzle-orm";

import { db } from "@/db";
import { users, type UserRow } from "@/db/schema";

export type UserListItem = Pick<
  UserRow,
  "id" | "email" | "name" | "role" | "createdAt"
>;

export async function listUsers() {
  return db
    .select({
      id: users.id,
      email: users.email,
      name: users.name,
      role: users.role,
      createdAt: users.createdAt,
    })
    .from(users)
    .where(isNull(users.deletedAt))
    .orderBy(asc(users.name));
}

export async function getUserById(id: number) {
  const [user] = await db.select().from(users).where(eq(users.id, id)).limit(1);

  return user ?? null;
}

export async function softDeleteUser(id: number) {
  const [user] = await db
    .update(users)
    .set({ deletedAt: new Date(), updatedAt: new Date() })
    .where(eq(users.id, id))
    .returning();

  return user ?? null;
}
