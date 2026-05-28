import { and, eq, isNull } from "drizzle-orm";

import { db } from "@/db";
import { groupMembers, users, type UserRow } from "@/db/schema";
import { hashPassword, verifyPassword } from "./password";
import { createAuthToken, verifyAuthToken, type AuthTokenUser } from "./tokens";

export type PublicUser = {
  id: number;
  email: string;
  name: string;
  role: "user" | "admin";
};

export type RegisterUserInput = {
  name: string;
  email: string;
  password: string;
};

export type LoginUserInput = {
  email: string;
  password: string;
};

export class AuthError extends Error {
  constructor(message: string, public readonly status = 400) {
    super(message);
    this.name = "AuthError";
  }
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function toPublicUser(user: UserRow): PublicUser {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  };
}

function toTokenUser(user: PublicUser): AuthTokenUser {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  };
}

function validatePassword(password: string) {
  if (password.length < 8) {
    throw new AuthError("Паролата трябва да е поне 8 символа.");
  }
}

export async function findUserByEmail(email: string) {
  const [user] = await db
    .select()
    .from(users)
    .where(and(eq(users.email, normalizeEmail(email)), isNull(users.deletedAt)))
    .limit(1);

  return user ?? null;
}

export async function findUserById(id: number) {
  const [user] = await db
    .select()
    .from(users)
    .where(and(eq(users.id, id), isNull(users.deletedAt)))
    .limit(1);

  return user ?? null;
}

export async function registerUser(input: RegisterUserInput) {
  const email = normalizeEmail(input.email);
  const name = input.name.trim();

  if (!name) {
    throw new AuthError("Името е задължително.");
  }

  if (!email.includes("@")) {
    throw new AuthError("Въведи валиден имейл.");
  }

  validatePassword(input.password);

  const existingUser = await findUserByEmail(email);

  if (existingUser) {
    throw new AuthError("Вече има потребител с този имейл.", 409);
  }

  const [createdUser] = await db
    .insert(users)
    .values({
      email,
      name,
      passwordHash: hashPassword(input.password),
      role: "user",
    })
    .returning();

  const user = toPublicUser(createdUser);

  return {
    user,
    token: createAuthToken(toTokenUser(user)),
  };
}

export async function loginUser(input: LoginUserInput) {
  const user = await findUserByEmail(input.email);

  if (!user || !verifyPassword(input.password, user.passwordHash)) {
    throw new AuthError("Невалиден имейл или парола.", 401);
  }

  const publicUser = toPublicUser(user);

  return {
    user: publicUser,
    token: createAuthToken(toTokenUser(publicUser)),
  };
}

export async function getCurrentUserFromToken(token: string | null | undefined) {
  if (!token) {
    return null;
  }

  const payload = verifyAuthToken(token);

  if (!payload) {
    return null;
  }

  const id = Number(payload.sub);

  if (!Number.isInteger(id)) {
    return null;
  }

  const user = await findUserById(id);

  return user ? toPublicUser(user) : null;
}

export function isAdmin(user: PublicUser | null | undefined) {
  return user?.role === "admin";
}

export async function getGroupMembership(userId: number, groupId: number) {
  const [membership] = await db
    .select()
    .from(groupMembers)
    .where(
      and(
        eq(groupMembers.userId, userId),
        eq(groupMembers.groupId, groupId),
        isNull(groupMembers.removedAt),
      ),
    )
    .limit(1);

  return membership ?? null;
}

export async function isGroupMember(userId: number, groupId: number) {
  return Boolean(await getGroupMembership(userId, groupId));
}

export async function isGroupManager(userId: number, groupId: number) {
  const membership = await getGroupMembership(userId, groupId);

  return membership?.role === "manager";
}
