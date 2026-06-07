import { useCallback, useEffect, useState } from "react";
import { Text, TextInput, View } from "react-native";

import * as api from "@/src/services/api";
import {
  AppHeader,
  Badge,
  Card,
  EmptyState,
  ErrorBanner,
  LoadingState,
  PrimaryButton,
  SecondaryButton,
  RequireLogin,
  Screen,
  SectionTitle,
  Subtitle,
  SuccessBanner,
  Title,
  Eyebrow,
} from "@/src/components/mobile-ui";
import { useAuth } from "@/src/state/auth-context";

export default function GroupsScreen() {
  const { user, token, isLoading: authLoading } = useAuth();
  const [groups, setGroups] = useState<api.MobileGroup[]>([]);
  const [inviteCode, setInviteCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [groupPage, setGroupPage] = useState(1);
  const [groupsHasNext, setGroupsHasNext] = useState(false);
  const [joining, setJoining] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadGroups = useCallback(
    async (page = 1, append = false) => {
      if (!token) return;

      if (append) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }
      setError(null);

      try {
        const response = await api.listGroups(token, page);
        setGroups((current) => {
          if (!append) return response.groups;

          const byId = new Map(current.map((group) => [group.id, group]));
          for (const group of response.groups) {
            byId.set(group.id, group);
          }

          return Array.from(byId.values());
        });
        setGroupPage(response.pagination.page);
        setGroupsHasNext(response.pagination.hasNext);
      } catch (requestError) {
        setError(
          requestError instanceof Error
            ? requestError.message
            : "Групите не можаха да се заредят.",
        );
      } finally {
        if (append) {
          setLoadingMore(false);
        } else {
          setLoading(false);
        }
      }
    },
    [token],
  );

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
      await loadGroups(1, false);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Не успях да те добавя към групата.",
      );
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
      <AppHeader subtitle="групи" />
      <Card>
        <Eyebrow>Квартална грижа</Eyebrow>
        <Title>Достъпни групи</Title>
        <Subtitle>
          Виж групите, които можеш да отвориш. За участие използвай код за покана или създай група през
          web, а тук можеш да се включиш с код.
        </Subtitle>
      </Card>
      <ErrorBanner message={error} />
      <SuccessBanner message={message} />
      <Card>
        <SectionTitle>Код за покана</SectionTitle>
        <TextInput
          style={groupStyles.inviteInput}
          placeholder="Напр. PAWS-SOUTH"
          placeholderTextColor="#9ca3af"
          value={inviteCode}
          onChangeText={(value) => setInviteCode(value.toUpperCase())}
          autoCapitalize="characters"
        />
        <PrimaryButton
          disabled={joining}
          onPress={() => void handleJoinGroup()}
        >
          {joining ? "Добавяне..." : "Присъедини се"}
        </PrimaryButton>
      </Card>
      <SectionTitle>Групи</SectionTitle>
      {loading && groups.length === 0 ? <LoadingState /> : null}
      {!loading && groups.length === 0 ? (
        <EmptyState
          title="Няма групи"
          text="Въведи код за покана или създай група през web приложението."
        />
      ) : null}
      <View style={groupStyles.list}>
        {groups.map((group) => (
          <Card key={group.id}>
            <View style={groupStyles.groupTop}>
              <Badge>{group.role === "manager" ? "мениджър" : group.role === "member" ? "член" : "достъпна"}</Badge>
              <Badge tone="gray">{group.inviteCode}</Badge>
            </View>
            <Text style={groupStyles.groupTitle}>{group.title}</Text>
            {group.area ? (
              <Text style={groupStyles.groupMeta}>{group.area}</Text>
            ) : null}
            {group.description ? (
              <Text style={groupStyles.groupDescription}>
                {group.description}
              </Text>
            ) : null}
          </Card>
        ))}
      </View>
      {groupsHasNext ? (
        <SecondaryButton
          disabled={loadingMore}
          onPress={() => void loadGroups(groupPage + 1, true)}
        >
          {loadingMore ? "Зареждане..." : "Зареди още"}
        </SecondaryButton>
      ) : null}
    </Screen>
  );
}

const groupStyles = {
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
