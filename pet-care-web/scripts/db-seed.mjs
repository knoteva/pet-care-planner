import { scryptSync, createHash } from "node:crypto";
import { neon } from "@neondatabase/serverless";
import { config } from "dotenv";

for (const path of [".env.local", "../.env.local", ".env"]) {
  config({ path, override: false, quiet: true });
}

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error("DATABASE_URL is missing.");
  console.error("Create pet-care-web/.env.local with DATABASE_URL=your_neon_connection_string");
  process.exit(1);
}

const sql = neon(databaseUrl);

function hashPassword(email, password) {
  const salt = createHash("sha256")
    .update(`pet-care-planner:${email}`)
    .digest("hex")
    .slice(0, 32);
  const hash = scryptSync(password, salt, 64).toString("hex");

  return `scrypt:16384:8:1:${salt}:${hash}`;
}

async function upsertUser({ email, password, name, role }) {
  const rows = await sql`
    insert into users (email, password_hash, name, role, updated_at, deleted_at)
    values (${email}, ${hashPassword(email, password)}, ${name}, ${role}, now(), null)
    on conflict (email) do update set
      password_hash = excluded.password_hash,
      name = excluded.name,
      role = excluded.role,
      updated_at = now(),
      deleted_at = null
    returning id
  `;

  return Number(rows[0].id);
}

async function upsertPet({ ownerId, name, type, breed, age, size, notes }) {
  const existing = await sql`
    select id from pets
    where owner_id = ${ownerId} and name = ${name}
    limit 1
  `;

  if (existing[0]) {
    await sql`
      update pets set
        type = ${type},
        breed = ${breed},
        age = ${age},
        size = ${size},
        notes = ${notes},
        updated_at = now(),
        deleted_at = null
      where id = ${existing[0].id}
    `;

    return Number(existing[0].id);
  }

  const rows = await sql`
    insert into pets (owner_id, name, type, breed, age, size, notes)
    values (${ownerId}, ${name}, ${type}, ${breed}, ${age}, ${size}, ${notes})
    returning id
  `;

  return Number(rows[0].id);
}

async function upsertGroup({ title, description, area, inviteCode, createdById }) {
  const rows = await sql`
    insert into pet_groups (title, description, area, invite_code, created_by_id, updated_at, deleted_at)
    values (${title}, ${description}, ${area}, ${inviteCode}, ${createdById}, now(), null)
    on conflict (invite_code) do update set
      title = excluded.title,
      description = excluded.description,
      area = excluded.area,
      created_by_id = excluded.created_by_id,
      updated_at = now(),
      deleted_at = null
    returning id
  `;

  return Number(rows[0].id);
}

async function upsertGroupMember({ groupId, userId, role }) {
  const rows = await sql`
    insert into group_members (group_id, user_id, role, removed_at)
    values (${groupId}, ${userId}, ${role}, null)
    on conflict (group_id, user_id) do update set
      role = excluded.role,
      removed_at = null
    returning id
  `;

  return Number(rows[0].id);
}

async function upsertEvent({ groupId, createdById, title, eventType, startsAt, durationMinutes, location, capacity, status, notes }) {
  const existing = await sql`
    select id from care_events
    where group_id = ${groupId} and title = ${title}
    limit 1
  `;

  if (existing[0]) {
    await sql`
      update care_events set
        created_by_id = ${createdById},
        event_type = ${eventType},
        starts_at = ${startsAt},
        duration_minutes = ${durationMinutes},
        location = ${location},
        capacity = ${capacity},
        status = ${status},
        notes = ${notes},
        updated_at = now(),
        deleted_at = null
      where id = ${existing[0].id}
    `;

    return Number(existing[0].id);
  }

  const rows = await sql`
    insert into care_events (
      group_id,
      created_by_id,
      title,
      event_type,
      starts_at,
      duration_minutes,
      location,
      capacity,
      status,
      notes
    )
    values (
      ${groupId},
      ${createdById},
      ${title},
      ${eventType},
      ${startsAt},
      ${durationMinutes},
      ${location},
      ${capacity},
      ${status},
      ${notes}
    )
    returning id
  `;

  return Number(rows[0].id);
}

async function upsertParticipant({ eventId, userId, petId, status, notes }) {
  const rows = await sql`
    insert into event_participants (event_id, user_id, pet_id, status, notes, left_at)
    values (${eventId}, ${userId}, ${petId}, ${status}, ${notes}, null)
    on conflict (event_id, user_id) do update set
      pet_id = excluded.pet_id,
      status = excluded.status,
      notes = excluded.notes,
      left_at = null
    returning id
  `;

  return Number(rows[0].id);
}

async function upsertComment({ eventId, userId, text, status = "visible" }) {
  const existing = await sql`
    select id from event_comments
    where event_id = ${eventId} and user_id = ${userId} and text = ${text}
    limit 1
  `;

  if (existing[0]) {
    await sql`
      update event_comments set
        status = ${status},
        updated_at = now(),
        deleted_at = null
      where id = ${existing[0].id}
    `;

    return Number(existing[0].id);
  }

  const rows = await sql`
    insert into event_comments (event_id, user_id, text, status)
    values (${eventId}, ${userId}, ${text}, ${status})
    returning id
  `;

  return Number(rows[0].id);
}

async function printCounts() {
  const rows = await sql`
    select 'users' as table_name, count(*)::int as count from users
    union all select 'pets', count(*)::int from pets
    union all select 'pet_groups', count(*)::int from pet_groups
    union all select 'group_members', count(*)::int from group_members
    union all select 'care_events', count(*)::int from care_events
    union all select 'event_participants', count(*)::int from event_participants
    union all select 'event_comments', count(*)::int from event_comments
    order by table_name
  `;

  console.log("\nSeeded table counts:");
  for (const row of rows) {
    console.log(`${row.table_name}: ${row.count}`);
  }
}

try {
  const mariaId = await upsertUser({
    email: "demo@paws.bg",
    password: "demo123",
    name: "Мария Петкова",
    role: "user",
  });
  const adminId = await upsertUser({
    email: "admin@paws.bg",
    password: "admin123",
    name: "Админ Петрова",
    role: "admin",
  });
  const ivanId = await upsertUser({
    email: "ivan.georgiev@example.com",
    password: "demo123",
    name: "Иван Георгиев",
    role: "user",
  });
  const elenaId = await upsertUser({
    email: "elena.dimitrova@example.com",
    password: "demo123",
    name: "Елена Димитрова",
    role: "user",
  });
  const nikolayId = await upsertUser({
    email: "nikolay@example.com",
    password: "demo123",
    name: "Николай Симеонов",
    role: "user",
  });
  const kateAdminId = await upsertUser({
    email: "kate_admin@paws.bg",
    password: "kate123",
    name: "Кейт Админ",
    role: "admin",
  });
  const kateManagerId = await upsertUser({
    email: "kate_manager@paws.bg",
    password: "kate123",
    name: "Кейт Мениджър",
    role: "user",
  });
  const kateUserId = await upsertUser({
    email: "kate_user@paws.bg",
    password: "kate123",
    name: "Кейт Потребител",
    role: "user",
  });

  const rayaId = await upsertPet({
    ownerId: mariaId,
    name: "Рая",
    type: "dog",
    breed: "Кокер шпаньол",
    age: 4,
    size: "среден",
    notes: "Спокойна е с деца, но се притеснява от много шум.",
  });
  const maxId = await upsertPet({
    ownerId: mariaId,
    name: "Макс",
    type: "dog",
    breed: "Лабрадор",
    age: 6,
    size: "голям",
    notes: "Обича дълги разходки и носи топка.",
  });
  const archieId = await upsertPet({
    ownerId: ivanId,
    name: "Арчи",
    type: "dog",
    breed: "Бигъл",
    age: 2,
    size: "среден",
    notes: "Много социален, но дърпа на повод.",
  });
  const belaId = await upsertPet({
    ownerId: elenaId,
    name: "Бела",
    type: "dog",
    breed: "Пудел",
    age: 5,
    size: "малък",
    notes: "Има нужда от по-спокойни групи.",
  });
  await upsertPet({
    ownerId: elenaId,
    name: "Лора",
    type: "cat",
    breed: "Европейска късокосместа",
    age: 3,
    size: "малък",
    notes: "Нуждае се от вечерно хранене при пътуване.",
  });
  await upsertPet({
    ownerId: kateManagerId,
    name: "Моли",
    type: "dog",
    breed: "Голдън ретривър",
    age: 5,
    size: "голям",
    notes: "Тестов любимец за manager акаунт.",
  });
  await upsertPet({
    ownerId: kateUserId,
    name: "Тоби",
    type: "dog",
    breed: "Смесена порода",
    age: 2,
    size: "среден",
    notes: "Тестов любимец за regular user акаунт.",
  });

  const southGroupId = await upsertGroup({
    title: "Южен парк - разходки",
    description: "Съботни и вечерни разходки около централната алея.",
    area: "София, Южен парк",
    inviteCode: "PAWS-SOUTH",
    createdById: mariaId,
  });
  const mladostGroupId = await upsertGroup({
    title: "Младост: помощ за любимци",
    description: "Съседи, които си помагат с хранене, разходки и ветеринарни часове.",
    area: "София, Младост",
    inviteCode: "MLADOST-PETS",
    createdById: elenaId,
  });
  const lozenetsGroupId = await upsertGroup({
    title: "Квартални лапички - Лозенец",
    description: "Малки срещи за игра и обмен на грижи през седмицата.",
    area: "София, Лозенец",
    inviteCode: "LOZENETS-PAWS",
    createdById: ivanId,
  });

  await Promise.all([
    upsertGroupMember({ groupId: southGroupId, userId: mariaId, role: "manager" }),
    upsertGroupMember({ groupId: southGroupId, userId: ivanId, role: "member" }),
    upsertGroupMember({ groupId: southGroupId, userId: elenaId, role: "member" }),
    upsertGroupMember({ groupId: southGroupId, userId: nikolayId, role: "member" }),
    upsertGroupMember({ groupId: mladostGroupId, userId: elenaId, role: "manager" }),
    upsertGroupMember({ groupId: mladostGroupId, userId: mariaId, role: "member" }),
    upsertGroupMember({ groupId: mladostGroupId, userId: nikolayId, role: "member" }),
    upsertGroupMember({ groupId: lozenetsGroupId, userId: ivanId, role: "manager" }),
    upsertGroupMember({ groupId: lozenetsGroupId, userId: adminId, role: "member" }),
    upsertGroupMember({ groupId: southGroupId, userId: kateAdminId, role: "member" }),
    upsertGroupMember({ groupId: southGroupId, userId: kateManagerId, role: "manager" }),
    upsertGroupMember({ groupId: southGroupId, userId: kateUserId, role: "member" }),
  ]);

  for (let index = 1; index <= 12; index += 1) {
    const label = String(index).padStart(2, "0");
    const groupId = await upsertGroup({
      title: `Демо група ${label} - странициране`,
      description: `Тестова група ${label}, създадена за видима проверка на pagination в Web и Mobile.`,
      area: `София, район ${label}`,
      inviteCode: `PAGE-DEMO-${label}`,
      createdById: kateManagerId,
    });

    await Promise.all([
      upsertGroupMember({ groupId, userId: kateManagerId, role: "manager" }),
      upsertGroupMember({ groupId, userId: kateUserId, role: "member" }),
      upsertGroupMember({ groupId, userId: kateAdminId, role: "member" }),
    ]);

    const startsAt = new Date(Date.UTC(2026, 5, 10 + index, 8 + (index % 8), (index % 4) * 15, 0)).toISOString();
    const eventId = await upsertEvent({
      groupId,
      createdById: kateManagerId,
      title: `Демо събитие ${label} за странициране`,
      eventType: index % 2 === 0 ? "dog_walk" : "pet_sitting",
      startsAt,
      durationMinutes: 60,
      location: `София, район ${label}`,
      capacity: 4 + (index % 5),
      status: "upcoming",
      notes: "Създадено за проверка на pagination с по-голям demo dataset.",
    });

    if (index % 3 === 0) {
      await upsertParticipant({ eventId, userId: kateUserId, petId: null, status: "joined", notes: "Demo pagination participant." });
    }
  }
  const walkEventId = await upsertEvent({
    groupId: southGroupId,
    createdById: mariaId,
    title: "Съботна разходка в Южния парк",
    eventType: "dog_walk",
    startsAt: "2026-05-30T08:30:00.000Z",
    durationMinutes: 90,
    location: "Южен парк, вход откъм бул. Витоша",
    capacity: 8,
    status: "upcoming",
    notes: "Събираме се до фонтана. Носете вода и повод.",
  });
  const careEventId = await upsertEvent({
    groupId: mladostGroupId,
    createdById: elenaId,
    title: "Вечерна грижа за Рая",
    eventType: "pet_sitting",
    startsAt: "2026-05-31T16:00:00.000Z",
    durationMinutes: 60,
    location: "Младост 1, бл. 42",
    capacity: 2,
    status: "upcoming",
    notes: "Кратка проверка, храна и 20 минути разходка.",
  });
  const playEventId = await upsertEvent({
    groupId: southGroupId,
    createdById: ivanId,
    title: "Игри в кучешката градинка",
    eventType: "playdate",
    startsAt: "2026-05-28T17:30:00.000Z",
    durationMinutes: 60,
    location: "Кучешка площадка, Южен парк",
    capacity: 5,
    status: "current",
    notes: "Подходящо за социални кучета над 1 година.",
  });
  const vetEventId = await upsertEvent({
    groupId: lozenetsGroupId,
    createdById: ivanId,
    title: "Помощ за ветеринарен час",
    eventType: "vet_support",
    startsAt: "2026-05-22T12:00:00.000Z",
    durationMinutes: 45,
    location: "Лозенец, ул. Кораб планина",
    capacity: 1,
    status: "canceled",
    notes: "Собственикът отмени часа.",
  });

  await Promise.all([
    upsertParticipant({ eventId: walkEventId, userId: mariaId, petId: rayaId, status: "joined", notes: "Идвам с Рая." }),
    upsertParticipant({ eventId: walkEventId, userId: ivanId, petId: archieId, status: "joined", notes: "Арчи ще носи топка." }),
    upsertParticipant({ eventId: walkEventId, userId: elenaId, petId: belaId, status: "joined", notes: "Бела е за по-спокойна група." }),
    upsertParticipant({ eventId: walkEventId, userId: nikolayId, petId: null, status: "joined", notes: "Помощник без любимец." }),
    upsertParticipant({ eventId: careEventId, userId: mariaId, petId: rayaId, status: "joined", notes: "Собственик." }),
    upsertParticipant({ eventId: careEventId, userId: elenaId, petId: belaId, status: "joined", notes: "Ще помогна с храненето." }),
    upsertParticipant({ eventId: playEventId, userId: mariaId, petId: maxId, status: "joined", notes: "Макс е социален." }),
    upsertParticipant({ eventId: playEventId, userId: ivanId, petId: archieId, status: "joined", notes: "Организирам играта." }),
    upsertParticipant({ eventId: playEventId, userId: nikolayId, petId: null, status: "waitlisted", notes: "Ще дойда, ако има място." }),
    upsertParticipant({ eventId: vetEventId, userId: ivanId, petId: archieId, status: "left", notes: "Събитието е отменено." }),
  ]);

  await Promise.all([
    upsertComment({ eventId: walkEventId, userId: ivanId, text: "Ще закъснея 10 мин., но идвам с Макс." }),
    upsertComment({ eventId: walkEventId, userId: elenaId, text: "Ще донеса резервна купичка и вода." }),
    upsertComment({ eventId: walkEventId, userId: nikolayId, text: "Може ли да дойда като помощник без любимец?" }),
    upsertComment({ eventId: careEventId, userId: mariaId, text: "Моля проверете храната в шкафа." }),
    upsertComment({ eventId: playEventId, userId: ivanId, text: "Ако завали, ще преместим срещата за утре.", status: "reported" }),
  ]);

  console.log("Database seed completed.");
  console.log("Demo credentials:");
  console.log("- demo@paws.bg / demo123");
  console.log("- admin@paws.bg / admin123");
  console.log("- kate_admin@paws.bg / kate123");
  console.log("- kate_manager@paws.bg / kate123");
  console.log("- kate_user@paws.bg / kate123");
  await printCounts();
} catch (error) {
  console.error("Database seed failed.");
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
}