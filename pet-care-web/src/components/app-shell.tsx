import Link from "next/link";

import type { PublicUser } from "@/services/auth/auth-service";
import { getCurrentSessionUser } from "@/services/auth/session";
import { LogoutButton } from "./logout-button";
import { classNames } from "./ui-primitives";

type NavItem = {
  href: string;
  label: string;
  authOnly?: boolean;
  adminOnly?: boolean;
};

const navItems: NavItem[] = [
  { href: "/", label: "Начало" },
  { href: "/dashboard", label: "Табло", authOnly: true },
  { href: "/groups", label: "Групи", authOnly: true },
  { href: "/pets", label: "Любимци", authOnly: true },
  { href: "/events/new", label: "Ново събитие", authOnly: true },
  { href: "/admin", label: "Админ", adminOnly: true },
  { href: "/api/docs", label: "API" },
];

export async function AppShell({
  active,
  children,
  aside,
}: {
  active?: string;
  children: React.ReactNode;
  aside?: React.ReactNode;
}) {
  const user = await getCurrentSessionUser();

  return (
    <div className="min-h-screen bg-[#f5f7f4] text-neutral-950">
      <TopNavigation user={user} active={active} />

      <main className="mx-auto w-full max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
        <HeaderBar user={user} />
        <div
          className={classNames(
            "mt-6 grid gap-6",
            aside ? "xl:grid-cols-[minmax(0,1fr)_360px]" : "",
          )}
        >
          <section>{children}</section>
          {aside ? <aside className="space-y-5">{aside}</aside> : null}
        </div>
      </main>
    </div>
  );
}

export function TopNavigation({
  user,
  active,
}: {
  user: PublicUser | null;
  active?: string;
}) {
  const visibleItems = navItems.filter((item) => {
    if (item.adminOnly) {
      return user?.role === "admin";
    }

    if (item.authOnly) {
      return Boolean(user);
    }

    return true;
  });

  return (
    <header className="border-b border-neutral-200 bg-white shadow-sm">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-3 px-4 py-3 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-7">
          <Link href="/" className="text-3xl font-black tracking-normal text-emerald-700">
            Лапички
          </Link>
          <nav className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm font-semibold text-neutral-700">
            {visibleItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active === item.href ? "page" : undefined}
                className={classNames(
                  "transition hover:text-emerald-700",
                  active === item.href ? "text-emerald-700" : "",
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center justify-between gap-3 lg:justify-end">
          {user ? (
            <div className="flex items-center gap-2 text-right">
              <span className="grid size-9 shrink-0 place-items-center rounded-full border border-emerald-200 bg-emerald-50 text-sm font-black text-emerald-700">
                {user.name.split(" ").slice(0, 2).map(w => w[0]).join("")}
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-neutral-800">{user.name}</p>
                <div className="flex items-center justify-end gap-1.5 text-xs font-semibold text-neutral-600">
                  <Link href="/" className="hover:text-emerald-700">
                    Начало
                  </Link>
                  <span aria-hidden="true">|</span>
                  <LogoutButton variant="link" />
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-sm font-semibold">
              <Link
                href="/login"
                className="rounded-lg border border-neutral-200 bg-white px-3 py-2 transition hover:bg-neutral-50"
              >
                Вход
              </Link>
              <Link
                href="/register"
                className="rounded-lg bg-emerald-700 px-3 py-2 text-white transition hover:bg-emerald-800"
              >
                Регистрация
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

function HeaderBar({ user }: { user: PublicUser | null }) {
  const displayName = user?.name ?? "гост";

  return (
    <header className="rounded-lg border border-neutral-200 bg-white p-4">
      <p className="text-sm font-medium text-emerald-700">Здравей, {displayName}</p>
      <h1 className="text-2xl font-bold tracking-normal text-neutral-950">
        План за разходки и грижа
      </h1>
    </header>
  );
}