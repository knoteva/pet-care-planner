import { createHmac, timingSafeEqual } from "node:crypto";

export const AUTH_COOKIE_NAME = "pet-care-session";
export const AUTH_TOKEN_TTL_SECONDS = 7 * 24 * 60 * 60;

export type AuthTokenPayload = {
  sub: string;
  email: string;
  name: string;
  role: "user" | "admin";
  iat: number;
  exp: number;
};

export type AuthTokenUser = {
  id: number;
  email: string;
  name: string;
  role: "user" | "admin";
};

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET is required for authentication.");
  }

  return secret;
}

function encodeBase64Url(value: object | string) {
  const input = typeof value === "string" ? value : JSON.stringify(value);

  return Buffer.from(input).toString("base64url");
}

function signContent(content: string) {
  return createHmac("sha256", getJwtSecret()).update(content).digest("base64url");
}

function safeCompare(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);

  if (leftBuffer.length !== rightBuffer.length) {
    return false;
  }

  return timingSafeEqual(leftBuffer, rightBuffer);
}

export function createAuthToken(user: AuthTokenUser) {
  const issuedAt = Math.floor(Date.now() / 1000);
  const header = encodeBase64Url({ alg: "HS256", typ: "JWT" });
  const payload = encodeBase64Url({
    sub: String(user.id),
    email: user.email,
    name: user.name,
    role: user.role,
    iat: issuedAt,
    exp: issuedAt + AUTH_TOKEN_TTL_SECONDS,
  } satisfies AuthTokenPayload);
  const content = `${header}.${payload}`;
  const signature = signContent(content);

  return `${content}.${signature}`;
}

export function verifyAuthToken(token: string): AuthTokenPayload | null {
  const [header, payload, signature] = token.split(".");

  if (!header || !payload || !signature) {
    return null;
  }

  const expectedSignature = signContent(`${header}.${payload}`);

  if (!safeCompare(signature, expectedSignature)) {
    return null;
  }

  try {
    const parsed = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as AuthTokenPayload;
    const now = Math.floor(Date.now() / 1000);

    if (!parsed.sub || !parsed.email || !parsed.name || !parsed.role || parsed.exp <= now) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}
