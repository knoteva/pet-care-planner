import { EventFormView } from "@/components/app-ui";
import { requireCurrentSessionUser } from "@/services/auth/session";

export default async function NewEventPage() {
  await requireCurrentSessionUser("/events/new");

  return <EventFormView />;
}