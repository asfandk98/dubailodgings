"use client";

import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const VALUES = [
  {
    icon: "verified",
    title: "Trusted Stays",
    description:
      "We focus on presenting quality accommodation options so travelers can make informed decisions with confidence.",
  },
  {
    icon: "location_on",
    title: "Prime Locations",
    description:
      "Discover properties across Dubai and the UAE, from vibrant city destinations to convenient locations for business and leisure.",
  },
  {
    icon: "support_agent",
    title: "Guest First",
    description:
      "From discovering a property to completing a booking, we aim to make every step simple, clear, and convenient.",
  },
  {
    icon: "travel_explore",
    title: "Explore More",
    description:
      "Dubai is more than a place to stay. We help travelers discover accommodation that puts the best of the UAE within reach.",
  },
];

const STATS = [
  {
    value: "Dubai",
    label: "Our Home",
  },
  {
    value: "UAE",
    label: "Destinations",
  },
  {
    value: "24/7",
    label: "Online Access",
  },
  {
    value: "100%",
    label: "Guest Focus",
  },
];

export default function AboutPage() {
  return (
    <>
      <Header />

      <main className="bg-surface text-on-surface pt-16 md:pt-20">

        {/* ================= HERO ================= */}
        <section className="relative min-h-[520px] md:min-h-[620px] flex items-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-[#1b315d]" />

          <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-secondary/20 blur-3xl" />

          <div className="absolute -bottom-40 -left-32 w-[500px] h-[500px] rounded-full bg-white/10 blur-3xl" />

          <div className="relative z-10 max-w-container-max mx-auto w-full px-gutter py-32">
            <div className="max-w-3xl">

              <span className="inline-flex items-center gap-2 mb-6 text-white/80 font-label-caps text-label-caps">
                <span className="w-8 h-px bg-secondary" />
                ABOUT DUBAI LODGINGS
              </span>

              <h1 className="font-display-lg-mobile md:font-display-lg text-white text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[1.05] tracking-tight mb-7">
                Your Stay.
                <br />
                Your Dubai.
                <br />
                <span className="text-secondary">
                  Your Journey.
                </span>
              </h1>

              <p className="max-w-2xl text-white/80 text-base sm:text-lg md:text-xl leading-relaxed">
                Dubai Lodgings is designed to make discovering and
                booking accommodation in Dubai and across the UAE
                simple, convenient, and inspiring.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mt-9">

                <Link
                  href="/hotels"
                  className="inline-flex items-center justify-center gap-2 bg-secondary text-primary px-7 py-4 font-label-caps hover:bg-white transition-colors duration-300"
                >
                  EXPLORE HOTELS

                  <span className="material-symbols-outlined text-[20px]">
                    arrow_forward
                  </span>
                </Link>

                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 border border-white/40 text-white px-7 py-4 font-label-caps hover:bg-white hover:text-primary transition-colors duration-300"
                >
                  CONTACT US
                </Link>

              </div>
            </div>
          </div>
        </section>

        {/* ================= WHO WE ARE ================= */}
        <section className="py-20 md:py-28 bg-surface">
          <div className="max-w-container-max mx-auto px-gutter">

            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

              <div className="relative">

                <div className="aspect-[4/5] max-w-xl mx-auto bg-gradient-to-br from-primary via-[#16294c] to-secondary rounded-xl overflow-hidden">

                  <div className="absolute inset-0 flex items-center justify-center">

                    <div className="text-center text-white px-8">

                      <span className="material-symbols-outlined text-[80px] md:text-[100px] text-secondary mb-5">
                        apartment
                      </span>

                      <p className="font-display-lg-mobile md:font-display-lg text-3xl md:text-5xl">
                        DUBAI
                        <br />
                        LODGINGS
                      </p>

                      <div className="w-16 h-px bg-secondary mx-auto my-5" />

                      <p className="text-white/70 text-sm tracking-[0.2em]">
                        STAY • DISCOVER • EXPERIENCE
                      </p>

                    </div>
                  </div>
                </div>

                <div className="absolute -bottom-6 right-4 sm:right-8 bg-white rounded-lg shadow-2xl p-5 sm:p-6 max-w-[260px]">

                  <span className="material-symbols-outlined text-secondary text-[30px] mb-2">
                    travel_explore
                  </span>

                  <p className="text-primary font-bold text-lg">
                    Discover Dubai
                  </p>

                  <p className="text-on-surface-variant text-sm mt-1 leading-relaxed">
                    Find a stay that fits the way you want to experience
                    the city.
                  </p>

                </div>
              </div>

              <div className="lg:pl-4">

                <span className="text-secondary font-label-caps text-label-caps">
                  WHO WE ARE
                </span>

                <h2 className="font-headline-md text-primary text-3xl md:text-4xl lg:text-5xl leading-tight mt-4 mb-6">
                  Making accommodation discovery easier
                </h2>

                <div className="space-y-5 text-on-surface-variant text-base md:text-lg leading-relaxed">

                  <p>
                    Dubai Lodgings is an accommodation platform created
                    for travelers looking to discover hotels and stays
                    in Dubai and across the UAE.
                  </p>

                  <p>
                    We understand that choosing where to stay is an
                    important part of every journey. Location, comfort,
                    value, and convenience all matter.
                  </p>

                  <p>
                    Whether you are visiting Dubai for a holiday, a
                    business trip, a family getaway, or simply looking
                    for a new experience, Dubai Lodgings helps you
                    explore accommodation options suited to your journey.
                  </p>

                </div>

                <Link
                  href="/hotels"
                  className="inline-flex items-center gap-2 mt-8 text-primary font-label-caps border-b-2 border-secondary pb-2 hover:text-secondary transition-colors"
                >
                  DISCOVER OUR HOTELS

                  <span className="material-symbols-outlined text-[18px]">
                    arrow_forward
                  </span>
                </Link>

              </div>
            </div>
          </div>
        </section>

        {/* ================= STATS ================= */}
        <section className="bg-surface-container py-14 md:py-20">
          <div className="max-w-container-max mx-auto px-gutter">

            <div className="grid grid-cols-2 md:grid-cols-4 gap-0 border border-outline-variant">

              {STATS.map((stat, index) => (
                <div
                  key={stat.label}
                  className={`text-center py-8 md:py-10 px-4 ${
                    index < STATS.length - 1
                      ? "border-r border-outline-variant"
                      : ""
                  }`}
                >

                  <div className="font-display-lg-mobile md:font-display-lg text-primary text-2xl md:text-4xl">
                    {stat.value}
                  </div>

                  <div className="text-on-surface-variant font-label-caps text-[10px] md:text-xs mt-2">
                    {stat.label}
                  </div>

                </div>
              ))}

            </div>
          </div>
        </section>

        {/* ================= VALUES ================= */}
        <section className="py-20 md:py-28 bg-white">

          <div className="max-w-container-max mx-auto px-gutter">

            <div className="text-center max-w-2xl mx-auto mb-14">

              <span className="text-secondary font-label-caps text-label-caps">
                WHAT MATTERS TO US
              </span>

              <h2 className="font-headline-md text-primary text-3xl md:text-4xl mt-4 mb-5">
                Built around the traveler
              </h2>

              <p className="text-on-surface-variant text-base md:text-lg leading-relaxed">
                Every part of Dubai Lodgings is designed with one simple
                idea in mind: making your accommodation journey easier.
              </p>

            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

              {VALUES.map((value) => (

                <div
                  key={value.title}
                  className="group border border-outline-variant rounded-lg p-7 md:p-8 hover:border-secondary hover:shadow-xl transition-all duration-300"
                >

                  <div className="w-14 h-14 rounded-full bg-surface-container flex items-center justify-center mb-6 group-hover:bg-secondary transition-colors duration-300">

                    <span className="material-symbols-outlined text-[28px] text-primary">
                      {value.icon}
                    </span>

                  </div>

                  <h3 className="font-headline-md text-primary text-xl mb-3">
                    {value.title}
                  </h3>

                  <p className="text-on-surface-variant text-sm leading-relaxed">
                    {value.description}
                  </p>

                </div>

              ))}

            </div>
          </div>
        </section>

        {/* ================= EXPERIENCE ================= */}
        <section className="py-20 md:py-28 bg-primary text-white">

          <div className="max-w-container-max mx-auto px-gutter">

            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

              <div>

                <span className="text-secondary font-label-caps text-label-caps">
                  EXPERIENCE THE UAE
                </span>

                <h2 className="font-display-lg-mobile md:font-display-lg text-3xl md:text-5xl leading-tight mt-4 mb-6">
                  Stay close to what makes Dubai unforgettable.
                </h2>

                <p className="text-white/70 text-base md:text-lg leading-relaxed max-w-xl">
                  From Downtown Dubai to the coastline, business
                  districts, shopping destinations, and cultural
                  experiences, the right accommodation can make all
                  the difference.
                </p>

                <Link
                  href="/hotels"
                  className="inline-flex items-center gap-2 mt-8 bg-secondary text-primary px-7 py-4 font-label-caps hover:bg-white transition-colors duration-300"
                >
                  FIND YOUR STAY

                  <span className="material-symbols-outlined text-[20px]">
                    search
                  </span>
                </Link>

              </div>

              <div className="grid grid-cols-2 gap-4">

                {[
                  ["location_city", "City Life", "Be close to Dubai's vibrant urban experiences."],
                  ["beach_access", "Coastal Escapes", "Discover stays near Dubai's iconic coastline."],
                  ["business_center", "Business", "Convenient accommodation for business travelers."],
                  ["family_restroom", "Family Stays", "Options designed around comfortable family journeys."],
                ].map(([icon, title, description], index) => (

                  <div
                    key={title}
                    className={`bg-white/10 border border-white/10 rounded-lg p-6 md:p-8 min-h-[180px] flex flex-col justify-end ${
                      index % 2 === 1 ? "mt-8" : ""
                    }`}
                  >

                    <span className="material-symbols-outlined text-secondary text-[38px] mb-auto">
                      {icon}
                    </span>

                    <h3 className="font-headline-md text-xl">
                      {title}
                    </h3>

                    <p className="text-white/60 text-sm mt-2">
                      {description}
                    </p>

                  </div>

                ))}

              </div>
            </div>
          </div>
        </section>

        {/* ================= MISSION ================= */}
        <section className="py-20 md:py-28 bg-surface-container">

          <div className="max-w-4xl mx-auto px-gutter text-center">

            <span className="material-symbols-outlined text-secondary text-[42px] mb-5">
              format_quote
            </span>

            <span className="block text-secondary font-label-caps text-label-caps mb-5">
              OUR APPROACH
            </span>

            <h2 className="font-display-lg-mobile md:font-display-lg text-primary text-3xl md:text-5xl leading-tight">
              We believe finding the right place to stay should be part
              of the excitement of travelling, not a source of stress.
            </h2>

            <p className="mt-7 text-on-surface-variant text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
              That is why we are building Dubai Lodgings around
              simplicity, choice, convenience, and the experience of
              the traveler.
            </p>

          </div>
        </section>

        {/* ================= CTA ================= */}
        <section className="py-20 md:py-24 bg-white">

          <div className="max-w-container-max mx-auto px-gutter">

            <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-primary to-[#1d3768] px-7 sm:px-10 md:px-16 py-14 md:py-20">

              <div className="relative z-10 max-w-3xl">

                <span className="text-secondary font-label-caps text-label-caps">
                  READY TO EXPLORE?
                </span>

                <h2 className="font-display-lg-mobile md:font-display-lg text-white text-3xl md:text-5xl mt-4 mb-5">
                  Find your next stay in Dubai.
                </h2>

                <p className="text-white/70 text-base md:text-lg leading-relaxed max-w-2xl">
                  Explore our accommodation collection and start
                  planning your next Dubai experience.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 mt-8">

                  <Link
                    href="/hotels"
                    className="inline-flex items-center justify-center gap-2 bg-secondary text-primary px-7 py-4 font-label-caps hover:bg-white transition-colors duration-300"
                  >
                    EXPLORE HOTELS

                    <span className="material-symbols-outlined text-[20px]">
                      arrow_forward
                    </span>
                  </Link>

                  <Link
                    href="/contact"
                    className="inline-flex items-center justify-center gap-2 border border-white/30 text-white px-7 py-4 font-label-caps hover:bg-white hover:text-primary transition-colors duration-300"
                  >
                    CONTACT US
                  </Link>

                </div>
              </div>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </>
  );
}