import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { mobileGroups, mobileProposals } from "@/src/services/mock-data";

export default function GroupsScreen() {
  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>Групи</Text>
        <Text style={styles.title}>Квартална грижа</Text>
        <Text style={styles.subtitle}>
          Виж групите си, предложи събитие и следи заявките към мениджърите.
        </Text>
      </View>

      <View style={styles.actions}>
        <Pressable style={styles.primaryButton}>
          <Text style={styles.primaryButtonText}>Създай група</Text>
        </Pressable>
        <Pressable style={styles.secondaryButton}>
          <Text style={styles.secondaryButtonText}>Предложи събитие</Text>
        </Pressable>
      </View>

      <Text style={styles.sectionTitle}>Моите групи</Text>
      <View style={styles.list}>
        {mobileGroups.map((group) => (
          <View key={group.id} style={styles.card}>
            <View style={styles.cardTop}>
              <Text style={styles.badge}>{group.role}</Text>
              <Text style={styles.memberCount}>{group.members}</Text>
            </View>
            <Text style={styles.cardTitle}>{group.title}</Text>
            <Text style={styles.meta}>{group.area}</Text>
            <Text style={styles.note}>{group.description}</Text>
          </View>
        ))}
      </View>

      <Text style={styles.sectionTitle}>Предложения от членове</Text>
      <View style={styles.list}>
        {mobileProposals.map((proposal) => (
          <View key={proposal.id} style={styles.card}>
            <Text style={styles.badge}>{proposal.status}</Text>
            <Text style={styles.cardTitle}>{proposal.title}</Text>
            <Text style={styles.meta}>
              {proposal.author} · {proposal.time}
            </Text>
            <Text style={styles.note}>
              Мениджърът може да превърне предложението в реално събитие.
            </Text>
          </View>
        ))}
      </View>
    </ScrollView>
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
    color: "#5b21b6",
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
    paddingVertical: 12,
  },
  primaryButtonText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "900",
  },
  secondaryButton: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#d1d5db",
    backgroundColor: "#ffffff",
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  secondaryButtonText: {
    color: "#111827",
    fontSize: 14,
    fontWeight: "900",
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
  card: {
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
  memberCount: {
    fontSize: 13,
    fontWeight: "900",
    color: "#6b7280",
  },
  cardTitle: {
    marginTop: 12,
    fontSize: 18,
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
});
