import { Link, useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";

import { AppHeader, Card, DemoProfiles, ErrorBanner, Field, PrimaryButton, Screen, SecondaryButton, Subtitle, Title, Eyebrow } from "@/src/components/mobile-ui";
import { useAuth } from "@/src/state/auth-context";

export default function AuthScreen() {
  const router = useRouter();
  const { user, isLoading, error, signIn, signOut, clearError } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);

  async function handleLogin() {
    clearError();
    setLocalError(null);

    if (!email.trim() || !password) {
      setLocalError("Въведи имейл и парола.");
      return;
    }

    try {
      await signIn(email, password);
      router.replace("/");
    } catch {
      // The shared auth context already exposes the display error.
    }
  }

  if (user) {
    return (
      <Screen>
        <AppHeader subtitle="профил" />
        <Card>
          <Eyebrow>Профил</Eyebrow>
          <Title>{user.name}</Title>
          <Subtitle>{user.email}</Subtitle>
          <PrimaryButton onPress={() => router.replace("/")}>Към таблото</PrimaryButton>
          <SecondaryButton onPress={() => void signOut()}>Изход</SecondaryButton>
        </Card>
      </Screen>
    );
  }

  return (
    <Screen>
      <AppHeader subtitle="мобилен достъп" />
      <Card>
        <Eyebrow>Вход в профил</Eyebrow>
        <Title>Добре дошла обратно</Title>
        <Subtitle>Влез с тестов профил или с нов акаунт, създаден през регистрацията.</Subtitle>
        <ErrorBanner message={localError ?? error} />
        <Field label="Имейл" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" textContentType="emailAddress" />
        <Field label="Парола" value={password} onChangeText={setPassword} secureTextEntry textContentType="password" />
        <PrimaryButton disabled={isLoading} onPress={() => void handleLogin()}>{isLoading ? "Проверка..." : "Влез"}</PrimaryButton>
        <DemoProfiles />
        <View style={profileStyles.switchRow}>
          <Text style={profileStyles.switchText}>Нямаш профил?</Text>
          <Link href="/register" asChild>
            <Pressable hitSlop={8}>
              <Text style={profileStyles.switchLink}>Регистрирай се</Text>
            </Pressable>
          </Link>
        </View>
      </Card>
    </Screen>
  );
}

const profileStyles = {
  switchRow: {
    marginTop: 16,
    flexDirection: "row" as const,
    justifyContent: "center" as const,
    gap: 6,
  },
  switchText: {
    fontSize: 14,
    color: "#475569",
  },
  switchLink: {
    fontSize: 14,
    fontWeight: "900" as const,
    color: "#047857",
  },
};