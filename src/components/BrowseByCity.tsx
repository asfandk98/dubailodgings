import Link from "next/link";
import type { CityProperty } from "@/lib/api";
import { toAbsoluteImageUrl } from "@/lib/resolveImage";

const FALLBACK_IMAGES: Record<string, string> = {
  Dubai:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuAKxn8-VUEW4l_LhEwrh3rHUDr18dvcC2np5_fwgtTIuRT5XShCKHE1uIMgaiGOqhyenqdfsKk_ny2__xFDCl96ced6Ty_ReehchNenshqJNmM-VU5z3L4oBzxHDETdI3q23MJPL6iPsacWCWf4vXmY7_AW0QPDO3eM-6MNUS3CuedaqBlDy04NUFhPKvguy6dG-1jHje_crmTG1n_HQzIeR3W-4zUCdZ6bayLuInilg1DlBaQt7253",
  "Abu Dhabi":
    "https://lh3.googleusercontent.com/aida-public/AB6AXuB-M8ziuYPQfD8Vj2vzws-XvY34z9Pc97y9K1RXiKaZv6V1zsaIRbr6e4EAH88iXPqa0sUjQ3Q9GLVWpKT2ekVb_vHKuIcm9PvBl13NPLt3ya3aTvaYHvrrzAtRy5a0duyTqMk1FECcynnmuM6_Xm_j27YHgV5K4lavwQs7wWaHdO55w2SIp55ADxJzGCF99hYB7k6F4ORQ4u1qUfcE-VymWWM6Pf5WCQ45521JjfVqZUgLQ1gCCKgQ",
};

function getCityName(city: CityProperty) {
  return city.name ?? city.title ?? "Destination";
}

function getCityImage(city: CityProperty) {
  return (
    toAbsoluteImageUrl(city.image_url) ??
    toAbsoluteImageUrl(city.image) ??
    FALLBACK_IMAGES[getCityName(city)] ??
    FALLBACK_IMAGES.Dubai
  );
}

function getCityLabel(city: CityProperty) {
  if (city.properties) return city.properties;
  const count = city.properties_count ?? city.propertyCount;
  if (count === undefined || count === null) return null;
  return `${count} ${count === 1 ? "property" : "properties"}`;
}

export default function BrowseByCity({ cities }: { cities: CityProperty[] }) {
  if (!cities || cities.length === 0) return null;

  return (
    <section className="py-section-gap-lg max-w-container-max mx-auto px-gutter">
      <div className="flex items-end justify-between mb-10">
        <div>
          <h3 className="font-headline-md text-headline-md text-primary mb-2">Browse by Destination</h3>
          <p className="text-on-surface-variant font-body-md">Explore the finest Emirates in the UAE</p>
        </div>
        <Link href="/hotels" className="hidden md:flex items-center gap-2 text-secondary font-bold hover:underline">
          View All Destinations <span className="material-symbols-outlined">arrow_forward</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {cities.map((city, i) => {
          const label = getCityLabel(city);
          const key = city.slug ?? city.name ?? city.title;
          return (
            <Link
              key={city.id ?? key ?? i}
              href={`/hotels?location=${encodeURIComponent(key ?? "")}`}
              className="group relative h-[400px] rounded-lg overflow-hidden cursor-pointer shadow-lg block"
            >
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                style={{ backgroundImage: `url('${getCityImage(city)}')` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 text-white">
                <p className="font-label-caps text-label-caps mb-1 opacity-80">STAYS IN</p>
                <h4 className="font-headline-md text-headline-md">{getCityName(city)}</h4>
                {label && (
                  <p className="font-body-sm text-body-sm mt-2">
                    <span className="font-bold">{label}</span>
                  </p>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}