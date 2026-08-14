"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getFilters } from "@/lib/api";

export default function Hero() {
  const router = useRouter();

  const [locations, setLocations] = useState<string[]>([]);
  const [location, setLocation] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState("2 Adults");

  useEffect(() => {
    getFilters().then((data) => {
      setLocations(data.locations ?? ["Dubai", "Abu Dhabi", "Sharjah"]);
    });
  }, []);

  const today = new Date().toISOString().split("T")[0];

  const handleSearch = () => {
    const params = new URLSearchParams();

    if (location) params.set("location", location);
    if (checkIn) params.set("check_in", checkIn);
    if (checkOut) params.set("check_out", checkOut);
    if (guests) params.set("guests", guests);

    router.push(
      `/hotels${params.toString() ? `?${params.toString()}` : ""}`
    );
  };

  return (
    <>
      <section className="relative h-[751px] flex items-center justify-center overflow-hidden">

        {/* =========================================================
            ANIMATED BACKGROUND
        ========================================================== */}
        <div className="absolute inset-0 z-0 overflow-hidden">

          {/* Main image */}
          <div
            className="absolute inset-0 w-full h-full bg-cover bg-center animate-hero-zoom"
            role="img"
            aria-label="Dubai skyline at sunset"
            style={{
              backgroundImage:
                "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDQ8rYNvH4c3U78pucSDqLsFMH-YJWcPGnMZedBwqYZ15SiYtzLDE8GkwqITJlyJUsNivSZ2fHGffqUrpfJ5AYw0qG9ceSK2EUGETqfN3p4HWtq9_I_-nDXqhdSaWhyk42xaVXcqywuA7_BKI_VK4sbkBTKIefNooKjveYrUZE0Umlulxlvkfu2m_ko_iqc8pHnacVV4LcDtJHu1E6TcxFaZwwoGkpH9Zhmjf2O6SR-nNLVL7C2Edwm')",
            }}
          />

          {/* Dark cinematic overlay */}
          <div className="absolute inset-0 bg-black/35" />

          {/* Animated gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/20 to-black/65" />

          {/* Luxury glow */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[300px] rounded-full bg-secondary/10 blur-[120px] animate-pulse-slow" />

          {/* Floating light */}
          <div className="absolute top-[25%] left-[15%] w-2 h-2 rounded-full bg-white/40 blur-[1px] animate-floating-light" />

          <div
            className="absolute top-[35%] right-[18%] w-3 h-3 rounded-full bg-secondary-fixed/40 blur-[2px] animate-floating-light"
            style={{ animationDelay: "2s" }}
          />

          <div
            className="absolute bottom-[30%] left-[30%] w-2 h-2 rounded-full bg-white/30 blur-[1px] animate-floating-light"
            style={{ animationDelay: "4s" }}
          />
        </div>

        {/* =========================================================
            HERO CONTENT
        ========================================================== */}
        <div className="relative z-10 w-full max-w-container-max px-gutter text-center text-white">

          {/* Small eyebrow */}
          <div className="animate-fade-down mb-5">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs md:text-sm tracking-[0.2em] uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary-fixed animate-pulse" />
              Luxury Hospitality in Dubai
            </span>
          </div>

          {/* Main heading */}
          <h2 className="animate-hero-title font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg mb-6 leading-tight drop-shadow-2xl">
            Discover Dubai&apos;s Most
            <br className="hidden md:block" />
            <span className="relative inline-block">
              Prestigious Stays
            </span>
          </h2>

          {/* Subtitle */}
          <p className="animate-fade-up-delay max-w-2xl mx-auto text-white/80 text-sm md:text-base leading-relaxed mb-8">
            Experience exceptional hotels, unforgettable locations and
            world-class hospitality across the United Arab Emirates.
          </p>

          {/* =========================================================
              SEARCH PANEL
          ========================================================== */}
          <div className="animate-search-panel glass-panel max-w-5xl mx-auto rounded-2xl p-4 md:p-6 shadow-2xl mt-6 border border-white/20 backdrop-blur-xl">

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

              {/* LOCATION */}
              <div
                className="animate-search-field flex flex-col text-left px-4 border-b md:border-b-0 md:border-r border-outline-variant/30 pb-4 md:pb-0"
                style={{ animationDelay: "0.25s" }}
              >
                <label className="font-label-caps text-label-caps text-on-surface-variant mb-2">
                  LOCATION
                </label>

                <div className="flex items-center gap-2 text-primary group">
                  <span className="material-symbols-outlined text-secondary transition-transform duration-300 group-hover:scale-125">
                    location_on
                  </span>

                  <select
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="bg-transparent border-none focus:ring-0 w-full text-body-md font-medium appearance-none cursor-pointer outline-none"
                  >
                    <option value="">Where to go?</option>

                    {locations.map((loc) => (
                      <option key={loc} value={loc}>
                        {loc}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* CHECK IN */}
              <div
                className="animate-search-field flex flex-col text-left px-4 border-b md:border-b-0 md:border-r border-outline-variant/30 pb-4 md:pb-0"
                style={{ animationDelay: "0.4s" }}
              >
                <label className="font-label-caps text-label-caps text-on-surface-variant mb-2">
                  CHECK-IN
                </label>

                <div className="flex items-center gap-2 text-primary group">
                  <span className="material-symbols-outlined text-secondary transition-transform duration-300 group-hover:scale-125">
                    calendar_today
                  </span>

                  <input
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    min={today}
                    className="bg-transparent border-none focus:ring-0 w-full text-body-md font-medium [color-scheme:light] outline-none"
                    type="date"
                  />
                </div>
              </div>

              {/* CHECK OUT */}
              <div
                className="animate-search-field flex flex-col text-left px-4 border-b md:border-b-0 md:border-r border-outline-variant/30 pb-4 md:pb-0"
                style={{ animationDelay: "0.55s" }}
              >
                <label className="font-label-caps text-label-caps text-on-surface-variant mb-2">
                  CHECK-OUT
                </label>

                <div className="flex items-center gap-2 text-primary group">
                  <span className="material-symbols-outlined text-secondary transition-transform duration-300 group-hover:scale-125">
                    calendar_today
                  </span>

                  <input
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    min={checkIn || today}
                    className="bg-transparent border-none focus:ring-0 w-full text-body-md font-medium [color-scheme:light] outline-none"
                    type="date"
                  />
                </div>
              </div>

              {/* GUESTS */}
              <div
                className="animate-search-field flex flex-col text-left px-4 pb-4 md:pb-0"
                style={{ animationDelay: "0.7s" }}
              >
                <label className="font-label-caps text-label-caps text-on-surface-variant mb-2">
                  GUESTS
                </label>

                <div className="flex items-center gap-2 text-primary group">
                  <span className="material-symbols-outlined text-secondary transition-transform duration-300 group-hover:scale-125">
                    group
                  </span>

                  <select
                    value={guests}
                    onChange={(e) => setGuests(e.target.value)}
                    className="bg-transparent border-none focus:ring-0 w-full text-body-md font-medium appearance-none cursor-pointer outline-none"
                  >
                    <option>1 Adult</option>
                    <option>2 Adults</option>
                    <option>2 Adults, 1 Child</option>
                    <option>2 Adults, 2 Children</option>
                    <option>4 Adults</option>
                  </select>
                </div>
              </div>
            </div>

            {/* SEARCH BUTTON */}
            <button
              onClick={handleSearch}
              className="animate-button mt-5 bg-primary hover:bg-secondary-fixed hover:text-on-secondary-fixed transition-all duration-300 text-on-primary font-bold h-touch-target rounded-xl flex items-center justify-center gap-2 w-full md:w-auto md:mx-auto md:px-14 shadow-lg hover:shadow-2xl hover:-translate-y-1 active:translate-y-0 group"
            >
              <span className="material-symbols-outlined transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110">
                search
              </span>

              <span>Search</span>

              <span className="material-symbols-outlined text-sm opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300">
                arrow_forward
              </span>
            </button>
          </div>

          {/* Trust indicators */}
          <div className="animate-trust mt-7 flex flex-wrap justify-center items-center gap-5 md:gap-8 text-white/70 text-xs md:text-sm">

            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-sm text-secondary-fixed">
                verified
              </span>
              Premium Properties
            </div>

            <div className="hidden sm:block w-1 h-1 rounded-full bg-white/30" />

            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-sm text-secondary-fixed">
                location_on
              </span>
              Prime Locations
            </div>

            <div className="hidden sm:block w-1 h-1 rounded-full bg-white/30" />

            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-sm text-secondary-fixed">
                star
              </span>
              Exceptional Stays
            </div>
          </div>
        </div>

        {/* =========================================================
            SCROLL INDICATOR
        ========================================================== */}
        <div className="absolute bottom-7 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 text-white/60 animate-scroll-indicator">
          <span className="text-[10px] tracking-[0.25em] uppercase">
            Explore
          </span>

          <span className="material-symbols-outlined text-lg">
            keyboard_arrow_down
          </span>
        </div>
      </section>

      {/* =========================================================
          ANIMATIONS
      ========================================================== */}
      <style jsx>{`
        @keyframes heroZoom {
          0% {
            transform: scale(1);
          }

          50% {
            transform: scale(1.07);
          }

          100% {
            transform: scale(1);
          }
        }

        @keyframes fadeDown {
          0% {
            opacity: 0;
            transform: translateY(-25px);
          }

          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes heroTitle {
          0% {
            opacity: 0;
            transform: translateY(40px) scale(0.97);
            filter: blur(8px);
          }

          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
            filter: blur(0);
          }
        }

        @keyframes fadeUp {
          0% {
            opacity: 0;
            transform: translateY(25px);
          }

          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes searchPanel {
          0% {
            opacity: 0;
            transform: translateY(40px) scale(0.96);
          }

          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes searchField {
          0% {
            opacity: 0;
            transform: translateY(15px);
          }

          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes buttonEntrance {
          0% {
            opacity: 0;
            transform: translateY(15px);
          }

          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes pulseSlow {
          0%,
          100% {
            opacity: 0.25;
            transform: translateX(-50%) scale(1);
          }

          50% {
            opacity: 0.5;
            transform: translateX(-50%) scale(1.15);
          }
        }

        @keyframes floatingLight {
          0%,
          100% {
            transform: translateY(0) translateX(0);
            opacity: 0.2;
          }

          50% {
            transform: translateY(-30px) translateX(15px);
            opacity: 0.7;
          }
        }

        @keyframes trust {
          0% {
            opacity: 0;
          }

          100% {
            opacity: 1;
          }
        }

        @keyframes scrollIndicator {
          0%,
          100% {
            transform: translateY(0);
            opacity: 0.5;
          }

          50% {
            transform: translateY(8px);
            opacity: 1;
          }
        }

        .animate-hero-zoom {
          animation: heroZoom 18s ease-in-out infinite;
        }

        .animate-fade-down {
          animation: fadeDown 0.8s ease-out both;
        }

        .animate-hero-title {
          animation: heroTitle 1s ease-out 0.15s both;
        }

        .animate-fade-up-delay {
          animation: fadeUp 0.9s ease-out 0.5s both;
        }

        .animate-search-panel {
          animation: searchPanel 0.9s cubic-bezier(0.22, 1, 0.36, 1) 0.65s both;
        }

        .animate-search-field {
          animation: searchField 0.7s ease-out both;
        }

        .animate-button {
          animation: buttonEntrance 0.7s ease-out 0.85s both;
        }

        .animate-pulse-slow {
          animation: pulseSlow 6s ease-in-out infinite;
        }

        .animate-floating-light {
          animation: floatingLight 6s ease-in-out infinite;
        }

        .animate-trust {
          animation: trust 1s ease-out 1.4s both;
        }

        .animate-scroll-indicator {
          animation: scrollIndicator 2s ease-in-out infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .animate-hero-zoom,
          .animate-fade-down,
          .animate-hero-title,
          .animate-fade-up-delay,
          .animate-search-panel,
          .animate-search-field,
          .animate-button,
          .animate-pulse-slow,
          .animate-floating-light,
          .animate-trust,
          .animate-scroll-indicator {
            animation: none !important;
          }
        }
      `}</style>
    </>
  );
}