import Link from "next/link";

export function classNames(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ").trim();
}

export type BadgeTone = "success" | "warning" | "danger" | "info" | "neutral" | "ok";

export function Badge({
  tone,
  children,
}: {
  tone: BadgeTone;
  children: React.ReactNode;
}) {
  const classes = {
    success: "border-emerald-200 bg-emerald-50 text-emerald-800",
    warning: "border-amber-200 bg-amber-50 text-amber-900",
    danger: "border-rose-200 bg-rose-50 text-rose-800",
    info: "border-sky-200 bg-sky-50 text-sky-800",
    neutral: "border-neutral-200 bg-neutral-100 text-neutral-700",
    ok: "border-teal-200 bg-teal-50 text-teal-800",
  }[tone];

  return (
    <span
      className={classNames(
        "inline-flex items-center rounded-lg border px-2.5 py-1 text-xs font-bold leading-none",
        classes,
      )}
    >
      {children}
    </span>
  );
}

export function StatCard({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: string;
}) {
  const toneClasses: Record<string, string> = {
    emerald: "border-emerald-100 bg-emerald-50 text-emerald-800",
    sky: "border-sky-100 bg-sky-50 text-sky-800",
    violet: "border-violet-100 bg-violet-50 text-violet-800",
    amber: "border-amber-100 bg-amber-50 text-amber-800",
  };
  const toneClass = toneClasses[tone] ?? "border-neutral-100 bg-white text-neutral-900";

  return (
    <div
      className={classNames(
        "flex min-h-28 flex-col justify-center rounded-lg border p-4",
        toneClass,
      )}
    >
      <p className="flex min-h-10 items-center justify-center text-center text-sm font-medium leading-5">
        {label}
      </p>
      <p className="mt-1 text-center text-3xl font-black tracking-normal">
        {value}
      </p>
    </div>
  );
}

export function SectionTitle({
  title,
  action,
  href,
}: {
  title: string;
  action: string;
  href: string;
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <h2 className="text-xl font-bold text-neutral-950">{title}</h2>
      <Link
        href={href}
        className="inline-flex items-center justify-center rounded-lg bg-neutral-950 px-3 py-2 text-sm font-semibold text-white transition hover:bg-neutral-800"
      >
        <span aria-hidden="true">＋ </span>
        {action}
      </Link>
    </div>
  );
}

export function EmptyState({
  title,
  description,
  actionLabel,
  href,
  kicker = "Празно състояние",
}: {
  title: string;
  description: string;
  actionLabel: string;
  href: string;
  kicker?: string;
}) {
  return (
    <div className="rounded-lg border border-dashed border-neutral-300 bg-white p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-emerald-700">{kicker}</p>
          <h3 className="mt-2 text-lg font-bold text-neutral-950">{title}</h3>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-600">
            {description}
          </p>
        </div>
        <Link
          href={href}
          className="inline-flex shrink-0 justify-center rounded-lg border border-neutral-300 px-3 py-2 text-sm font-bold text-neutral-800"
        >
          {actionLabel}
        </Link>
      </div>
    </div>
  );
}

export function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-neutral-50 p-3">
      <dt className="text-xs font-semibold uppercase tracking-normal text-neutral-500">
        {label}
      </dt>
      <dd className="mt-1 font-semibold text-neutral-950">{value}</dd>
    </div>
  );
}

export function FormGuidePanel({ title }: { title: string }) {
  return (
    <div className="rounded-lg border border-neutral-200 bg-white p-5">
      <p className="text-sm font-semibold text-emerald-700">Демо форма</p>
      <h2 className="mt-2 text-lg font-bold">{title}: бъдеща логика</h2>
      <p className="mt-2 text-sm leading-6 text-neutral-600">
        Формата е само UI сега. Полетата са именувани така, че после да се
        вържат към validation schema, Server Action и REST/service слой.
      </p>
      <ul className="mt-4 grid gap-2 text-sm text-neutral-700">
        <li>✓ name атрибути за form data</li>
        <li>✓ същите термини като бъдещата DB schema</li>
        <li>✓ без fake client state, който после да пречи</li>
      </ul>
    </div>
  );
}

export function FormCard({
  title,
  description,
  submitLabel,
  cancelHref = "/dashboard",
  children,
}: {
  title: string;
  description: string;
  submitLabel: string;
  cancelHref?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mx-auto max-w-3xl rounded-lg border border-neutral-200 bg-white p-6">
      <h2 className="text-2xl font-bold">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-neutral-600">{description}</p>
      <form className="mt-6 grid gap-4">
        {children}
        <div className="mt-2 flex flex-wrap gap-2">
          <button
            type="button"
            className="rounded-lg bg-emerald-700 px-4 py-3 text-sm font-bold text-white"
          >
            {submitLabel}
          </button>
          <Link
            href={cancelHref}
            className="rounded-lg border border-neutral-300 px-4 py-3 text-sm font-bold text-neutral-800"
          >
            Откажи
          </Link>
        </div>
      </form>
    </section>
  );
}

export function FormField({
  name,
  label,
  placeholder,
  type = "text",
  defaultValue,
}: {
  name?: string;
  label: string;
  placeholder: string;
  type?: string;
  defaultValue?: string;
}) {
  return (
    <label className="grid gap-2 text-sm font-semibold text-neutral-800">
      {label}
      <input
        name={name}
        className="rounded-lg border border-neutral-300 px-3 py-3 text-base font-normal outline-none transition focus:border-emerald-600"
        placeholder={placeholder}
        type={type}
        defaultValue={defaultValue}
      />
    </label>
  );
}

export function FormSelect({
  name,
  label,
  options,
  defaultValue,
}: {
  name: string;
  label: string;
  options: Array<string | { value: string; label: string }>;
  defaultValue?: string;
}) {
  return (
    <label className="grid gap-2 text-sm font-semibold text-neutral-800">
      {label}
      <select
        name={name}
        className="rounded-lg border border-neutral-300 bg-white px-3 py-3 text-base font-normal outline-none transition focus:border-emerald-600"
        defaultValue={defaultValue}
      >
        {options.map((option) => (
          <option
            key={typeof option === "string" ? option : option.value}
            value={typeof option === "string" ? option : option.value}
          >
            {typeof option === "string" ? option : option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export function FormTextarea({
  name,
  label,
  placeholder,
  defaultValue,
}: {
  name: string;
  label: string;
  placeholder: string;
  defaultValue?: string;
}) {
  return (
    <label className="grid gap-2 text-sm font-semibold text-neutral-800">
      {label}
      <textarea
        name={name}
        className="min-h-32 rounded-lg border border-neutral-300 px-3 py-3 text-base font-normal outline-none transition focus:border-emerald-600"
        placeholder={placeholder}
        defaultValue={defaultValue}
      />
    </label>
  );
}