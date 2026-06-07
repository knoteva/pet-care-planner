declare const process: { env?: Record<string, string | undefined> };

export type UserRole = "user" | "admin";
export type GroupRole = "member" | "manager";
export type ParticipationStatus =
  | "joined"
  | "waitlisted"
  | "left"
  | "removed"
  | null;

export type PaginationMeta = {
  page: number;
  hasNext: boolean;
  basePath: string;
};

export type MobileUser = {
  id: number;
  email: string;
  name: string;
  role: UserRole;
};

export type MobileEvent = {
  id: number;
  groupId: number;
  title: string;
  eventType: string;
  startsAt: string;
  durationMinutes: number;
  location: string;
  capacity: number;
  status: string;
  notes?: string | null;
  groupTitle?: string | null;
  memberRole?: GroupRole | null;
  participantCount?: number;
  commentCount?: number;
  participationStatus?: ParticipationStatus;
};

export type MobileGroup = {
  id: number;
  title: string;
  description?: string | null;
  area?: string | null;
  inviteCode: string;
  role: GroupRole;
};

export type MobilePet = {
  id: number;
  ownerId: number;
  name: string;
  type: string;
  breed?: string | null;
  age?: number | null;
  size?: string | null;
  notes?: string | null;
};

export type MobileComment = {
  id: number;
  eventId: number;
  userId: number;
  text: string;
  createdAt: string;
  updatedAt?: string | null;
  authorName?: string | null;
};

type RequestOptions = {
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  body?: unknown;
  token?: string | null;
};

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export function getApiBaseUrl() {
  const configuredUrl = process.env?.EXPO_PUBLIC_API_BASE_URL?.trim();

  return (
    configuredUrl && configuredUrl.length > 0
      ? configuredUrl
      : "https://pet-care-web-rose.vercel.app"
  ).replace(/\/$/, "");
}

async function readResponse(response: Response) {
  const text = await response.text();

  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text) as unknown;
  } catch {
    return text;
  }
}

function errorMessage(payload: unknown, fallback: string) {
  if (payload && typeof payload === "object" && "error" in payload) {
    const value = (payload as { error?: unknown }).error;

    if (typeof value === "string" && value.trim().length > 0) {
      return value;
    }
  }

  return fallback;
}

export async function apiRequest<T>(
  path: string,
  options: RequestOptions = {},
) {
  const headers: Record<string, string> = {
    Accept: "application/json",
  };

  if (options.body !== undefined) {
    headers["Content-Type"] = "application/json";
  }

  if (options.token) {
    headers.Authorization = `Bearer ${options.token}`;
  }

  const response = await fetch(`${getApiBaseUrl()}${path}`, {
    method: options.method ?? "GET",
    headers,
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
  });

  const payload = await readResponse(response);

  if (!response.ok) {
    throw new ApiError(
      errorMessage(payload, "Заявката не беше успешна."),
      response.status,
    );
  }

  return payload as T;
}

export async function login(email: string, password: string) {
  return apiRequest<{ user: MobileUser; token: string }>("/api/auth/login", {
    method: "POST",
    body: { email, password },
  });
}

export async function register(name: string, email: string, password: string) {
  return apiRequest<{ user: MobileUser; token: string }>("/api/auth/register", {
    method: "POST",
    body: { name, email, password },
  });
}

export async function getMe(token: string) {
  return apiRequest<{ user: MobileUser }>("/api/me", { token });
}

export async function listEvents(token: string, page = 1) {
  return apiRequest<{ events: MobileEvent[]; pagination: PaginationMeta }>(
    `/api/events?page=${page}`,
    { token },
  );
}

export async function joinEvent(eventId: number, token: string) {
  return apiRequest<{ participant: unknown }>(`/api/events/${eventId}/join`, {
    method: "POST",
    body: {},
    token,
  });
}

export async function leaveEvent(eventId: number, token: string) {
  return apiRequest<{ participant: unknown }>(`/api/events/${eventId}/join`, {
    method: "DELETE",
    token,
  });
}

export async function listComments(eventId: number, token: string, page = 1) {
  return apiRequest<{ comments: MobileComment[]; pagination: PaginationMeta }>(
    `/api/events/${eventId}/comments?page=${page}`,
    { token },
  );
}

export async function createComment(
  eventId: number,
  text: string,
  token: string,
) {
  return apiRequest<{ comment: MobileComment }>(
    `/api/events/${eventId}/comments`,
    {
      method: "POST",
      body: { text },
      token,
    },
  );
}

export async function updateComment(
  eventId: number,
  commentId: number,
  text: string,
  token: string,
) {
  return apiRequest<{ comment: MobileComment }>(
    `/api/events/${eventId}/comments/${commentId}`,
    {
      method: "PATCH",
      body: { text },
      token,
    },
  );
}

export async function deleteComment(
  eventId: number,
  commentId: number,
  token: string,
) {
  return apiRequest<{ comment: MobileComment }>(
    `/api/events/${eventId}/comments/${commentId}`,
    {
      method: "DELETE",
      token,
    },
  );
}

export async function listGroups(token: string, page = 1) {
  return apiRequest<{ groups: MobileGroup[]; pagination: PaginationMeta }>(
    `/api/groups?page=${page}`,
    { token },
  );
}

export async function joinGroup(inviteCode: string, token: string) {
  return apiRequest<{ membership: unknown }>("/api/groups/join", {
    method: "POST",
    body: { inviteCode },
    token,
  });
}

export async function listPets(token: string, page = 1) {
  return apiRequest<{ pets: MobilePet[]; pagination: PaginationMeta }>(
    `/api/pets?page=${page}`,
    { token },
  );
}
