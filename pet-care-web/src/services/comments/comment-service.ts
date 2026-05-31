import { and, asc, eq, isNull } from "drizzle-orm";

import { db } from "@/db";
import { careEvents, eventComments, users } from "@/db/schema";
import { getGroupMembership, isAdmin, type PublicUser } from "@/services/auth/auth-service";
import { textField } from "@/services/validation";

export async function listEventComments(eventId: number) {
  return db
    .select({
      id: eventComments.id,
      eventId: eventComments.eventId,
      userId: eventComments.userId,
      text: eventComments.text,
      status: eventComments.status,
      createdAt: eventComments.createdAt,
      updatedAt: eventComments.updatedAt,
      authorName: users.name,
    })
    .from(eventComments)
    .innerJoin(users, eq(users.id, eventComments.userId))
    .where(
      and(
        eq(eventComments.eventId, eventId),
        eq(eventComments.status, "visible"),
        isNull(eventComments.deletedAt),
        isNull(users.deletedAt),
      ),
    )
    .orderBy(asc(eventComments.createdAt));
}

export async function createEventComment(user: PublicUser, eventId: number, text: string) {
  const [event] = await db
    .select({ groupId: careEvents.groupId })
    .from(careEvents)
    .where(and(eq(careEvents.id, eventId), isNull(careEvents.deletedAt)))
    .limit(1);

  if (!event) {
    throw new Error("Event not found.");
  }

  const membership = await getGroupMembership(user.id, event.groupId);

  if (!isAdmin(user) && !membership) {
    throw new Error("Only group members can comment on events.");
  }

  const cleanText = textField(text, { label: "Коментар", min: 2, max: 500 });
  const [comment] = await db
    .insert(eventComments)
    .values({ eventId, userId: user.id, text: cleanText })
    .returning();

  return comment;
}

export async function softDeleteEventComment(commentId: number, user: PublicUser) {
  const [comment] = await db
    .select({ id: eventComments.id, userId: eventComments.userId })
    .from(eventComments)
    .where(and(eq(eventComments.id, commentId), isNull(eventComments.deletedAt)))
    .limit(1);

  if (!comment) {
    return null;
  }

  if (!isAdmin(user) && comment.userId !== user.id) {
    throw new Error("Only the comment author or an admin can delete this comment.");
  }

  const [deletedComment] = await db
    .update(eventComments)
    .set({ deletedAt: new Date(), updatedAt: new Date() })
    .where(eq(eventComments.id, commentId))
    .returning();

  return deletedComment ?? null;
}