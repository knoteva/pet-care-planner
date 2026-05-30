import { and, asc, eq, isNull } from "drizzle-orm";

import { db } from "@/db";
import { pets, type NewPet } from "@/db/schema";

export type CreatePetInput = Pick<
  NewPet,
  "ownerId" | "name" | "type" | "breed" | "age" | "size" | "notes" | "photoUrl"
>;

// Define updateable fields (excluding ownerId for security)
export type UpdatePetInput = Partial<Omit<CreatePetInput, "ownerId">>;

// Помощен тип за създаване от фронтенда (където ownerId идва от сесията)
export type CreatePetPayload = Omit<CreatePetInput, "ownerId">;

/**
 * Списък с всички активни любимци на конкретен потребител.
 */
export async function listPetsForUser(userId: number) {
  return db
    .select()
    .from(pets)
    .where(and(eq(pets.ownerId, userId), isNull(pets.deletedAt)))
    .orderBy(asc(pets.name));
}

/**
 * Връща конкретен любимец, само ако той принадлежи на подадения потребител.
 */
export async function getPetForUser(petId: number, userId: number) {
  const [pet] = await db
    .select()
    .from(pets)
    .where(and(eq(pets.id, petId), eq(pets.ownerId, userId), isNull(pets.deletedAt)))
    .limit(1);

  return pet ?? null;
}

export async function createPet(input: CreatePetInput) {
  if (!input.ownerId) {
    throw new Error("Owner ID is required to create a pet.");
  }

  const [pet] = await db.insert(pets).values(input).returning();

  return pet;
}

export async function updatePetForUser(petId: number, userId: number, input: UpdatePetInput) {
  const [pet] = await db
    .update(pets)
    .set({ ...input, updatedAt: new Date() })
    .where(and(eq(pets.id, petId), eq(pets.ownerId, userId), isNull(pets.deletedAt)))
    .returning();

  return pet ?? null;
}

export async function softDeletePetForUser(petId: number, userId: number) {
  const [pet] = await db
    .update(pets)
    .set({ deletedAt: new Date(), updatedAt: new Date() })
    .where(and(eq(pets.id, petId), eq(pets.ownerId, userId), isNull(pets.deletedAt)))
    .returning();

  return pet ?? null;
}