import { redirect } from "next/navigation";

type SearchParams = {
  error?: string | string[];
  [key: string]: string | string[] | undefined;
};

const fieldPrefix = "field_";
const defaultFallback = "Провери въведените данни и опитай отново.";

function getErrorMessage(error: unknown, fallback = defaultFallback) {
  return error instanceof Error && error.message.trim().length > 0
    ? error.message
    : fallback;
}

export function getFormError(searchParams?: SearchParams) {
  const value = Array.isArray(searchParams?.error)
    ? searchParams.error[0]
    : searchParams?.error;

  return value ? value.slice(0, 300) : undefined;
}

export function getFormValue(searchParams: SearchParams | undefined, fieldName: string) {
  const rawValue = searchParams?.[`${fieldPrefix}${fieldName}`];
  const value = Array.isArray(rawValue) ? rawValue[0] : rawValue;

  return value ? value.slice(0, 500) : undefined;
}

export function redirectWithFormError(
  path: string,
  error: unknown,
  fallback = defaultFallback,
): never {
  redirect(`${path}?error=${encodeURIComponent(getErrorMessage(error, fallback))}`);
}

export function redirectWithFormErrorAndState(
  path: string,
  error: unknown,
  formData: FormData,
  fieldNames: string[],
  fallback = defaultFallback,
): never {
  const params = new URLSearchParams({ error: getErrorMessage(error, fallback) });

  for (const fieldName of fieldNames) {
    const value = formData.get(fieldName);

    if (value !== null) {
      params.set(`${fieldPrefix}${fieldName}`, String(value).slice(0, 500));
    }
  }

  redirect(`${path}?${params.toString()}`);
}