import { HomeView } from "@/components/app-ui";
import { getCurrentSessionUser } from "@/services/auth/session";

export default async function Home() {
  const user = await getCurrentSessionUser();

  return <HomeView currentUser={user} />;
}
