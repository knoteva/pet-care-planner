import { Link } from "expo-router";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

export default function AuthScreen() {
  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.container}>
        <View style={styles.heroCard}>
          <View style={styles.brandRow}>
            <View style={styles.logoBox}>
              <Text style={styles.logoText}>Л</Text>
            </View>
            <View>
              <Text style={styles.eyebrow}>Лапички</Text>
              <Text style={styles.brandSubline}>планер за грижа</Text>
            </View>
          </View>
          <Text style={styles.title}>Вход в профил</Text>
          <Text style={styles.subtitle}>
            Демо вход за преглед на групи, събития, любимци и коментари.
          </Text>
        </View>

        <View style={styles.card}>
          <AuthField label="Имейл" placeholder="demo@paws.bg" />
          <AuthField label="Парола" placeholder="demo123" secure />
          <Pressable style={styles.primaryButton}>
            <Text style={styles.primaryButtonText}>Влез</Text>
          </Pressable>
          <Text style={styles.demoText}>Демо достъп: demo@paws.bg / demo123</Text>
          <View style={styles.switchRow}>
            <Text style={styles.switchText}>Нямаш профил?</Text>
            <Link href="/register" asChild>
              <Pressable hitSlop={8}>
                <Text style={styles.switchLink}>Регистрирай се</Text>
              </Pressable>
            </Link>
          </View>
        </View>

        <BenefitCard
          title="След вход"
          items={[
            "Преглеждаш предстоящи събития",
            "Участваш и коментираш",
            "Виждаш групи и любимци",
          ]}
        />
      </View>
    </ScrollView>
  );
}

export function AuthField({
  label,
  placeholder,
  secure = false,
}: {
  label: string;
  placeholder: string;
  secure?: boolean;
}) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor="#9ca3af"
        secureTextEntry={secure}
      />
    </View>
  );
}

export function BenefitCard({ title, items }: { title: string; items: string[] }) {
  return (
    <View style={styles.benefitCard}>
      <Text style={styles.benefitTitle}>{title}</Text>
      <View style={styles.benefitList}>
        {items.map((item) => (
          <View key={item} style={styles.benefitPill}>
            <Text style={styles.benefitCheck}>✓</Text>
            <Text style={styles.benefitText}>{item}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#f5f7f4",
  },
  content: {
    padding: 18,
    paddingBottom: 34,
    alignItems: "center",
  },
  container: {
    width: "100%",
    maxWidth: 430,
  },
  heroCard: {
    borderRadius: 8,
    backgroundColor: "#ffffff",
    padding: 18,
    borderWidth: 1,
    borderColor: "#e5e7eb",
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
  eyebrow: {
    fontSize: 16,
    fontWeight: "900",
    color: "#111827",
  },
  brandSubline: {
    marginTop: 1,
    fontSize: 12,
    color: "#6b7280",
  },
  title: {
    marginTop: 18,
    fontSize: 26,
    lineHeight: 31,
    fontWeight: "900",
    color: "#111827",
  },
  subtitle: {
    marginTop: 8,
    fontSize: 15,
    lineHeight: 22,
    color: "#4b5563",
  },
  card: {
    marginTop: 12,
    borderRadius: 8,
    backgroundColor: "#ffffff",
    padding: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
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
    borderColor: "#d1d5db",
    backgroundColor: "#f9fafb",
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 15,
    color: "#111827",
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
    marginTop: 16,
    alignItems: "center",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#047857",
    backgroundColor: "#ecfdf5",
    paddingHorizontal: 14,
    paddingVertical: 13,
  },
  secondaryButtonText: {
    color: "#047857",
    fontSize: 14,
    fontWeight: "900",
  },
  demoText: {
    marginTop: 12,
    textAlign: "center",
    fontSize: 13,
    color: "#4b5563",
  },
  switchRow: {
    marginTop: 16,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    flexDirection: "row",
    justifyContent: "center",
    gap: 6,
  },
  switchText: {
    fontSize: 14,
    color: "#4b5563",
  },
  switchLink: {
    fontSize: 14,
    fontWeight: "900",
    color: "#047857",
  },
  benefitCard: {
    marginTop: 12,
    borderRadius: 8,
    backgroundColor: "#ecfdf5",
    padding: 14,
    borderWidth: 1,
    borderColor: "#bbf7d0",
  },
  benefitTitle: {
    fontSize: 16,
    fontWeight: "900",
    color: "#064e3b",
  },
  benefitList: {
    marginTop: 10,
    gap: 8,
  },
  benefitPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderRadius: 8,
    backgroundColor: "#ffffff",
    paddingHorizontal: 10,
    paddingVertical: 9,
  },
  benefitCheck: {
    color: "#047857",
    fontWeight: "900",
  },
  benefitText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
    color: "#065f46",
  },
});

export const authStyles = styles;