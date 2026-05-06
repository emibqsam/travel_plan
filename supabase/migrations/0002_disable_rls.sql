-- Dev-only: RLS 비활성화 (인증 미연결 상태에서 작업 진행용)
alter table public.trips disable row level security;
alter table public.trip_items disable row level security;
