import { Link } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";

import { mobileEvents } from "@/src/services/mock-data";

const homeStats = [
  { label: "Днес", value: "3 събития", detail: "разходка, грижа и игра" },
  { label: "Групи", value: "4 активни", detail: "по квартал и нужда" },
  { label: "Предложения", value: "2 нови", detail: "чакат мениджър" },
];

export default function EventsScreen() {
  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={styles.brandRow}>
        <View style={styles.logoBox}>
          <Text style={styles.logoText}>Л</Text>
        </View>
        <View>
          <Text style={styles.brand}>Лапички</Text>
          <Text style={styles.brandSubline}>планер за грижа</Text>
        </View>
      </View>

      <View style={styles.loginCard}>
        <Text style={styles.loginTitle}>Вход в профил</Text>
        <Text style={styles.loginCopy}>
          Демо достъп за преглед на групи, събития и грижа.
        </Text>
        <Text style={styles.label}>Имейл</Text>
        <TextInput
          style={styles.input}
          placeholder="demo@paws.bg"
          placeholderTextColor="#94a3b8"
        />
        <Text style={styles.label}>Парола</Text>
        <TextInput
          style={styles.input}
          placeholder="demo123"
          placeholderTextColor="#94a3b8"
          secureTextEntry
        />
        <Link href="/auth" asChild>
          <Pressable style={styles.primaryButton}>
            <Text style={styles.primaryButtonText}>Вход</Text>
          </Pressable>
        </Link>
        <View style={styles.registerRow}>
          <Text style={styles.registerText}>Нямаш профил?</Text>
          <Link href="/register" asChild>
            <Pressable hitSlop={8}>
              <Text style={styles.registerLink}>Регистрирай се!</Text>
            </Pressable>
          </Link>
        </View>
      </View>

      <View style={styles.heroCard}>
        <Text style={styles.eyebrow}>квартална организация</Text>
        <Text style={styles.title}>
          Един споделен план за разходки, грижа и помощ с любимците.
        </Text>
        <Text style={styles.subtitle}>
          Вместо уговорки в чатове, групата вижда събития, участници,
          коментари и предложения на едно място.
        </Text>
      </View>

      <View style={styles.statsGrid}>
        {homeStats.map((stat) => (
          <View key={stat.label} style={styles.statCard}>
            <Text style={styles.statLabel}>{stat.label}</Text>
            <Text style={styles.statValue}>{stat.value}</Text>
            <Text style={styles.statDetail}>{stat.detail}</Text>
          </View>
        ))}
      </View>

      <View style={styles.activityCard}>
        <Text style={styles.sectionTitle}>Последни демо активности</Text>
        <View style={styles.activityList}>
          {mobileEvents.map((event) => (
            <View key={event.id} style={styles.eventCard}>
              <View style={styles.eventTop}>
                <Text style={styles.badge}>{event.status}</Text>
                <Text style={styles.capacity}>{event.capacity}</Text>
              </View>
              <Text style={styles.eventTitle}>{event.title}</Text>
              <Text style={styles.meta}>{event.location}</Text>
              <Text style={styles.eventTime}>{event.time}</Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#eef4f1",
  },
  content: {
    padding: 18,
    paddingBottom: 34,
  },
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 14,
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
    fontSize: 22,
    fontWeight: "900",
    color: "#047857",
  },
  brandSubline: {
    marginTop: 1,
    fontSize: 12,
    color: "#64748b",
  },
  loginCard: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#dce3df",
    backgroundColor: "#ffffff",
    padding: 18,
  },
  loginTitle: {
    fontSize: 22,
    fontWeight: "900",
    color: "#0f172a",
  },
  loginCopy: {
    marginTop: 8,
    fontSize: 14,
    lineHeight: 21,
    color: "#475569",
  },
  label: {
    marginTop: 14,
    fontSize: 13,
    fontWeight: "800",
    color: "#0f172a",
  },
  input: {
    marginTop: 7,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#cbd5e1",
    backgroundColor: "#eff6ff",
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
  registerRow: {
    marginTop: 15,
    flexDirection: "row",
    justifyContent: "center",
    gap: 6,
  },
  registerText: {
    fontSize: 14,
    color: "#475569",
  },
  registerLink: {
    fontSize: 14,
    fontWeight: "900",
    color: "#047857",
  },
  heroCard: {
    marginTop: 14,
    borderRadius: 8,
    backgroundColor: "#ffffff",
    padding: 20,
    borderWidth: 1,
    borderColor: "#dce3df",
  },
  eyebrow: {
    fontSize: 13,
    fontWeight: "900",
    color: "#047857",
    textTransform: "uppercase",
  },
  title: {
    marginTop: 10,
    fontSize: 28,
    lineHeight: 34,
    fontWeight: "900",
    color: "#0f172a",
  },
  subtitle: {
    marginTop: 12,
    fontSize: 15,
    lineHeight: 23,
    color: "#475569",
  },
  statsGrid: {
    marginTop: 14,
    gap: 10,
  },
  statCard: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#dce3df",
    backgroundColor: "#ffffff",
    padding: 16,
  },
  statLabel: {
    fontSize: 13,
    fontWeight: "800",
    color: "#64748b",
  },
  statValue: {
    marginTop: 7,
    fontSize: 24,
    fontWeight: "900",
    color: "#047857",
  },
  statDetail: {
    marginTop: 4,
    fontSize: 13,
    color: "#475569",
  },
  activityCard: {
    marginTop: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#dce3df",
    backgroundColor: "#ffffff",
    padding: 16,
  },
  sectionTitle: {
    fontSize: 19,
    fontWeight: "900",
    color: "#0f172a",
  },
  activityList: {
    marginTop: 12,
    gap: 11,
  },
  eventCard: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    backgroundColor: "#fbfbfa",
    padding: 14,
  },
  eventTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
  badge: {
    overflow: "hidden",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#99f6e4",
    backgroundColor: "#ecfdf5",
    paddingHorizontal: 10,
    paddingVertical: 5,
    color: "#047857",
    fontSize: 12,
    fontWeight: "900",
  },
  capacity: {
    fontSize: 13,
    fontWeight: "900",
    color: "#92400e",
  },
  eventTitle: {
    marginTop: 11,
    fontSize: 17,
    lineHeight: 22,
    fontWeight: "900",
    color: "#0f172a",
  },
  meta: {
    marginTop: 5,
    fontSize: 13,
    lineHeight: 19,
    color: "#475569",
  },
  eventTime: {
    marginTop: 7,
    fontSize: 13,
    fontWeight: "800",
    color: "#0f172a",
  },
});
