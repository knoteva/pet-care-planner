import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import * as api from "@/src/services/api";
import {
  clearStoredToken,
  getStoredToken,
  setStoredToken,
} from "@/src/services/token-storage";

type AuthContextValue = {
  user: api.MobileUser | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  signIn(email: string, password: string): Promise<void>;
  signUp(name: string, email: string, password: string): Promise<void>;
  signOut(): Promise<void>;
  refreshSession(): Promise<void>;
  clearError(): void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function friendlyError(error: unknown) {
  if (error instanceof api.ApiError) {
    if (error.status === 401) {
      return "Невалиден имейл или парола.";
    }

    return error.message;
  }

  if (error instanceof TypeError) {
    return `Не мога да се свържа със сървъра. Провери EXPO_PUBLIC_API_BASE_URL (${api.getApiBaseUrl()}).`;
  }

  return "Възникна неочаквана грешка.";
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<api.MobileUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const applySession = useCallback(
    async (nextUser: api.MobileUser, nextToken: string) => {
      setUser(nextUser);
      setToken(nextToken);
      await setStoredToken(nextToken);
    },
    [],
  );

  const refreshSession = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const storedToken = await getStoredToken();

      if (!storedToken) {
        setUser(null);
        setToken(null);
        return;
      }

      const response = await api.getMe(storedToken);
      setUser(response.user);
      setToken(storedToken);
    } catch (requestError) {
      await clearStoredToken();
      setUser(null);
      setToken(null);
      setError(friendlyError(requestError));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void refreshSession();
  }, [refreshSession]);

  const signIn = useCallback(
    async (email: string, password: string) => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await api.login(email.trim(), password);
        await applySession(response.user, response.token);
      } catch (requestError) {
        setError(friendlyError(requestError));
        throw requestError;
      } finally {
        setIsLoading(false);
      }
    },
    [applySession],
  );

  const signUp = useCallback(
    async (name: string, email: string, password: string) => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await api.register(
          name.trim(),
          email.trim(),
          password,
        );
        await applySession(response.user, response.token);
      } catch (requestError) {
        setError(friendlyError(requestError));
        throw requestError;
      } finally {
        setIsLoading(false);
      }
    },
    [applySession],
  );

  const signOut = useCallback(async () => {
    await clearStoredToken();
    setUser(null);
    setToken(null);
    setError(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      isLoading,
      error,
      signIn,
      signUp,
      signOut,
      refreshSession,
      clearError: () => setError(null),
    }),
    [user, token, isLoading, error, signIn, signUp, signOut, refreshSession],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider.");
  }

  return context;
}
