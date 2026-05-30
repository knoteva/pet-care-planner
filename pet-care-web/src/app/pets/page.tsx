import { PetsView } from "@/components/app-ui";
import { requireCurrentSessionUser } from "@/services/auth/session";
import { listPetsForUser } from "@/services/pets/pet-service";

export default async function PetsPage() {
  const user = await requireCurrentSessionUser("/pets");
  const pets = await listPetsForUser(user.id);

  return <PetsView pets={pets} />;
}
