"use client";

import { DateRange, type Range } from "react-date-range";
import { useState, useEffect, useCallback, useRef } from "react";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { API_BASE_URL } from "@/lib/api";

const today = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
};

export default function DateSelector({
  setDates,
  roomId,
}: {
  setDates: (dates: { startDate: Date; endDate: Date } | null) => void;
  roomId?: string | number;
}) {
  const [open, setOpen] = useState(false);
  const [range, setRange] = useState<Range[]>([{ startDate: today(), endDate: undefined, key: "selection" }]);
  const [unavailableDates, setUnavailableDates] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const fetchedRef = useRef<Set<string>>(new Set());

  const fetchMonth = useCallback(
    async (year: number, month: number) => {
      if (!roomId) return;
      const key = `${year}-${String(month).padStart(2, "0")}`;
      if (fetchedRef.current.has(key)) return;
      fetchedRef.current.add(key);
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE_URL}/rooms/${roomId}/availability?year=${year}&month=${month}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        const dateStrings: string[] = [
          ...(data.blocked_dates ?? []),
          ...(data.booked_dates ?? []),
          ...(data.unavailable_dates ?? []),
        ];
        setUnavailableDates((prev) => new Set([...prev, ...dateStrings]));
      } catch (err) {
        console.error("Availability fetch error:", err);
      } finally {
        setLoading(false);
      }
    },
    [roomId]
  );

  useEffect(() => {
    if (!roomId) return;
    fetchedRef.current = new Set();
    setUnavailableDates(new Set());
    const now = new Date();
    for (let i = 0; i < 6; i++) {
      const d = new Date(now.getFullYear(), now.getMonth() + i, 1);
      fetchMonth(d.getFullYear(), d.getMonth() + 1);
    }
  }, [roomId, fetchMonth]);

  const handleShownDateChange = useCallback(
    (shownDate: Date) => {
      const y = shownDate.getFullYear();
      const m = shownDate.getMonth() + 1;
      fetchMonth(y, m);
      const next = new Date(y, m, 1);
      fetchMonth(next.getFullYear(), next.getMonth() + 1);
    },
    [fetchMonth]
  );

  const disabledDates = Array.from(unavailableDates).map((str) => {
    const [y, mo, d] = str.split("-").map(Number);
    return new Date(y, mo - 1, d);
  });

  const isRangeValid = (start?: Date, end?: Date) => {
    if (!start || !end) return true;
    const cur = new Date(start.getFullYear(), start.getMonth(), start.getDate());
    const endD = new Date(end.getFullYear(), end.getMonth(), end.getDate());
    while (cur <= endD) {
      const key = [
        cur.getFullYear(),
        String(cur.getMonth() + 1).padStart(2, "0"),
        String(cur.getDate()).padStart(2, "0"),
      ].join("-");
      if (unavailableDates.has(key)) return false;
      cur.setDate(cur.getDate() + 1);
    }
    return true;
  };

  const fmt = (date?: Date) =>
    date ? date.toLocaleDateString("en-AE", { day: "numeric", month: "short" }) : "Select date";

  const nights = (() => {
    const s = range[0].startDate;
    const e = range[0].endDate;
    if (!s || !e) return 0;
    return Math.max(0, Math.ceil((e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24)));
  })();

  const handleChange = (item: { selection: Range }) => {
    const { startDate, endDate } = item.selection;
    if (!isRangeValid(startDate, endDate)) {
      alert("Some selected dates are unavailable. Please choose different dates.");
      return;
    }
    setRange([{ startDate, endDate, key: "selection" }]);
    const validNights =
      startDate && endDate ? Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) : 0;
    if (validNights > 0 && startDate && endDate) {
      setDates({ startDate, endDate });
    } else {
      setDates(null);
    }
  };

  return (
    <div className="relative">
      <div onClick={() => setOpen((o) => !o)} className="group cursor-pointer">
        <label className="font-label-caps text-on-surface-variant mb-3 block">STAY DATES</label>
        <div
          className={`border p-4 flex items-center justify-between transition-colors bg-white ${
            open ? "border-primary" : "border-outline-variant hover:border-primary"
          }`}
        >
          <div className="flex flex-col">
            <span className="font-bold text-primary">
              {fmt(range[0].startDate)} - {fmt(range[0].endDate)}
            </span>
            <span className="text-on-surface-variant text-[12px]">
              {nights > 0 ? `${nights} Night${nights !== 1 ? "s" : ""}` : "Tap to select"}
            </span>
          </div>
          <span className="material-symbols-outlined text-on-surface-variant">calendar_month</span>
        </div>
      </div>

      {open && (
        <div className="absolute z-50 mt-2 bg-white shadow-2xl border border-outline-variant">
          {loading && (
            <div className="absolute inset-0 bg-white/70 z-10 flex items-center justify-center">
              <div className="w-5 h-5 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          )}
          <DateRange
            ranges={range}
            onChange={handleChange}
            onShownDateChange={handleShownDateChange}
            minDate={today()}
            disabledDates={disabledDates}
            moveRangeOnFirstSelection={false}
            rangeColors={["#000000"]}
            months={1}
            direction="horizontal"
          />
          <div className="p-4 border-t border-outline-variant">
            <button
              onClick={() => nights > 0 && setOpen(false)}
              disabled={nights === 0}
              className="w-full bg-primary text-on-primary py-3 font-bold uppercase tracking-wider disabled:opacity-40 transition-colors"
            >
              {nights > 0 ? `Done — ${nights} night${nights !== 1 ? "s" : ""}` : "Pick a check-out date"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}