import { Link } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";

import * as api from "@/src/services/api";
import { AppHeader, Badge, Card, DemoProfiles, EmptyState, ErrorBanner, LoadingState, PrimaryButton, Screen, SecondaryButton, SectionTitle, Subtitle, SuccessBanner, Title, Eyebrow, styles } from "@/src/components/mobile-ui";
import { formatCapacity, formatDuration, formatEventDate, formatEventStatus, formatEventType } from "@/src/utils/format";
import { useAuth } from "@/src/state/auth-context";

function actionErrorMessage(error: unknown) {
  if (error instanceof api.ApiError) {
    if (error.status === 403) {
      return "Трябва да си член на групата, за да участваш или коментираш.";
    }

    if (error.status === 401) {
      return "Сесията е изтекла. Влез отново.";
    }

    return error.message;
  }

  return error instanceof Error ? error.message : "Действието не беше записано.";
}

export default function DashboardScreen() {
  const { user, token, isLoading: authLoading } = useAuth();
  const [events, setEvents] = useState<api.MobileEvent[]>([]);
  const [commentsByEvent, setCommentsByEvent] = useState<Record<number, api.MobileComment[]>>({});
  const [commentInputs, setCommentInputs] = useState<Record<number, string>>({});
  const [expandedEventId, setExpandedEventId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [actionEventId, setActionEventId] = useState<number | null>(null);
  const [eventFeedback, setEventFeedback] = useState<Record<number, { type: "success" | "error"; message: string }>>({});
  const [editingCommentIdByEvent, setEditingCommentIdByEvent] = useState<Record<number, number | null>>({});
  const [editCommentInputs, setEditCommentInputs] = useState<Record<number, string>>({});

  const loadEvents = useCallback(async () => {
    if (!token) return;

    setLoading(true);
    setError(null);

    try {
      const response = await api.listEvents(token);
      setEvents(response.events);
    } catch (requestError) {
      setError(actionErrorMessage(requestError));
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
      { label: "Събития", value: String(events.length) },
      { label: "Групи", value: String(groupNames.size) },
      { label: "Участия", value: String(joined) },
    ];
  }, [events]);

  async function toggleJoin(event: api.MobileEvent) {
    if (!token) return;

    const wasJoined = event.participationStatus === "joined";
    setActionEventId(event.id);
    setError(null);
    setEventFeedback((current) => {
      const next = { ...current };
      delete next[event.id];
      return next;
    });

    try {
      if (wasJoined) {
        await api.leaveEvent(event.id, token);
      } else {
        await api.joinEvent(event.id, token);
      }

      setEvents((current) =>
        current.map((item) => {
          if (item.id !== event.id) return item;

          const nextCount = Math.max(0, (item.participantCount ?? 0) + (wasJoined ? -1 : 1));

          return {
            ...item,
            participationStatus: wasJoined ? "left" : "joined",
            participantCount: nextCount,
          };
        }),
      );

      setEventFeedback((current) => ({
        ...current,
        [event.id]: { type: "success", message: wasJoined ? "Участието е отменено." : "Участието е записано." },
      }));
      await loadEvents();
    } catch (requestError) {
      setEventFeedback((current) => ({
        ...current,
        [event.id]: { type: "error", message: actionErrorMessage(requestError) },
      }));
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
      setEventFeedback((current) => ({
        ...current,
        [eventId]: { type: "error", message: actionErrorMessage(requestError) },
      }));
    }
  }

  function startEditingComment(eventId: number, comment: api.MobileComment) {
    setEditingCommentIdByEvent((current) => ({ ...current, [eventId]: comment.id }));
    setEditCommentInputs((current) => ({ ...current, [comment.id]: comment.text }));
  }

  function cancelEditingComment(eventId: number) {
    setEditingCommentIdByEvent((current) => ({ ...current, [eventId]: null }));
  }
  async function submitComment(eventId: number) {
    if (!token) return;

    const text = (commentInputs[eventId] ?? "").trim();

    if (text.length < 2) {
      setEventFeedback((current) => ({
        ...current,
        [eventId]: { type: "error", message: "Коментарът трябва да е поне 2 символа." },
      }));
      return;
    }

    setActionEventId(eventId);
    setError(null);

    try {
      await api.createComment(eventId, text, token);
      setCommentInputs((current) => ({ ...current, [eventId]: "" }));
      const response = await api.listComments(eventId, token);
      setCommentsByEvent((current) => ({ ...current, [eventId]: response.comments }));
      setEventFeedback((current) => ({
        ...current,
        [eventId]: { type: "success", message: "Коментарът е добавен." },
      }));
      await loadEvents();
    } catch (requestError) {
      setEventFeedback((current) => ({
        ...current,
        [eventId]: { type: "error", message: actionErrorMessage(requestError) },
      }));
    } finally {
      setActionEventId(null);
    }
  }

  async function submitCommentEdit(eventId: number, commentId: number) {
    if (!token) return;

    const text = (editCommentInputs[commentId] ?? "").trim();

    if (text.length < 2) {
      setEventFeedback((current) => ({
        ...current,
        [eventId]: { type: "error", message: "Коментарът трябва да е поне 2 символа." },
      }));
      return;
    }

    setActionEventId(eventId);
    setError(null);

    try {
      await api.updateComment(eventId, commentId, text, token);
      const response = await api.listComments(eventId, token);
      setCommentsByEvent((current) => ({ ...current, [eventId]: response.comments }));
      setEditingCommentIdByEvent((current) => ({ ...current, [eventId]: null }));
      setEventFeedback((current) => ({
        ...current,
        [eventId]: { type: "success", message: "Коментарът е обновен." },
      }));
    } catch (requestError) {
      setEventFeedback((current) => ({
        ...current,
        [eventId]: { type: "error", message: actionErrorMessage(requestError) },
      }));
    } finally {
      setActionEventId(null);
    }
  }

  async function deleteComment(eventId: number, commentId: number) {
    if (!token) return;

    setActionEventId(eventId);
    setError(null);

    try {
      await api.deleteComment(eventId, commentId, token);
      const response = await api.listComments(eventId, token);
      setCommentsByEvent((current) => ({ ...current, [eventId]: response.comments }));
      setEditingCommentIdByEvent((current) => ({ ...current, [eventId]: null }));
      setEventFeedback((current) => ({
        ...current,
        [eventId]: { type: "success", message: "Коментарът е изтрит." },
      }));
      await loadEvents();
    } catch (requestError) {
      setEventFeedback((current) => ({
        ...current,
        [eventId]: { type: "error", message: actionErrorMessage(requestError) },
      }));
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
        <AppHeader subtitle="мобилен планер" />
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
      <AppHeader subtitle="мобилно табло" />
      <Card tone="green">
        <Eyebrow>Днес</Eyebrow>
        <Title>План за грижа</Title>
        <Subtitle>{user.email}</Subtitle>
      </Card>
      <ErrorBanner message={error} />
      <View style={dashboardStyles.statsGrid}>
        {stats.map((stat) => (
          <View key={stat.label} style={dashboardStyles.statCard}>
            <Text style={dashboardStyles.statLabel}>{stat.label}</Text>
            <Text style={dashboardStyles.statValue}>{stat.value}</Text>
          </View>
        ))}
      </View>
      <SectionTitle>Събития</SectionTitle>
      {loading && events.length === 0 ? <LoadingState /> : null}
      {!loading && events.length === 0 ? <EmptyState title="Няма събития" text="Влез в група с код за покана или създай събитие през web приложението." /> : null}
      <View style={dashboardStyles.list}>
        {events.map((event) => {
          const isJoined = event.participationStatus === "joined";
          const isExpanded = expandedEventId === event.id;
          const comments = commentsByEvent[event.id] ?? [];
          const actionInProgress = actionEventId === event.id;
          const feedback = eventFeedback[event.id];

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
              {feedback?.type === "success" ? <SuccessBanner message={feedback.message} /> : null}
              {feedback?.type === "error" ? <ErrorBanner message={feedback.message} /> : null}
              <PrimaryButton disabled={actionInProgress} onPress={() => void toggleJoin(event)}>
                {actionInProgress ? "Записване..." : isJoined ? "Няма да участвам" : "Ще участвам"}
              </PrimaryButton>
              <SecondaryButton disabled={actionInProgress} onPress={() => void toggleComments(event.id)}>
                {isExpanded ? "Скрий коментарите" : "Коментари"}
              </SecondaryButton>
              {isExpanded ? (
                <View style={dashboardStyles.commentsBox}>
                  {comments.length === 0 ? <Text style={dashboardStyles.commentEmpty}>Още няма коментари.</Text> : null}
                  {comments.map((comment) => {
                    const canManageComment = user.role === "admin" || comment.userId === user.id;
                    const isEditingComment = editingCommentIdByEvent[event.id] === comment.id;

                    return (
                      <View key={comment.id} style={dashboardStyles.commentItem}>
                        <View style={dashboardStyles.commentHeader}>
                          <View style={dashboardStyles.commentBody}>
                            <Text style={dashboardStyles.commentAuthor}>{comment.authorName ?? "Потребител"}</Text>
                            {isEditingComment ? (
                              <TextInput
                                style={dashboardStyles.commentEditInput}
                                value={editCommentInputs[comment.id] ?? comment.text}
                                onChangeText={(value) => setEditCommentInputs((current) => ({ ...current, [comment.id]: value }))}
                                multiline
                              />
                            ) : (
                              <Text style={dashboardStyles.commentText}>{comment.text}</Text>
                            )}
                          </View>
                          {canManageComment ? (
                            <View style={dashboardStyles.commentActions}>
                              {isEditingComment ? (
                                <>
                                  <Pressable
                                    disabled={actionInProgress}
                                    onPress={() => void submitCommentEdit(event.id, comment.id)}
                                    style={dashboardStyles.commentActionButton}
                                  >
                                    <Text style={dashboardStyles.commentActionText}>Запази</Text>
                                  </Pressable>
                                  <Pressable
                                    disabled={actionInProgress}
                                    onPress={() => cancelEditingComment(event.id)}
                                    style={dashboardStyles.commentActionButton}
                                  >
                                    <Text style={dashboardStyles.commentActionText}>Отказ</Text>
                                  </Pressable>
                                </>
                              ) : (
                                <>
                                  <Pressable
                                    disabled={actionInProgress}
                                    onPress={() => startEditingComment(event.id, comment)}
                                    style={dashboardStyles.commentActionButton}
                                  >
                                    <Text style={dashboardStyles.commentActionText}>Редактирай</Text>
                                  </Pressable>
                                  <Pressable
                                    disabled={actionInProgress}
                                    onPress={() => void deleteComment(event.id, comment.id)}
                                    style={dashboardStyles.commentActionButton}
                                  >
                                    <Text style={dashboardStyles.commentDeleteText}>Изтрий</Text>
                                  </Pressable>
                                </>
                              )}
                            </View>
                          ) : null}
                        </View>
                      </View>
                    );
                  })}
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
    marginBottom: 10,
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
  commentHeader: {
    flexDirection: "column" as const,
    gap: 8,
  },
  commentBody: {
    minWidth: 0,
    gap: 4,
  },
  commentActions: {
    flexDirection: "row" as const,
    flexWrap: "wrap" as const,
    gap: 8,
  },
  commentActionButton: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#d1d5db",
    backgroundColor: "#ffffff",
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  commentActionText: {
    fontSize: 12,
    fontWeight: "900" as const,
    color: "#047857",
  },
  commentDeleteText: {
    fontSize: 12,
    fontWeight: "900" as const,
    color: "#be123c",
  },
  commentEditInput: {
    minHeight: 64,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#cbd5e1",
    backgroundColor: "#ffffff",
    paddingHorizontal: 10,
    paddingVertical: 8,
    textAlignVertical: "top" as const,
    fontSize: 14,
    color: "#0f172a",
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