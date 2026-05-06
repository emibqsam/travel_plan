-- Dev-only: mock user 사용을 위해 trips.user_id의 auth.users FK 제거
alter table public.trips drop constraint if exists trips_user_id_fkey;
