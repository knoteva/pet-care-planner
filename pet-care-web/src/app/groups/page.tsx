import { GroupsView } from "@/components/app-ui";
import { requireCurrentSessionUser } from "@/services/auth/session";
import { listGroupsForUser } from "@/services/groups/group-service";
import type { PetGroup } from "@/types";

function toPetGroup(group: Awaited<ReturnType<typeof listGroupsForUser>>[number]): PetGroup {
  return {
    id: group.id,
    title: group.title,
    description: group.description,
    area: group.area,
    inviteCode: group.inviteCode,
    createdById: group.createdById,
    createdAt: group.createdAt.toISOString(),
    isManager: group.role === "manager",
  };
}

export default async function GroupsPage() {
  const user = await requireCurrentSessionUser("/groups");
  const groups = (await listGroupsForUser(user.id)).map(toPetGroup);

  return <GroupsView groups={groups} />;
}