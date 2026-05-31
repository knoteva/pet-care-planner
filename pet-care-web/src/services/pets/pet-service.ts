import { and, asc, eq, isNull } from "drizzle-orm";

import { db } from "@/db";
import { pets, type NewPet } from "@/db/schema";
import type { PetType } from "@/types";
import { enumField, integerField, textField } from "@/services/validation";

export type CreatePetInput = Pick<
  NewPet,
  "ownerId" | "name" | "type" | "breed" | "age" | "size" | "notes" | "photoUrl"
>;

// Define updateable fields (excluding ownerId for security)
export type UpdatePetInput = Partial<Omit<CreatePetInput, "ownerId">>;

// Помощен тип за създаване от фронтенда (където ownerId идва от сесията)
export type CreatePetPayload = Omit<CreatePetInput, "ownerId">;

const petTypes = ["dog", "cat", "bird", "rabbit", "other"] satisfies PetType[];

function validatePetInput<T extends Partial<CreatePetInput>>(input: T) {
  return {
    ...input,
    name: input.name === undefined ? input.name : textField(input.name, { label: "Име", max: 120 }),
    type: input.type === undefined ? input.type : enumField(input.type, petTypes, "Тип"),
    breed: input.breed === undefined ? input.breed : textField(input.breed, { label: "Порода", max: 120, required: false }),
    age: input.age === undefined ? input.age : integerField(input.age, { label: "Възраст", min: 0, max: 50, required: false }),
    size: input.size === undefined ? input.size : textField(input.size, { label: "Размер", max: 40, required: false }),
    notes: input.notes === undefined ? input.notes : textField(input.notes, { label: "Бележки", max: 1000, required: false }),
  } satisfies T;
}

/**
 * Списък с всички активни любимци на конкретен потребител.
 */
export async function listPetsForUser(userId: number, options: { limit?: number; offset?: number } = {}) {
  return db
    .select()
    .from(pets)
    .where(and(eq(pets.ownerId, userId), isNull(pets.deletedAt)))
    .orderBy(asc(pets.name))
    .limit(options.limit ?? 100)
    .offset(options.offset ?? 0);
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
  const ownerId = integerField(input.ownerId, { label: "Собственик", min: 1, max: 2147483647 });
  const cleanInput = validatePetInput(input);

  const [pet] = await db.insert(pets).values({ ...cleanInput, ownerId }).returning();

  return pet;
}

export async function updatePetForUser(petId: number, userId: number, input: UpdatePetInput) {
  integerField(petId, { label: "Любимец", min: 1, max: 2147483647 });
  integerField(userId, { label: "Потребител", min: 1, max: 2147483647 });

  const [pet] = await db
    .update(pets)
    .set({ ...validatePetInput(input), updatedAt: new Date() })
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