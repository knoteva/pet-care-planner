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
      <View style={styles.header}>
        <Text style={styles.eyebrow}>Достъп</Text>
        <Text style={styles.title}>Вход в Лапички</Text>
        <Text style={styles.subtitle}>
          Статичен мобилен auth изглед. Реалният вход ще използва REST API и
          Bearer JWT token.
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Вход</Text>
        <AuthField label="Имейл" placeholder="demo@paws.bg" />
        <AuthField label="Парола" placeholder="demo123" secure />
        <Pressable style={styles.primaryButton}>
          <Text style={styles.primaryButtonText}>Влез</Text>
        </Pressable>
        <Text style={styles.demoText}>Демо достъп: demo@paws.bg / demo123</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Регистрация</Text>
        <AuthField label="Име" placeholder="Мария Петкова" />
        <AuthField label="Имейл" placeholder="maria@example.com" />
        <AuthField label="Парола" placeholder="Минимум 8 символа" secure />
        <AuthField
          label="Потвърди парола"
          placeholder="Повтори паролата"
          secure
        />
        <Pressable style={styles.secondaryButton}>
          <Text style={styles.secondaryButtonText}>Създай профил</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

function AuthField({
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

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#f5f7f4",
  },
  content: {
    padding: 18,
    paddingBottom: 32,
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
  sectionTitle: {
    fontSize: 20,
    fontWeight: "900",
    color: "#111827",
  },
  field: {
    marginTop: 14,
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
    fontSize: 13,
    color: "#4b5563",
  },
});
