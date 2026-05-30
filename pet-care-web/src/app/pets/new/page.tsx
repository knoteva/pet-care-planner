import { PetFormView } from "@/components/app-ui";
import { requireCurrentSessionUser } from "@/services/auth/session";

export default async function NewPetPage() {
  await requireCurrentSessionUser("/pets/new");

  return <PetFormView />;
}