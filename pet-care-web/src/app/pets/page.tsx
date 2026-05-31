import { PetsView } from "@/components/app-ui";
import { requireCurrentSessionUser } from "@/services/auth/session";
import { getPageWindow, parsePage, resolvePageRows } from "@/services/pagination";
import { listPetsForUser } from "@/services/pets/pet-service";

type PageProps = {
  searchParams?: Promise<{ page?: string | string[] }>;
};

export default async function PetsPage({ searchParams }: PageProps) {
  const user = await requireCurrentSessionUser("/pets");
  const page = parsePage((await searchParams)?.page);
  const pets = await listPetsForUser(user.id, getPageWindow(page));
  const { items, pagination } = resolvePageRows(pets, page, "/pets");

  return <PetsView pets={items} pagination={pagination} />;
}