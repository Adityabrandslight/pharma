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
  Baby,
  Apple,
  ShieldCheck,
  Activity,
  Droplet,
} from "lucide-react";

const CATEGORIES = [
  { name: "Pain Relief", slug: "pain-relief" },
  { name: "Cough & Cold", slug: "cough-cold" },
  { name: "Digestive Health", slug: "digestive" },
  { name: "Antibiotics  ", slug: "antibiotics" },
  { name: "Diabetes", slug: "diabetes" },
  { name: "Heart Care", slug: "cardiac" },
  { name: "Skin Care", slug: "derma" },
  { name: "Vitamins", slug: "vitamins" },
  { name: "Ayurveda", slug: "ayurveda" },
  { name: "Women’s Health", slug: "women" },
  { name: "Baby Care", slug: "baby" },
  { name: "Elderly Care", slug: "elderly" },
  { name: "Devices", slug: "devices" },
];

// Different icon per category
const ICONS = {
  "Pain Relief": Pill,
  "Cough & Cold": Thermometer,
  "Digestive Health": Droplet,
  Diabetes: Syringe,
  "Heart Care": HeartPulse,
  "Skin Care": Sun,
  Vitamins: Apple,
  Ayurveda: Stethoscope,
  "Women’s Health": Activity,
  "Baby Care": Baby,
  "Elderly Care": ShieldCheck,
  Devices: Thermometer,
};

// Helper to normalize strings for matching
const norm = (s = "") => s.toLowerCase().replace(/\s+/g, "").replace(/[’']/g, "");

export default function MedicineCategoryNav() {
  const scrollerRef = useRef(null);
  const [openMenu, setOpenMenu] = useState(null); // {slug,label,left,top,width}
  const closeTimer = useRef(null);

  // products.json data
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // fetch once
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

  // Build a map: categorySlug -> products[]
  const byCategory = useMemo(() => {
    const map = {};
    for (const cat of CATEGORIES) map[cat.slug] = [];
    for (const p of products) {
      // Try to map product.category to our CATEGORIES
      const match =
        CATEGORIES.find(
          (c) =>
            norm(c.name) === norm(p.category) ||
            norm(c.slug) === norm(p.category) ||
            norm(c.name).includes(norm(p.category)) ||
            norm(p.category).includes(norm(c.name))
        ) || null;
      if (match) {
        map[match.slug].push(p);
      }
    }
    return map;
  }, [products]);

  const scrollBy = (delta) => scrollerRef.current?.scrollBy({ left: delta, behavior: "smooth" });

  const cancelClose = () => clearTimeout(closeTimer.current);
  const scheduleClose = (delay = 250) => {
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
        <div
          ref={scrollerRef}
          className="no-scrollbar relative flex gap-2 overflow-x-auto scroll-smooth py-3"
        >
          {CATEGORIES.map((cat) => {
            const Icon = ICONS[cat.name] || Pill;
            const isOpen = openMenu?.slug === cat.slug;

            return (
              <div key={cat.slug} className="relative">
                {/* Category trigger as BUTTON (no navigation) */}
                <button
                  type="button"
                  aria-haspopup="menu"
                  aria-expanded={isOpen}
                  onPointerEnter={(e) => openFor(e.currentTarget, cat)}
                  onPointerLeave={() => scheduleClose(250)}
                  onClick={(e) => {
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

      {/* Dropdown outside the scroller */}
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
                  byCategory[openMenu.slug]
                    .slice(0, 10) // show first 10; tweak as needed
                    .map((p) => (
                      <li key={p.id}>
                        <Link
                          href={`/product/${p.slug}`}
                          className="flex items-center justify-between gap-2 rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-sky-50 hover:text-sky-800"
                          role="menuitem"
                          tabIndex={0}
                        >
                          <span className="line-clamp-1">{p.name}</span>
                          {/* tiny price if present */}
                          {typeof p.price === "number" && (
                            <span className="shrink-0 text-[12px] font-medium text-slate-600">₹{p.price}</span>
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
