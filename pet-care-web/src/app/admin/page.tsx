import { AdminView } from "@/components/app-ui";
import { getAdminDashboardData } from "@/services/admin/admin-service";
import { requireAdminSessionUser } from "@/services/auth/session";
import {
  getPageWindow,
  parsePage,
  resolvePageRows,
} from "@/services/pagination";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams?: Promise<{ page?: string | string[] }>;
};

export default async function AdminPage({ searchParams }: PageProps) {
  await requireAdminSessionUser("/admin");

  const page = parsePage((await searchParams)?.page);
  const data = await getAdminDashboardData(getPageWindow(page));
  const { items, pagination } = resolvePageRows(data.users, page, "/admin");

  return (
    <AdminView
      access="allowed"
      stats={data.stats}
      users={items}
      pagination={pagination}
    />
  );
}
