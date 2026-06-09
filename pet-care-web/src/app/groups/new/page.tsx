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

export default async function NewGroupPage({ searchParams }: PageProps) {
  await requireCurrentSessionUser("/groups/new");
  const errorMessage = getFormError(
    searchParams ? await searchParams : undefined,
  );

  async function createGroupAction(formData: FormData) {
    "use server";

    const user = await requireCurrentSessionUser("/groups/new");
    const title = String(formData.get("title") ?? "").trim();

    if (!title) {
      redirectWithFormError(
        "/groups/new",
        new Error("Името на групата е задължително."),
      );
    }

    let groupId: number;

    try {
      const group = await createGroup({
        title,
        createdById: user.id,
        area: optionalText(formData.get("area")),
        description: optionalText(formData.get("description")),
      });
      groupId = group.id;
    } catch (error) {
      redirectWithFormError("/groups/new", error);
    }

    redirect(`/groups/${groupId}`);
  }

  return (
    <GroupFormView action={createGroupAction} errorMessage={errorMessage} />
  );
}