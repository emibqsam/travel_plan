export interface Trip {
  id: string;
  user_id: string;
  title: string;
  destination: string | null;
  start_date: string;
  end_date: string;
  created_at: string;
  updated_at: string;
}

export interface TripItem {
  id: string;
  trip_id: string;
  day_number: number;
  start_time: string | null;
  place: string;
  memo: string | null;
  sort_order: number;
  created_at: string;
}

export function tripDayCount(trip: Pick<Trip, "start_date" | "end_date">): number {
  const start = new Date(trip.start_date);
  const end = new Date(trip.end_date);
  const ms = end.getTime() - start.getTime();
  return Math.floor(ms / (1000 * 60 * 60 * 24)) + 1;
}

export function tripDayDate(startDate: string, dayNumber: number): string {
  const d = new Date(startDate);
  d.setDate(d.getDate() + (dayNumber - 1));
  return d.toISOString().slice(0, 10);
}
