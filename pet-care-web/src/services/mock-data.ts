import type { CareEvent, EventComment, Pet, PetGroup, User } from "@/types";

export const currentUser: User = {
  id: 1,
  email: "demo@paws.bg",
  name: "Мария Петкова",
  role: "user",
  photoUrl: null,
  createdAt: "2026-05-26T09:00:00.000Z",
};

export const pets: Pet[] = [
  {
    id: 1,
    ownerId: 1,
    name: "Рая",
    type: "dog",
    breed: "Кокер шпаньол",
    age: 4,
    size: "среден",
    notes: "Спокойна е с деца, но се притеснява от много шум.",
    photoUrl: null,
  },
  {
    id: 2,
    ownerId: 1,
    name: "Макс",
    type: "dog",
    breed: "Лабрадор",
    age: 6,
    size: "голям",
    notes: "Обича дълги разходки и носи топка.",
    photoUrl: null,
  },
  {
    id: 3,
    ownerId: 1,
    name: "Лора",
    type: "cat",
    breed: "Европейска късокосместа",
    age: 3,
    size: "малък",
    notes: "Нуждае се от вечерно хранене при пътуване.",
    photoUrl: null,
  },
];

export const groups: PetGroup[] = [
  {
    id: 1,
    title: "Южен парк - разходки",
    description: "Съботни и вечерни разходки около централната алея.",
    area: "София, Южен парк",
    inviteCode: "PAWS-SOUTH",
    createdById: 1,
    createdAt: "2026-05-20T08:00:00.000Z",
    isManager: true,
  },
  {
    id: 2,
    title: "Младост: помощ за любимци",
    description:
      "Съседи, които си помагат с хранене, разходки и ветеринарни часове.",
    area: "София, Младост",
    inviteCode: "MLADOST-PETS",
    createdById: 4,
    createdAt: "2026-05-18T11:00:00.000Z",
    isManager: false,
  },
  {
    id: 3,
    title: "Квартални лапички - Лозенец",
    description: "Малки playdate срещи и обмен на грижи през седмицата.",
    area: "София, Лозенец",
    inviteCode: "LOZENETS-PAWS",
    createdById: 2,
    createdAt: "2026-05-15T10:30:00.000Z",
    isManager: false,
  },
];

export const events: CareEvent[] = [
  {
    id: 1,
    groupId: 1,
    title: "Съботна разходка в Южния парк",
    eventType: "dog_walk",
    startsAt: "2026-05-30T08:30:00.000Z",
    durationMinutes: 90,
    location: "Южен парк, вход откъм бул. Витоша",
    capacity: 8,
    canceled: false,
    notes: "Събираме се до фонтана. Носете вода и повод.",
    status: "upcoming",
    participantCount: 7,
    commentCount: 3,
  },
  {
    id: 2,
    groupId: 2,
    title: "Вечерна грижа за Рая",
    eventType: "pet_sitting",
    startsAt: "2026-05-31T16:00:00.000Z",
    durationMinutes: 60,
    location: "Младост 1, бл. 42",
    capacity: 2,
    canceled: false,
    notes: "Кратка проверка, храна и 20 минути разходка.",
    status: "upcoming",
    participantCount: 2,
    commentCount: 1,
  },
  {
    id: 3,
    groupId: 1,
    title: "Игри в кучешката градинка",
    eventType: "playdate",
    startsAt: "2026-05-26T17:30:00.000Z",
    durationMinutes: 60,
    location: "Кучешка площадка, Южен парк",
    capacity: 5,
    canceled: false,
    notes: "Подходящо за социални кучета над 1 година.",
    status: "current",
    participantCount: 6,
    commentCount: 4,
  },
  {
    id: 4,
    groupId: 3,
    title: "Помощ за ветеринарен час",
    eventType: "vet_support",
    startsAt: "2026-05-22T12:00:00.000Z",
    durationMinutes: 45,
    location: "Лозенец, ул. Кораб планина",
    capacity: 1,
    canceled: true,
    notes: "Собственикът отмени часа.",
    status: "canceled",
    participantCount: 0,
    commentCount: 2,
  },
];

export const comments: EventComment[] = [
  {
    id: 1,
    eventId: 1,
    userId: 2,
    text: "Ще закъснея 10 мин., но идвам с Макс.",
    createdAt: "2026-05-26T10:20:00.000Z",
    updatedAt: null,
    deletedAt: null,
  },
  {
    id: 2,
    eventId: 1,
    userId: 3,
    text: "Ще донеса резервна купичка и вода.",
    createdAt: "2026-05-26T11:05:00.000Z",
    updatedAt: null,
    deletedAt: null,
  },
  {
    id: 3,
    eventId: 1,
    userId: 4,
    text: "Може ли да дойда като помощник без любимец?",
    createdAt: "2026-05-26T12:15:00.000Z",
    updatedAt: null,
    deletedAt: null,
  },
];

export const participants = [
  { id: 1, userId: 1, name: "Мария", pet: "Рая", status: "потвърдено" },
  { id: 2, userId: 2, name: "Иван", pet: "Макс", status: "потвърдено" },
  { id: 3, userId: 3, name: "Елена", pet: "Бела", status: "потвърдено" },
  { id: 4, userId: 4, name: "Николай", pet: "помощник", status: "без любимец" },
];

export const dashboardStats = [
  { label: "Активни събития", value: "12", tone: "emerald" },
  { label: "Моите любимци", value: "3", tone: "sky" },
  { label: "Групи", value: "4", tone: "violet" },
  { label: "Коментари днес", value: "18", tone: "amber" },
];

export const groupMembers = [
  {
    id: 1,
    name: "Мария Петкова",
    email: "demo@paws.bg",
    role: "мениджър",
    pets: "Рая, Макс",
    joinedAt: "20 май",
  },
  {
    id: 2,
    name: "Иван Георгиев",
    email: "ivan.georgiev@example.com",
    role: "член",
    pets: "Арчи",
    joinedAt: "21 май",
  },
  {
    id: 3,
    name: "Елена Димитрова",
    email: "elena.dimitrova@example.com",
    role: "член",
    pets: "Бела",
    joinedAt: "22 май",
  },
  {
    id: 4,
    name: "Николай Симеонов",
    email: "nikolay@example.com",
    role: "помощник",
    pets: "без любимец",
    joinedAt: "24 май",
  },
];

export const adminStats = [
  { label: "Потребители", value: "58", tone: "sky" },
  { label: "Групи", value: "12", tone: "emerald" },
  { label: "Любимци", value: "74", tone: "violet" },
  { label: "Сигнали", value: "3", tone: "amber" },
];

export const adminUsers = [
  {
    id: 1,
    name: "Мария Петкова",
    email: "demo@paws.bg",
    role: "admin",
    status: "активен",
    joinedAt: "26 май",
  },
  {
    id: 2,
    name: "Иван Георгиев",
    email: "ivan.georgiev@example.com",
    role: "user",
    status: "активен",
    joinedAt: "24 май",
  },
  {
    id: 3,
    name: "Елена Димитрова",
    email: "elena.dimitrova@example.com",
    role: "user",
    status: "активен",
    joinedAt: "23 май",
  },
];

export const moderationQueue = [
  {
    id: 1,
    eventTitle: "Игри в кучешката градинка",
    author: "Иван",
    text: "Може ли да дойда с две кучета?",
    status: "докладвано",
  },
  {
    id: 2,
    eventTitle: "Съботна разходка в Южния парк",
    author: "Елена",
    text: "Ще донеса вода.",
    status: "нов сигнал",
  },
  {
    id: 3,
    eventTitle: "Вечерна грижа за Рая",
    author: "Мария",
    text: "Моля проверете храната в шкафа.",
    status: "24 ч. без преглед",
  },
];

export const apiEndpoints = [
  {
    method: "POST",
    path: "/api/auth/register",
    purpose: "Регистрация и връщане на JWT token.",
  },
  {
    method: "POST",
    path: "/api/auth/login",
    purpose: "Вход с имейл и парола за mobile app.",
  },
  {
    method: "GET",
    path: "/api/me",
    purpose: "Текущ потребител по Bearer token.",
  },
  {
    method: "POST",
    path: "/api/auth/logout",
    purpose: "Изход и изчистване на web session cookie.",
  },
  {
    method: "GET",
    path: "/api/events?page=&limit=",
    purpose: "Страничен списък със събития от групите на потребителя.",
  },
  {
    method: "POST",
    path: "/api/events",
    purpose: "Създаване на събитие от активен член на група.",
  },
  {
    method: "GET",
    path: "/api/events/[id]",
    purpose: "Детайли за събитие, достъпни само за членове/admin.",
  },
  {
    method: "PATCH",
    path: "/api/events/[id]",
    purpose: "Редакция или отмяна от автора, manager или admin.",
  },
  {
    method: "DELETE",
    path: "/api/events/[id]",
    purpose: "Soft delete от автора, manager или admin.",
  },
  {
    method: "POST",
    path: "/api/events/[id]/join",
    purpose: "Участие със selected pet или helper-only режим.",
  },
  {
    method: "POST",
    path: "/api/events/[id]/comments",
    purpose: "Добавяне на коментар към събитие.",
  },
];
