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
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.eyebrow}>Лапички</Text>
          <Text style={styles.title}>Профил</Text>
          <Text style={styles.subtitle}>
            Влез с демо профила. Реалният вход ще използва REST API и Bearer JWT
            token.
          </Text>
        </View>

        <View style={styles.card}>
          <AuthField label="Имейл" placeholder="demo@paws.bg" />
          <AuthField label="Парола" placeholder="demo123" secure />
          <Pressable style={styles.primaryButton}>
            <Text style={styles.primaryButtonText}>Влез</Text>
          </Pressable>
          <Text style={styles.demoText}>
            Демо достъп: demo@paws.bg / demo123
          </Text>
          <View style={styles.registerRow}>
            <Text style={styles.registerQuestion}>Нямаш профил?</Text>
            <Link href="/register" asChild>
              <Pressable>
                <Text style={styles.registerLink}>Регистрирай се!</Text>
              </Pressable>
            </Link>
          </View>
        </View>

        <BenefitCard />
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

function BenefitCard() {
  return (
    <View style={styles.benefitCard}>
      <Text style={styles.benefitTitle}>Какво получаваш?</Text>
      <Text style={styles.benefitItem}>✓ Групи за разходки и грижа</Text>
      <Text style={styles.benefitItem}>✓ Участие и коментари по събития</Text>
      <Text style={styles.benefitItem}>✓ Предложения към мениджърите</Text>
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
    paddingBottom: 32,
    alignItems: "center",
  },
  container: {
    width: "100%",
    maxWidth: 520,
  },
  header: {
    borderRadius: 8,
    backgroundColor: "#ffffff",
    padding: 18,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  eyebrow: {
    fontSize: 13,
    fontWeight: "800",
    color: "#047857",
    textTransform: "uppercase",
  },
  title: {
    marginTop: 4,
    fontSize: 28,
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
    marginTop: 14,
    borderRadius: 8,
    backgroundColor: "#ffffff",
    padding: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  field: {
    marginTop: 13,
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
    backgroundColor: "#ffffff",
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
  registerRow: {
    marginTop: 16,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    flexDirection: "row",
    justifyContent: "center",
    gap: 6,
  },
  registerQuestion: {
    fontSize: 14,
    color: "#4b5563",
  },
  registerLink: {
    fontSize: 14,
    fontWeight: "900",
    color: "#047857",
  },
  benefitCard: {
    marginTop: 14,
    borderRadius: 8,
    backgroundColor: "#ecfdf5",
    padding: 16,
    borderWidth: 1,
    borderColor: "#bbf7d0",
  },
  benefitTitle: {
    fontSize: 17,
    fontWeight: "900",
    color: "#064e3b",
  },
  benefitItem: {
    marginTop: 9,
    fontSize: 14,
    lineHeight: 20,
    color: "#065f46",
  },
});

export const authStyles = styles;
