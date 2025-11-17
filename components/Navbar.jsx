"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  Pill,
  Thermometer,
  Stethoscope,
  HeartPulse,
  Sun,
  Syringe,
  ShieldCheck,
  Activity,
  Droplet,
  Apple,
} from "lucide-react";

// Route slugs you already use
const CATEGORIES = [
  { name: "Antibiotics", slug: "antibiotics" },
  { name: "ED", slug: "ed" },
  { name: "Steroids", slug: "steroids" },
  { name: "Diabetic Care", slug: "diabetic-care" },
  { name: "Skin & Dermatology", slug: "skin-dermatology" },
  { name: "Sleeping Aids", slug: "sleeping-aids" },
  { name: "ADHD & Neurological", slug: "adhd-neurological" },
  { name: "Weightloss & Female", slug: "weightloss-female" },
  { name: "Heart Health", slug: "heart-health" },
  { name: "Anti-cancer", slug: "anti-cancer" },
  { name: "Pain-killers", slug: "pain-killers" },
  { name: "Thyroid", slug: "thyroid" },
  { name: "Deaddiction", slug: "deaddiction" },
];

const ICONS = {
  Antibiotics: Pill,
  ED: Activity,
  Steroids: Syringe,
  "Diabetic Care": Syringe,
  "Skin & Dermatology": Sun,
  "Sleeping Aids": Stethoscope,
  "ADHD & Neurological": Activity,
  "Weightloss & Female": Apple,
  "Heart Health": HeartPulse,
  "Anti-cancer": Pill,
  "Pain-killers": Droplet,
  Thyroid: Thermometer,
  Deaddiction: ShieldCheck,
};

// Normalize to route-style slug: & -> '-', compress, drop filler words
const toSlug = (s = "") => {
  let t = s.toString().toLowerCase();

  // special: weight loss -> weightloss (route uses weightloss)
  t = t.replace(/\bweight\s+loss\b/g, "weightloss");

  // & should behave like route slugs
  t = t.replace(/&/g, "-");

  // remove common filler words that break matching
  t = t.replace(/\bhealth\b/g, ""); // "female health" -> "female"

  // squash non-alnum to "-"
  t = t.replace(/[^a-z0-9]+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
  return t;
};

// hyphen-insensitive string for loose match
const loose = (s = "") => toSlug(s).replace(/-/g, "");

export default function MedicineCategoryNav() {
  const scrollerRef = useRef(null);
  const [openMenu, setOpenMenu] = useState(null);
  const closeTimer = useRef(null);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    fetch("/data/products.json")
      .then((r) => r.json())
      .then((json) => {
        if (!alive) return;
        setProducts(Array.isArray(json.products) ? json.products : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
    return () => {
      alive = false;
    };
  }, []);

  // Map: categorySlug -> products[]
  const byCategory = useMemo(() => {
    const map = {};
    for (const cat of CATEGORIES) map[cat.slug] = [];

    for (const p of products) {
      const pSlug = toSlug(p.category || "");
      const pLoose = loose(p.category || "");

      const matchedCat =
        CATEGORIES.find((c) => {
          const cSlug = c.slug;
          const cLoose = loose(c.slug);

          // strict or contains, plus loose equality/contains
          return (
            pSlug === cSlug ||
            pSlug.includes(cSlug) ||
            cSlug.includes(pSlug) ||
            pLoose === cLoose ||
            pLoose.includes(cLoose) ||
            cLoose.includes(pLoose)
          );
        }) || null;

      if (matchedCat) map[matchedCat.slug].push(p);
    }
    return map;
  }, [products]);

  const scrollBy = (delta) => scrollerRef.current?.scrollBy({ left: delta, behavior: "smooth" });

  const cancelClose = () => clearTimeout(closeTimer.current);
  const scheduleClose = (delay = 250) => {
    if ("ontouchstart" in window) return; // don't auto-close on mobile
    cancelClose();
    closeTimer.current = setTimeout(() => setOpenMenu(null), delay);
  };

  const openFor = (target, cat) => {
    cancelClose();
    const rect = target.getBoundingClientRect();
    const minWidth = 280;
    const left = Math.max(8, Math.min(rect.left, window.innerWidth - minWidth - 8));
    const top = rect.bottom;
    setOpenMenu({ slug: cat.slug, label: cat.name, left, top, width: minWidth });
  };

  useEffect(() => {
    const close = () => setOpenMenu(null);
    const scroller = scrollerRef.current;
    scroller?.addEventListener("scroll", close, { passive: true });
    window.addEventListener("resize", close);
    return () => {
      scroller?.removeEventListener("scroll", close);
      window.removeEventListener("resize", close);
    };
  }, []);

  return (
    <div className="w-full border-b border-sky-200 bg-white">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Left Arrow */}
        <button
          type="button"
          aria-label="Scroll left"
          onClick={() => scrollBy(-260)}
          className="absolute left-0 top-1/2 z-40 -translate-y-1/2 rounded-full border border-sky-200 bg-white p-1 text-sky-600 shadow-sm hover:bg-sky-50"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        {/* Scrollable Categories */}
        <div ref={scrollerRef} className="no-scrollbar relative flex gap-2 overflow-x-auto scroll-smooth py-3">
          {CATEGORIES.map((cat) => {
            const Icon = ICONS[cat.name] || Pill;
            const isOpen = openMenu?.slug === cat.slug;

            return (
              <div key={cat.slug} className="relative">
                <button
                  type="button"
                  aria-haspopup="menu"
                  aria-expanded={isOpen}
                  onPointerEnter={(e) => {
                    if (!("ontouchstart" in window)) openFor(e.currentTarget, cat);
                  }}
                  onPointerLeave={() => scheduleClose(250)}
                  onClick={(e) => {
                    e.preventDefault();
                    if (isOpen) setOpenMenu(null);
                    else openFor(e.currentTarget, cat);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      if (isOpen) setOpenMenu(null);
                      else openFor(e.currentTarget, cat);
                    }
                  }}
                  className={`cursor-pointer flex snap-start items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors
                    ${isOpen ? "border-sky-300 bg-sky-50 text-sky-800" : "border-sky-200 text-gray-800 hover:bg-sky-50 hover:text-sky-700"}`}
                >
                  <Icon className="h-4 w-4 text-sky-500" />
                  {cat.name}
                </button>
              </div>
            );
          })}
        </div>

        {/* Right Arrow */}
        <button
          type="button"
          aria-label="Scroll right"
          onClick={() => scrollBy(260)}
          className="absolute right-0 top-1/2 z-40 -translate-y-1/2 rounded-full border border-sky-200 bg-white p-1 text-sky-600 shadow-sm hover:bg-sky-50"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      {/* Dropdown */}
      {openMenu && (
        <>
          {/* Hover bridge */}
          <div
            className="fixed z-50"
            style={{ left: openMenu.left, top: openMenu.top - 8, width: openMenu.width, height: 10 }}
            onPointerEnter={cancelClose}
            onPointerLeave={() => scheduleClose(180)}
          />
          <div
            className="fixed z-50"
            style={{ left: openMenu.left, top: openMenu.top }}
            onPointerEnter={cancelClose}
            onPointerLeave={() => scheduleClose(200)}
            role="menu"
            aria-label={`${openMenu.label} submenu`}
          >
            <div className="min-w-[280px] rounded-lg border border-sky-200 bg-white p-2 shadow-md">
              {/* Header */}
              <div className="mb-2 px-2">
                <p className="text-[13px] font-semibold text-sky-700">{openMenu.label}</p>
                <p className="text-[12px] text-slate-500">Top products</p>
              </div>

              {/* Product list */}
              <ul className="max-h-[320px] w-full overflow-auto rounded-md">
                {loading ? (
                  <li className="px-3 py-2 text-sm text-slate-500">Loading…</li>
                ) : byCategory[openMenu.slug]?.length ? (
                  byCategory[openMenu.slug].slice(0, 10).map((p, index) => (
                    <li key={p.id || p.slug || index}>
                      <Link
                        href={`/product/${p.slug}`}
                        className="flex items-center justify-between gap-2 rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-sky-50 hover:text-sky-800"
                        role="menuitem"
                        tabIndex={0}
                      >
                        <span className="line-clamp-1">{p.name}</span>
                        {typeof p.price === "number" && (
                          <span className="shrink-0 text-[12px] font-medium text-slate-600">${p.price}</span>
                        )}
                      </Link>
                    </li>
                  ))
                ) : (
                  <li className="px-3 py-2 text-sm text-slate-500">No products found.</li>
                )}
              </ul>

              {/* View all */}
              <div className="pt-2">
                <Link
                  href={`/category/${openMenu.slug}`}
                  className="block rounded-md bg-sky-600 px-3 py-2 text-center text-sm font-semibold text-white hover:bg-sky-700"
                  onClick={() => setOpenMenu(null)}
                >
                  View all {openMenu.label}
                </Link>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}