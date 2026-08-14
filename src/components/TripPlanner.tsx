"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { sendConciergeChat, type ConciergeHotel, type ConciergeMessage } from "@/lib/api";
import { toAbsoluteImageUrl } from "@/lib/resolveImage";

interface Recommendation {
  id: number;
  reason: string;
}

interface ChatEntry {
  role: "user" | "assistant";
  content: string;
  recommendations: Recommendation[];
}

function parseRecommendations(text: string): { text: string; recommendations: Recommendation[] } {
  const match = text.match(/RECOMMENDATIONS:\s*(\[[\s\S]*?\])/i);
  if (!match) return { text, recommendations: [] };
  try {
    const recommendations = JSON.parse(match[1]);
    const cleanText = text.replace(/RECOMMENDATIONS:\s*\[[\s\S]*?\]/i, "").trim();
    return { text: cleanText, recommendations };
  } catch {
    return { text, recommendations: [] };
  }
}

function HotelCard({ hotel, reason }: { hotel?: ConciergeHotel; reason: string }) {
  if (!hotel) return null;
  const image = toAbsoluteImageUrl(hotel.image_url) ?? toAbsoluteImageUrl(hotel.image);
  return (
    <Link
      href={`/hotels/${hotel.slug ?? hotel.id}`}
      className="block mt-2 rounded-lg overflow-hidden border border-outline-variant/30 hover:border-secondary transition-all bg-white"
    >
      <div className="relative h-24 overflow-hidden bg-surface-container">
        {image ? (
          <img src={image} alt={hotel.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-2xl">🏨</div>
        )}
      </div>
      <div className="p-3">
        <p className="font-bold text-primary text-sm">{hotel.title}</p>
        <p className="text-on-surface-variant text-xs mt-0.5">{hotel.location}</p>
        <p className="text-on-surface-variant text-xs mt-1.5 italic">&quot;{reason}&quot;</p>
      </div>
    </Link>
  );
}

export default function TripPlanner() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatEntry[]>([]);
  const [hotelsCache, setHotelsCache] = useState<ConciergeHotel[]>([]);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([
        {
          role: "assistant",
          content: "Hello! I'm your Dubai travel AI. Looking for a hotel near the Burj Khalifa or a desert getaway?",
          recommendations: [],
        },
      ]);
    }
  }, [open, messages.length]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;

    const newMessages: ChatEntry[] = [...messages, { role: "user", content: text, recommendations: [] }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const history: ConciergeMessage[] = newMessages.map((m) => ({ role: m.role, content: m.content }));
      const { content: raw, hotels } = await sendConciergeChat(history);
      setHotelsCache(hotels);
      const { text: cleanText, recommendations } = parseRecommendations(raw);
      setMessages((prev) => [...prev, { role: "assistant", content: cleanText, recommendations }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, I'm having trouble connecting. Please try again shortly.", recommendations: [] },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100]">
      {open && (
        <div className="absolute bottom-20 right-0 w-[350px] bg-white rounded-xl shadow-2xl border border-outline-variant overflow-hidden flex flex-col">
          <div className="bg-primary p-4 flex items-center justify-between text-white">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-secondary-fixed">auto_awesome</span>
              <div>
                <p className="font-bold text-body-sm leading-tight">AI Trip Planner</p>
                <p className="text-[10px] opacity-70">Always Online</p>
              </div>
            </div>
            <button className="material-symbols-outlined hover:text-secondary-fixed" onClick={() => setOpen(false)}>
              close
            </button>
          </div>

          <div className="h-80 p-4 overflow-y-auto bg-surface-container-low flex flex-col gap-4">
            {messages.map((msg, i) => (
              <div key={i} className={msg.role === "user" ? "self-end max-w-[85%]" : "max-w-[85%]"}>
                <div
                  className={`p-3 rounded-lg shadow-sm text-body-sm border ${
                    msg.role === "user"
                      ? "bg-primary text-white rounded-tr-none border-primary"
                      : "bg-white text-primary rounded-tl-none border-outline-variant/30"
                  }`}
                >
                  {msg.content}
                </div>
                {msg.recommendations.map((rec) => {
                  const hotel = hotelsCache.find((h) => String(h.id) === String(rec.id));
                  return <HotelCard key={rec.id} hotel={hotel} reason={rec.reason} />;
                })}
              </div>
            ))}
            {loading && <div className="text-xs text-on-surface-variant px-2">Thinking…</div>}
            <div ref={bottomRef} />
          </div>

          <div className="p-4 bg-white border-t border-outline-variant flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") send();
              }}
              className="flex-1 bg-surface-container border-none rounded-lg px-4 py-2 text-body-sm focus:ring-1 focus:ring-secondary"
              placeholder="Ask me anything..."
              type="text"
            />
            <button
              onClick={send}
              disabled={!input.trim() || loading}
              className="bg-primary text-white h-10 w-10 flex items-center justify-center rounded-lg disabled:opacity-40"
            >
              <span className="material-symbols-outlined">send</span>
            </button>
          </div>
        </div>
      )}

      <button
        onClick={() => setOpen((o) => !o)}
        className="h-14 w-14 rounded-full bg-primary text-white shadow-2xl flex items-center justify-center group active:scale-90 transition-transform relative"
      >
        <span className="material-symbols-outlined text-[28px] group-hover:rotate-12 transition-transform">
          {open ? "close" : "smart_toy"}
        </span>
        {!open && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75" />
            <span className="relative inline-flex rounded-full h-4 w-4 bg-secondary" />
          </span>
        )}
      </button>
    </div>
  );
}