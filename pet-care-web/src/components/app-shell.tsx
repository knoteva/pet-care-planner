import Link from "next/link";

import type { PublicUser } from "@/services/auth/auth-service";
import { getCurrentSessionUser } from "@/services/auth/session";
import { classNames } from "./ui-primitives";

const navSections = [
  {
    title: "Публично",
    items: [{ href: "/", label: "Начало", icon: "⌂" }],
  },
  {
    title: "След вход",
    items: [
      { href: "/dashboard", label: "Табло", icon: "▦" },
      { href: "/pets", label: "Любимци", icon: "●" },
      { href: "/groups", label: "Групи", icon: "◎" },
    ],
  },
  {
    title: "Управление",
    items: [
      { href: "/admin", label: "Админ", icon: "◇", adminOnly: true },
      { href: "/api/docs", label: "API", icon: "{}" },
    ],
  },
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
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col lg:flex-row">
        <aside className="border-b border-neutral-200 bg-white/90 px-4 py-4 lg:w-64 lg:border-b-0 lg:border-r lg:px-5 lg:py-6">
          <Link href="/" className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-lg bg-emerald-700 text-lg font-black text-white">
              Л
            </span>
            <span>
              <span className="block text-lg font-bold">Лапички</span>
              <span className="block text-xs text-neutral-500">
                планер за грижа
              </span>
            </span>
          </Link>

          <nav className="mt-6 grid gap-4">
            {navSections.map((section) => {
              const visibleItems = section.items.filter((item) => !item.adminOnly || user?.role === "admin");

              if (visibleItems.length === 0) {
                return null;
              }

              return (
              <div key={section.title}>
                <p className="px-3 text-[11px] font-black uppercase tracking-normal text-neutral-400">
                  {section.title}
                </p>
                <div className="mt-2 grid grid-cols-2 gap-2 lg:grid-cols-1">
                  {visibleItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      aria-current={active === item.href ? "page" : undefined}
                      className={classNames(
                        "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition",
                        active === item.href
                          ? "bg-emerald-700 text-white"
                          : "text-neutral-700 hover:bg-emerald-50 hover:text-emerald-900",
                      )}
                    >
                      <span aria-hidden="true" className="w-5 text-center">
                        {item.icon}
                      </span>
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
              );
            })}
          </nav>

          <div className="mt-6 hidden rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-950 lg:block">
            <p className="font-semibold">Демо данни</p>
            <p className="mt-1 text-amber-800">
              Част от екраните вече са вързани към Neon. Останалите все още
              използват примерни данни до следващите backend стъпки.
            </p>
          </div>
        </aside>

        <main className="flex-1 px-4 py-5 sm:px-6 lg:px-8">
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
    </div>
  );
}

function HeaderBar({ user }: { user: PublicUser | null }) {
  const displayName = user?.name ?? "гост";

  return (
    <header className="flex flex-col gap-3 rounded-lg border border-neutral-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-sm font-medium text-emerald-700">
          Здравей, {displayName}
        </p>
        <h1 className="text-2xl font-bold tracking-normal text-neutral-950">
          План за разходки и грижа
        </h1>
      </div>
      <div className="flex flex-wrap gap-2 text-xs font-bold text-neutral-600">
        {user ? (
          <>
            <span className="rounded-lg border border-neutral-200 bg-neutral-50 px-2.5 py-1">
              {user.role === "admin" ? "admin" : "user"}
            </span>
            <span className="rounded-lg border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-emerald-800">
              реална сесия
            </span>
          </>
        ) : (
          <>
            <Link
              href="/login"
              className="rounded-lg border border-neutral-200 bg-neutral-50 px-2.5 py-1 transition hover:bg-neutral-100"
            >
              Вход
            </Link>
            <Link
              href="/register"
              className="rounded-lg border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-emerald-800 transition hover:bg-emerald-100"
            >
              Регистрация
            </Link>
          </>
        )}
      </div>
    </header>
  );
}