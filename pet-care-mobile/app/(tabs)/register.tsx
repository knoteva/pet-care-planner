import { Link, useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";

import { BrandHeader, Card, ErrorBanner, Field, PrimaryButton, Screen, Subtitle, Title, Eyebrow } from "@/src/components/mobile-ui";
import { useAuth } from "@/src/state/auth-context";

export default function RegisterScreen() {
  const router = useRouter();
  const { user, isLoading, error, signUp } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);

  async function handleRegister() {
    setLocalError(null);

    if (name.trim().length < 2) {
      setLocalError("Името трябва да е поне 2 символа.");
      return;
    }

    if (!email.includes("@")) {
      setLocalError("Въведи валиден имейл.");
      return;
    }

    if (password.length < 8) {
      setLocalError("Паролата трябва да е поне 8 символа.");
      return;
    }

    if (password !== confirmPassword) {
      setLocalError("Паролите не съвпадат.");
      return;
    }

    try {
      await signUp(name, email, password);
      router.replace("/");
    } catch {
      // The shared auth context already exposes the display error.
    }
  }

  if (user) {
    return (
      <Screen>
        <BrandHeader subtitle="мобилен профил" />
        <Card tone="green">
          <Eyebrow>Вече си влязла</Eyebrow>
          <Title>{user.name}</Title>
          <Subtitle>Можеш да продължиш към таблото или да излезеш от профила през таб Профил.</Subtitle>
          <PrimaryButton onPress={() => router.replace("/")}>Към таблото</PrimaryButton>
        </Card>
      </Screen>
    );
  }

  return (
    <Screen>
      <BrandHeader subtitle="нов профил" />
      <Card>
        <Eyebrow>Регистрация</Eyebrow>
        <Title>Създай профил</Title>
        <Subtitle>След регистрация mobile приложението пази Bearer token и използва същото API като web клиента.</Subtitle>
        <ErrorBanner message={localError ?? error} />
        <Field label="Име" value={name} onChangeText={setName} textContentType="name" />
        <Field label="Имейл" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" textContentType="emailAddress" />
        <Field label="Парола" value={password} onChangeText={setPassword} secureTextEntry textContentType="newPassword" />
        <Field label="Потвърди парола" value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry textContentType="newPassword" />
        <PrimaryButton disabled={isLoading} onPress={() => void handleRegister()}>{isLoading ? "Създаване..." : "Създай профил"}</PrimaryButton>
        <View style={registerStyles.switchRow}>
          <Text style={registerStyles.switchText}>Вече имаш профил?</Text>
          <Link href="/auth" asChild>
            <Pressable hitSlop={8}>
              <Text style={registerStyles.switchLink}>Влез</Text>
            </Pressable>
          </Link>
        </View>
      </Card>
    </Screen>
  );
}

const registerStyles = {
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