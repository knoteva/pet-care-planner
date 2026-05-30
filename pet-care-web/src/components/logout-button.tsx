import { classNames } from "./ui-primitives";

export function LogoutButton({
  variant = "button",
}: {
  variant?: "button" | "link";
}) {
  return (
    <form action="/api/auth/logout?redirect=/" method="post" className="inline">
      <button
        type="submit"
        className={classNames(
          variant === "link"
            ? "text-xs font-semibold text-neutral-600 hover:text-emerald-700"
            : "rounded-lg border border-neutral-200 bg-neutral-50 px-2.5 py-1 transition hover:bg-neutral-100",
        )}
      >
        Изход
      </button>
    </form>
  );
}