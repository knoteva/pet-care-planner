import { redirect } from "next/navigation";

import { PetFormView } from "@/components/app-ui";
import { requireCurrentSessionUser } from "@/services/auth/session";
import { redirectWithFormError, getFormError } from "@/services/forms/form-errors";
import { createPet } from "@/services/pets/pet-service";
import { integerField } from "@/services/validation";
import type { PetType } from "@/types";

const PET_TYPES = new Set<PetType>(["dog", "cat", "bird", "rabbit", "other"]);

type PageProps = {
  searchParams?: Promise<{ error?: string | string[] }>;
};

function optionalText(value: FormDataEntryValue | null) {
  const text = String(value ?? "").trim();

  return text.length > 0 ? text : null;
}

function optionalAge(value: FormDataEntryValue | null) {
  return integerField(value, { label: "Възраст", min: 0, max: 50, required: false });
}

export default async function NewPetPage({ searchParams }: PageProps) {
  await requireCurrentSessionUser("/pets/new");
  const errorMessage = getFormError(searchParams ? await searchParams : undefined);

  async function createPetAction(formData: FormData) {
    "use server";

    const actionUser = await requireCurrentSessionUser("/pets/new");
    const name = String(formData.get("name") ?? "").trim();
    const typeValue = String(formData.get("type") ?? "");

    if (!name) {
      redirectWithFormError("/pets/new", new Error("Името е задължително."));
    }

    if (!PET_TYPES.has(typeValue as PetType)) {
      redirectWithFormError("/pets/new", new Error("Избери валиден тип любимец."));
    }

    try {
      await createPet({
        ownerId: actionUser.id,
        name,
        type: typeValue as PetType,
        breed: optionalText(formData.get("breed")),
        age: optionalAge(formData.get("age")),
        size: optionalText(formData.get("size")),
        notes: optionalText(formData.get("notes")),
        photoUrl: null,
      });
    } catch (error) {
      redirectWithFormError("/pets/new", error);
    }

    redirect("/pets");
  }

  return <PetFormView action={createPetAction} errorMessage={errorMessage} />;
}