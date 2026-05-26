import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { mobileEvents } from "@/src/services/mock-data";

export default function EventsScreen() {
  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>Лапички</Text>
        <Text style={styles.title}>Предстоящи грижи</Text>
        <Text style={styles.subtitle}>
          Демо мобилен изглед за разходки, участие и коментари.
        </Text>
      </View>

      <View style={styles.summaryRow}>
        <SummaryCard label="Днес" value="3" tone="green" />
        <SummaryCard label="Групи" value="4" tone="blue" />
        <SummaryCard label="Любимци" value="3" tone="rose" />
      </View>

      <View style={styles.list}>
        {mobileEvents.map((event) => (
          <View key={event.id} style={styles.eventCard}>
            <View style={styles.cardTop}>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{event.status}</Text>
              </View>
              <Text style={styles.capacity}>{event.capacity}</Text>
            </View>
            <Text style={styles.eventTitle}>{event.title}</Text>
            <Text style={styles.meta}>{event.group}</Text>
            <Text style={styles.meta}>
              {event.time} · {event.location}
            </Text>
            <Text style={styles.note}>{event.note}</Text>
            <View style={styles.actions}>
              <Pressable style={styles.primaryButton}>
                <Text style={styles.primaryButtonText}>Ще участвам</Text>
              </Pressable>
              <Pressable style={styles.secondaryButton}>
                <Text style={styles.secondaryButtonText}>Детайли</Text>
              </Pressable>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

function SummaryCard({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "green" | "blue" | "rose";
}) {
  const background = {
    green: "#dcfce7",
    blue: "#e0f2fe",
    rose: "#ffe4e6",
  }[tone];

  const color = {
    green: "#166534",
    blue: "#075985",
    rose: "#9f1239",
  }[tone];

  return (
    <View style={[styles.summaryCard, { backgroundColor: background }]}>
      <Text style={[styles.summaryValue, { color }]}>{value}</Text>
      <Text style={[styles.summaryLabel, { color }]}>{label}</Text>
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
  title: {
    marginTop: 4,
    fontSize: 28,
    fontWeight: "800",
    color: "#111827",
  },
  eyebrow: {
    fontSize: 13,
    fontWeight: "800",
    color: "#047857",
    textTransform: "uppercase",
  },
  subtitle: {
    marginTop: 8,
    fontSize: 15,
    lineHeight: 22,
    color: "#4b5563",
  },
  summaryRow: {
    marginTop: 14,
    flexDirection: "row",
    gap: 10,
  },
  summaryCard: {
    flex: 1,
    borderRadius: 8,
    padding: 14,
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: "900",
  },
  summaryLabel: {
    marginTop: 2,
    fontSize: 12,
    fontWeight: "700",
  },
  list: {
    marginTop: 14,
    gap: 12,
  },
  eventCard: {
    borderRadius: 8,
    backgroundColor: "#ffffff",
    padding: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  cardTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  badge: {
    borderRadius: 8,
    backgroundColor: "#ecfdf5",
    borderWidth: 1,
    borderColor: "#bbf7d0",
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  badgeText: {
    color: "#166534",
    fontSize: 12,
    fontWeight: "800",
  },
  capacity: {
    fontSize: 13,
    fontWeight: "800",
    color: "#92400e",
  },
  eventTitle: {
    marginTop: 12,
    fontSize: 19,
    fontWeight: "800",
    color: "#111827",
  },
  meta: {
    marginTop: 4,
    fontSize: 14,
    color: "#6b7280",
  },
  note: {
    marginTop: 10,
    fontSize: 14,
    lineHeight: 21,
    color: "#374151",
  },
  actions: {
    marginTop: 14,
    flexDirection: "row",
    gap: 10,
  },
  primaryButton: {
    borderRadius: 8,
    backgroundColor: "#047857",
    paddingHorizontal: 14,
    paddingVertical: 11,
  },
  primaryButtonText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "800",
  },
  secondaryButton: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#d1d5db",
    paddingHorizontal: 14,
    paddingVertical: 11,
  },
  secondaryButtonText: {
    color: "#111827",
    fontSize: 14,
    fontWeight: "800",
  },
});
