import Link from "next/link";

import {
  dashboardStats,
  groupMembers,
  events as mockEvents,
  groups as mockGroups,
  moderationQueue,
  pets as mockPets,
} from "@/services/mock-data";
import type {
  AdminPanelStat,
  AdminPanelUser,
  AdminUserDetails,
} from "@/services/admin/admin-service";
import type { PublicUser } from "@/services/auth/auth-service";
import type { CareEvent, EventComment, Pet, PetGroup } from "@/types";
import type { HomeData, HomeStat } from "@/services/home/home-service";
import { AppShell, TopNavigation } from "./app-shell";
import { AuthForm } from "./auth-form";
import { EventCard, EventDetailsCard } from "./event-ui";
import {
  Badge,
  EmptyState,
  FormCard,
  FormField,
  FormGuidePanel,
  InfoItem,
  FormSelect,
  FormTextarea,
  PaginationControls,
  SectionTitle,
  StatCard,
  classNames,
} from "./ui-primitives";
import { DeletePetButton } from "./delete-pet-button";
import { LogoutButton } from "./logout-button";

export function DashboardView({
  events = mockEvents,
  groups = mockGroups,
  pets = mockPets,
  stats = dashboardStats,
}: {
  events?: CareEvent[];
  groups?: PetGroup[];
  pets?: Pet[];
  stats?: typeof dashboardStats;
}) {
  const primaryEvent = events[0];

  return (
    <AppShell
      active="/dashboard"
      aside={
        primaryEvent ? (
          <EventDetailsCard event={primaryEvent} compact />
        ) : undefined
      }
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      <section className="mt-6">
        <SectionTitle
          title="Предстоящи събития"
          action="Ново събитие"
          href="/events/new"
        />
        {events.length > 0 ? (
          <div className="mt-3 grid gap-3">
            {events.slice(0, 3).map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <div className="mt-3">
            <EmptyState
              title="Още няма събития"
              description="Създай или отвори групово събитие, за да се покаже в таблото."
              actionLabel="Ново събитие"
              href="/events/new"
            />
          </div>
        )}
      </section>

      <section className="mt-6 grid gap-5 lg:grid-cols-2">
        <PetPanel pets={pets} />
        <GroupPanel groups={groups} />
      </section>

      <section className="mt-6">
        <EmptyState
          title="Архивът е празен в демо режима"
          description="Тук ще се показват минали и отменени събития със server-side paging, когато свържем базата."
          actionLabel="Създай събитие"
          href="/events/new"
        />
      </section>
    </AppShell>
  );
}

export function HomeView({
  currentUser,
  homeData,
}: {
  currentUser: PublicUser | null;
  homeData?: HomeData;
}) {
  const stats =
    homeData?.stats ??
    ([
      { label: "Днес", value: "3 събития", detail: "разходка, грижа и игра" },
      { label: "Групи", value: "4 активни", detail: "по квартал и нужда" },
      { label: "Участия", value: "15 активни", detail: "по групите" },
    ] satisfies HomeStat[]);
  const events = homeData?.events ?? mockEvents.slice(0, 3);

  return (
    <main className="min-h-screen bg-[#eef4f1] text-neutral-950">
      <TopNavigation user={currentUser} active="/" />

      <section className="mx-auto grid max-w-6xl items-start gap-8 px-5 py-8 lg:grid-cols-[340px_minmax(0,1fr)]">
        <aside className="rounded-lg border border-neutral-200 bg-white p-6 shadow-sm">
          {currentUser ? (
            <HomeSessionCard user={currentUser} />
          ) : (
            <AuthForm mode="login" variant="home" />
          )}
        </aside>

        <div className="grid gap-5">
          <section className="rounded-lg bg-white p-7 shadow-sm">
            <p className="text-sm font-black uppercase tracking-normal text-emerald-700">
              квартална организация
            </p>
            <h2 className="mt-3 max-w-3xl text-4xl font-black leading-tight">
              Един споделен план за разходки, грижа и помощ с любимците.
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-7 text-neutral-600">
              Вместо да се губят уговорки в чатове, групата вижда събития,
              участници и коментари на едно място.
            </p>
          </section>

          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-lg bg-white p-5 shadow-sm"
              >
                <p className="text-sm font-bold text-neutral-500">
                  {stat.label}
                </p>
                <p className="mt-2 text-2xl font-black text-emerald-700">
                  {stat.value}
                </p>
                <p className="mt-2 text-sm text-neutral-600">{stat.detail}</p>
              </div>
            ))}
          </section>

          <section className="rounded-lg bg-white p-6 shadow-sm">
            <h2 className="text-xl font-black">
              {homeData ? "Последни активности" : "Последни демо активности"}
            </h2>
            {events.length > 0 ? (
              <div className="mt-4 grid gap-3">
                {events.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            ) : (
              <p className="mt-4 rounded-lg bg-neutral-50 p-3 text-sm text-neutral-600">
                Още няма събития за този профил.
              </p>
            )}
          </section>
        </div>
      </section>
    </main>
  );
}

function HomeSessionCard({ user }: { user: PublicUser }) {
  return (
    <div>
      <p className="text-sm font-semibold text-emerald-700">Активен профил</p>
      <h1 className="mt-2 text-2xl font-black">Здравей, {user.name}</h1>
      <p className="mt-2 text-sm leading-6 text-neutral-600">
        Сесията ти е активна. Началото вече показва реални данни за профила.
      </p>
      <div className="mt-4 rounded-lg border border-neutral-200 bg-neutral-50 p-3 text-sm">
        <p className="break-all font-semibold">{user.email}</p>
        <p className="mt-1 text-neutral-600">
          Роля: {user.role === "admin" ? "admin" : "user"}
        </p>
      </div>
      <div className="mt-5 grid gap-2">
        <Link
          href="/dashboard"
          className="rounded-lg bg-emerald-700 px-4 py-3 text-center text-sm font-black text-white transition hover:bg-emerald-800"
        >
          Към таблото
        </Link>
        {user.role === "admin" ? (
          <Link
            href="/admin"
            className="rounded-lg border border-neutral-300 bg-white px-4 py-3 text-center text-sm font-bold transition hover:bg-neutral-50"
          >
            Админ панел
          </Link>
        ) : null}
        <div className="flex justify-center">
          <LogoutButton variant="button" />
        </div>
      </div>
    </div>
  );
}
export function AuthView({ mode }: { mode: "login" | "register" }) {
  const isLogin = mode === "login";

  return (
    <AppShell active="">
      <div className="mx-auto grid max-w-5xl overflow-hidden rounded-lg border border-neutral-200 bg-white lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="p-6 sm:p-8">
          <p className="text-sm font-semibold text-emerald-700">
            {isLogin ? "Вход в профил" : "Създай профил"}
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-normal text-neutral-950">
            {isLogin ? "Добре дошла обратно" : "Регистрация в Лапички"}
          </h2>
          <form className="mt-6 grid gap-4">
            {!isLogin ? (
              <FormField name="name" label="Име" placeholder="Мария Петкова" />
            ) : null}
            <FormField
              name="email"
              label="Имейл"
              placeholder="kate_user@paws.bg"
            />
            <FormField
              name="password"
              label="Парола"
              placeholder="kate123"
              type="password"
            />
            {!isLogin ? (
              <FormField
                name="confirmPassword"
                label="Потвърди парола"
                placeholder="Повтори паролата"
                type="password"
              />
            ) : null}
            <button
              className="mt-2 rounded-lg bg-emerald-700 px-4 py-3 text-sm font-bold text-white"
              type="button"
            >
              {isLogin ? "Влез" : "Създай профил"}
            </button>
          </form>
          <p className="mt-4 text-sm text-neutral-600">
            Демо достъп:{" "}
            <span className="font-semibold">kate_user@paws.bg / kate123</span>
          </p>
          <p className="mt-4 text-sm text-neutral-600">
            {isLogin ? "Нямаш профил?" : "Вече имаш профил?"}{" "}
            <Link
              href={isLogin ? "/register" : "/login"}
              className="font-bold text-emerald-700"
            >
              {isLogin ? "Регистрирай се" : "Влез"}
            </Link>
          </p>
        </div>
        <div className="bg-emerald-50 p-6 sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-normal text-emerald-700">
            Pet Care Planner
          </p>
          <h3 className="mt-3 text-2xl font-bold text-neutral-950">
            Координирай грижа без хаос.
          </h3>
          <div className="mt-6 grid gap-3">
            {[
              "Групи със съседи",
              "Събития и участие",
              "Коментари и участие",
            ].map((item) => (
              <div
                key={item}
                className="rounded-lg bg-white p-4 text-sm font-bold"
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}

export function PetsView({
  pets,
  pagination,
}: {
  pets: Pet[];
  pagination?: PaginationView;
}) {
  return (
    <AppShell active="/pets" aside={<CareChecklistPreview />}>
      <SectionTitle
        title="Моите любимци"
        action="Добави любимец"
        href="/pets/new"
      />
      {pets.length > 0 ? (
        <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {pets.map((pet) => (
            <PetCard key={pet.id} pet={pet} />
          ))}
        </div>
      ) : (
        <div className="mt-4">
          <EmptyState
            title="Още няма любимци"
            description="Добави първия си любимец, за да започнеш да координираш грижа с реални данни от базата."
            actionLabel="Добави любимец"
            href="/pets/new"
          />
        </div>
      )}
      {pagination ? <PaginationControls {...pagination} /> : null}
    </AppShell>
  );
}

type PaginationView = { page: number; hasNext: boolean; basePath: string };

type GroupMemberDisplay = {
  id: number;
  name: string;
  email: string;
  role: string;
  pets: string;
  joinedAt: string;
};

type EventParticipantView = {
  id: number;
  userId: number;
  name: string;
  petName?: string | null;
  status: "joined" | "waitlisted" | "left" | "removed";
};

export function GroupsView({
  groups = mockGroups,
  pagination,
}: {
  groups?: PetGroup[];
  pagination?: PaginationView;
}) {
  return (
    <AppShell active="/groups" aside={<InvitePanel />}>
      <SectionTitle title="Групи" action="Нова група" href="/groups/new" />
      {groups.length > 0 ? (
        <div className="mt-4 grid gap-4">
          {groups.map((group) => (
            <GroupCard key={group.id} group={group} />
          ))}
        </div>
      ) : (
        <div className="mt-4">
          <EmptyState
            title="Още няма групи"
            description="Създай първата си група, за да организираш събития и помощ за любимци."
            actionLabel="Нова група"
            href="/groups/new"
          />
        </div>
      )}
      {pagination ? <PaginationControls {...pagination} /> : null}
    </AppShell>
  );
}

export function EventPageView({
  event = mockEvents[0],
  comments,
  participants = [],
  commentAction,
  editCommentAction,
  deleteCommentAction,
  joinAction,
  leaveAction,
  errorMessage,
}: {
  event?: CareEvent;
  comments?: Array<EventComment & { authorName?: string; canManage?: boolean }>;
  participants?: EventParticipantView[];
  commentAction?: React.ComponentProps<"form">["action"];
  editCommentAction?: React.ComponentProps<"form">["action"];
  deleteCommentAction?: React.ComponentProps<"form">["action"];
  joinAction?: React.ComponentProps<"form">["action"];
  leaveAction?: React.ComponentProps<"form">["action"];
  errorMessage?: string;
}) {
  return (
    <AppShell
      active="/dashboard"
      aside={<ParticipantPanel participants={participants} />}
    >
      <EventDetailsCard
        event={event}
        comments={comments}
        commentAction={commentAction}
        editCommentAction={editCommentAction}
        deleteCommentAction={deleteCommentAction}
        joinAction={joinAction}
        leaveAction={leaveAction}
        errorMessage={errorMessage}
      />
    </AppShell>
  );
}

export function AdminView({
  access = "allowed",
  stats,
  users,
  pagination,
}: {
  access?: "allowed" | "anonymous" | "forbidden";
  stats: AdminPanelStat[];
  users: AdminPanelUser[];
  pagination?: PaginationView;
}) {
  const hasAccess = access === "allowed";

  return (
    <AppShell active="/admin">
      {!hasAccess ? (
        <section className="rounded-lg border border-neutral-200 bg-white p-6">
          <p className="text-sm font-semibold text-emerald-700">
            {access === "anonymous" ? "Необходим е вход" : "Ограничен достъп"}
          </p>
          <h2 className="mt-2 text-2xl font-bold text-neutral-950">
            {access === "anonymous"
              ? "Влез като администратор"
              : "Тази страница е само за администратори"}
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-neutral-600">
            {access === "anonymous"
              ? "Админ панелът вече проверява реалната web сесия. Използвай admin@paws.bg или kate_admin@paws.bg."
              : "В момента си влязъл с потребител без admin роля. Данните за потребители и роли не се показват."}
          </p>
          <Link
            href="/login"
            className="mt-5 inline-flex rounded-lg bg-emerald-700 px-4 py-3 text-sm font-bold text-white"
          >
            Към вход
          </Link>
        </section>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat) => (
              <StatCard key={stat.label} {...stat} />
            ))}
          </div>

          <section className="mt-6 grid gap-5 xl:grid-cols-[minmax(0,1fr)_340px]">
            <div className="rounded-lg border border-neutral-200 bg-white p-5">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-xl font-bold">Потребители</h2>
                  <p className="text-sm text-neutral-600">
                    Реални потребители от Neon, с роли и дата на създаване.
                  </p>
                </div>
                <Badge tone="success">real database</Badge>
              </div>
              <div className="mt-4 grid gap-3">
                {users.map((user) => (
                  <div
                    key={user.id}
                    className="rounded-lg border border-neutral-200 bg-neutral-50 p-4"
                  >
                    <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_repeat(3,minmax(92px,120px))] xl:grid-cols-[minmax(0,1fr)_110px_110px_110px_auto] xl:items-center">
                      <div className="min-w-0">
                        <p className="font-bold text-neutral-950">
                          {user.name}
                        </p>
                        <p className="break-all text-sm text-neutral-500">
                          {user.email}
                        </p>
                      </div>
                      <AdminMeta label="Роля" value={user.role} />
                      <AdminMeta label="Статус" value={user.status} />
                      <AdminMeta label="От" value={user.joinedAt} />
                      <Link
                        href={`/admin/users/${user.id}`}
                        className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-center font-semibold md:col-span-4 xl:col-span-1 xl:w-auto"
                      >
                        Преглед
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
              {pagination ? <PaginationControls {...pagination} /> : null}
            </div>

            <AdminAuditPanel />
          </section>

          <section className="mt-6 rounded-lg border border-neutral-200 bg-white p-5">
            <h2 className="text-xl font-bold">Сигнали за преглед</h2>
            <p className="mt-2 text-sm leading-6 text-neutral-600">
              Коментарите се публикуват веднага. Тук влизат само докладвани или
              автоматично маркирани случаи; ако стоят дълго, се виждат като
              просрочени сигнали.
            </p>
            <div className="mt-4 grid gap-3">
              {moderationQueue.map((item) => {
                const isOverdue = item.status.includes("24");

                return (
                  <div
                    key={item.id}
                    className="rounded-lg border border-neutral-200 bg-neutral-50 p-4"
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge tone={isOverdue ? "danger" : "warning"}>
                        {item.status}
                      </Badge>
                      <Badge tone="neutral">публикуван</Badge>
                      <p className="font-bold text-neutral-950">
                        {item.eventTitle}
                      </p>
                    </div>
                    <p className="mt-3 text-sm leading-6 text-neutral-700">
                      {item.author}: {item.text}
                    </p>
                  </div>
                );
              })}
            </div>
          </section>
        </>
      )}
    </AppShell>
  );
}
export function GroupDetailsView({
  group = mockGroups[0],
  groupEvents,
  members = groupMembers,
}: {
  group?: PetGroup;
  groupEvents?: CareEvent[];
  members?: GroupMemberDisplay[];
}) {
  const eventsForGroup =
    groupEvents ?? mockEvents.filter((event) => event.groupId === group.id);

  return (
    <AppShell
      active="/groups"
      aside={
        <>
          <InvitePanel />
          <CareChecklistPreview />
        </>
      }
    >
      <section className="rounded-lg border border-neutral-200 bg-white p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <Badge tone={group.isManager ? "success" : "neutral"}>
              {group.isManager ? "мениджърски изглед" : "член на група"}
            </Badge>
            <h2 className="mt-3 text-3xl font-bold">{group.title}</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-600">
              {group.description}
            </p>
            <p className="mt-3 text-sm font-semibold text-neutral-950">
              {group.area}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {group.isManager ? (
              <Link
                href="/events/new"
                className="rounded-lg bg-emerald-700 px-4 py-2.5 text-sm font-bold text-white"
              >
                Ново събитие
              </Link>
            ) : (
              <Link
                href="/events/suggest"
                className="rounded-lg bg-emerald-700 px-4 py-2.5 text-sm font-bold text-white"
              >
                Предложи събитие
              </Link>
            )}
          </div>
        </div>
      </section>

      <section className="mt-6 grid gap-5">
        <div className="rounded-lg border border-neutral-200 bg-white p-5">
          <h3 className="text-xl font-bold">Събития в групата</h3>
          {eventsForGroup.length > 0 ? (
            <div className="mt-4 grid gap-3">
              {eventsForGroup.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <div className="mt-4">
              <EmptyState
                title="Още няма събития"
                description="Когато мениджърът създаде събитие, то ще се появи тук."
                actionLabel={
                  group.isManager ? "Ново събитие" : "Предложи събитие"
                }
                href={group.isManager ? "/events/new" : "/events/suggest"}
              />
            </div>
          )}
        </div>

        <div className="rounded-lg border border-neutral-200 bg-white p-5">
          <h3 className="text-xl font-bold">Членове</h3>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {members.map((member) => (
              <div
                key={member.id}
                className="rounded-lg border border-neutral-100 bg-neutral-50 p-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-bold">{member.name}</p>
                    <p className="text-sm text-neutral-500">{member.email}</p>
                  </div>
                  <Badge
                    tone={member.role === "мениджър" ? "success" : "neutral"}
                  >
                    {member.role}
                  </Badge>
                </div>
                <p className="mt-2 text-sm text-neutral-600">
                  {member.pets} · от {member.joinedAt}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </AppShell>
  );
}

export function PetFormView({
  action,
  errorMessage,
}: {
  action?: React.ComponentProps<"form">["action"];
  errorMessage?: string;
}) {
  return (
    <AppShell active="/pets" aside={<FormGuidePanel title="Любимец" />}>
      <FormCard
        title="Добави любимец"
        description="Тези полета са подготвени за бъдещата таблица pets и create pet service."
        submitLabel="Запази любимец"
        errorMessage={errorMessage}
        action={action}
      >
        <FormField name="name" label="Име" placeholder="Рая" maxLength={120} />
        <FormSelect
          name="type"
          label="Тип"
          options={[
            { value: "dog", label: "Куче" },
            { value: "cat", label: "Котка" },
            { value: "bird", label: "Птица" },
            { value: "rabbit", label: "Заек" },
            { value: "other", label: "Друго" },
          ]}
        />
        <FormField
          name="breed"
          label="Порода"
          placeholder="Кокер шпаньол"
          maxLength={120}
          required={false}
        />
        <FormField
          name="age"
          label="Възраст"
          placeholder="4"
          type="number"
          min={0}
          max={50}
          required={false}
        />
        <FormSelect
          name="size"
          label="Размер"
          options={["малък", "среден", "голям"]}
        />
        <FormTextarea
          name="notes"
          label="Бележки"
          placeholder="Характер, страхове, храна, важни навици..."
          maxLength={1000}
        />
      </FormCard>
    </AppShell>
  );
}

export function PetEditFormView({
  pet = mockPets[0],
  action,
  errorMessage,
}: {
  pet?: Pet;
  action?: React.ComponentProps<"form">["action"];
  errorMessage?: string;
} = {}) {
  return (
    <AppShell active="/pets" aside={<FormGuidePanel title="Редакция" />}>
      <FormCard
        title={`Редактирай ${pet.name}`}
        description="Същата форма ще се използва от бъдещия update pet service."
        submitLabel="Запази промените"
        cancelHref="/pets"
        errorMessage={errorMessage}
        action={action}
      >
        <FormField
          name="name"
          label="Име"
          placeholder="Рая"
          defaultValue={pet.name}
          maxLength={120}
        />
        <FormSelect
          name="type"
          label="Тип"
          defaultValue={pet.type}
          options={[
            { value: "dog", label: "Куче" },
            { value: "cat", label: "Котка" },
            { value: "bird", label: "Птица" },
            { value: "rabbit", label: "Заек" },
            { value: "other", label: "Друго" },
          ]}
        />
        <FormField
          name="breed"
          label="Порода"
          placeholder="Кокер шпаньол"
          defaultValue={pet.breed ?? ""}
          maxLength={120}
          required={false}
        />
        <FormField
          name="age"
          label="Възраст"
          placeholder="4"
          type="number"
          defaultValue={String(pet.age ?? "")}
          min={0}
          max={50}
          required={false}
        />
        <FormSelect
          name="size"
          label="Размер"
          defaultValue={pet.size ?? "среден"}
          options={["малък", "среден", "голям"]}
        />
        <FormTextarea
          name="notes"
          label="Бележки"
          placeholder="Характер, страхове, храна, важни навици..."
          defaultValue={pet.notes ?? ""}
          maxLength={1000}
        />
      </FormCard>
    </AppShell>
  );
}

export function GroupFormView({
  action,
  errorMessage,
}: {
  action?: React.ComponentProps<"form">["action"];
  errorMessage?: string;
}) {
  return (
    <AppShell active="/groups" aside={<FormGuidePanel title="Група" />}>
      <FormCard
        title="Създай група"
        description="Собственикът на групата ще стане първият group manager."
        submitLabel="Създай група"
        errorMessage={errorMessage}
        action={action}
      >
        <FormField
          name="title"
          label="Име на групата"
          placeholder="Южен парк - разходки"
          minLength={3}
          maxLength={160}
        />
        <FormField
          name="area"
          label="Район"
          placeholder="София, Южен парк"
          maxLength={180}
          required={false}
        />
        <FormTextarea
          name="description"
          label="Описание"
          placeholder="Кога се събирате, какъв тип грижа координирате..."
          maxLength={1000}
        />
        <FormField
          name="inviteCode"
          label="Код за покана"
          placeholder="PAWS-SOUTH"
          minLength={4}
          maxLength={48}
          pattern="[A-Z0-9-]+"
        />
      </FormCard>
    </AppShell>
  );
}

type EventGroupOption = { value: string; label: string };
type EventFormDefaults = Partial<
  Record<
    | "groupId"
    | "title"
    | "eventType"
    | "startsAt"
    | "durationMinutes"
    | "location"
    | "capacity"
    | "notes",
    string
  >
>;

export function EventFormView({
  action,
  errorMessage,
  groupOptions = mockGroups.map((group) => ({
    value: String(group.id),
    label: group.title,
  })),
  defaults = {},
  minStartsAt,
}: {
  action?: React.ComponentProps<"form">["action"];
  errorMessage?: string;
  groupOptions?: EventGroupOption[];
  defaults?: EventFormDefaults;
  minStartsAt?: string;
}) {
  if (groupOptions.length === 0) {
    return (
      <AppShell active="/dashboard" aside={<FormGuidePanel title="Събитие" />}>
        <EmptyState
          title="Няма група за ново събитие"
          description="Само админ или мениджър на група може да публикува събитие директно. Създай група или използвай мениджърски профил."
          actionLabel="Към групите"
          href="/groups"
        />
      </AppShell>
    );
  }

  return (
    <AppShell active="/dashboard" aside={<FormGuidePanel title="Събитие" />}>
      <FormCard
        title="Ново събитие"
        description="Събитието се записва в базата и е видимо за членовете на избраната група."
        submitLabel="Публикувай събитие"
        errorMessage={errorMessage}
        action={action}
      >
        <FormSelect
          name="groupId"
          label="Група"
          options={groupOptions}
          defaultValue={defaults.groupId}
        />
        <FormField
          name="title"
          label="Заглавие"
          placeholder="Съботна разходка в Южния парк"
          defaultValue={defaults.title}
          minLength={3}
          maxLength={180}
        />
        <FormSelect
          name="eventType"
          label="Тип събитие"
          defaultValue={defaults.eventType}
          options={[
            { value: "dog_walk", label: "Разходка" },
            { value: "pet_sitting", label: "Грижа" },
            { value: "playdate", label: "Игра" },
            { value: "training", label: "Тренировка" },
            { value: "vet_support", label: "Ветеринарна помощ" },
            { value: "other", label: "Друго" },
          ]}
        />
        <FormField
          name="startsAt"
          label="Дата и час"
          placeholder="2026-05-30T11:30"
          type="datetime-local"
          defaultValue={defaults.startsAt}
          min={minStartsAt}
          step={900}
        />
        <FormField
          name="durationMinutes"
          label="Продължителност"
          placeholder="90"
          type="number"
          defaultValue={defaults.durationMinutes}
          min={15}
          max={360}
          step={5}
        />
        <FormField
          name="location"
          label="Място"
          placeholder="Южен парк, вход откъм бул. Витоша"
          defaultValue={defaults.location}
          minLength={3}
          maxLength={240}
        />
        <FormField
          name="capacity"
          label="Капацитет"
          placeholder="8"
          type="number"
          defaultValue={defaults.capacity}
          min={1}
          max={50}
        />
        <FormTextarea
          name="notes"
          label="Бележки"
          placeholder="Какво да носят участниците, особености, инструкции..."
          defaultValue={defaults.notes}
          maxLength={1200}
        />
      </FormCard>
    </AppShell>
  );
}

export function AdminUserDetailsView({
  details,
}: {
  details: AdminUserDetails;
}) {
  const stats = [
    { label: "Любимци", value: String(details.petCount), tone: "violet" },
    { label: "Групи", value: String(details.groupCount), tone: "emerald" },
    { label: "Събития", value: String(details.eventCount), tone: "sky" },
    { label: "Коментари", value: String(details.commentCount), tone: "amber" },
  ];

  return (
    <AppShell active="/admin">
      <section className="rounded-lg border border-neutral-200 bg-white p-5">
        <p className="text-sm font-semibold text-emerald-700">
          Потребителски профил
        </p>
        <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold">{details.name}</h2>
            <p className="mt-1 break-all text-sm text-neutral-600">
              {details.email}
            </p>
          </div>
          <Badge tone={details.role === "admin" ? "warning" : "neutral"}>
            {details.role}
          </Badge>
        </div>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => (
            <StatCard key={stat.label} {...stat} />
          ))}
        </div>
        <dl className="mt-5 grid gap-3 text-sm sm:grid-cols-3">
          <InfoItem label="Статус" value={details.status} />
          <InfoItem label="От" value={details.joinedAt} />
          <InfoItem
            label="Участия"
            value={String(details.participationCount)}
          />
        </dl>
        <Link
          href="/admin"
          className="mt-5 inline-flex rounded-lg border border-neutral-300 px-4 py-3 text-sm font-bold text-neutral-800"
        >
          Обратно към админ панела
        </Link>
      </section>
    </AppShell>
  );
}
function AdminMeta({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-white px-3 py-2 md:bg-neutral-50">
      <p className="text-xs font-semibold text-neutral-500">{label}</p>
      <p className="mt-1 font-bold text-neutral-900">{value}</p>
    </div>
  );
}

function PetPanel({ pets = mockPets }: { pets?: Pet[] }) {
  return (
    <div className="rounded-lg border border-neutral-200 bg-white p-4">
      <h2 className="text-lg font-bold">Моите любимци</h2>
      <div className="mt-3 grid gap-3">
        {pets.slice(0, 2).map((pet) => (
          <PetRow key={pet.id} pet={pet} />
        ))}
      </div>
    </div>
  );
}

function GroupPanel({ groups = mockGroups }: { groups?: PetGroup[] }) {
  return (
    <div className="rounded-lg border border-neutral-200 bg-white p-4">
      <h2 className="text-lg font-bold">Активни групи</h2>
      <div className="mt-3 grid gap-3">
        {groups.slice(0, 2).map((group) => (
          <div
            key={group.id}
            className="flex items-start justify-between gap-3 border-b border-neutral-100 pb-3 last:border-0 last:pb-0"
          >
            <div>
              <p className="font-semibold">{group.title}</p>
              <p className="text-sm text-neutral-500">{group.area}</p>
            </div>
            {group.isManager ? (
              <Badge tone="success">мениджър</Badge>
            ) : (
              <Badge tone="neutral">член</Badge>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function PetCard({ pet }: { pet: Pet }) {
  return (
    <article className="flex flex-col rounded-lg border border-neutral-200 bg-white p-5">
      <PetAvatar name={pet.name} />
      <h3 className="mt-4 text-xl font-bold">{pet.name}</h3>
      <p className="text-sm text-neutral-600">
        {pet.breed} · {pet.age} г. · {pet.size}
      </p>
      <p className="mt-3 text-sm leading-6 text-neutral-600">{pet.notes}</p>
      <div className="mt-auto pt-4 flex flex-wrap gap-2">
        <Link
          href={`/pets/${pet.id}/edit`}
          className="inline-flex rounded-lg border border-neutral-300 px-3 py-2 text-sm font-semibold"
        >
          Редактирай
        </Link>
        <DeletePetButton petId={pet.id} />
      </div>
    </article>
  );
}

function PetRow({ pet }: { pet: Pet }) {
  return (
    <div className="flex items-center gap-3">
      <PetAvatar name={pet.name} small />
      <div>
        <p className="font-semibold">{pet.name}</p>
        <p className="text-sm text-neutral-500">{pet.breed}</p>
      </div>
    </div>
  );
}

function PetAvatar({ name, small = false }: { name: string; small?: boolean }) {
  return (
    <div
      className={classNames(
        "grid place-items-center rounded-lg bg-rose-100 font-black text-rose-800",
        small ? "size-10 text-sm" : "size-14 text-xl",
      )}
    >
      {name.slice(0, 1)}
    </div>
  );
}

function GroupCard({ group }: { group: PetGroup }) {
  return (
    <Link
      href={`/groups/${group.id}`}
      className="block rounded-lg border border-neutral-200 bg-white p-5 transition hover:border-emerald-400 hover:shadow-sm"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className="text-xl font-bold">{group.title}</h3>
          <p className="mt-1 text-sm text-neutral-600">{group.description}</p>
          <p className="mt-3 text-sm font-semibold text-neutral-950">
            {group.area}
          </p>
        </div>
        {group.isManager ? (
          <Badge tone="success">мениджър</Badge>
        ) : (
          <Badge tone="neutral">член</Badge>
        )}
      </div>
    </Link>
  );
}

function ParticipantPanel({
  participants,
}: {
  participants: EventParticipantView[];
}) {
  const statusLabels: Record<EventParticipantView["status"], string> = {
    joined: "потвърдено",
    waitlisted: "изчаква",
    left: "отписан",
    removed: "премахнат",
  };

  return (
    <div className="rounded-lg border border-neutral-200 bg-white p-5">
      <h2 className="text-lg font-bold">Участници</h2>
      <div className="mt-3 grid gap-3">
        {participants.length > 0 ? (
          participants.map((participant) => (
            <div
              key={participant.id}
              className="flex items-center justify-between gap-3"
            >
              <div>
                <p className="font-semibold">{participant.name}</p>
                <p className="text-sm text-neutral-500">
                  {participant.petName ?? "без любимец"}
                </p>
              </div>
              <Badge
                tone={
                  participant.status === "waitlisted" ? "warning" : "success"
                }
              >
                {statusLabels[participant.status]}
              </Badge>
            </div>
          ))
        ) : (
          <p className="rounded-lg bg-neutral-50 p-3 text-sm text-neutral-600">
            Още няма участници.
          </p>
        )}
      </div>
    </div>
  );
}

function InvitePanel() {
  return (
    <div className="rounded-lg border border-neutral-200 bg-white p-5">
      <h2 className="text-lg font-bold">Покана към група</h2>
      <p className="mt-2 text-sm leading-6 text-neutral-600">
        Мениджърите ще могат да създават кодове и линкове за покана.
      </p>
      <div className="mt-4 rounded-lg bg-neutral-100 px-3 py-2 font-mono text-sm">
        PAWS-SOUTH
      </div>
      <Link
        href="/groups/join"
        className="mt-4 inline-flex w-full justify-center rounded-lg bg-emerald-700 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-800"
      >
        Въведи код за покана
      </Link>
    </div>
  );
}

function AdminAuditPanel() {
  return (
    <div className="rounded-lg border border-neutral-200 bg-white p-5">
      <h2 className="text-lg font-bold">Админ панел</h2>
      <p className="mt-2 text-sm leading-6 text-neutral-600">
        Тази страница е визуален mock за бъдещи admin services: потребители,
        групи, събития и модерация.
      </p>
      <div className="mt-4 grid gap-2 text-sm">
        <div className="rounded-lg bg-neutral-50 p-3">
          Проверка на роли преди достъп
        </div>
        <div className="rounded-lg bg-neutral-50 p-3">
          Server-side paging за големи списъци
        </div>
        <div className="rounded-lg bg-neutral-50 p-3">
          Модерация от admin или group manager
        </div>
      </div>
    </div>
  );
}

function CareChecklistPreview() {
  return (
    <div className="rounded-lg border border-neutral-200 bg-white p-5">
      <h2 className="text-lg font-bold">Бонус AI списък</h2>
      <p className="mt-2 text-sm leading-6 text-neutral-600">
        По-късно тук мениджър ще генерира помощен списък за събитие.
      </p>
      <ul className="mt-4 grid gap-2 text-sm text-neutral-700">
        <li>✓ вода и купичка</li>
        <li>✓ повод и торбички</li>
        <li>✓ бележки за любимците</li>
      </ul>
      <button
        type="button"
        disabled
        className="mt-4 w-full cursor-not-allowed rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm font-bold text-emerald-800"
      >
        Генерирай списък (скоро)
      </button>
    </div>
  );
}
