"use client";

import { useEffect, useRef, useState } from "react";
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
  { name: "Pain Relief", slug: "pain-relief", items: ["Paracetamol", "Ibuprofen", "Diclofenac", "Aspirin"] },
  { name: "Cough & Cold", slug: "cough-cold", items: ["Cough Syrup", "Decongestant", "Throat Lozenges", "Antihistamines"] },
  { name: "Digestive Health", slug: "digestive", items: ["Antacids", "Laxatives", "Probiotics", "ORS"] },
  { name: "Diabetes", slug: "diabetes", items: ["Glucose Monitors", "Lancets", "Test Strips", "Sugar Substitutes"] },
  { name: "Heart Care", slug: "cardiac", items: ["Statins", "BP Monitors", "Omega-3", "CoQ10"] },
  { name: "Skin Care", slug: "derma", items: ["Antifungal", "Antibacterial", "Moisturizers", "Sunscreen"] },
  { name: "Vitamins", slug: "vitamins", items: ["Multivitamins", "Vitamin C", "Vitamin D3", "Calcium"] },
  { name: "Ayurveda", slug: "ayurveda", items: ["Chyawanprash", "Ashwagandha", "Triphala", "Giloy"] },
  { name: "Women’s Health", slug: "women", items: ["Iron", "PCOS Support", "Sanitary", "UTI Care"] },
  { name: "Baby Care", slug: "baby", items: ["Diapers", "Wipes", "Rash Cream", "Supplements"] },
  { name: "Elderly Care", slug: "elderly", items: ["Adult Diapers", "Joint Care", "Walking Aids", "Nutrition"] },
  { name: "Devices", slug: "devices", items: ["Thermometers", "Pulse Oximeter", "Nebulizer", "BP Monitor"] },
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

export default function MedicineCategoryNav() {
  const scrollerRef = useRef(null);
  const [openMenu, setOpenMenu] = useState(null);
  const closeTimer = useRef(null);

  const scrollBy = (delta) => scrollerRef.current?.scrollBy({ left: delta, behavior: "smooth" });

  const cancelClose = () => clearTimeout(closeTimer.current);
  const scheduleClose = (delay = 250) => {
    cancelClose();
    closeTimer.current = setTimeout(() => setOpenMenu(null), delay);
  };

  // Open dropdown for a category
  const openFor = (target, cat) => {
    cancelClose();
    const rect = target.getBoundingClientRect();
    const minWidth = 240;
    const left = Math.max(8, Math.min(rect.left, window.innerWidth - minWidth - 8));
    const top = rect.bottom;
    setOpenMenu({ slug: cat.slug, label: cat.name, items: cat.items, left, top, width: minWidth });
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
                    // toggle on click for touch/desktop
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
                  className={`flex snap-start items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors
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
            <div className="min-w-[240px] rounded-lg border border-sky-200 bg-white p-2 shadow-md">
              <ul className="grid gap-1">
                {openMenu.items.map((item) => (
                  <li key={item}>
                    <Link
                      href={`/category/${openMenu.slug}/${item.toLowerCase().replace(/\s+/g, "-")}`}
                      className="block rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-sky-50 hover:text-sky-700 whitespace-nowrap"
                      role="menuitem"
                      tabIndex={0}
                    >
                      {item}
                    </Link>
                  </li>
                ))}
                <li className="pt-1">
                  <Link
                    href={`/category/${openMenu.slug}`}
                    className="block rounded-md bg-sky-600 px-3 py-2 text-center text-sm font-semibold text-white hover:bg-sky-700"
                  >
                    View all
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
