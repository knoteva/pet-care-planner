import { Link } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";

import * as api from "@/src/services/api";
import { Badge, BrandHeader, Card, DemoProfiles, EmptyState, ErrorBanner, LoadingState, PrimaryButton, Screen, SecondaryButton, SectionTitle, Subtitle, Title, Eyebrow, styles } from "@/src/components/mobile-ui";
import { formatCapacity, formatDuration, formatEventDate, formatEventStatus, formatEventType } from "@/src/utils/format";
import { useAuth } from "@/src/state/auth-context";

export default function DashboardScreen() {
  const { user, token, isLoading: authLoading } = useAuth();
  const [events, setEvents] = useState<api.MobileEvent[]>([]);
  const [commentsByEvent, setCommentsByEvent] = useState<Record<number, api.MobileComment[]>>({});
  const [commentInputs, setCommentInputs] = useState<Record<number, string>>({});
  const [expandedEventId, setExpandedEventId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [actionEventId, setActionEventId] = useState<number | null>(null);

  const loadEvents = useCallback(async () => {
    if (!token) return;

    setLoading(true);
    setError(null);

    try {
      const response = await api.listEvents(token);
      setEvents(response.events);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Събитията не можаха да се заредят.");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    void loadEvents();
  }, [loadEvents]);

  const stats = useMemo(() => {
    const groupNames = new Set(events.map((event) => event.groupTitle ?? String(event.groupId)));
    const joined = events.filter((event) => event.participationStatus === "joined").length;

    return [
      { label: "Събития", value: String(events.length), detail: "видими за профила" },
      { label: "Групи", value: String(groupNames.size), detail: "с активен достъп" },
      { label: "Участия", value: String(joined), detail: "потвърдени" },
    ];
  }, [events]);

  async function toggleJoin(event: api.MobileEvent) {
    if (!token) return;

    setActionEventId(event.id);
    setError(null);

    try {
      if (event.participationStatus === "joined") {
        await api.leaveEvent(event.id, token);
      } else {
        await api.joinEvent(event.id, token);
      }

      await loadEvents();
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Участието не беше записано.");
    } finally {
      setActionEventId(null);
    }
  }

  async function toggleComments(eventId: number) {
    if (!token) return;

    if (expandedEventId === eventId) {
      setExpandedEventId(null);
      return;
    }

    setExpandedEventId(eventId);
    setError(null);

    try {
      const response = await api.listComments(eventId, token);
      setCommentsByEvent((current) => ({ ...current, [eventId]: response.comments }));
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Коментарите не можаха да се заредят.");
    }
  }

  async function submitComment(eventId: number) {
    if (!token) return;

    const text = (commentInputs[eventId] ?? "").trim();

    if (text.length < 2) {
      setError("Коментарът трябва да е поне 2 символа.");
      return;
    }

    setActionEventId(eventId);
    setError(null);

    try {
      await api.createComment(eventId, text, token);
      setCommentInputs((current) => ({ ...current, [eventId]: "" }));
      const response = await api.listComments(eventId, token);
      setCommentsByEvent((current) => ({ ...current, [eventId]: response.comments }));
      await loadEvents();
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Коментарът не беше записан.");
    } finally {
      setActionEventId(null);
    }
  }

  if (authLoading) {
    return (
      <Screen>
        <LoadingState label="Проверявам mobile сесията..." />
      </Screen>
    );
  }

  if (!user) {
    return (
      <Screen>
        <BrandHeader subtitle="мобилен планер" />
        <Card>
          <Eyebrow>Квартална организация</Eyebrow>
          <Title>Един споделен план за разходки, грижа и помощ с любимците.</Title>
          <Subtitle>Mobile приложението използва REST API и Bearer token. Влез, за да видиш реалните групи, събития и любимци от базата.</Subtitle>
          <Link href="/auth" asChild>
            <Pressable style={styles.primaryButton}>
              <Text style={styles.primaryButtonText}>Вход в профил</Text>
            </Pressable>
          </Link>
          <DemoProfiles />
        </Card>
      </Screen>
    );
  }

  return (
    <Screen>
      <BrandHeader subtitle={`здравей, ${user.name}`} />
      <Card tone="green">
        <Eyebrow>Активен профил</Eyebrow>
        <Title>План за грижа днес</Title>
        <Subtitle>{user.email}</Subtitle>
      </Card>
      <ErrorBanner message={error} />
      <View style={dashboardStyles.statsGrid}>
        {stats.map((stat) => (
          <View key={stat.label} style={dashboardStyles.statCard}>
            <Text style={dashboardStyles.statLabel}>{stat.label}</Text>
            <Text style={dashboardStyles.statValue}>{stat.value}</Text>
            <Text style={dashboardStyles.statDetail}>{stat.detail}</Text>
          </View>
        ))}
      </View>
      <View style={dashboardStyles.sectionHeader}>
        <SectionTitle>Събития</SectionTitle>
        <SecondaryButton disabled={loading} onPress={() => void loadEvents()}>{loading ? "Зарежда..." : "Обнови"}</SecondaryButton>
      </View>
      {loading && events.length === 0 ? <LoadingState /> : null}
      {!loading && events.length === 0 ? <EmptyState title="Няма събития" text="Влез в група с код за покана или създай събитие през web приложението." /> : null}
      <View style={dashboardStyles.list}>
        {events.map((event) => {
          const isJoined = event.participationStatus === "joined";
          const isExpanded = expandedEventId === event.id;
          const comments = commentsByEvent[event.id] ?? [];
          const actionInProgress = actionEventId === event.id;

          return (
            <Card key={event.id}>
              <View style={dashboardStyles.eventTop}>
                <Badge>{formatEventStatus(event.status)}</Badge>
                <Badge tone="gray">{formatCapacity(event)}</Badge>
              </View>
              <Text style={dashboardStyles.eventTitle}>{event.title}</Text>
              <Text style={dashboardStyles.eventMeta}>{event.groupTitle ?? "Група"} · {formatEventType(event.eventType)}</Text>
              <Text style={dashboardStyles.eventMeta}>{event.location}</Text>
              <View style={dashboardStyles.eventFacts}>
                <Text style={dashboardStyles.factText}>{formatEventDate(event.startsAt)}</Text>
                <Text style={dashboardStyles.factText}>{formatDuration(event.durationMinutes)}</Text>
                <Text style={dashboardStyles.factText}>{event.commentCount ?? 0} коментара</Text>
              </View>
              {event.notes ? <Text style={dashboardStyles.eventNote}>{event.notes}</Text> : null}
              <PrimaryButton disabled={actionInProgress} onPress={() => void toggleJoin(event)}>
                {isJoined ? "Няма да участвам" : "Ще участвам"}
              </PrimaryButton>
              <SecondaryButton disabled={actionInProgress} onPress={() => void toggleComments(event.id)}>
                {isExpanded ? "Скрий коментарите" : "Коментари"}
              </SecondaryButton>
              {isExpanded ? (
                <View style={dashboardStyles.commentsBox}>
                  {comments.length === 0 ? <Text style={dashboardStyles.commentEmpty}>Още няма коментари.</Text> : null}
                  {comments.map((comment) => (
                    <View key={comment.id} style={dashboardStyles.commentItem}>
                      <Text style={dashboardStyles.commentAuthor}>{comment.authorName ?? "Потребител"}</Text>
                      <Text style={dashboardStyles.commentText}>{comment.text}</Text>
                    </View>
                  ))}
                  <TextInput
                    style={dashboardStyles.commentInput}
                    placeholder="Напиши коментар"
                    placeholderTextColor="#9ca3af"
                    value={commentInputs[event.id] ?? ""}
                    onChangeText={(value) => setCommentInputs((current) => ({ ...current, [event.id]: value }))}
                    multiline
                  />
                  <PrimaryButton disabled={actionInProgress} onPress={() => void submitComment(event.id)}>Изпрати коментар</PrimaryButton>
                </View>
              ) : null}
            </Card>
          );
        })}
      </View>
    </Screen>
  );
}

const dashboardStyles = {
  statsGrid: {
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
    fontWeight: "800" as const,
    color: "#64748b",
  },
  statValue: {
    marginTop: 5,
    fontSize: 26,
    fontWeight: "900" as const,
    color: "#047857",
  },
  statDetail: {
    marginTop: 3,
    fontSize: 13,
    color: "#475569",
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
  eventTop: {
    flexDirection: "row" as const,
    flexWrap: "wrap" as const,
    gap: 8,
  },
  eventTitle: {
    marginTop: 12,
    fontSize: 19,
    lineHeight: 24,
    fontWeight: "900" as const,
    color: "#0f172a",
  },
  eventMeta: {
    marginTop: 5,
    fontSize: 14,
    lineHeight: 20,
    color: "#475569",
  },
  eventFacts: {
    marginTop: 12,
    gap: 6,
  },
  factText: {
    fontSize: 13,
    fontWeight: "800" as const,
    color: "#0f172a",
  },
  eventNote: {
    marginTop: 10,
    fontSize: 14,
    lineHeight: 21,
    color: "#475569",
  },
  commentsBox: {
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    paddingTop: 12,
    gap: 8,
  },
  commentEmpty: {
    fontSize: 14,
    color: "#64748b",
  },
  commentItem: {
    borderRadius: 8,
    backgroundColor: "#f8fafc",
    padding: 10,
  },
  commentAuthor: {
    fontSize: 12,
    fontWeight: "900" as const,
    color: "#047857",
  },
  commentText: {
    marginTop: 4,
    fontSize: 14,
    lineHeight: 20,
    color: "#0f172a",
  },
  commentInput: {
    minHeight: 72,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#cbd5e1",
    backgroundColor: "#ffffff",
    paddingHorizontal: 12,
    paddingVertical: 10,
    textAlignVertical: "top" as const,
    fontSize: 14,
    color: "#0f172a",
  },
};