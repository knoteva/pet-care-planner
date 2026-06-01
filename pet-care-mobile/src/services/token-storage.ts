import { Platform } from "react-native";

const TOKEN_KEY = "pet-care-planner-token";
let memoryToken: string | null = null;

type LocalStorageLike = {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
};

function getWebStorage(): LocalStorageLike | null {
  if (Platform.OS !== "web") {
    return null;
  }

  return (
    (globalThis as unknown as { localStorage?: LocalStorageLike })
      .localStorage ?? null
  );
}

export async function getStoredToken() {
  const storage = getWebStorage();

  if (storage) {
    return storage.getItem(TOKEN_KEY);
  }

  return memoryToken;
}

export async function setStoredToken(token: string) {
  memoryToken = token;
  getWebStorage()?.setItem(TOKEN_KEY, token);
}

export async function clearStoredToken() {
  memoryToken = null;
  getWebStorage()?.removeItem(TOKEN_KEY);
}
