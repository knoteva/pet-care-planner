"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { FormEvent } from "react";

import { classNames } from "./ui-primitives";

type AuthMode = "login" | "register";

type AuthFormProps = {
  mode: AuthMode;
  variant?: "page" | "home";
};

type AuthApiResponse = {
  user?: {
    id: number;
    email: string;
    name: string;
    role: "user" | "admin";
  };
  token?: string;
  error?: string;
};

const demoCredentials = {
  email: "kate_user@paws.bg",
  password: "kate123",
};

const demoAccounts = [
  { label: "Админ", email: "kate_admin@paws.bg" },
  { label: "Мениджър", email: "kate_manager@paws.bg" },
  { label: "Потребител", email: "kate_user@paws.bg" },
];

function getAuthRedirectPath() {
  const redirectTo = new URLSearchParams(window.location.search).get("redirect");

  if (redirectTo?.startsWith("/") && !redirectTo.startsWith("//")) {
    return redirectTo;
  }

  return "/dashboard";
}
async function readAuthResponse(response: Response) {
  try {
    return (await response.json()) as AuthApiResponse;
  } catch {
    return { error: "Сървърът върна неочакван отговор." } satisfies AuthApiResponse;
  }
}

export function AuthForm({ mode, variant = "page" }: AuthFormProps) {
  const router = useRouter();
  const isLogin = mode === "login";
  const isHomeVariant = variant === "home";
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setMessage(null);

    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("name") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");
    const confirmPassword = String(formData.get("confirmPassword") ?? "");

    if (!email || !password) {
      setError("Имейлът и паролата са задължителни.");
      return;
    }

    if (!isLogin) {
      if (!name) {
        setError("Името е задължително.");
        return;
      }

      if (password !== confirmPassword) {
        setError("Паролите не съвпадат.");
        return;
      }
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(isLogin ? "/api/auth/login" : "/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(isLogin ? { email, password } : { name, email, password }),
      });
      const result = await readAuthResponse(response);

      if (!response.ok || !result.user) {
        setError(result.error ?? "Неуспешна заявка. Моля опитай отново.");
        return;
      }

      setMessage(isLogin ? "Входът е успешен." : "Профилът е създаден.");
      router.refresh();
      router.push(getAuthRedirectPath());
    } catch {
      setError("Не може да се осъществи връзка със сървъра.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className={isHomeVariant ? "" : "p-6 sm:p-8"}>
      <p className="text-sm font-semibold text-emerald-700">
        {isLogin ? "Вход в профил" : "Създай профил"}
      </p>
      <h2 className="mt-2 text-3xl font-bold tracking-normal text-neutral-950">
        {isLogin ? "Добре дошла обратно" : "Регистрация в Лапички"}
      </h2>

      <form
        action={isLogin ? "/api/auth/login?redirect=/dashboard" : "/api/auth/register?redirect=/dashboard"}
        className="mt-6 grid gap-4"
        method="post"
        onSubmit={handleSubmit}
      >
        {!isLogin ? (
          <AuthField name="name" label="Име" placeholder="Мария Петкова" />
        ) : null}
        <AuthField
          name="email"
          label="Имейл"
          placeholder=""
          type="email"
          autoComplete="email"
        />
        <AuthField
          name="password"
          label="Парола"
          placeholder={isLogin ? "" : "Минимум 8 символа"}
          type="password"
          autoComplete={isLogin ? "current-password" : "new-password"}
        />
        {!isLogin ? (
          <AuthField
            name="confirmPassword"
            label="Потвърди парола"
            placeholder="Повтори паролата"
            type="password"
            autoComplete="new-password"
          />
        ) : null}

        {error ? (
          <p className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-800">
            {error}
          </p>
        ) : null}
        {message ? (
          <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-800">
            {message}
          </p>
        ) : null}

        <button
          className="mt-2 rounded-lg bg-emerald-700 px-4 py-3 text-sm font-bold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:bg-neutral-400"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Моля изчакай..." : isLogin ? "Влез" : "Създай профил"}
        </button>
      </form>

      <div className="mt-4 rounded-lg border border-emerald-100 bg-emerald-50 p-3 text-sm text-emerald-950">
        <p className="font-bold">Тестови профили</p>
        <div className="mt-2 grid gap-1.5">
          {demoAccounts.map((account) => (
            <p key={account.email} className="flex flex-col gap-0.5 sm:flex-row sm:items-center sm:justify-between">
              <span className="font-semibold">{account.label}</span>
              <span className="break-all">{account.email}</span>
            </p>
          ))}
        </div>
        <p className="mt-2 text-emerald-800">Парола за всички: <span className="font-semibold">kate123</span></p>
      </div>
      <p className="mt-4 text-sm text-neutral-600">
        {isLogin ? "Нямаш профил?" : "Вече имаш профил?"} {" "}
        <Link href={isLogin ? "/register" : "/login"} className="font-bold text-emerald-700">
          {isLogin ? "Регистрирай се" : "Влез"}
        </Link>
      </p>
    </div>
  );
}

function AuthField({
  name,
  label,
  placeholder,
  type = "text",
  autoComplete,
}: {
  name: string;
  label: string;
  placeholder: string;
  type?: string;
  autoComplete?: string;
}) {
  return (
    <label className="grid gap-2 text-sm font-semibold text-neutral-800">
      {label}
      <input
        name={name}
        className={classNames(
          "rounded-lg border border-neutral-300 px-3 py-3 text-base font-normal outline-none transition",
          "focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100",
        )}
        placeholder={placeholder}
        type={type}
        autoComplete={autoComplete}
      />
    </label>
  );
}