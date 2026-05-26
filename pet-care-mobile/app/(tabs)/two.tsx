import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { mobilePets } from "@/src/services/mock-data";

export default function PetsScreen() {
  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>Профил</Text>
        <Text style={styles.title}>Моите любимци</Text>
        <Text style={styles.subtitle}>
          Избирай любимец при участие в събитие или се включи като помощник.
        </Text>
      </View>

      <View style={styles.petList}>
        {mobilePets.map((pet) => (
          <View key={pet.id} style={styles.petCard}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{pet.name.slice(0, 1)}</Text>
            </View>
            <View style={styles.petBody}>
              <Text style={styles.petName}>{pet.name}</Text>
              <Text style={styles.petMeta}>
                {pet.breed} · {pet.age}
              </Text>
              <Text style={styles.petNote}>{pet.note}</Text>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.profileCard}>
        <Text style={styles.profileTitle}>demo@paws.bg</Text>
        <Text style={styles.profileText}>
          Демо профил за тестване на бъдещия auth flow.
        </Text>
        <Pressable style={styles.secondaryButton}>
          <Text style={styles.secondaryButtonText}>Изход</Text>
        </Pressable>
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
  title: {
    marginTop: 4,
    fontSize: 28,
    fontWeight: "800",
    color: "#111827",
  },
  eyebrow: {
    fontSize: 13,
    fontWeight: "800",
    color: "#be123c",
    textTransform: "uppercase",
  },
  subtitle: {
    marginTop: 8,
    fontSize: 15,
    lineHeight: 22,
    color: "#4b5563",
  },
  petList: {
    marginTop: 14,
    gap: 12,
  },
  petCard: {
    flexDirection: "row",
    gap: 12,
    borderRadius: 8,
    backgroundColor: "#ffffff",
    padding: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: "#ffe4e6",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: "#9f1239",
    fontSize: 20,
    fontWeight: "900",
  },
  petBody: {
    flex: 1,
  },
  petName: {
    fontSize: 18,
    fontWeight: "800",
    color: "#111827",
  },
  petMeta: {
    marginTop: 3,
    fontSize: 14,
    color: "#6b7280",
  },
  petNote: {
    marginTop: 8,
    fontSize: 14,
    lineHeight: 21,
    color: "#374151",
  },
  profileCard: {
    marginTop: 14,
    borderRadius: 8,
    backgroundColor: "#ffffff",
    padding: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  profileTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: "#111827",
  },
  profileText: {
    marginTop: 6,
    fontSize: 14,
    lineHeight: 21,
    color: "#4b5563",
  },
  secondaryButton: {
    marginTop: 14,
    alignSelf: "flex-start",
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
