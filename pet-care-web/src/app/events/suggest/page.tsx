import { redirect } from "next/navigation";

import { AppShell } from "@/components/app-shell";
import { EmptyState, FormCard, FormSelect, FormTextarea } from "@/components/ui-primitives";
import { requireCurrentSessionUser } from "@/services/auth/session";
import { createEventComment } from "@/services/comments/comment-service";
import { listEventsForUser } from "@/services/events/event-service";
import { listGroupsForUser } from "@/services/groups/group-service";

function parseGroupId(value: FormDataEntryValue | null) {
  const id = Number(value);

  return Number.isInteger(id) && id > 0 ? id : null;
}

export default async function SuggestEventPage() {
  const user = await requireCurrentSessionUser("/events/suggest");
  const groups = await listGroupsForUser(user.id);

  async function suggestEventAction(formData: FormData) {
    "use server";

    const actionUser = await requireCurrentSessionUser("/events/suggest");
    const groupId = parseGroupId(formData.get("groupId"));
    const text = String(formData.get("text") ?? "").trim();

    if (!groupId || !text) {
      redirect("/events/suggest");
    }

    const eventRows = await listEventsForUser(actionUser.id);
    const targetEvent = eventRows.find((event) => event.groupId === groupId);

    if (!targetEvent) {
      redirect(`/groups/${groupId}`);
    }

    await createEventComment(
      actionUser,
      targetEvent.id,
      `Предложение за ново събитие: ${text}`,
    );
    redirect(`/events/${targetEvent.id}`);
  }

  return (
    <AppShell active="/groups">
      {groups.length > 0 ? (
        <FormCard
          title="Предложи събитие"
          description="Членовете не публикуват директно нови събития. Предложението се записва като коментар към активно събитие в избраната група, за да го види мениджърът."
          submitLabel="Изпрати предложение"
          cancelHref="/groups"
          action={suggestEventAction}
        >
          <FormSelect
            name="groupId"
            label="Група"
            options={groups.map((group) => ({ value: String(group.id), label: group.title }))}
          />
          <FormTextarea
            name="text"
            label="Предложение"
            placeholder="Например: Може ли утре в 18:30 да направим разходка около Южния парк?"
            minLength={10}
            maxLength={500}
            required
          />
        </FormCard>
      ) : (
        <EmptyState
          title="Нямаш активни групи"
          description="Присъедини се към група или създай нова, преди да предложиш събитие."
          actionLabel="Към групите"
          href="/groups"
        />
      )}
    </AppShell>
  );
}