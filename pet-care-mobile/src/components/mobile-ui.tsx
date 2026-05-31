import type { ReactNode } from "react";
import { Link } from "expo-router";
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, TextInput, View, type TextInputProps } from "react-native";

export function Screen({ children }: { children: ReactNode }) {
  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      {children}
    </ScrollView>
  );
}

export function Card({ children, tone = "default" }: { children: ReactNode; tone?: "default" | "green" }) {
  return <View style={[styles.card, tone === "green" && styles.greenCard]}>{children}</View>;
}

export function BrandHeader({ subtitle }: { subtitle?: string }) {
  return (
    <View style={styles.brandRow}>
      <View style={styles.logoBox}>
        <Text style={styles.logoText}>Л</Text>
      </View>
      <View>
        <Text style={styles.brand}>Лапички</Text>
        {subtitle ? <Text style={styles.brandSubline}>{subtitle}</Text> : null}
      </View>
    </View>
  );
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return <Text style={styles.eyebrow}>{children}</Text>;
}

export function Title({ children }: { children: ReactNode }) {
  return <Text style={styles.title}>{children}</Text>;
}

export function Subtitle({ children }: { children: ReactNode }) {
  return <Text style={styles.subtitle}>{children}</Text>;
}

export function SectionTitle({ children }: { children: ReactNode }) {
  return <Text style={styles.sectionTitle}>{children}</Text>;
}

export function Field({ label, ...props }: TextInputProps & { label: string }) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput placeholderTextColor="#9ca3af" style={styles.input} {...props} />
    </View>
  );
}

export function PrimaryButton({ children, disabled, onPress }: { children: ReactNode; disabled?: boolean; onPress?: () => void }) {
  return (
    <Pressable disabled={disabled} onPress={onPress} style={[styles.primaryButton, disabled && styles.disabledButton]}>
      <Text style={styles.primaryButtonText}>{children}</Text>
    </Pressable>
  );
}

export function SecondaryButton({ children, disabled, onPress }: { children: ReactNode; disabled?: boolean; onPress?: () => void }) {
  return (
    <Pressable disabled={disabled} onPress={onPress} style={[styles.secondaryButton, disabled && styles.disabledButton]}>
      <Text style={styles.secondaryButtonText}>{children}</Text>
    </Pressable>
  );
}

export function Badge({ children, tone = "green" }: { children: ReactNode; tone?: "green" | "gray" | "amber" }) {
  return <Text style={[styles.badge, styles[`${tone}Badge`]]}>{children}</Text>;
}

export function ErrorBanner({ message }: { message?: string | null }) {
  if (!message) return null;

  return (
    <View style={styles.errorBanner}>
      <Text style={styles.errorText}>{message}</Text>
    </View>
  );
}

export function LoadingState({ label = "Зареждане..." }: { label?: string }) {
  return (
    <View style={styles.stateBox}>
      <ActivityIndicator color="#047857" />
      <Text style={styles.stateText}>{label}</Text>
    </View>
  );
}

export function EmptyState({ title, text }: { title: string; text: string }) {
  return (
    <View style={styles.stateBox}>
      <Text style={styles.emptyTitle}>{title}</Text>
      <Text style={styles.stateText}>{text}</Text>
    </View>
  );
}

export function RequireLogin() {
  return (
    <Screen>
      <Card>
        <Eyebrow>Достъп</Eyebrow>
        <Title>Влез в профил</Title>
        <Subtitle>Този екран чете данни от API-то и изисква активна mobile сесия.</Subtitle>
        <Link href="/auth" asChild>
          <Pressable style={styles.primaryButton}>
            <Text style={styles.primaryButtonText}>Към вход</Text>
          </Pressable>
        </Link>
      </Card>
    </Screen>
  );
}

export function DemoProfiles() {
  return (
    <View style={styles.demoBox}>
      <Text style={styles.demoTitle}>Тестови профили</Text>
      <Text style={styles.demoLine}>Админ: kate_admin@paws.bg</Text>
      <Text style={styles.demoLine}>Мениджър: kate_manager@paws.bg</Text>
      <Text style={styles.demoLine}>Потребител: kate_user@paws.bg</Text>
      <Text style={styles.demoPassword}>Парола за всички: kate123</Text>
    </View>
  );
}

export const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#eef4f1",
  },
  content: {
    width: "100%",
    maxWidth: 760,
    alignSelf: "center",
    padding: 18,
    paddingBottom: 34,
    gap: 14,
  },
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  logoBox: {
    width: 42,
    height: 42,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#047857",
  },
  logoText: {
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "900",
  },
  brand: {
    fontSize: 24,
    fontWeight: "900",
    color: "#047857",
  },
  brandSubline: {
    marginTop: 1,
    fontSize: 12,
    color: "#64748b",
  },
  card: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#dce3df",
    backgroundColor: "#ffffff",
    padding: 18,
    shadowColor: "#0f172a",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  greenCard: {
    backgroundColor: "#ecfdf5",
    borderColor: "#bbf7d0",
  },
  eyebrow: {
    fontSize: 13,
    fontWeight: "900",
    color: "#047857",
    textTransform: "uppercase",
  },
  title: {
    marginTop: 8,
    fontSize: 28,
    lineHeight: 34,
    fontWeight: "900",
    color: "#0f172a",
  },
  subtitle: {
    marginTop: 10,
    fontSize: 15,
    lineHeight: 23,
    color: "#475569",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "900",
    color: "#0f172a",
  },
  field: {
    marginTop: 12,
    gap: 7,
  },
  label: {
    fontSize: 13,
    fontWeight: "800",
    color: "#111827",
  },
  input: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#cbd5e1",
    backgroundColor: "#ffffff",
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 15,
    color: "#0f172a",
  },
  primaryButton: {
    marginTop: 16,
    alignItems: "center",
    borderRadius: 8,
    backgroundColor: "#047857",
    paddingHorizontal: 14,
    paddingVertical: 13,
  },
  primaryButtonText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "900",
  },
  secondaryButton: {
    marginTop: 10,
    alignItems: "center",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#cbd5e1",
    backgroundColor: "#ffffff",
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  secondaryButtonText: {
    color: "#0f172a",
    fontSize: 14,
    fontWeight: "900",
  },
  disabledButton: {
    opacity: 0.6,
  },
  badge: {
    alignSelf: "flex-start",
    overflow: "hidden",
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 5,
    fontSize: 12,
    fontWeight: "900",
  },
  greenBadge: {
    borderColor: "#99f6e4",
    backgroundColor: "#ecfdf5",
    color: "#047857",
  },
  grayBadge: {
    borderColor: "#e5e7eb",
    backgroundColor: "#f8fafc",
    color: "#475569",
  },
  amberBadge: {
    borderColor: "#fde68a",
    backgroundColor: "#fffbeb",
    color: "#92400e",
  },
  errorBanner: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#fecaca",
    backgroundColor: "#fef2f2",
    padding: 12,
  },
  errorText: {
    fontSize: 14,
    lineHeight: 20,
    color: "#991b1b",
  },
  stateBox: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#dce3df",
    backgroundColor: "#ffffff",
    padding: 18,
    alignItems: "center",
    gap: 10,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: "900",
    color: "#0f172a",
  },
  stateText: {
    textAlign: "center",
    fontSize: 14,
    lineHeight: 20,
    color: "#64748b",
  },
  demoBox: {
    marginTop: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#bbf7d0",
    backgroundColor: "#ecfdf5",
    padding: 12,
    gap: 4,
  },
  demoTitle: {
    fontSize: 14,
    fontWeight: "900",
    color: "#064e3b",
  },
  demoLine: {
    fontSize: 13,
    color: "#064e3b",
  },
  demoPassword: {
    marginTop: 4,
    fontSize: 13,
    fontWeight: "900",
    color: "#064e3b",
  },
});