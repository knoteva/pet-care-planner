import { useCallback, useEffect, useState } from "react";
import { Text, View } from "react-native";

import * as api from "@/src/services/api";
import { Badge, BrandHeader, Card, EmptyState, ErrorBanner, LoadingState, RequireLogin, Screen, SecondaryButton, SectionTitle, Subtitle, Title, Eyebrow } from "@/src/components/mobile-ui";
import { useAuth } from "@/src/state/auth-context";
import { formatPetMeta } from "@/src/utils/format";

export default function PetsScreen() {
  const { user, token, isLoading: authLoading } = useAuth();
  const [pets, setPets] = useState<api.MobilePet[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadPets = useCallback(async () => {
    if (!token) return;

    setLoading(true);
    setError(null);

    try {
      const response = await api.listPets(token);
      setPets(response.pets);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Любимците не можаха да се заредят.");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    void loadPets();
  }, [loadPets]);

  if (authLoading) {
    return (
      <Screen>
        <LoadingState label="Проверявам mobile сесията..." />
      </Screen>
    );
  }

  if (!user || !token) {
    return <RequireLogin />;
  }

  return (
    <Screen>
      <BrandHeader subtitle="любимци" />
      <Card>
        <Eyebrow>Профил</Eyebrow>
        <Title>Моите любимци</Title>
        <Subtitle>Mobile приложението показва любимците от реалната база. Добавяне и редакция засега остават в web приложението.</Subtitle>
      </Card>
      <ErrorBanner message={error} />
      <View style={petStyles.sectionHeader}>
        <SectionTitle>Списък</SectionTitle>
        <SecondaryButton disabled={loading} onPress={() => void loadPets()}>{loading ? "Зарежда..." : "Обнови"}</SecondaryButton>
      </View>
      {loading && pets.length === 0 ? <LoadingState /> : null}
      {!loading && pets.length === 0 ? <EmptyState title="Няма любимци" text="Добави любимец през web приложението, после обнови този екран." /> : null}
      <View style={petStyles.list}>
        {pets.map((pet) => (
          <Card key={pet.id}>
            <View style={petStyles.petTop}>
              <View style={petStyles.avatar}>
                <Text style={petStyles.avatarText}>{pet.name.slice(0, 1).toUpperCase()}</Text>
              </View>
              <View style={petStyles.petInfo}>
                <Text style={petStyles.petName}>{pet.name}</Text>
                <Text style={petStyles.petMeta}>{formatPetMeta(pet)}</Text>
              </View>
            </View>
            {pet.size ? <Badge tone="gray">{pet.size}</Badge> : null}
            {pet.notes ? <Text style={petStyles.petNotes}>{pet.notes}</Text> : null}
          </Card>
        ))}
      </View>
    </Screen>
  );
}

const petStyles = {
  sectionHeader: {
    flexDirection: "row" as const,
    justifyContent: "space-between" as const,
    alignItems: "center" as const,
    gap: 12,
  },
  list: {
    gap: 12,
  },
  petTop: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: 12,
    marginBottom: 12,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 8,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    backgroundColor: "#ffe4e6",
  },
  avatarText: {
    color: "#9f1239",
    fontSize: 20,
    fontWeight: "900" as const,
  },
  petInfo: {
    flex: 1,
  },
  petName: {
    fontSize: 19,
    fontWeight: "900" as const,
    color: "#0f172a",
  },
  petMeta: {
    marginTop: 4,
    fontSize: 14,
    color: "#475569",
  },
  petNotes: {
    marginTop: 10,
    fontSize: 14,
    lineHeight: 21,
    color: "#475569",
  },
};