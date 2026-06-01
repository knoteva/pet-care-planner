export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}

type TextOptions = {
  label: string;
  min?: number;
  max?: number;
  required?: boolean;
  pattern?: RegExp;
};

export function textField(
  value: unknown,
  options: TextOptions & { required: false },
): string | null;
export function textField(
  value: unknown,
  options: TextOptions & { required?: true },
): string;
export function textField(value: unknown, options: TextOptions): string | null {
  const { label, min = 1, max, required = true, pattern } = options;
  const text = String(value ?? "").trim();

  if (!text) {
    if (!required) {
      return null;
    }

    throw new ValidationError(`${label} е задължително поле.`);
  }

  if (text.length < min) {
    throw new ValidationError(`${label} трябва да е поне ${min} символа.`);
  }

  if (max && text.length > max) {
    throw new ValidationError(`${label} трябва да е до ${max} символа.`);
  }

  if (pattern && !pattern.test(text)) {
    throw new ValidationError(`${label} е в невалиден формат.`);
  }

  return text;
}

type IntegerOptions = {
  label: string;
  min: number;
  max: number;
  required?: boolean;
};

export function integerField(
  value: unknown,
  options: IntegerOptions & { required: false },
): number | null;
export function integerField(
  value: unknown,
  options: IntegerOptions & { required?: true },
): number;
export function integerField(
  value: unknown,
  options: IntegerOptions,
): number | null {
  const { label, min, max, required = true } = options;
  const raw = String(value ?? "").trim();

  if (!raw) {
    if (!required) {
      return null;
    }

    throw new ValidationError(`${label} е задължително поле.`);
  }

  if (!/^-?\d+$/.test(raw)) {
    throw new ValidationError(`${label} трябва да е цяло число.`);
  }

  const numberValue = Number(raw);

  if (numberValue < min || numberValue > max) {
    throw new ValidationError(`${label} трябва да е между ${min} и ${max}.`);
  }

  return numberValue;
}

export function enumField<T extends string>(
  value: unknown,
  allowedValues: readonly T[],
  label: string,
) {
  const text = String(value ?? "").trim();

  if (!allowedValues.includes(text as T)) {
    throw new ValidationError(`${label} е невалидна стойност.`);
  }

  return text as T;
}

type DateOptions = {
  label: string;
  minDate?: Date;
  maxDate?: Date;
};

export function dateField(value: unknown, options: DateOptions) {
  const raw = value instanceof Date ? value : new Date(String(value ?? ""));

  if (Number.isNaN(raw.getTime())) {
    throw new ValidationError(`${options.label} е невалидна дата.`);
  }

  if (options.minDate && raw < options.minDate) {
    throw new ValidationError(`${options.label} не може да е в миналото.`);
  }

  if (options.maxDate && raw > options.maxDate) {
    throw new ValidationError(`${options.label} е твърде далеч в бъдещето.`);
  }

  return raw;
}
