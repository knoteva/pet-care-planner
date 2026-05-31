import { redirect } from "next/navigation";

import { EventFormView } from "@/components/app-ui";
import { requireCurrentSessionUser } from "@/services/auth/session";
import { createEventAsManager } from "@/services/events/event-service";
import { listGroupsForUser } from "@/services/groups/group-service";
import type { EventType } from "@/types";

const eventTypes = ["dog_walk", "pet_sitting", "playdate", "training", "vet_support", "other"] satisfies EventType[];

function parsePositiveInteger(value: FormDataEntryValue | null) {
  const numberValue = Number(value);

  return Number.isInteger(numberValue) && numberValue > 0 ? numberValue : null;
}

function optionalText(value: FormDataEntryValue | null) {
  const text = String(value ?? "").trim();

  return text.length > 0 ? text : null;
}

export default async function NewEventPage() {
  const user = await requireCurrentSessionUser("/events/new");
  const groups = await listGroupsForUser(user.id);
  const creatableGroups = groups.filter((group) => user.role === "admin" || group.role === "manager");

  async function createEventAction(formData: FormData) {
    "use server";

    const actionUser = await requireCurrentSessionUser("/events/new");
    const groupId = parsePositiveInteger(formData.get("groupId"));
    const durationMinutes = parsePositiveInteger(formData.get("durationMinutes"));
    const capacity = parsePositiveInteger(formData.get("capacity"));
    const title = String(formData.get("title") ?? "").trim();
    const location = String(formData.get("location") ?? "").trim();
    const eventTypeValue = String(formData.get("eventType") ?? "");
    const startsAt = new Date(String(formData.get("startsAt") ?? ""));

    if (
      !groupId ||
      !durationMinutes ||
      !capacity ||
      !title ||
      !location ||
      Number.isNaN(startsAt.getTime()) ||
      !eventTypes.includes(eventTypeValue as EventType)
    ) {
      redirect("/events/new");
    }

    const event = await createEventAsManager(actionUser, {
      groupId,
      createdById: actionUser.id,
      title,
      eventType: eventTypeValue as EventType,
      startsAt,
      durationMinutes,
      location,
      capacity,
      notes: optionalText(formData.get("notes")),
    });

    redirect(`/events/${event.id}`);
  }

  return (
    <EventFormView
      action={createEventAction}
      groupOptions={creatableGroups.map((group) => ({ value: String(group.id), label: group.title }))}
    />
  );
}