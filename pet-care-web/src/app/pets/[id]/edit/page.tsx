import { notFound, redirect } from "next/navigation";

import { PetEditFormView } from "@/components/app-ui";
import { requireCurrentSessionUser } from "@/services/auth/session";
import { getPetForUser, updatePetForUser } from "@/services/pets/pet-service";
import type { PetType } from "@/types";

const PET_TYPES = new Set<PetType>(["dog", "cat", "bird", "rabbit", "other"]);

function parsePetId(value: string) {
  const petId = Number(value);

  return Number.isInteger(petId) && petId > 0 ? petId : null;
}

function optionalText(value: FormDataEntryValue | null) {
  const text = String(value ?? "").trim();

  return text.length > 0 ? text : null;
}

function optionalAge(value: FormDataEntryValue | null) {
  const text = String(value ?? "").trim();
  if (!text) {
    return null;
  }

  const age = Number(text);

  return Number.isInteger(age) && age >= 0 ? age : null;
}

export default async function EditPetPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await requireCurrentSessionUser("/pets");
  const petId = parsePetId((await params).id);

  if (!petId) {
    notFound();
  }

  const resolvedPetId = petId;
  const pet = await getPetForUser(resolvedPetId, user.id);

  if (!pet) {
    notFound();
  }

  async function updatePetAction(formData: FormData) {
    "use server";

    const actionUser = await requireCurrentSessionUser(`/pets/${resolvedPetId}/edit`);
    const name = String(formData.get("name") ?? "").trim();
    const typeValue = String(formData.get("type") ?? "");

    if (!name || !PET_TYPES.has(typeValue as PetType)) {
      redirect(`/pets/${resolvedPetId}/edit`);
    }

    await updatePetForUser(resolvedPetId, actionUser.id, {
      name,
      type: typeValue as PetType,
      breed: optionalText(formData.get("breed")),
      age: optionalAge(formData.get("age")),
      size: optionalText(formData.get("size")),
      notes: optionalText(formData.get("notes")),
      photoUrl: pet.photoUrl,
    });

    redirect("/pets");
  }

  return <PetEditFormView action={updatePetAction} pet={pet} />;
}
