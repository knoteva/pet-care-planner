import { redirect } from "next/navigation";

import { EventFormView } from "@/components/app-ui";
import { requireCurrentSessionUser } from "@/services/auth/session";
import { createEventAsManager } from "@/services/events/event-service";
import { redirectWithFormError, getFormError } from "@/services/forms/form-errors";
import { listGroupsForUser } from "@/services/groups/group-service";
import type { EventType } from "@/types";

function optionalText(value: FormDataEntryValue | null) {
  const text = String(value ?? "").trim();

  return text.length > 0 ? text : null;
}

type PageProps = {
  searchParams?: Promise<{ error?: string | string[] }>;
};

export default async function NewEventPage({ searchParams }: PageProps) {
  const user = await requireCurrentSessionUser("/events/new");
  const groups = await listGroupsForUser(user.id);
  const creatableGroups = groups.filter((group) => user.role === "admin" || group.role === "manager");
  const errorMessage = getFormError(searchParams ? await searchParams : undefined);

  async function createEventAction(formData: FormData) {
    "use server";

    const actionUser = await requireCurrentSessionUser("/events/new");
    const groupId = Number(formData.get("groupId"));
    const durationMinutes = Number(formData.get("durationMinutes"));
    const capacity = Number(formData.get("capacity"));
    const title = String(formData.get("title") ?? "").trim();
    const location = String(formData.get("location") ?? "").trim();
    const eventTypeValue = String(formData.get("eventType") ?? "") as EventType;
    const startsAt = new Date(String(formData.get("startsAt") ?? ""));

    let eventId: number;

    try {
      const event = await createEventAsManager(actionUser, {
        groupId,
        createdById: actionUser.id,
        title,
        eventType: eventTypeValue,
        startsAt,
        durationMinutes,
        location,
        capacity,
        notes: optionalText(formData.get("notes")),
      });
      eventId = event.id;
    } catch (error) {
      redirectWithFormError("/events/new", error);
    }

    redirect(`/events/${eventId}`);
  }

  return (
    <EventFormView
      action={createEventAction}
      errorMessage={errorMessage}
      groupOptions={creatableGroups.map((group) => ({ value: String(group.id), label: group.title }))}
    />
  );
}