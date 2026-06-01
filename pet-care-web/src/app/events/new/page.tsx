import { redirect } from "next/navigation";

import { EventFormView } from "@/components/app-ui";
import { requireCurrentSessionUser } from "@/services/auth/session";
import {
  createEventAsManager,
  getMinimumEventStartDate,
} from "@/services/events/event-service";
import {
  getFormError,
  getFormValue,
  redirectWithFormErrorAndState,
} from "@/services/forms/form-errors";
import { listCreatableGroupsForUser } from "@/services/groups/group-service";
import type { EventType } from "@/types";

const eventFormFields = [
  "groupId",
  "title",
  "eventType",
  "startsAt",
  "durationMinutes",
  "location",
  "capacity",
  "notes",
];

function optionalText(value: FormDataEntryValue | null) {
  const text = String(value ?? "").trim();

  return text.length > 0 ? text : null;
}

function toDateTimeLocalInputValue(date: Date) {
  const localDate = new Date(
    date.getTime() - date.getTimezoneOffset() * 60_000,
  );

  return localDate.toISOString().slice(0, 16);
}

type PageProps = {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function NewEventPage({ searchParams }: PageProps) {
  const user = await requireCurrentSessionUser("/events/new");
  const groups = await listCreatableGroupsForUser(user);
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const errorMessage = getFormError(resolvedSearchParams);

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
      redirectWithFormErrorAndState(
        "/events/new",
        error,
        formData,
        eventFormFields,
      );
    }

    redirect(`/events/${eventId}`);
  }

  return (
    <EventFormView
      action={createEventAction}
      errorMessage={errorMessage}
      minStartsAt={toDateTimeLocalInputValue(getMinimumEventStartDate())}
      defaults={{
        groupId: getFormValue(resolvedSearchParams, "groupId"),
        title: getFormValue(resolvedSearchParams, "title"),
        eventType: getFormValue(resolvedSearchParams, "eventType"),
        startsAt: getFormValue(resolvedSearchParams, "startsAt"),
        durationMinutes: getFormValue(resolvedSearchParams, "durationMinutes"),
        location: getFormValue(resolvedSearchParams, "location"),
        capacity: getFormValue(resolvedSearchParams, "capacity"),
        notes: getFormValue(resolvedSearchParams, "notes"),
      }}
      groupOptions={groups.map((group) => ({
        value: String(group.id),
        label: group.title,
      }))}
    />
  );
}
