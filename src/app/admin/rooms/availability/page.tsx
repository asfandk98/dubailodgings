"use client";

import { useEffect, useState, useCallback } from "react";
import { toast } from "react-hot-toast";
import AdminTopBar from "@/components/admin/AdminTopBar";
import {
  getHotelsForRoomSelect,
  getRoomsForHotel,
  getRoomAvailability,
  blockDates,
  unblockDates,
  type AdminHotel,
  type AvailabilityRoom,
} from "@/lib/admin";

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function RoomAvailabilityPage() {
  const [hotels, setHotels] = useState<AdminHotel[]>([]);
  const [rooms, setRooms] = useState<AvailabilityRoom[]>([]);
  const [selectedHotel, setSelectedHotel] = useState("");
  const [selectedRoom, setSelectedRoom] = useState("");
  const [blockedDates, setBlockedDates] = useState<string[]>([]);
  const [bookedDates, setBookedDates] = useState<string[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [viewDate, setViewDate] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const today = new Date();

  useEffect(() => {
    getHotelsForRoomSelect()
      .then((res) => {
        const data = res.data;
        setHotels(Array.isArray(data) ? data : (data.data ?? []));
      })
      .catch(() => toast.error("Failed to load hotels"));
  }, []);

  useEffect(() => {
    if (!selectedHotel) return;
    setSelectedRoom("");
    setBlockedDates([]);
    setBookedDates([]);
    getRoomsForHotel(selectedHotel)
      .then((res) => setRooms(res.data))
      .catch(() => toast.error("Failed to load rooms"));
  }, [selectedHotel]);

  useEffect(() => {
    if (!selectedRoom) return;
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth() + 1;
    setLoading(true);
    getRoomAvailability(selectedRoom, month, year)
      .then((res) => {
        setBlockedDates(res.data.blocked_dates ?? []);
        setBookedDates(res.data.booked_dates ?? []);
      })
      .catch(() => toast.error("Failed to load availability"))
      .finally(() => setLoading(false));
  }, [selectedRoom, viewDate]);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const formatDate = (y: number, m: number, d: number) => `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
  const dateStr = (d: number) => formatDate(year, month, d);
  const isPast = (d: number) => new Date(year, month, d) < new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const isBlocked = (d: number) => blockedDates.includes(dateStr(d));
  const isBooked = (d: number) => bookedDates.includes(dateStr(d));
  const isPicked = (d: number) => selected.includes(dateStr(d));

  const toggleDay = useCallback(
    (d: number) => {
      if (isBooked(d)) return;
      const date = dateStr(d);
      setSelected((prev) => (prev.includes(date) ? prev.filter((x) => x !== date) : [...prev, date]));
    },
    [bookedDates, year, month]
  );

  const handleMouseDown = (d: number) => {
    if (isPast(d) || isBooked(d)) return;
    setIsDragging(true);
    toggleDay(d);
  };

  const handleMouseEnter = (d: number) => {
    if (!isDragging) return;
    if (isPast(d) || isBooked(d)) return;
    toggleDay(d);
  };

  useEffect(() => {
    const handleMouseUp = () => setIsDragging(false);
    window.addEventListener("mouseup", handleMouseUp);
    return () => window.removeEventListener("mouseup", handleMouseUp);
  }, []);

  const blockSelected = async () => {
    const valid = selected.filter((d) => !bookedDates.includes(d));
    if (valid.length === 0) {
      toast.error("Cannot block booked dates");
      return;
    }
    try {
      await blockDates(selectedRoom, valid);
      setBlockedDates((prev) => [...new Set([...prev, ...valid])]);
      setSelected([]);
      toast.success(`${valid.length} date(s) blocked`);
    } catch {
      toast.error("Failed to block dates");
    }
  };

  const unblockSelected = async () => {
    try {
      await unblockDates(selectedRoom, selected);
      setBlockedDates((prev) => prev.filter((d) => !selected.includes(d)));
      setSelected([]);
      toast.success(`${selected.length} date(s) unblocked`);
    } catch {
      toast.error("Failed to unblock dates");
    }
  };

  const prevMonth = () => setViewDate(new Date(year, month - 1, 1));
  const nextMonth = () => setViewDate(new Date(year, month + 1, 1));

  return (
    <>
      <AdminTopBar title="Room Availability" subtitle="Block or unblock dates for specific rooms" />
      <div className="flex-1 overflow-y-auto p-gutter">
        <div className="space-y-6 max-w-3xl">
          <div className="grid grid-cols-2 gap-4">
            <select value={selectedHotel} onChange={(e) => setSelectedHotel(e.target.value)} className="admin-input">
              <option value="">— Choose hotel —</option>
              {hotels.map((h) => (
                <option key={h.id} value={h.id}>
                  {h.title}
                </option>
              ))}
            </select>
            <select value={selectedRoom} onChange={(e) => setSelectedRoom(e.target.value)} disabled={!selectedHotel} className="admin-input disabled:opacity-40">
              <option value="">— Choose room —</option>
              {rooms.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name} — AED {r.price}/night
                </option>
              ))}
            </select>
          </div>

          {selectedRoom && (
            <div className="bg-white border border-outline-variant rounded-xl p-5">
              <div className="flex justify-between items-center mb-5">
                <button onClick={prevMonth} className="text-on-surface-variant hover:text-primary transition">
                  <span className="material-symbols-outlined">chevron_left</span>
                </button>
                <h2 className="text-primary font-medium">
                  {MONTHS[month]} {year}
                </h2>
                <button onClick={nextMonth} className="text-on-surface-variant hover:text-primary transition">
                  <span className="material-symbols-outlined">chevron_right</span>
                </button>
              </div>

              <div className="grid grid-cols-7 mb-2">
                {DAYS.map((d) => (
                  <div key={d} className="text-center text-xs text-on-surface-variant">
                    {d}
                  </div>
                ))}
              </div>

              {loading ? (
                <div className="h-40 flex items-center justify-center text-on-surface-variant text-sm">Loading…</div>
              ) : (
                <div className="grid grid-cols-7 gap-1 select-none">
                  {Array.from({ length: firstDay }).map((_, i) => (
                    <div key={`pad-${i}`} />
                  ))}
                  {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
                    const past = isPast(day);
                    const blocked = isBlocked(day);
                    const booked = isBooked(day);
                    const picked = isPicked(day);
                    return (
                      <button
                        key={day}
                        type="button"
                        disabled={past || booked}
                        onMouseDown={() => handleMouseDown(day)}
                        onMouseEnter={() => handleMouseEnter(day)}
                        className={`aspect-square rounded-lg text-sm relative transition-colors
                          ${past ? "text-on-surface-variant/20" : "text-primary"}
                          ${booked ? "bg-amber-100 text-amber-800 cursor-not-allowed" : ""}
                          ${blocked ? "bg-error-container text-error" : ""}
                          ${picked ? "bg-secondary text-on-secondary scale-105" : ""}
                        `}
                      >
                        {day}
                        {booked && <span className="material-symbols-outlined absolute bottom-0.5 left-1/2 -translate-x-1/2 text-[10px]">lock</span>}
                      </button>
                    );
                  })}
                </div>
              )}

              <div className="flex items-center gap-4 mt-5 pt-4 border-t border-outline-variant text-xs text-on-surface-variant">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm bg-error-container inline-block" /> Blocked
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm bg-amber-100 inline-block" /> Booked
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm bg-secondary inline-block" /> Selected
                </span>
              </div>
            </div>
          )}

          {selected.length > 0 && (
            <div className="flex gap-3">
              <button onClick={blockSelected} className="flex items-center gap-2 bg-error text-on-error px-4 py-2.5 rounded-lg text-sm font-medium hover:opacity-90 transition">
                <span className="material-symbols-outlined text-lg">lock</span>
                Block {selected.length} date{selected.length !== 1 ? "s" : ""}
              </button>
              <button onClick={unblockSelected} className="flex items-center gap-2 bg-green-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:opacity-90 transition">
                <span className="material-symbols-outlined text-lg">lock_open</span>
                Unblock {selected.length} date{selected.length !== 1 ? "s" : ""}
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}