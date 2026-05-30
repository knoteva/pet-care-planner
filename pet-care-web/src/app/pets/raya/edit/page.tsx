import { PetEditFormView } from "@/components/app-ui";
import { requireCurrentSessionUser } from "@/services/auth/session";

export default async function EditPetPage() {
  await requireCurrentSessionUser("/pets/raya/edit");

  return <PetEditFormView />;
}