import { notFound, redirect } from "next/navigation";

import { PetEditFormView } from "@/components/app-ui";
import { requireCurrentSessionUser } from "@/services/auth/session";
import {
  redirectWithFormError,
  getFormError,
} from "@/services/forms/form-errors";
import { getPetForUser, updatePetForUser } from "@/services/pets/pet-service";
import { integerField } from "@/services/validation";
import type { PetType } from "@/types";

const PET_TYPES = new Set<PetType>(["dog", "cat", "bird", "rabbit", "other"]);

type PageProps = {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ error?: string | string[] }>;
};

function parsePetId(value: string) {
  const petId = Number(value);

  return Number.isInteger(petId) && petId > 0 ? petId : null;
}

function optionalText(value: FormDataEntryValue | null) {
  const text = String(value ?? "").trim();

  return text.length > 0 ? text : null;
}

function optionalAge(value: FormDataEntryValue | null) {
  return integerField(value, {
    label: "Възраст",
    min: 0,
    max: 50,
    required: false,
  });
}

export default async function EditPetPage({ params, searchParams }: PageProps) {
  const user = await requireCurrentSessionUser("/pets");
  const petId = parsePetId((await params).id);

  if (!petId) {
    notFound();
  }

  const resolvedPetId = petId;
  const editPath = `/pets/${resolvedPetId}/edit`;
  const pet = await getPetForUser(resolvedPetId, user.id);
  const errorMessage = getFormError(
    searchParams ? await searchParams : undefined,
  );

  if (!pet) {
    notFound();
  }

  async function updatePetAction(formData: FormData) {
    "use server";

    const actionUser = await requireCurrentSessionUser(editPath);
    const name = String(formData.get("name") ?? "").trim();
    const typeValue = String(formData.get("type") ?? "");

    if (!name) {
      redirectWithFormError(editPath, new Error("Името е задължително."));
    }

    if (!PET_TYPES.has(typeValue as PetType)) {
      redirectWithFormError(editPath, new Error("Избери валиден тип любимец."));
    }

    try {
      const updatedPet = await updatePetForUser(resolvedPetId, actionUser.id, {
        name,
        type: typeValue as PetType,
        breed: optionalText(formData.get("breed")),
        age: optionalAge(formData.get("age")),
        size: optionalText(formData.get("size")),
        notes: optionalText(formData.get("notes")),
        photoUrl: pet.photoUrl,
      });

      if (!updatedPet) {
        redirectWithFormError(
          editPath,
          new Error("Любимецът не беше намерен или нямаш достъп до него."),
        );
      }
    } catch (error) {
      redirectWithFormError(editPath, error);
    }

    redirect("/pets");
  }

  return (
    <PetEditFormView
      action={updatePetAction}
      pet={pet}
      errorMessage={errorMessage}
    />
  );
}
