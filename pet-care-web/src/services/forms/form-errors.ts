import { redirect } from "next/navigation";

type SearchParams = {
  error?: string | string[];
};

export function getFormError(searchParams?: SearchParams) {
  const value = Array.isArray(searchParams?.error)
    ? searchParams.error[0]
    : searchParams?.error;

  return value ? value.slice(0, 300) : undefined;
}

export function redirectWithFormError(
  path: string,
  error: unknown,
  fallback = "Провери въведените данни и опитай отново.",
): never {
  const message =
    error instanceof Error && error.message.trim().length > 0
      ? error.message
      : fallback;

  redirect(`${path}?error=${encodeURIComponent(message)}`);
}
