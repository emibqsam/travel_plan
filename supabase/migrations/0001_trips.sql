-- Trips schema: trips + trip_items
create extension if not exists "pgcrypto";

create table if not exists public.trips (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  destination text,
  start_date date not null,
  end_date date not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint trips_dates_check check (end_date >= start_date)
);

create index if not exists trips_user_id_idx on public.trips(user_id);

create table if not exists public.trip_items (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid not null references public.trips(id) on delete cascade,
  day_number int not null check (day_number >= 1),
  start_time time,
  place text not null,
  memo text,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists trip_items_trip_day_idx on public.trip_items(trip_id, day_number, sort_order);

-- updated_at trigger
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trips_set_updated_at on public.trips;
create trigger trips_set_updated_at
before update on public.trips
for each row execute function public.set_updated_at();

-- RLS
alter table public.trips enable row level security;
alter table public.trip_items enable row level security;

drop policy if exists "trips_owner_all" on public.trips;
create policy "trips_owner_all" on public.trips
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "trip_items_owner_all" on public.trip_items;
create policy "trip_items_owner_all" on public.trip_items
  for all
  using (exists (select 1 from public.trips t where t.id = trip_id and t.user_id = auth.uid()))
  with check (exists (select 1 from public.trips t where t.id = trip_id and t.user_id = auth.uid()));
