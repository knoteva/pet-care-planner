import { AdminView } from "@/components/app-ui";
import { getAdminDashboardData } from "@/services/admin/admin-service";
import { requireAdminSessionUser } from "@/services/auth/session";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  await requireAdminSessionUser("/admin");

  const data = await getAdminDashboardData();

  return <AdminView access="allowed" stats={data.stats} users={data.users} />;
}