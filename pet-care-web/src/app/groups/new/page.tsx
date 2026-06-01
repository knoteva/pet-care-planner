import { redirect } from "next/navigation";

import { GroupFormView } from "@/components/app-ui";
import { requireCurrentSessionUser } from "@/services/auth/session";
import {
  redirectWithFormError,
  getFormError,
} from "@/services/forms/form-errors";
import { createGroup } from "@/services/groups/group-service";

function optionalText(value: FormDataEntryValue | null) {
  const text = String(value ?? "").trim();

  return text.length > 0 ? text : null;
}

type PageProps = {
  searchParams?: Promise<{ error?: string | string[] }>;
};

function normalizeGroupError(error: unknown) {
  if (
    error instanceof Error &&
    error.message.toLowerCase().includes("duplicate")
  ) {
    return new Error("Този код за покана вече се използва. Избери друг код.");
  }

  return error;
}

export default async function NewGroupPage({ searchParams }: PageProps) {
  await requireCurrentSessionUser("/groups/new");
  const errorMessage = getFormError(
    searchParams ? await searchParams : undefined,
  );

  async function createGroupAction(formData: FormData) {
    "use server";

    const user = await requireCurrentSessionUser("/groups/new");
    const title = String(formData.get("title") ?? "").trim();
    const inviteCode = String(formData.get("inviteCode") ?? "")
      .trim()
      .toUpperCase();

    if (!title) {
      redirectWithFormError(
        "/groups/new",
        new Error("Името на групата е задължително."),
      );
    }

    if (!inviteCode) {
      redirectWithFormError(
        "/groups/new",
        new Error("Кодът за покана е задължителен."),
      );
    }

    try {
      await createGroup({
        title,
        inviteCode,
        createdById: user.id,
        area: optionalText(formData.get("area")),
        description: optionalText(formData.get("description")),
      });
    } catch (error) {
      redirectWithFormError("/groups/new", normalizeGroupError(error));
    }

    redirect("/groups");
  }

  return (
    <GroupFormView action={createGroupAction} errorMessage={errorMessage} />
  );
}
