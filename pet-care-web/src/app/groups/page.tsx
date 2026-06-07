import { GroupsView } from "@/components/app-ui";
import { requireCurrentSessionUser } from "@/services/auth/session";
import { listGroupsForViewer } from "@/services/groups/group-service";
import {
  getPageWindow,
  parsePage,
  resolvePageRows,
} from "@/services/pagination";
import type { PetGroup } from "@/types";

function toPetGroup(
  group: Awaited<ReturnType<typeof listGroupsForViewer>>[number],
): PetGroup {
  return {
    id: group.id,
    title: group.title,
    description: group.description,
    area: group.area,
    inviteCode: group.inviteCode,
    createdById: group.createdById,
    createdAt: group.createdAt.toISOString(),
    isManager: group.role === "manager",
    isMember: Boolean(group.role),
  };
}

type PageProps = {
  searchParams?: Promise<{ page?: string | string[] }>;
};

export default async function GroupsPage({ searchParams }: PageProps) {
  const user = await requireCurrentSessionUser("/groups");
  const page = parsePage((await searchParams)?.page);
  const groupRows = await listGroupsForViewer(user, getPageWindow(page));
  const { items, pagination } = resolvePageRows(groupRows, page, "/groups");
  const groups = items.map(toPetGroup);

  return <GroupsView groups={groups} pagination={pagination} />;
}
