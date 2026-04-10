-- Zylane Booking System Schema
-- Run this in Supabase SQL Editor (Dashboard > SQL Editor > New Query)

create extension if not exists "pgcrypto";

-- Workers
create table workers (
  id           uuid primary key default gen_random_uuid(),
  name         text not null,
  skills       text[] not null default '{}',
  is_active    boolean not null default true,
  email        text,
  created_at   timestamptz not null default now()
);

-- Services
create table services (
  id               uuid primary key default gen_random_uuid(),
  name             text not null,
  category         text not null,
  duration_minutes integer not null,
  price_display    text not null,
  is_active        boolean not null default true
);

-- Worker weekly schedules
create table schedules (
  id           uuid primary key default gen_random_uuid(),
  worker_id    uuid not null references workers(id) on delete cascade,
  day_of_week  integer not null check (day_of_week between 0 and 6),
  start_time   time not null,
  end_time     time not null,
  check (end_time > start_time)
);

-- Bookings
create table bookings (
  id             uuid primary key default gen_random_uuid(),
  worker_id      uuid not null references workers(id) on delete restrict,
  service_id     uuid not null references services(id) on delete restrict,
  date           date not null,
  start_time     time not null,
  end_time       time not null,
  client_name    text not null,
  client_contact text not null,
  status         text not null default 'confirmed' check (status in ('confirmed','cancelled')),
  cancel_token   uuid not null default gen_random_uuid(),
  created_at     timestamptz not null default now(),
  check (end_time > start_time)
);

-- Indexes
create index idx_schedules_worker on schedules(worker_id);
create index idx_bookings_worker_date on bookings(worker_id, date);
create index idx_bookings_cancel_token on bookings(cancel_token);
create index idx_bookings_date on bookings(date);

-- Enable RLS
alter table workers   enable row level security;
alter table services  enable row level security;
alter table schedules enable row level security;
alter table bookings  enable row level security;

-- Public read access
create policy "Public read workers" on workers for select to anon using (true);
create policy "Public read services" on services for select to anon using (true);
create policy "Public read schedules" on schedules for select to anon using (true);
create policy "Public read bookings" on bookings for select to anon using (true);

-- Public can create bookings
create policy "Public insert bookings" on bookings for insert to anon with check (true);

-- Public can cancel bookings (only set status to cancelled)
create policy "Public cancel booking" on bookings for update to anon
  using (true) with check (status = 'cancelled');
