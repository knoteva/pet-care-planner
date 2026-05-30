import { EventPageView } from "@/components/app-ui";
import { requireCurrentSessionUser } from "@/services/auth/session";

export default async function EventPage() {
  await requireCurrentSessionUser("/events/sabotna-razhodka");

  return <EventPageView />;
}