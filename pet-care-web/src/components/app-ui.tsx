import Link from "next/link";

import {
  adminStats,
  adminUsers,
  dashboardStats,
  groupMembers,
  events,
  groups,
  moderationQueue,
  participants,
  pets,
} from "@/services/mock-data";
import type { AdminPanelStat, AdminPanelUser } from "@/services/admin/admin-service";
import type { Pet, PetGroup } from "@/types";
import { AppShell } from "./app-shell";
import { AuthForm } from "./auth-form";
import { EventCard, EventDetailsCard } from "./event-ui";
import {
  Badge,
  EmptyState,
  FormCard,
  FormField,
  FormGuidePanel,
  FormSelect,
  FormTextarea,
  SectionTitle,
  StatCard,
  classNames,
} from "./ui-primitives";

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

export function HomeView() {
  return (
    <main className="min-h-screen bg-[#eef4f1] text-neutral-950">
      <header className="bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5">
          <Link href="/" className="text-3xl font-black text-emerald-700">
            Лапички
          </Link>
          <nav className="hidden items-center gap-6 text-sm font-bold text-neutral-700 md:flex">
            <Link href="/dashboard">Демо табло</Link>
            <Link href="/groups/yuzhen-park">Група</Link>
            <Link href="/events/new">Ново събитие</Link>
          </nav>
        </div>
      </header>

      <section className="mx-auto grid max-w-6xl items-start gap-8 px-5 py-8 lg:grid-cols-[340px_minmax(0,1fr)]">
        <aside className="rounded-lg border border-neutral-200 bg-white p-6 shadow-sm">
          <AuthForm mode="login" variant="home" />
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

          <section className="grid gap-4 md:grid-cols-3">
            {[
              ["Днес", "3 събития", "разходка, грижа и игра"],
              ["Групи", "4 активни", "по квартал и нужда"],
              ["Участия", "15 активни", "по групите"],
            ].map(([label, value, detail]) => (
              <div key={label} className="rounded-lg bg-white p-5 shadow-sm">
                <p className="text-sm font-bold text-neutral-500">{label}</p>
                <p className="mt-2 text-2xl font-black text-emerald-700">
                  {value}
                </p>
                <p className="mt-2 text-sm text-neutral-600">{detail}</p>
              </div>
            ))}
          </section>

          <section className="rounded-lg bg-white p-6 shadow-sm">
            <h2 className="text-xl font-black">Последни демо активности</h2>
            <div className="mt-4 grid gap-3">
              {events.slice(0, 3).map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </section>
        </div>
      </section>
    </main>
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
            <FormField name="email" label="Имейл" placeholder="demo@paws.bg" />
            <FormField
              name="password"
              label="Парола"
              placeholder="demo123"
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
            <span className="font-semibold">demo@paws.bg / demo123</span>
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
      <div className="mt-6">
        <EmptyState
          title="Няма чакащи покани"
          description="Когато мениджър изпрати покана, тя ще се появи тук с действия за приемане или отказ."
          actionLabel="Отвори демо група"
          href="/groups/yuzhen-park"
        />
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

export function AdminView({
  access = "allowed",
  stats,
  users,
}: {
  access?: "allowed" | "anonymous" | "forbidden";
  stats: AdminPanelStat[];
  users: AdminPanelUser[];
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
                        <p className="font-bold text-neutral-950">{user.name}</p>
                        <p className="break-all text-sm text-neutral-500">
                          {user.email}
                        </p>
                      </div>
                      <AdminMeta label="Роля" value={user.role} />
                      <AdminMeta label="Статус" value={user.status} />
                      <AdminMeta label="От" value={user.joinedAt} />
                      <button
                        type="button"
                        className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 font-semibold md:col-span-4 xl:col-span-1 xl:w-auto"
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
                      <p className="font-bold text-neutral-950">{item.eventTitle}</p>
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
          <div className="flex flex-wrap gap-2">
            <Link
              href="/events/new"
              className="rounded-lg bg-emerald-700 px-4 py-2.5 text-sm font-bold text-white"
            >
              Ново събитие
            </Link>
            <button
              type="button"
              disabled
              className="cursor-not-allowed rounded-lg border border-neutral-300 bg-neutral-100 px-4 py-2.5 text-sm font-bold text-neutral-500"
            >
              Покани член
            </button>
          </div>
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

export function PetEditFormView() {
  const pet = pets[0];

  return (
    <AppShell active="/pets" aside={<FormGuidePanel title="Редакция" />}>
      <FormCard
        title={`Редактирай ${pet.name}`}
        description="Същата форма ще се използва от бъдещия update pet service."
        submitLabel="Запази промените"
        cancelHref="/pets"
      >
        <FormField
          name="name"
          label="Име"
          placeholder="Рая"
          defaultValue={pet.name}
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
        />
        <FormField
          name="age"
          label="Възраст"
          placeholder="4"
          type="number"
          defaultValue={String(pet.age ?? "")}
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

function AdminMeta({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-white px-3 py-2 md:bg-neutral-50">
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
      <Link
        href="/pets/raya/edit"
        className="mt-4 inline-flex rounded-lg border border-neutral-300 px-3 py-2 text-sm font-semibold"
      >
        Редактирай
      </Link>
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
      <button
        type="button"
        disabled
        className="mt-4 w-full cursor-not-allowed rounded-lg bg-neutral-200 px-4 py-2.5 text-sm font-bold text-neutral-500"
      >
        Покани член (скоро)
      </button>
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

