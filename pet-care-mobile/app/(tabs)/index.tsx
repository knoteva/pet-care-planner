import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { mobileEvents, mobileStats } from "@/src/services/mock-data";

export default function EventsScreen() {
  const primaryEvent = mobileEvents[0];

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>Лапички</Text>
        <Text style={styles.title}>План за грижа днес</Text>
        <Text style={styles.subtitle}>
          Мобилен демо изглед за участие, коментари, групи и грижа за любимците.
        </Text>
      </View>

      <View style={styles.summaryRow}>
        {mobileStats.map((stat) => (
          <View
            key={stat.label}
            style={[styles.summaryCard, { backgroundColor: stat.tone }]}
          >
            <Text style={[styles.summaryValue, { color: stat.text }]}>
              {stat.value}
            </Text>
            <Text style={[styles.summaryLabel, { color: stat.text }]}>
              {stat.label}
            </Text>
          </View>
        ))}
      </View>

      <View style={styles.featuredCard}>
        <Text style={styles.badge}>{primaryEvent.status}</Text>
        <Text style={styles.featuredTitle}>{primaryEvent.title}</Text>
        <Text style={styles.meta}>
          {primaryEvent.time} · {primaryEvent.location}
        </Text>
        <Text style={styles.note}>{primaryEvent.note}</Text>
        <View style={styles.infoGrid}>
          <Info label="Капацитет" value={primaryEvent.capacity} />
          <Info label="Коментари" value={`${primaryEvent.comments}`} />
        </View>
        <View style={styles.actions}>
          <Pressable style={styles.primaryButton}>
            <Text style={styles.primaryButtonText}>Ще участвам</Text>
          </Pressable>
          <Pressable style={styles.secondaryButton}>
            <Text style={styles.secondaryButtonText}>Напиши коментар</Text>
          </Pressable>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Предстоящи събития</Text>
      <View style={styles.list}>
        {mobileEvents.slice(1).map((event) => (
          <View key={event.id} style={styles.eventCard}>
            <View style={styles.cardTop}>
              <Text style={styles.badge}>{event.status}</Text>
              <Text style={styles.capacity}>{event.capacity}</Text>
            </View>
            <Text style={styles.eventTitle}>{event.title}</Text>
            <Text style={styles.meta}>{event.group}</Text>
            <Text style={styles.meta}>
              {event.time} · {event.location}
            </Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.infoBox}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
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
  summaryRow: {
    marginTop: 14,
    flexDirection: "row",
    gap: 10,
  },
  summaryCard: {
    flex: 1,
    minHeight: 86,
    justifyContent: "center",
    borderRadius: 8,
    padding: 12,
  },
  summaryValue: {
    textAlign: "center",
    fontSize: 26,
    fontWeight: "900",
  },
  summaryLabel: {
    marginTop: 2,
    textAlign: "center",
    fontSize: 12,
    fontWeight: "800",
  },
  featuredCard: {
    marginTop: 14,
    borderRadius: 8,
    backgroundColor: "#ffffff",
    padding: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  badge: {
    alignSelf: "flex-start",
    overflow: "hidden",
    borderRadius: 8,
    backgroundColor: "#ecfdf5",
    borderWidth: 1,
    borderColor: "#bbf7d0",
    paddingHorizontal: 10,
    paddingVertical: 5,
    color: "#166534",
    fontSize: 12,
    fontWeight: "800",
  },
  featuredTitle: {
    marginTop: 12,
    fontSize: 23,
    fontWeight: "900",
    color: "#111827",
  },
  meta: {
    marginTop: 5,
    fontSize: 14,
    color: "#6b7280",
  },
  note: {
    marginTop: 10,
    fontSize: 14,
    lineHeight: 21,
    color: "#374151",
  },
  infoGrid: {
    marginTop: 14,
    flexDirection: "row",
    gap: 10,
  },
  infoBox: {
    flex: 1,
    borderRadius: 8,
    backgroundColor: "#f9fafb",
    padding: 12,
  },
  infoLabel: {
    fontSize: 11,
    fontWeight: "800",
    color: "#6b7280",
    textTransform: "uppercase",
  },
  infoValue: {
    marginTop: 4,
    fontSize: 15,
    fontWeight: "900",
    color: "#111827",
  },
  actions: {
    marginTop: 14,
    flexDirection: "row",
    flexWrap: "wrap",
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
  sectionTitle: {
    marginTop: 20,
    fontSize: 20,
    fontWeight: "900",
    color: "#111827",
  },
  list: {
    marginTop: 10,
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
  capacity: {
    fontSize: 13,
    fontWeight: "900",
    color: "#92400e",
  },
  eventTitle: {
    marginTop: 12,
    fontSize: 18,
    fontWeight: "900",
    color: "#111827",
  },
});
