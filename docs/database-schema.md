# Database Schema

This document describes the initial Pet Care Planner PostgreSQL schema used by Drizzle ORM.

## ER Diagram

```mermaid
erDiagram
  users ||--o{ pets : owns
  users ||--o{ pet_groups : creates
  users ||--o{ group_members : joins
  pet_groups ||--o{ group_members : has

  pet_groups ||--o{ care_events : contains
  users ||--o{ care_events : creates

  care_events ||--o{ event_participants : has
  users ||--o{ event_participants : joins
  pets ||--o{ event_participants : attends_with

  care_events ||--o{ event_comments : has
  users ||--o{ event_comments : writes

  pet_groups ||--o{ event_proposals : receives
  users ||--o{ event_proposals : proposes
  users ||--o{ event_proposals : reviews
  care_events ||--o{ event_proposals : converted_from
```

## Tables and Field Types

### `users`

| Field | Type | Notes |
|---|---|---|
| `id` | `serial` | Primary key |
| `email` | `varchar(255)` | Required, unique |
| `password_hash` | `text` | Required, stores hashed password only |
| `name` | `varchar(120)` | Required |
| `role` | `user_role` enum | `user`, `admin`; default `user` |
| `photo_url` | `text` | Optional |
| `created_at` | `timestamp with time zone` | Default now |
| `updated_at` | `timestamp with time zone` | Default now |
| `deleted_at` | `timestamp with time zone` | Optional soft delete |

### `pets`

| Field | Type | Notes |
|---|---|---|
| `id` | `serial` | Primary key |
| `owner_id` | `integer` | FK to `users.id`, cascade delete |
| `name` | `varchar(120)` | Required |
| `type` | `pet_type` enum | `dog`, `cat`, `bird`, `rabbit`, `other` |
| `breed` | `varchar(120)` | Optional |
| `age` | `integer` | Optional |
| `size` | `varchar(40)` | Optional |
| `notes` | `text` | Optional |
| `photo_url` | `text` | Optional |
| `created_at` | `timestamp with time zone` | Default now |
| `updated_at` | `timestamp with time zone` | Default now |
| `deleted_at` | `timestamp with time zone` | Optional soft delete |

### `pet_groups`

| Field | Type | Notes |
|---|---|---|
| `id` | `serial` | Primary key |
| `title` | `varchar(160)` | Required |
| `description` | `text` | Optional |
| `area` | `varchar(180)` | Optional |
| `invite_code` | `varchar(48)` | Required, unique |
| `created_by_id` | `integer` | FK to `users.id` |
| `created_at` | `timestamp with time zone` | Default now |
| `updated_at` | `timestamp with time zone` | Default now |
| `deleted_at` | `timestamp with time zone` | Optional soft delete |

### `group_members`

| Field | Type | Notes |
|---|---|---|
| `id` | `serial` | Primary key |
| `group_id` | `integer` | FK to `pet_groups.id`, cascade delete |
| `user_id` | `integer` | FK to `users.id`, cascade delete |
| `role` | `group_member_role` enum | `member`, `manager`; default `member` |
| `joined_at` | `timestamp with time zone` | Default now |
| `removed_at` | `timestamp with time zone` | Optional |

Unique constraint: `group_id + user_id`.

### `care_events`

| Field | Type | Notes |
|---|---|---|
| `id` | `serial` | Primary key |
| `group_id` | `integer` | FK to `pet_groups.id`, cascade delete |
| `created_by_id` | `integer` | FK to `users.id` |
| `title` | `varchar(180)` | Required |
| `event_type` | `event_type` enum | Walk, sitting, playdate, training, vet support, other |
| `starts_at` | `timestamp with time zone` | Required |
| `duration_minutes` | `integer` | Required |
| `location` | `text` | Required |
| `capacity` | `integer` | Required, default `1` |
| `canceled` | `boolean` | Required, default `false` |
| `status` | `event_status` enum | Default `upcoming` |
| `notes` | `text` | Optional |
| `created_at` | `timestamp with time zone` | Default now |
| `updated_at` | `timestamp with time zone` | Default now |
| `deleted_at` | `timestamp with time zone` | Optional soft delete |

### `event_participants`

| Field | Type | Notes |
|---|---|---|
| `id` | `serial` | Primary key |
| `event_id` | `integer` | FK to `care_events.id`, cascade delete |
| `user_id` | `integer` | FK to `users.id`, cascade delete |
| `pet_id` | `integer` | Optional FK to `pets.id`, set null on delete |
| `status` | `event_participant_status` enum | `joined`, `waitlisted`, `left`, `removed` |
| `notes` | `text` | Optional |
| `joined_at` | `timestamp with time zone` | Default now |
| `left_at` | `timestamp with time zone` | Optional |

Unique constraint: `event_id + user_id`.

### `event_comments`

| Field | Type | Notes |
|---|---|---|
| `id` | `serial` | Primary key |
| `event_id` | `integer` | FK to `care_events.id`, cascade delete |
| `user_id` | `integer` | FK to `users.id`, cascade delete |
| `text` | `text` | Required |
| `status` | `event_comment_status` enum | `visible`, `reported`, `hidden` |
| `created_at` | `timestamp with time zone` | Default now |
| `updated_at` | `timestamp with time zone` | Default now |
| `deleted_at` | `timestamp with time zone` | Optional soft delete |

### `event_proposals`

| Field | Type | Notes |
|---|---|---|
| `id` | `serial` | Primary key |
| `group_id` | `integer` | FK to `pet_groups.id`, cascade delete |
| `created_by_id` | `integer` | FK to `users.id` |
| `title` | `varchar(180)` | Required |
| `event_type` | `event_type` enum | Required |
| `preferred_starts_at` | `timestamp with time zone` | Optional exact preferred date/time |
| `preferred_time_text` | `varchar(180)` | Optional human-friendly time text |
| `location` | `text` | Optional |
| `capacity` | `integer` | Required, default `1` |
| `notes` | `text` | Optional |
| `status` | `event_proposal_status` enum | `pending`, `approved`, `rejected`, `converted` |
| `reviewed_by_id` | `integer` | Optional FK to `users.id` |
| `reviewed_at` | `timestamp with time zone` | Optional |
| `converted_event_id` | `integer` | Optional FK to `care_events.id` |
| `created_at` | `timestamp with time zone` | Default now |
| `updated_at` | `timestamp with time zone` | Default now |

## Enum Values

| Enum | Values |
|---|---|
| `user_role` | `user`, `admin` |
| `pet_type` | `dog`, `cat`, `bird`, `rabbit`, `other` |
| `group_member_role` | `member`, `manager` |
| `event_type` | `dog_walk`, `pet_sitting`, `playdate`, `training`, `vet_support`, `other` |
| `event_status` | `upcoming`, `current`, `past`, `canceled`, `under_capacity`, `full_capacity`, `over_capacity` |
| `event_participant_status` | `joined`, `waitlisted`, `left`, `removed` |
| `event_comment_status` | `visible`, `reported`, `hidden` |
| `event_proposal_status` | `pending`, `approved`, `rejected`, `converted` |