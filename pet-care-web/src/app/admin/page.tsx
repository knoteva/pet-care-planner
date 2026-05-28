import { AdminView } from "@/components/app-ui";
import { getAdminDashboardData } from "@/services/admin/admin-service";
import { getCurrentSessionUser } from "@/services/auth/session";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const user = await getCurrentSessionUser();

  if (!user) {
    return (
      <AdminView
        access="anonymous"
        stats={[]}
        users={[]}
      />
    );
  }

  if (user.role !== "admin") {
    return (
      <AdminView
        access="forbidden"
        stats={[]}
        users={[]}
      />
    );
  }

  const data = await getAdminDashboardData();

  return <AdminView access="allowed" stats={data.stats} users={data.users} />;
}