import { and, count, desc, isNull, ne } from "drizzle-orm";

import { db } from "@/db";
import { careEvents, eventComments, petGroups, pets, users } from "@/db/schema";

export type AdminPanelStat = {
  label: string;
  value: string;
  tone: string;
};

export type AdminPanelUser = {
  id: number;
  name: string;
  email: string;
  role: "user" | "admin";
  status: string;
  joinedAt: string;
};

function formatJoinedAt(value: Date) {
  return new Intl.DateTimeFormat("bg-BG", {
    day: "numeric",
    month: "short",
  }).format(value);
}

async function getCount<T extends number>(query: Promise<Array<{ value: T }>>) {
  const [row] = await query;

  return Number(row?.value ?? 0);
}

export async function getAdminDashboardData(options: { limit?: number; offset?: number } = {}) {
  const [userCount, groupCount, petCount, signalCount, adminUsers] = await Promise.all([
    getCount(db.select({ value: count() }).from(users).where(isNull(users.deletedAt))),
    getCount(db.select({ value: count() }).from(petGroups).where(isNull(petGroups.deletedAt))),
    getCount(db.select({ value: count() }).from(pets).where(isNull(pets.deletedAt))),
    getCount(
      db
        .select({ value: count() })
        .from(eventComments)
        .where(and(isNull(eventComments.deletedAt), ne(eventComments.status, "visible"))),
    ),
    db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        createdAt: users.createdAt,
      })
      .from(users)
      .where(isNull(users.deletedAt))
      .orderBy(desc(users.createdAt))
      .limit(options.limit ?? 50)
      .offset(options.offset ?? 0),
  ]);

  return {
    stats: [
      { label: "Потребители", value: String(userCount), tone: "sky" },
      { label: "Групи", value: String(groupCount), tone: "emerald" },
      { label: "Любимци", value: String(petCount), tone: "violet" },
      { label: "Сигнали", value: String(signalCount), tone: "amber" },
    ] satisfies AdminPanelStat[],
    users: adminUsers.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: "активен",
      joinedAt: formatJoinedAt(user.createdAt),
    })) satisfies AdminPanelUser[],
  };
}