"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Pill } from "lucide-react";

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

export default function MedicineCategoryNav() {
  const scrollerRef = useRef(null);

  const [openMenu, setOpenMenu] = useState(null);
  const closeTimer = useRef(null);

  const scrollBy = (delta) => {
    scrollerRef.current?.scrollBy({ left: delta, behavior: "smooth" });
  };

  const cancelClose = () => clearTimeout(closeTimer.current);
  const scheduleClose = (delay = 250) => {
    cancelClose();
    closeTimer.current = setTimeout(() => setOpenMenu(null), delay);
  };

  const openFor = (e, cat) => {
    cancelClose();
    const rect = e.currentTarget.getBoundingClientRect();
    const minWidth = 240;
    const left = Math.max(8, Math.min(rect.left, window.innerWidth - minWidth - 8));
    const top = rect.bottom;
    setOpenMenu({
      slug: cat.slug,
      label: cat.name,
      items: cat.items,
      left,
      top,
      width: minWidth,
    });
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
    <div className="w-full border-b border-blue-100 bg-white">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Left Arrow */}
        <button
          type="button"
          aria-label="Scroll left"
          onClick={() => scrollBy(-260)}
          className="absolute left-0 top-1/2 z-40 -translate-y-1/2 rounded-full border border-blue-200 bg-white p-1 text-blue-600 shadow hover:bg-blue-50"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        {/* Scrollable Categories */}
        <div
          ref={scrollerRef}
          className="no-scrollbar relative flex gap-2 overflow-x-auto scroll-smooth py-3"
        >
          {CATEGORIES.map((cat) => (
            <div key={cat.slug} className="relative">
              <Link
                href={`/category/${cat.slug}`}
                className="flex snap-start items-center gap-2 rounded-full border border-blue-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-700 whitespace-nowrap transition"
                onPointerEnter={(e) => openFor(e, cat)}
                onPointerLeave={() => scheduleClose(250)}
              >
                <Pill className="h-4 w-4 text-blue-500" />
                {cat.name}
              </Link>
            </div>
          ))}
        </div>

        {/* Right Arrow */}
        <button
          type="button"
          aria-label="Scroll right"
          onClick={() => scrollBy(260)}
          className="absolute right-0 top-1/2 z-40 -translate-y-1/2 rounded-full border border-blue-200 bg-white p-1 text-blue-600 shadow hover:bg-blue-50"
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
            style={{
              left: openMenu.left,
              top: openMenu.top - 8,
              width: openMenu.width,
              height: 10,
            }}
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
            <div className="min-w-[240px] rounded-xl border border-blue-200 bg-white p-2 shadow-lg">
              <ul className="grid gap-1">
                {openMenu.items.map((item) => (
                  <li key={item}>
                    <Link
                      href={`/category/${openMenu.slug}/${item.toLowerCase().replace(/\s+/g, "-")}`}
                      className="block rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-800 whitespace-nowrap"
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
                    className="block rounded-lg bg-blue-600 px-3 py-2 text-center text-sm font-semibold text-white hover:bg-blue-700"
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
