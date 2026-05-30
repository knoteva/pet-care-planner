import { and, asc, eq, isNull } from "drizzle-orm";

import { db } from "@/db";
import { pets, type NewPet } from "@/db/schema";

export type CreatePetInput = Pick<
  NewPet,
  "ownerId" | "name" | "type" | "breed" | "age" | "size" | "notes" | "photoUrl"
>;

export type UpdatePetInput = Partial<Omit<CreatePetInput, "ownerId">>;

export async function listPetsByOwner(ownerId: number) {
  return db
    .select()
    .from(pets)
    .where(and(eq(pets.ownerId, ownerId), isNull(pets.deletedAt)))
    .orderBy(asc(pets.name));
}

export async function getPetForOwner(petId: number, ownerId: number) {
  const [pet] = await db
    .select()
    .from(pets)
    .where(and(eq(pets.id, petId), eq(pets.ownerId, ownerId), isNull(pets.deletedAt)))
    .limit(1);

  return pet ?? null;
}

export async function createPet(input: CreatePetInput) {
  const [pet] = await db.insert(pets).values(input).returning();

  return pet;
}

export async function updatePetForOwner(petId: number, ownerId: number, input: UpdatePetInput) {
  const [pet] = await db
    .update(pets)
    .set({ ...input, updatedAt: new Date() })
    .where(and(eq(pets.id, petId), eq(pets.ownerId, ownerId), isNull(pets.deletedAt)))
    .returning();

  return pet ?? null;
}

export async function softDeletePetForOwner(petId: number, ownerId: number) {
  const [pet] = await db
    .update(pets)
    .set({ deletedAt: new Date(), updatedAt: new Date() })
    .where(and(eq(pets.id, petId), eq(pets.ownerId, ownerId), isNull(pets.deletedAt)))
    .returning();

  return pet ?? null;
}