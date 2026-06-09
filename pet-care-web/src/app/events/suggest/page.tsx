import { redirect } from "next/navigation";

export default function SuggestEventPage() {
  redirect("/events/new");
}