import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

const SCRYPT_COST = 16384;
const SCRYPT_BLOCK_SIZE = 8;
const SCRYPT_PARALLELIZATION = 1;
const KEY_LENGTH = 64;
const MAX_MEMORY = 64 * 1024 * 1024;

function deriveKey(password: string, salt: string) {
  return scryptSync(password, salt, KEY_LENGTH, {
    cost: SCRYPT_COST,
    blockSize: SCRYPT_BLOCK_SIZE,
    parallelization: SCRYPT_PARALLELIZATION,
    maxmem: MAX_MEMORY,
  });
}

export function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const hash = deriveKey(password, salt).toString("hex");

  return `scrypt:${SCRYPT_COST}:${SCRYPT_BLOCK_SIZE}:${SCRYPT_PARALLELIZATION}:${salt}:${hash}`;
}

export function verifyPassword(password: string, storedHash: string) {
  const [scheme, cost, blockSize, parallelization, salt, hash] =
    storedHash.split(":");

  if (
    scheme !== "scrypt" ||
    cost !== String(SCRYPT_COST) ||
    blockSize !== String(SCRYPT_BLOCK_SIZE) ||
    parallelization !== String(SCRYPT_PARALLELIZATION) ||
    !salt ||
    !hash
  ) {
    return false;
  }

  const stored = Buffer.from(hash, "hex");
  const candidate = deriveKey(password, salt);

  if (stored.length !== candidate.length) {
    return false;
  }

  return timingSafeEqual(stored, candidate);
}
