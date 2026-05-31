import { HomeView } from "@/components/app-ui";
import { getCurrentSessionUser } from "@/services/auth/session";
import { getHomeDataForUser } from "@/services/home/home-service";

export default async function Home() {
  const user = await getCurrentSessionUser();
  const homeData = user ? await getHomeDataForUser(user) : undefined;

  return <HomeView currentUser={user} homeData={homeData} />;
}