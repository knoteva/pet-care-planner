import { useCallback, useEffect, useState } from "react";
import { Text, TextInput, View } from "react-native";

import * as api from "@/src/services/api";
import { Badge, BrandHeader, Card, EmptyState, ErrorBanner, LoadingState, PrimaryButton, RequireLogin, Screen, SecondaryButton, SectionTitle, Subtitle, Title, Eyebrow } from "@/src/components/mobile-ui";
import { useAuth } from "@/src/state/auth-context";

export default function GroupsScreen() {
  const { user, token, isLoading: authLoading } = useAuth();
  const [groups, setGroups] = useState<api.MobileGroup[]>([]);
  const [inviteCode, setInviteCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [joining, setJoining] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadGroups = useCallback(async () => {
    if (!token) return;

    setLoading(true);
    setError(null);

    try {
      const response = await api.listGroups(token);
      setGroups(response.groups);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Групите не можаха да се заредят.");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    void loadGroups();
  }, [loadGroups]);

  async function handleJoinGroup() {
    if (!token) return;

    const cleanCode = inviteCode.trim().toUpperCase();

    if (cleanCode.length < 4) {
      setError("Кодът трябва да е поне 4 символа.");
      return;
    }

    setJoining(true);
    setError(null);
    setMessage(null);

    try {
      await api.joinGroup(cleanCode, token);
      setInviteCode("");
      setMessage("Успешно се присъедини към групата.");
      await loadGroups();
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Не успях да те добавя към групата.");
    } finally {
      setJoining(false);
    }
  }

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
      <BrandHeader subtitle="моите групи" />
      <Card>
        <Eyebrow>Групи</Eyebrow>
        <Title>Квартална грижа</Title>
        <Subtitle>Виж групите, в които участваш. Нови групи и събития се управляват през web, а тук можеш да се включиш с код.</Subtitle>
      </Card>
      <ErrorBanner message={error} />
      {message ? (
        <Card tone="green">
          <Text style={groupStyles.successText}>{message}</Text>
        </Card>
      ) : null}
      <Card>
        <SectionTitle>Вход с код за покана</SectionTitle>
        <TextInput
          style={groupStyles.inviteInput}
          placeholder="Напр. PAWS-SOUTH"
          placeholderTextColor="#9ca3af"
          value={inviteCode}
          onChangeText={(value) => setInviteCode(value.toUpperCase())}
          autoCapitalize="characters"
        />
        <PrimaryButton disabled={joining} onPress={() => void handleJoinGroup()}>{joining ? "Добавяне..." : "Присъедини се"}</PrimaryButton>
      </Card>
      <View style={groupStyles.sectionHeader}>
        <SectionTitle>Моите групи</SectionTitle>
        <SecondaryButton disabled={loading} onPress={() => void loadGroups()}>{loading ? "Зарежда..." : "Обнови"}</SecondaryButton>
      </View>
      {loading && groups.length === 0 ? <LoadingState /> : null}
      {!loading && groups.length === 0 ? <EmptyState title="Няма групи" text="Въведи код за покана или създай група през web приложението." /> : null}
      <View style={groupStyles.list}>
        {groups.map((group) => (
          <Card key={group.id}>
            <View style={groupStyles.groupTop}>
              <Badge>{group.role === "manager" ? "мениджър" : "член"}</Badge>
              <Badge tone="gray">{group.inviteCode}</Badge>
            </View>
            <Text style={groupStyles.groupTitle}>{group.title}</Text>
            {group.area ? <Text style={groupStyles.groupMeta}>{group.area}</Text> : null}
            {group.description ? <Text style={groupStyles.groupDescription}>{group.description}</Text> : null}
          </Card>
        ))}
      </View>
    </Screen>
  );
}

const groupStyles = {
  successText: {
    fontSize: 14,
    fontWeight: "800" as const,
    color: "#047857",
  },
  inviteInput: {
    marginTop: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#cbd5e1",
    backgroundColor: "#ffffff",
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 15,
    color: "#0f172a",
  },
  sectionHeader: {
    flexDirection: "row" as const,
    justifyContent: "space-between" as const,
    alignItems: "center" as const,
    gap: 12,
  },
  list: {
    gap: 12,
  },
  groupTop: {
    flexDirection: "row" as const,
    flexWrap: "wrap" as const,
    gap: 8,
  },
  groupTitle: {
    marginTop: 12,
    fontSize: 19,
    lineHeight: 24,
    fontWeight: "900" as const,
    color: "#0f172a",
  },
  groupMeta: {
    marginTop: 5,
    fontSize: 14,
    color: "#475569",
  },
  groupDescription: {
    marginTop: 10,
    fontSize: 14,
    lineHeight: 21,
    color: "#475569",
  },
};