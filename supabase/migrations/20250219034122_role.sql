CREATE TABLE "public"."roles" (
    "id" uuid NOT NULL,
    "name" text NOT NULL,
    "created_at" timestamptz NOT NULL DEFAULT now(),
    "updated_at" timestamptz NOT NULL DEFAULT now(),
    PRIMARY KEY ("id")
);

INSERT INTO "public"."roles" ("id", "name") VALUES
(uuid_generate_v4(), 'admin'),
(uuid_generate_v4(), 'supervisor'),
(uuid_generate_v4(), 'user');

alter table roles
  enable row level security;

create policy "Public roles are viewable by everyone." on roles
  for select using (true);