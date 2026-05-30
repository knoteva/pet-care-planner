import { GroupFormView } from "@/components/app-ui";
import { requireCurrentSessionUser } from "@/services/auth/session";

export default async function NewGroupPage() {
  await requireCurrentSessionUser("/groups/new");

  return <GroupFormView />;
}