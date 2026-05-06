"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  type Trip,
  type TripItem,
  tripDayCount,
  tripDayDate,
} from "@/app/lib/types/trip";

interface Props {
  trip: Trip;
  initialItems: TripItem[];
}

export function TripEditor({ trip, initialItems }: Props) {
  const router = useRouter();
  const [items, setItems] = useState<TripItem[]>(initialItems);
  const dayCount = useMemo(() => tripDayCount(trip), [trip]);

  const itemsByDay = useMemo(() => {
    const map = new Map<number, TripItem[]>();
    for (const item of items) {
      const arr = map.get(item.day_number) ?? [];
      arr.push(item);
      map.set(item.day_number, arr);
    }
    return map;
  }, [items]);

  async function addItem(
    dayNumber: number,
    payload: { place: string; start_time: string | null; memo: string | null },
  ) {
    const res = await fetch(`/api/trips/${trip.id}/items`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ day_number: dayNumber, ...payload }),
    });
    const json = await res.json();
    if (!res.ok || !json.success) {
      alert(json.error || "추가 실패");
      return;
    }
    setItems((prev) => [...prev, json.data as TripItem]);
  }

  async function deleteItem(itemId: string) {
    if (!confirm("삭제하시겠습니까?")) return;
    const res = await fetch(`/api/trips/${trip.id}/items/${itemId}`, {
      method: "DELETE",
    });
    const json = await res.json();
    if (!res.ok || !json.success) {
      alert(json.error || "삭제 실패");
      return;
    }
    setItems((prev) => prev.filter((it) => it.id !== itemId));
  }

  async function deleteTrip() {
    if (!confirm("여행 전체를 삭제하시겠습니까?")) return;
    const res = await fetch(`/api/trips/${trip.id}`, { method: "DELETE" });
    const json = await res.json();
    if (!res.ok || !json.success) {
      alert(json.error || "삭제 실패");
      return;
    }
    router.push("/dashboard");
    router.refresh();
  }

  const days = Array.from({ length: dayCount }, (_, i) => i + 1);

  return (
    <div className="mt-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900">{trip.title}</h1>
          {trip.destination && (
            <p className="mt-1 text-slate-600">{trip.destination}</p>
          )}
          <p className="mt-2 text-sm text-slate-500">
            {trip.start_date} ~ {trip.end_date} · {dayCount}일
          </p>
        </div>
        <button
          onClick={deleteTrip}
          className="h-9 rounded-full border border-red-200 px-4 text-sm text-red-600 hover:bg-red-50"
        >
          여행 삭제
        </button>
      </div>

      <div className="mt-8 flex flex-col gap-6">
        {days.map((dayNum) => (
          <DaySection
            key={dayNum}
            dayNumber={dayNum}
            dateStr={tripDayDate(trip.start_date, dayNum)}
            items={itemsByDay.get(dayNum) ?? []}
            onAdd={(payload) => addItem(dayNum, payload)}
            onDelete={deleteItem}
          />
        ))}
      </div>
    </div>
  );
}

function DaySection({
  dayNumber,
  dateStr,
  items,
  onAdd,
  onDelete,
}: {
  dayNumber: number;
  dateStr: string;
  items: TripItem[];
  onAdd: (payload: {
    place: string;
    start_time: string | null;
    memo: string | null;
  }) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}) {
  const [open, setOpen] = useState(false);
  const [place, setPlace] = useState("");
  const [time, setTime] = useState("");
  const [memo, setMemo] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!place.trim()) return;
    setSubmitting(true);
    await onAdd({
      place: place.trim(),
      start_time: time || null,
      memo: memo.trim() || null,
    });
    setSubmitting(false);
    setPlace("");
    setTime("");
    setMemo("");
    setOpen(false);
  }

  return (
    <section className="rounded-3xl border border-white/40 bg-white/60 p-5 backdrop-blur">
      <header className="flex items-baseline justify-between">
        <h2 className="text-lg font-semibold text-slate-900">
          Day {dayNumber}
        </h2>
        <span className="text-sm text-slate-500">{dateStr}</span>
      </header>

      <ul className="mt-4 flex flex-col gap-2">
        {items.length === 0 && (
          <li className="text-sm text-slate-400">일정이 없습니다.</li>
        )}
        {items.map((item) => (
          <li
            key={item.id}
            className="flex items-start justify-between gap-3 rounded-xl border border-slate-100 bg-white/70 p-3"
          >
            <div className="flex-1">
              <div className="flex items-center gap-2">
                {item.start_time && (
                  <span className="text-xs font-medium text-slate-500">
                    {item.start_time.slice(0, 5)}
                  </span>
                )}
                <span className="font-medium text-slate-900">{item.place}</span>
              </div>
              {item.memo && (
                <p className="mt-1 text-sm text-slate-600">{item.memo}</p>
              )}
            </div>
            <button
              onClick={() => onDelete(item.id)}
              className="text-xs text-slate-400 hover:text-red-600"
            >
              삭제
            </button>
          </li>
        ))}
      </ul>

      {open ? (
        <form
          onSubmit={submit}
          className="mt-4 flex flex-col gap-2 rounded-xl border border-slate-200 bg-white/80 p-3"
        >
          <div className="flex gap-2">
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="h-9 w-28 rounded-lg border border-slate-200 px-2 text-sm"
            />
            <input
              required
              value={place}
              onChange={(e) => setPlace(e.target.value)}
              placeholder="장소"
              className="h-9 flex-1 rounded-lg border border-slate-200 px-3 text-sm"
            />
          </div>
          <textarea
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            placeholder="메모 (선택)"
            rows={2}
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="h-9 rounded-full border border-slate-200 px-4 text-sm text-slate-600 hover:bg-white"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="h-9 rounded-full bg-slate-900 px-4 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-60"
            >
              추가
            </button>
          </div>
        </form>
      ) : (
        <button
          onClick={() => setOpen(true)}
          className="mt-4 h-9 rounded-full border border-dashed border-slate-300 px-4 text-sm text-slate-600 hover:bg-white"
        >
          + 일정 추가
        </button>
      )}
    </section>
  );
}
