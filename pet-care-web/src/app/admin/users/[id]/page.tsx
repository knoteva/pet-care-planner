import { notFound } from "next/navigation";

import { AdminUserDetailsView } from "@/components/app-ui";
import { getAdminUserDetails } from "@/services/admin/admin-service";
import { requireAdminSessionUser } from "@/services/auth/session";

function parseId(value: string) {
  const id = Number(value);

  return Number.isInteger(id) && id > 0 ? id : null;
}

export default async function AdminUserPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdminSessionUser("/admin");
  const userId = parseId((await params).id);

  if (!userId) {
    notFound();
  }

  const details = await getAdminUserDetails(userId);

  if (!details) {
    notFound();
  }

  return <AdminUserDetailsView details={details} />;
}
