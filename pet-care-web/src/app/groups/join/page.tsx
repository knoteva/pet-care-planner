import { redirect } from "next/navigation";

import { AppShell } from "@/components/app-shell";
import { FormCard, FormField } from "@/components/ui-primitives";
import { requireCurrentSessionUser } from "@/services/auth/session";
import {
  redirectWithFormError,
  getFormError,
} from "@/services/forms/form-errors";
import { joinGroupByInviteCode } from "@/services/groups/group-service";

type PageProps = {
  searchParams?: Promise<{ error?: string | string[] }>;
};

export default async function JoinGroupPage({ searchParams }: PageProps) {
  await requireCurrentSessionUser("/groups/join");
  const errorMessage = getFormError(
    searchParams ? await searchParams : undefined,
  );

  async function joinGroupAction(formData: FormData) {
    "use server";

    const user = await requireCurrentSessionUser("/groups/join");
    const inviteCode = String(formData.get("inviteCode") ?? "")
      .trim()
      .toUpperCase();

    let groupId: number;

    try {
      const membership = await joinGroupByInviteCode(user.id, inviteCode);
      groupId = membership.groupId;
    } catch (error) {
      redirectWithFormError("/groups/join", error);
    }

    redirect(`/groups/${groupId}`);
  }

  return (
    <AppShell active="/groups">
      <FormCard
        title="Присъедини се към група"
        description="Въведи код за покана от мениджъра на групата. След успешно присъединяване ще виждаш събитията и коментарите в тази група."
        submitLabel="Присъедини се"
        cancelHref="/groups"
        errorMessage={errorMessage}
        action={joinGroupAction}
      >
        <FormField
          name="inviteCode"
          label="Код за покана"
          placeholder="PAWS-SOUTH"
          minLength={4}
          maxLength={48}
          pattern="[A-Za-z0-9-]+"
        />
      </FormCard>
    </AppShell>
  );
}
