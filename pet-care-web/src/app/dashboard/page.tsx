import { DashboardView } from "@/components/app-ui";
import { requireCurrentSessionUser } from "@/services/auth/session";

export default async function DashboardPage() {
  await requireCurrentSessionUser("/dashboard");

  return <DashboardView />;
}