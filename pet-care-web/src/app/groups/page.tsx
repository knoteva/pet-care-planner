import { GroupsView } from "@/components/app-ui";
import { requireCurrentSessionUser } from "@/services/auth/session";

export default async function GroupsPage() {
  await requireCurrentSessionUser("/groups");

  return <GroupsView />;
}