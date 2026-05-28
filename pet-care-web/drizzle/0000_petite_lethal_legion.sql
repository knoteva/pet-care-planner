CREATE TYPE "public"."event_comment_status" AS ENUM('visible', 'reported', 'hidden');--> statement-breakpoint
CREATE TYPE "public"."event_participant_status" AS ENUM('joined', 'waitlisted', 'left', 'removed');--> statement-breakpoint
CREATE TYPE "public"."event_status" AS ENUM('upcoming', 'current', 'past', 'canceled');--> statement-breakpoint
CREATE TYPE "public"."event_type" AS ENUM('dog_walk', 'pet_sitting', 'playdate', 'training', 'vet_support', 'other');--> statement-breakpoint
CREATE TYPE "public"."group_member_role" AS ENUM('member', 'manager');--> statement-breakpoint
CREATE TYPE "public"."pet_type" AS ENUM('dog', 'cat', 'bird', 'rabbit', 'other');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('user', 'admin');--> statement-breakpoint
CREATE TABLE "care_events" (
	"id" serial PRIMARY KEY NOT NULL,
	"group_id" integer NOT NULL,
	"created_by_id" integer NOT NULL,
	"title" varchar(180) NOT NULL,
	"event_type" "event_type" NOT NULL,
	"starts_at" timestamp with time zone NOT NULL,
	"duration_minutes" integer NOT NULL,
	"location" text NOT NULL,
	"capacity" integer DEFAULT 1 NOT NULL,
	"status" "event_status" DEFAULT 'upcoming' NOT NULL,
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "event_comments" (
	"id" serial PRIMARY KEY NOT NULL,
	"event_id" integer NOT NULL,
	"user_id" integer NOT NULL,
	"text" text NOT NULL,
	"status" "event_comment_status" DEFAULT 'visible' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "event_participants" (
	"id" serial PRIMARY KEY NOT NULL,
	"event_id" integer NOT NULL,
	"user_id" integer NOT NULL,
	"pet_id" integer,
	"status" "event_participant_status" DEFAULT 'joined' NOT NULL,
	"notes" text,
	"joined_at" timestamp with time zone DEFAULT now() NOT NULL,
	"left_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "group_members" (
	"id" serial PRIMARY KEY NOT NULL,
	"group_id" integer NOT NULL,
	"user_id" integer NOT NULL,
	"role" "group_member_role" DEFAULT 'member' NOT NULL,
	"joined_at" timestamp with time zone DEFAULT now() NOT NULL,
	"removed_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "pet_groups" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(160) NOT NULL,
	"description" text,
	"area" varchar(180),
	"invite_code" varchar(48) NOT NULL,
	"created_by_id" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "pets" (
	"id" serial PRIMARY KEY NOT NULL,
	"owner_id" integer NOT NULL,
	"name" varchar(120) NOT NULL,
	"type" "pet_type" NOT NULL,
	"breed" varchar(120),
	"age" integer,
	"size" varchar(40),
	"notes" text,
	"photo_url" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" varchar(255) NOT NULL,
	"password_hash" text NOT NULL,
	"name" varchar(120) NOT NULL,
	"role" "user_role" DEFAULT 'user' NOT NULL,
	"photo_url" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
ALTER TABLE "care_events" ADD CONSTRAINT "care_events_group_id_pet_groups_id_fk" FOREIGN KEY ("group_id") REFERENCES "public"."pet_groups"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "care_events" ADD CONSTRAINT "care_events_created_by_id_users_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event_comments" ADD CONSTRAINT "event_comments_event_id_care_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."care_events"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event_comments" ADD CONSTRAINT "event_comments_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event_participants" ADD CONSTRAINT "event_participants_event_id_care_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."care_events"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event_participants" ADD CONSTRAINT "event_participants_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event_participants" ADD CONSTRAINT "event_participants_pet_id_pets_id_fk" FOREIGN KEY ("pet_id") REFERENCES "public"."pets"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "group_members" ADD CONSTRAINT "group_members_group_id_pet_groups_id_fk" FOREIGN KEY ("group_id") REFERENCES "public"."pet_groups"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "group_members" ADD CONSTRAINT "group_members_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pet_groups" ADD CONSTRAINT "pet_groups_created_by_id_users_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pets" ADD CONSTRAINT "pets_owner_id_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "care_events_group_id_idx" ON "care_events" USING btree ("group_id");--> statement-breakpoint
CREATE INDEX "care_events_created_by_id_idx" ON "care_events" USING btree ("created_by_id");--> statement-breakpoint
CREATE INDEX "care_events_starts_at_idx" ON "care_events" USING btree ("starts_at");--> statement-breakpoint
CREATE INDEX "care_events_status_idx" ON "care_events" USING btree ("status");--> statement-breakpoint
CREATE INDEX "care_events_deleted_at_idx" ON "care_events" USING btree ("deleted_at");--> statement-breakpoint
CREATE INDEX "event_comments_event_id_idx" ON "event_comments" USING btree ("event_id");--> statement-breakpoint
CREATE INDEX "event_comments_user_id_idx" ON "event_comments" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "event_comments_status_idx" ON "event_comments" USING btree ("status");--> statement-breakpoint
CREATE INDEX "event_comments_deleted_at_idx" ON "event_comments" USING btree ("deleted_at");--> statement-breakpoint
CREATE UNIQUE INDEX "event_participants_event_id_user_id_unique" ON "event_participants" USING btree ("event_id","user_id");--> statement-breakpoint
CREATE INDEX "event_participants_event_id_idx" ON "event_participants" USING btree ("event_id");--> statement-breakpoint
CREATE INDEX "event_participants_user_id_idx" ON "event_participants" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "event_participants_pet_id_idx" ON "event_participants" USING btree ("pet_id");--> statement-breakpoint
CREATE INDEX "event_participants_status_idx" ON "event_participants" USING btree ("status");--> statement-breakpoint
CREATE UNIQUE INDEX "group_members_group_id_user_id_unique" ON "group_members" USING btree ("group_id","user_id");--> statement-breakpoint
CREATE INDEX "group_members_group_id_idx" ON "group_members" USING btree ("group_id");--> statement-breakpoint
CREATE INDEX "group_members_user_id_idx" ON "group_members" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "pet_groups_invite_code_unique" ON "pet_groups" USING btree ("invite_code");--> statement-breakpoint
CREATE INDEX "pet_groups_created_by_id_idx" ON "pet_groups" USING btree ("created_by_id");--> statement-breakpoint
CREATE INDEX "pet_groups_deleted_at_idx" ON "pet_groups" USING btree ("deleted_at");--> statement-breakpoint
CREATE INDEX "pets_owner_id_idx" ON "pets" USING btree ("owner_id");--> statement-breakpoint
CREATE INDEX "pets_type_idx" ON "pets" USING btree ("type");--> statement-breakpoint
CREATE INDEX "pets_deleted_at_idx" ON "pets" USING btree ("deleted_at");--> statement-breakpoint
CREATE UNIQUE INDEX "users_email_unique" ON "users" USING btree ("email");--> statement-breakpoint
CREATE INDEX "users_deleted_at_idx" ON "users" USING btree ("deleted_at");