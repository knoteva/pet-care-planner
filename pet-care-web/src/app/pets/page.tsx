import { PetsView } from "@/components/app-ui";
import { requireCurrentSessionUser } from "@/services/auth/session";

export default async function PetsPage() {
  await requireCurrentSessionUser("/pets");

  return <PetsView />;
}