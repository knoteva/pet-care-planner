import { AuthForm } from "./auth-form";
import { AppShell } from "./app-shell";

export function AuthPage({ mode }: { mode: "login" | "register" }) {
  return (
    <AppShell active="">
      <div className="mx-auto grid max-w-5xl overflow-hidden rounded-lg border border-neutral-200 bg-white lg:grid-cols-[minmax(0,1fr)_360px]">
        <AuthForm mode={mode} />
        <AuthSidePanel />
      </div>
    </AppShell>
  );
}

function AuthSidePanel() {
  return (
    <div className="bg-emerald-50 p-6 sm:p-8">
      <p className="text-sm font-semibold uppercase tracking-normal text-emerald-700">
        Pet Care Planner
      </p>
      <h3 className="mt-3 text-2xl font-bold text-neutral-950">
        Координирай грижа без хаос.
      </h3>
      <div className="mt-6 grid gap-3">
        {["Групи със съседи", "Събития и участие", "Коментари и грижа"].map((item) => (
          <div key={item} className="rounded-lg bg-white p-4 text-sm font-bold">
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}