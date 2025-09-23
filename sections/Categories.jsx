"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

const CATEGORIES = [
  { name: "Antibiotics",  slug: "antibiotics",   img: "/images/antibiotics.png" },
  { name: "Diabetes",     slug: "diabetes",      img: "/images/diabeties.png" },
  { name: "ED",           slug: "ed",            img: "/images/ed.png" },
  { name: "Anti Cancer",  slug: "anti-cancer",   img: "/images/anticancer.png" },
  { name: "Deaddiction",  slug: "deaddiction",   img: "/images/deaddiction.png" },
  { name: "Painkiller",   slug: "painkiller",    img: "/images/painkiller.png" },
  { name: "Heart Health", slug: "heart-health",  img: "/images/hearthealth.png" },
  { name: "Skin",         slug: "skin",          img: "/images/skin.png" },
  { name: "Sleep",        slug: "sleep",         img: "/images/sleep.png" },
  { name: "Steroids",     slug: "steroids",      img: "/images/steroids.png" },
  { name: "Thyroid",      slug: "thyroid",       img: "/images/thyroid.png" },
  { name: "Weight Loss",  slug: "weight-loss",   img: "/images/weightloss.png" },
];

export default function CategoriesGrid({ categories = CATEGORIES, title = "Shop by Category" }) {
  const scrollerRef = useRef(null);
  const scrollBy = (px) => scrollerRef.current?.scrollBy({ left: px, behavior: "smooth" });

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6 flex items-end justify-between">
        <h2 className="text-2xl font-bold tracking-tight text-sky-600 uppercase">{title}</h2>
        <Link href="/categories" className="text-sm font-medium text-sky-700 hover:text-sky-900">
          View all
        </Link>
      </div>

      {/* Mobile: SAME CARD, horizontal snap carousel */}
      <div className="sm:hidden relative">
        {/* edge arrows */}
        <button
          aria-label="Scroll left"
          onClick={() => scrollBy(-240)}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 rounded-full border border-sky-200 bg-white p-1.5 text-sky-700 shadow-sm"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          aria-label="Scroll right"
          onClick={() => scrollBy(240)}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 rounded-full border border-sky-200 bg-white p-1.5 text-sky-700 shadow-sm"
        >
          <ChevronRight className="h-5 w-5" />
        </button>

        {/* scroller */}
        <div
          ref={scrollerRef}
          className="no-scrollbar -mx-4 flex gap-3 overflow-x-auto px-4 pb-1 snap-x snap-mandatory scroll-smooth"
          aria-roledescription="carousel"
          aria-label="Categories"
        >
          {categories.map((cat, i) => (
            <Link
              key={cat.slug}
              href={`/category/${cat.slug}`}
              className="snap-start shrink-0 w-40"   // ~160px card width; tweak if needed
            >
              <div className="rounded-xl border border-sky-200 bg-white">
                <div className="relative aspect-square p-3">
                  {/* contain = no crop, consistent look */}
                  <Image
                    src={cat.img}
                    alt={cat.name}
                    fill
                    sizes="160px"
                    className="object-contain"
                    priority={i < 3}
                  />
                </div>
              </div>
              <p className="mt-2 text-center text-sm font-semibold text-gray-900">{cat.name}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Tablet/Desktop: GRID (unchanged) */}
      <ul className="hidden sm:grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
        {categories.map((cat, i) => (
          <li key={cat.slug}>
            <Link
              href={`/category/${cat.slug}`}
              className="group block rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
            >
              <div className="relative overflow-hidden rounded-xl border border-sky-100 bg-white">
                <div className="relative aspect-square p-3">
                  <Image
                    src={cat.img}
                    alt={cat.name}
                    fill
                    sizes="(max-width: 1024px) 33vw, 16vw"
                    className="object-contain"
                    priority={i < 6}
                  />
                </div>
              </div>
              <div className="mt-2 text-center">
                <p className="text-sm font-semibold text-gray-900">{cat.name}</p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
