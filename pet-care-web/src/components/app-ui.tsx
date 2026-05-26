import Link from "next/link";
import {
  adminStats,
  adminUsers,
  comments,
  currentUser,
  dashboardStats,
  groupMembers,
  events,
  groups,
  moderationQueue,
  participants,
  pets,
} from "@/services/mock-data";
import type {
  CareEvent,
  EventStatus,
  EventType,
  Pet,
  PetGroup,
} from "@pet-care/shared";

const navItems = [
  { href: "/", label: "Начало", icon: "⌂" },
  { href: "/dashboard", label: "Табло", icon: "▦" },
  { href: "/pets", label: "Любимци", icon: "●" },
  { href: "/groups", label: "Групи", icon: "◎" },
  { href: "/admin", label: "Админ", icon: "◇" },
  { href: "/api/docs", label: "API", icon: "{}" },
];

const statusLabels: Record<EventStatus, string> = {
  upcoming: "предстоящо",
  current: "в момента",
  past: "архив",
  canceled: "отменено",
  under_capacity: "има места",
  full_capacity: "запълнено",
  over_capacity: "над капацитет",
};

const eventTypeLabels: Record<EventType, string> = {
  dog_walk: "разходка",
  pet_sitting: "грижа",
  playdate: "игра",
  training: "тренировка",
  vet_support: "ветеринар",
  other: "друго",
};

function classNames(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

export function AppShell({
  active,
  children,
  aside,
}: {
  active?: string;
  children: React.ReactNode;
  aside?: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#f5f7f4] text-neutral-950">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col lg:flex-row">
        <aside className="border-b border-neutral-200 bg-white/90 px-4 py-4 lg:w-64 lg:border-b-0 lg:border-r lg:px-5 lg:py-6">
          <Link href="/" className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-lg bg-emerald-700 text-lg font-black text-white">
              Л
            </span>
            <span>
              <span className="block text-lg font-bold">Лапички</span>
              <span className="block text-xs text-neutral-500">
                планер за грижа
              </span>
            </span>
          </Link>

          <nav className="mt-6 grid grid-cols-2 gap-2 lg:grid-cols-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={classNames(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition",
                  active === item.href
                    ? "bg-emerald-700 text-white"
                    : "text-neutral-700 hover:bg-emerald-50 hover:text-emerald-900",
                )}
              >
                <span aria-hidden="true" className="w-5 text-center">
                  {item.icon}
                </span>
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="mt-6 hidden rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-950 lg:block">
            <p className="font-semibold">Демо изглед</p>
            <p className="mt-1 text-amber-800">
              Данните са примерни и ще бъдат вързани към база в следващ
              milestone.
            </p>
          </div>
        </aside>

        <main className="flex-1 px-4 py-5 sm:px-6 lg:px-8">
          <HeaderBar />
          <div
            className={classNames(
              "mt-6 grid gap-6",
              aside ? "xl:grid-cols-[minmax(0,1fr)_360px]" : "",
            )}
          >
            <section>{children}</section>
            {aside ? <aside className="space-y-5">{aside}</aside> : null}
          </div>
        </main>
      </div>
    </div>
  );
}

function HeaderBar() {
  return (
    <header className="flex flex-col gap-3 rounded-lg border border-neutral-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-sm font-medium text-emerald-700">
          Добре дошла, {currentUser.name}
        </p>
        <h1 className="text-2xl font-bold tracking-normal text-neutral-950">
          План за разходки и грижа
        </h1>
      </div>
      <div className="flex flex-wrap gap-2">
        <Link
          href="/login"
          className="rounded-lg border border-neutral-300 px-4 py-2 text-sm font-semibold text-neutral-800"
        >
          Вход
        </Link>
        <Link
          href="/register"
          className="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white"
        >
          Регистрация
        </Link>
      </div>
    </header>
  );
}

export function DashboardView() {
  const primaryEvent = events[0];

  return (
    <AppShell
      active="/dashboard"
      aside={<EventDetailsCard event={primaryEvent} compact />}
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {dashboardStats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      <section className="mt-6">
        <SectionTitle
          title="Предстоящи събития"
          action="Ново събитие"
          href="/events/new"
        />
        <div className="mt-3 grid gap-3">
          {events.slice(0, 3).map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </section>

      <section className="mt-6 grid gap-5 lg:grid-cols-2">
        <PetPanel />
        <GroupPanel />
      </section>
    </AppShell>
  );
}

export function HomeView() {
  return (
    <AppShell active="/">
      <section className="rounded-lg border border-neutral-200 bg-white p-5">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-center">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-normal text-emerald-700">
              Pet Care Planner
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-normal text-neutral-950">
              Организирай разходки, грижа и помощ в квартала.
            </h2>
            <p className="mt-3 text-base leading-7 text-neutral-600">
              Начален статичен изглед на приложението: групи, любимци, събития,
              участие и коментари. Backend връзката ще дойде след UI
              milestone-а.
            </p>
          </div>
          <div className="grid min-w-64 grid-cols-2 gap-2">
            {["Разходка", "Грижа", "Коментар", "Група"].map((label) => (
              <div
                key={label}
                className="rounded-lg border border-emerald-100 bg-emerald-50 p-4 text-center"
              >
                <span className="block text-xl font-black text-emerald-800">
                  ✓
                </span>
                <span className="mt-1 block text-sm font-semibold text-emerald-950">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {dashboardStats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </section>

      <section className="mt-6 grid gap-5 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="rounded-lg border border-neutral-200 bg-white p-5">
          <SectionTitle
            title="Демо събития"
            action="Виж табло"
            href="/dashboard"
          />
          <div className="mt-4 grid gap-3">
            {events.slice(0, 2).map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </div>
        <CareChecklistPreview />
      </section>
    </AppShell>
  );
}

export function AuthView({ mode }: { mode: "login" | "register" }) {
  const isLogin = mode === "login";

  return (
    <AppShell active="">
      <div className="mx-auto max-w-xl rounded-lg border border-neutral-200 bg-white p-6">
        <p className="text-sm font-semibold text-emerald-700">
          {isLogin ? "Вход в профил" : "Създай профил"}
        </p>
        <h2 className="mt-2 text-2xl font-bold">
          {isLogin ? "Добре дошла обратно" : "Регистрация в Лапички"}
        </h2>
        <form className="mt-6 grid gap-4">
          {!isLogin ? (
            <FormField label="Име" placeholder="Мария Петкова" />
          ) : null}
          <FormField label="Имейл" placeholder="demo@paws.bg" />
          <FormField label="Парола" placeholder="demo123" type="password" />
          <button
            className="mt-2 rounded-lg bg-emerald-700 px-4 py-3 text-sm font-bold text-white"
            type="button"
          >
            {isLogin ? "Влез" : "Създай профил"}
          </button>
        </form>
        <p className="mt-4 text-sm text-neutral-600">
          Демо достъп:{" "}
          <span className="font-semibold">demo@paws.bg / demo123</span>
        </p>
      </div>
    </AppShell>
  );
}

export function PetsView() {
  return (
    <AppShell active="/pets" aside={<CareChecklistPreview />}>
      <SectionTitle
        title="Моите любимци"
        action="Добави любимец"
        href="/pets/new"
      />
      <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {pets.map((pet) => (
          <PetCard key={pet.id} pet={pet} />
        ))}
      </div>
    </AppShell>
  );
}

export function GroupsView() {
  return (
    <AppShell active="/groups" aside={<InvitePanel />}>
      <SectionTitle title="Групи" action="Нова група" href="/groups/new" />
      <div className="mt-4 grid gap-4">
        {groups.map((group) => (
          <GroupCard key={group.id} group={group} />
        ))}
      </div>
    </AppShell>
  );
}

export function EventPageView() {
  return (
    <AppShell active="/dashboard" aside={<ParticipantPanel />}>
      <EventDetailsCard event={events[0]} />
    </AppShell>
  );
}

export function AdminView() {
  return (
    <AppShell active="/admin">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {adminStats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      <section className="mt-6 grid gap-5 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="rounded-lg border border-neutral-200 bg-white p-5">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-bold">Потребители</h2>
              <p className="text-sm text-neutral-600">
                Бъдещ admin изглед за роли, статус и основни действия.
              </p>
            </div>
            <Badge tone="info">mock admin panel</Badge>
          </div>
          <div className="mt-4 grid gap-3">
            {adminUsers.map((user) => (
              <div
                key={user.id}
                className="rounded-lg border border-neutral-200 bg-neutral-50 p-4"
              >
                <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_340px_auto] lg:items-center">
                  <div className="min-w-0">
                    <p className="font-bold text-neutral-950">{user.name}</p>
                    <p className="break-all text-sm text-neutral-500">
                      {user.email}
                    </p>
                  </div>
                  <div className="grid gap-2 text-sm sm:grid-cols-3">
                    <AdminMeta label="Роля" value={user.role} />
                    <AdminMeta label="Статус" value={user.status} />
                    <AdminMeta label="От" value={user.joinedAt} />
                  </div>
                  <button
                    type="button"
                    className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 font-semibold lg:w-auto"
                  >
                    Преглед
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <AdminAuditPanel />
      </section>

      <section className="mt-6 rounded-lg border border-neutral-200 bg-white p-5">
        <h2 className="text-xl font-bold">Коментари за модерация</h2>
        <div className="mt-4 grid gap-3">
          {moderationQueue.map((item) => (
            <div
              key={item.id}
              className="rounded-lg border border-neutral-200 bg-neutral-50 p-4"
            >
              <div className="flex flex-wrap items-center gap-2">
                <Badge tone="warning">{item.status}</Badge>
                <p className="text-sm font-semibold text-neutral-700">
                  {item.eventTitle}
                </p>
              </div>
              <p className="mt-2 text-sm text-neutral-600">
                {item.author}: {item.text}
              </p>
            </div>
          ))}
        </div>
      </section>
    </AppShell>
  );
}

export function GroupDetailsView() {
  const group = groups[0];
  const groupEvents = events.filter((event) => event.groupId === group.id);

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
            <Badge tone="success">мениджърски изглед</Badge>
            <h2 className="mt-3 text-3xl font-bold">{group.title}</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-600">
              {group.description}
            </p>
            <p className="mt-3 text-sm font-semibold text-neutral-950">
              {group.area}
            </p>
          </div>
          <Link
            href="/events/new"
            className="rounded-lg bg-emerald-700 px-4 py-2.5 text-sm font-bold text-white"
          >
            Ново събитие
          </Link>
        </div>
      </section>

      <section className="mt-6 grid gap-5">
        <div className="rounded-lg border border-neutral-200 bg-white p-5">
          <h3 className="text-xl font-bold">Събития в групата</h3>
          <div className="mt-4 grid gap-3">
            {groupEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-neutral-200 bg-white p-5">
          <h3 className="text-xl font-bold">Членове</h3>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {groupMembers.map((member) => (
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

export function PetFormView() {
  return (
    <AppShell active="/pets" aside={<FormGuidePanel title="Любимец" />}>
      <FormCard
        title="Добави любимец"
        description="Тези полета са подготвени за бъдещата таблица pets и create pet service."
        submitLabel="Запази любимец"
      >
        <FormField name="name" label="Име" placeholder="Рая" />
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
        <FormField name="breed" label="Порода" placeholder="Кокер шпаньол" />
        <FormField name="age" label="Възраст" placeholder="4" type="number" />
        <FormSelect
          name="size"
          label="Размер"
          options={["малък", "среден", "голям"]}
        />
        <FormTextarea
          name="notes"
          label="Бележки"
          placeholder="Характер, страхове, храна, важни навици..."
        />
      </FormCard>
    </AppShell>
  );
}

export function GroupFormView() {
  return (
    <AppShell active="/groups" aside={<FormGuidePanel title="Група" />}>
      <FormCard
        title="Създай група"
        description="Собственикът на групата ще стане първият group manager."
        submitLabel="Създай група"
      >
        <FormField
          name="title"
          label="Име на групата"
          placeholder="Южен парк - разходки"
        />
        <FormField name="area" label="Район" placeholder="София, Южен парк" />
        <FormTextarea
          name="description"
          label="Описание"
          placeholder="Кога се събирате, какъв тип грижа координирате..."
        />
        <FormField
          name="inviteCode"
          label="Код за покана"
          placeholder="PAWS-SOUTH"
        />
      </FormCard>
    </AppShell>
  );
}

export function EventFormView() {
  return (
    <AppShell active="/dashboard" aside={<FormGuidePanel title="Събитие" />}>
      <FormCard
        title="Ново събитие"
        description="Полета, съвместими с бъдещата таблица care_events."
        submitLabel="Публикувай събитие"
      >
        <FormField
          name="title"
          label="Заглавие"
          placeholder="Съботна разходка в Южния парк"
        />
        <FormSelect
          name="eventType"
          label="Тип събитие"
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
          placeholder="2026-05-30 11:30"
        />
        <FormField
          name="durationMinutes"
          label="Продължителност"
          placeholder="90"
          type="number"
        />
        <FormField
          name="location"
          label="Място"
          placeholder="Южен парк, вход откъм бул. Витоша"
        />
        <FormField
          name="capacity"
          label="Капацитет"
          placeholder="8"
          type="number"
        />
        <FormTextarea
          name="notes"
          label="Бележки"
          placeholder="Какво да носят участниците, особености, инструкции..."
        />
      </FormCard>
    </AppShell>
  );
}

function StatCard({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: string;
}) {
  const toneClass = {
    emerald: "bg-emerald-50 text-emerald-800 border-emerald-100",
    sky: "bg-sky-50 text-sky-800 border-sky-100",
    violet: "bg-violet-50 text-violet-800 border-violet-100",
    amber: "bg-amber-50 text-amber-800 border-amber-100",
  }[tone];

  return (
    <div
      className={classNames(
        "flex min-h-28 flex-col justify-center rounded-lg border bg-white p-4",
        toneClass,
      )}
    >
      <p className="flex min-h-10 items-center justify-center text-center text-sm font-medium leading-5">
        {label}
      </p>
      <p className="mt-1 text-center text-3xl font-black tracking-normal">
        {value}
      </p>
    </div>
  );
}

function SectionTitle({
  title,
  action,
  href,
}: {
  title: string;
  action: string;
  href: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <h2 className="text-xl font-bold text-neutral-950">{title}</h2>
      <Link
        href={href}
        className="rounded-lg bg-neutral-950 px-3 py-2 text-sm font-semibold text-white"
      >
        <span aria-hidden="true">＋ </span>
        {action}
      </Link>
    </div>
  );
}

function EventCard({ event }: { event: CareEvent }) {
  const capacityTone =
    event.participantCount && event.participantCount > event.capacity
      ? "warning"
      : "ok";

  return (
    <Link
      href="/events/sabotna-razhodka"
      className="block rounded-lg border border-neutral-200 bg-white p-4 transition hover:border-emerald-400 hover:shadow-sm"
    >
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="flex flex-wrap gap-2">
            <Badge
              tone={
                event.canceled
                  ? "danger"
                  : event.status === "current"
                    ? "info"
                    : "success"
              }
            >
              {statusLabels[event.status]}
            </Badge>
            <Badge tone="neutral">{eventTypeLabels[event.eventType]}</Badge>
            <Badge tone={capacityTone}>
              {event.participantCount}/{event.capacity} участници
            </Badge>
          </div>
          <h3 className="mt-3 text-lg font-bold text-neutral-950">
            {event.title}
          </h3>
          <p className="mt-1 text-sm text-neutral-600">{event.location}</p>
        </div>
        <div className="text-left text-sm text-neutral-600 lg:text-right">
          <p className="font-semibold text-neutral-950">
            {formatEventDate(event.startsAt)}
          </p>
          <p>{event.durationMinutes} мин.</p>
          <p>{event.commentCount} коментара</p>
        </div>
      </div>
    </Link>
  );
}

function EventDetailsCard({
  event,
  compact = false,
}: {
  event: CareEvent;
  compact?: boolean;
}) {
  return (
    <article className="rounded-lg border border-neutral-200 bg-white p-5">
      <div className="flex flex-wrap gap-2">
        <Badge tone={event.status === "current" ? "info" : "success"}>
          {statusLabels[event.status]}
        </Badge>
        <Badge
          tone={
            event.participantCount && event.participantCount > event.capacity
              ? "warning"
              : "neutral"
          }
        >
          {event.participantCount}/{event.capacity} капацитет
        </Badge>
      </div>
      <h2 className="mt-3 text-2xl font-bold text-neutral-950">
        {event.title}
      </h2>
      <p className="mt-2 text-sm leading-6 text-neutral-600">{event.notes}</p>

      <dl className="mt-5 grid gap-3 text-sm sm:grid-cols-2">
        <InfoItem label="Дата" value={formatEventDate(event.startsAt)} />
        <InfoItem
          label="Продължителност"
          value={`${event.durationMinutes} мин.`}
        />
        <InfoItem label="Място" value={event.location} />
        <InfoItem label="Тип" value={eventTypeLabels[event.eventType]} />
      </dl>

      <div className="mt-5 flex flex-wrap gap-2">
        <button
          className="rounded-lg bg-emerald-700 px-4 py-2.5 text-sm font-bold text-white"
          type="button"
        >
          Ще участвам
        </button>
        <button
          className="rounded-lg border border-neutral-300 px-4 py-2.5 text-sm font-bold text-neutral-800"
          type="button"
        >
          Сподели линк
        </button>
      </div>

      {!compact ? (
        <div className="mt-6">
          <h3 className="font-bold">Коментари</h3>
          <div className="mt-3 grid gap-3">
            {comments.map((comment) => (
              <div
                key={comment.id}
                className="rounded-lg bg-neutral-50 p-3 text-sm text-neutral-700"
              >
                {comment.text}
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </article>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-neutral-50 p-3">
      <dt className="text-xs font-semibold uppercase tracking-normal text-neutral-500">
        {label}
      </dt>
      <dd className="mt-1 font-semibold text-neutral-950">{value}</dd>
    </div>
  );
}

function AdminMeta({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-white px-3 py-2">
      <p className="text-xs font-semibold text-neutral-500">{label}</p>
      <p className="mt-1 font-bold text-neutral-900">{value}</p>
    </div>
  );
}

function PetPanel() {
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

function GroupPanel() {
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
    <article className="rounded-lg border border-neutral-200 bg-white p-5">
      <PetAvatar name={pet.name} />
      <h3 className="mt-4 text-xl font-bold">{pet.name}</h3>
      <p className="text-sm text-neutral-600">
        {pet.breed} · {pet.age} г. · {pet.size}
      </p>
      <p className="mt-3 text-sm leading-6 text-neutral-600">{pet.notes}</p>
      <button
        className="mt-4 rounded-lg border border-neutral-300 px-3 py-2 text-sm font-semibold"
        type="button"
      >
        Редактирай
      </button>
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
      href="/groups/yuzhen-park"
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

function ParticipantPanel() {
  return (
    <div className="rounded-lg border border-neutral-200 bg-white p-5">
      <h2 className="text-lg font-bold">Участници</h2>
      <div className="mt-3 grid gap-3">
        {participants.map((participant) => (
          <div
            key={participant.id}
            className="flex items-center justify-between gap-3"
          >
            <div>
              <p className="font-semibold">{participant.name}</p>
              <p className="text-sm text-neutral-500">{participant.pet}</p>
            </div>
            <Badge
              tone={
                participant.status === "без любимец" ? "neutral" : "success"
              }
            >
              {participant.status}
            </Badge>
          </div>
        ))}
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
    </div>
  );
}

function FormGuidePanel({ title }: { title: string }) {
  return (
    <div className="rounded-lg border border-neutral-200 bg-white p-5">
      <h2 className="text-lg font-bold">{title}: бъдеща логика</h2>
      <p className="mt-2 text-sm leading-6 text-neutral-600">
        Формата е само UI сега. Полетата са именувани така, че после да се
        вържат към validation schema, Server Action и REST/service слой.
      </p>
      <ul className="mt-4 grid gap-2 text-sm text-neutral-700">
        <li>✓ `name` атрибути за form data</li>
        <li>✓ същите термини като бъдещата DB schema</li>
        <li>✓ без fake client state, който после да пречи</li>
      </ul>
    </div>
  );
}

function FormCard({
  title,
  description,
  submitLabel,
  children,
}: {
  title: string;
  description: string;
  submitLabel: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mx-auto max-w-3xl rounded-lg border border-neutral-200 bg-white p-6">
      <h2 className="text-2xl font-bold">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-neutral-600">{description}</p>
      <form className="mt-6 grid gap-4">
        {children}
        <div className="mt-2 flex flex-wrap gap-2">
          <button
            type="button"
            className="rounded-lg bg-emerald-700 px-4 py-3 text-sm font-bold text-white"
          >
            {submitLabel}
          </button>
          <Link
            href="/dashboard"
            className="rounded-lg border border-neutral-300 px-4 py-3 text-sm font-bold text-neutral-800"
          >
            Откажи
          </Link>
        </div>
      </form>
    </section>
  );
}

function FormField({
  name,
  label,
  placeholder,
  type = "text",
}: {
  name?: string;
  label: string;
  placeholder: string;
  type?: string;
}) {
  return (
    <label className="grid gap-2 text-sm font-semibold text-neutral-800">
      {label}
      <input
        name={name}
        className="rounded-lg border border-neutral-300 px-3 py-3 text-base font-normal outline-none transition focus:border-emerald-600"
        placeholder={placeholder}
        type={type}
      />
    </label>
  );
}

function FormSelect({
  name,
  label,
  options,
}: {
  name: string;
  label: string;
  options: Array<string | { value: string; label: string }>;
}) {
  return (
    <label className="grid gap-2 text-sm font-semibold text-neutral-800">
      {label}
      <select
        name={name}
        className="rounded-lg border border-neutral-300 bg-white px-3 py-3 text-base font-normal outline-none transition focus:border-emerald-600"
      >
        {options.map((option) => (
          <option
            key={typeof option === "string" ? option : option.value}
            value={typeof option === "string" ? option : option.value}
          >
            {typeof option === "string" ? option : option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function FormTextarea({
  name,
  label,
  placeholder,
}: {
  name: string;
  label: string;
  placeholder: string;
}) {
  return (
    <label className="grid gap-2 text-sm font-semibold text-neutral-800">
      {label}
      <textarea
        name={name}
        className="min-h-32 rounded-lg border border-neutral-300 px-3 py-3 text-base font-normal outline-none transition focus:border-emerald-600"
        placeholder={placeholder}
      />
    </label>
  );
}

function Badge({
  tone,
  children,
}: {
  tone: "success" | "warning" | "danger" | "info" | "neutral" | "ok";
  children: React.ReactNode;
}) {
  const classes = {
    success: "bg-emerald-50 text-emerald-800 border-emerald-200",
    warning: "bg-amber-50 text-amber-900 border-amber-200",
    danger: "bg-rose-50 text-rose-800 border-rose-200",
    info: "bg-sky-50 text-sky-800 border-sky-200",
    neutral: "bg-neutral-100 text-neutral-700 border-neutral-200",
    ok: "bg-teal-50 text-teal-800 border-teal-200",
  }[tone];

  return (
    <span
      className={classNames(
        "inline-flex rounded-lg border px-2.5 py-1 text-xs font-bold",
        classes,
      )}
    >
      {children}
    </span>
  );
}

function formatEventDate(value: string) {
  return new Intl.DateTimeFormat("bg-BG", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}
