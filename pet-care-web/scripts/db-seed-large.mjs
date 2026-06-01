import { neon } from "@neondatabase/serverless";
import { config } from "dotenv";

for (const path of [".env.local", "../.env.local", ".env"]) {
  config({ path, override: false, quiet: true });
}

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error("DATABASE_URL is missing.");
  console.error(
    "Create pet-care-web/.env.local with DATABASE_URL=your_neon_connection_string",
  );
  process.exit(1);
}

const count = Number.parseInt(process.env.LARGE_SEED_COUNT ?? "10000", 10);
const managerEmail =
  process.env.LARGE_SEED_MANAGER_EMAIL ?? "kate_manager@paws.bg";
const memberEmail = process.env.LARGE_SEED_MEMBER_EMAIL ?? "kate_user@paws.bg";
const inviteCode = "LOAD-TEST-PETS";

if (!Number.isInteger(count) || count < 1 || count > 20000) {
  console.error("LARGE_SEED_COUNT must be an integer between 1 and 20000.");
  process.exit(1);
}

const sql = neon(databaseUrl);

async function getUserId(email) {
  const rows = await sql`
    select id from users
    where email = ${email} and deleted_at is null
    limit 1
  `;

  return rows[0] ? Number(rows[0].id) : null;
}

try {
  const managerId = await getUserId(managerEmail);
  const memberId = await getUserId(memberEmail);

  if (!managerId || !memberId) {
    console.error("Required seed users are missing.");
    console.error("Run npm run db:seed first, then run this command again.");
    console.error(`Expected manager: ${managerEmail}`);
    console.error(`Expected member: ${memberEmail}`);
    process.exit(1);
  }

  const groupRows = await sql`
    insert into pet_groups (title, description, area, invite_code, created_by_id, updated_at, deleted_at)
    values (
      'Load test group - pagination proof',
      'Generated group used only for large pagination and scalability checks.',
      'Sofia load-test area',
      ${inviteCode},
      ${managerId},
      now(),
      null
    )
    on conflict (invite_code) do update set
      title = excluded.title,
      description = excluded.description,
      area = excluded.area,
      created_by_id = excluded.created_by_id,
      updated_at = now(),
      deleted_at = null
    returning id
  `;
  const groupId = Number(groupRows[0].id);

  await sql`
    insert into group_members (group_id, user_id, role, removed_at)
    values (${groupId}, ${managerId}, 'manager', null), (${groupId}, ${memberId}, 'member', null)
    on conflict (group_id, user_id) do update set
      role = excluded.role,
      removed_at = null
  `;

  await sql`
    delete from event_comments
    where event_id in (
      select id from care_events
      where group_id = ${groupId} and title like 'Load test care event %'
    )
  `;

  await sql`
    delete from event_participants
    where event_id in (
      select id from care_events
      where group_id = ${groupId} and title like 'Load test care event %'
    )
  `;

  await sql`
    delete from care_events
    where group_id = ${groupId} and title like 'Load test care event %'
  `;

  await sql`
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
      notes,
      updated_at,
      deleted_at
    )
    select
      ${groupId},
      ${managerId},
      'Load test care event ' || lpad(gs.n::text, 5, '0'),
      case
        when gs.n % 6 = 0 then 'vet_support'::event_type
        when gs.n % 5 = 0 then 'training'::event_type
        when gs.n % 3 = 0 then 'playdate'::event_type
        when gs.n % 2 = 0 then 'pet_sitting'::event_type
        else 'dog_walk'::event_type
      end,
      now() + make_interval(hours => gs.n),
      45 + ((gs.n % 6) * 15),
      'Sofia load-test area ' || (gs.n % 25),
      4 + (gs.n % 8),
      'upcoming'::event_status,
      'Generated row for pagination and performance checks.',
      now(),
      null
    from generate_series(1, ${count}) as gs(n)
  `;

  await sql`
    insert into event_comments (event_id, user_id, text, status, updated_at, deleted_at)
    select
      id,
      ${memberId},
      'Load-test comment for event ' || id,
      'visible'::event_comment_status,
      now(),
      null
    from care_events
    where group_id = ${groupId} and title like 'Load test care event %'
  `;

  await sql`
    insert into event_participants (event_id, user_id, pet_id, status, notes, left_at)
    select
      id,
      ${memberId},
      null,
      'joined'::event_participant_status,
      'Load-test participant without pet.',
      null
    from care_events
    where group_id = ${groupId}
      and title like 'Load test care event %'
      and id % 5 = 0
    on conflict (event_id, user_id) do update set
      status = 'joined'::event_participant_status,
      notes = excluded.notes,
      left_at = null
  `;

  const rows = await sql`
    select
      (select count(*)::int from care_events where group_id = ${groupId} and title like 'Load test care event %') as events,
      (select count(*)::int from event_comments where event_id in (select id from care_events where group_id = ${groupId} and title like 'Load test care event %')) as comments,
      (select count(*)::int from event_participants where event_id in (select id from care_events where group_id = ${groupId} and title like 'Load test care event %')) as participants
  `;

  console.log("Large seed completed.");
  console.log(`group invite code: ${inviteCode}`);
  console.log(`events: ${rows[0].events}`);
  console.log(`comments: ${rows[0].comments}`);
  console.log(`participants: ${rows[0].participants}`);
  console.log(
    "Use this only when you want to demonstrate pagination with a large dataset.",
  );
} catch (error) {
  console.error("Large seed failed.");
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
}
