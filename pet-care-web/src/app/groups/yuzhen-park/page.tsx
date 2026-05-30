import { GroupDetailsView } from "@/components/app-ui";
import { requireCurrentSessionUser } from "@/services/auth/session";

export default async function GroupDetailsPage() {
  await requireCurrentSessionUser("/groups/yuzhen-park");

  return <GroupDetailsView />;
}