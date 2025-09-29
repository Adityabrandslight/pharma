"use client";

import { useState, useId, useMemo } from "react";

/**
 * Pharma FAQ — minimal, professional, accessible
 * - Calm blue accent, neutral surfaces
 * - Built-in search filter
 * - Smooth, accessible accordion with keyboard support
 * - SEO: JSON-LD FAQ schema
 * - Pure Tailwind. No external UI libs required.
 */

export default function PharmaFAQ() {
  const faqs = useMemo(
    () => [
      {
        q: "What should I do if I miss a dose?",
        a: "If you miss a dose, take it as soon as you remember unless it’s close to your next scheduled dose. Do not double the dose. For product-specific guidance, review the Patient Information Leaflet or consult your healthcare professional.",
      },
      {
        q: "How are your medicines quality-checked?",
        a: "Our manufacturing follows current Good Manufacturing Practice (cGMP). Each batch undergoes identity, purity, potency, and sterility testing as applicable before release.",
      },
      {
        q: "Can I take this medicine during pregnancy or while breastfeeding?",
        a: "Safety varies by product and trimester. Always discuss risks and benefits with your clinician or pharmacist. Refer to the product label’s Pregnancy and Lactation section for details.",
      },
      {
        q: "How should I store my medication?",
        a: "Unless otherwise specified, store at 20–25°C (68–77°F), protect from moisture and light, and keep out of reach of children. Some products require refrigeration; check the label.",
      },
      {
        q: "Where can I report a side effect (adverse event)?",
        a: "Report suspected adverse events to your healthcare professional and the national pharmacovigilance program. You can also use our Safety Reporting form on the Contact page.",
      },
      {
        q: "Do you offer patient assistance or cost-support programs?",
        a: "Yes. Eligible patients may qualify for copay support or free medication through our assistance programs. Visit the Patient Support section for enrollment criteria.",
      },
    ],
    []
  );

  const [query, setQuery] = useState("");
  const filtered = useMemo(() => {
    if (!query.trim()) return faqs;
    const q = query.toLowerCase();
    return faqs.filter(
      (i) =>
        i.q.toLowerCase().includes(q) ||
        i.a.toLowerCase().includes(q)
    );
  }, [faqs, query]);

  const jsonLd = useMemo(
    () => ({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: { "@type": "Answer", text: item.a },
      })),
    }),
    [faqs]
  );

  return (
    <main className="bg-white">
      {/* SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Header */}
      <section className="mx-auto max-w-3xl px-4 pt-14 sm:pt-16">
        <p className="text-xs font-semibold uppercase tracking-widest text-blue-700">
          Support
        </p>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
          Frequently Asked Questions
        </h1>
        <p className="mt-3 text-slate-600">
          Information provided is educational and not a substitute for professional medical advice. Always consult your healthcare provider about your personal situation.
        </p>

        {/* Search */}
        <div className="mt-6">
          <label htmlFor="faq-search" className="sr-only">
            Search FAQs
          </label>
          <div className="relative">
            <input
              id="faq-search"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search questions or keywords…"
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
            />
            <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
              <SearchIcon className="h-4 w-4" />
            </div>
          </div>
          {query && (
            <p className="mt-2 text-xs text-slate-500">
              Showing {filtered.length} of {faqs.length}
            </p>
          )}
        </div>
      </section>

      {/* List */}
      <section className="mx-auto max-w-3xl px-4 pb-16 pt-8">
        {filtered.length ? (
          <FAQList items={filtered} />
        ) : (
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-sm text-slate-600">
            No results. Try different keywords or browse the topics above.
          </div>
        )}

        {/* Help panel */}
        <div className="mt-10 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-base font-semibold text-slate-900">Still need help?</h2>
          <p className="mt-2 text-sm text-slate-600">
            Contact our medical information team or report a safety concern.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <a
              href="/contact"
              className="inline-flex items-center justify-center rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-800 transition hover:bg-blue-100"
            >
              Contact support
            </a>
            <a
              href="/safety-reporting"
              className="inline-flex items-center justify-center rounded-lg border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-medium text-rose-800 transition hover:bg-rose-100"
            >
              Report side effect
            </a>
          </div>
          <p className="mt-4 text-xs text-slate-500">
            In case of emergency or severe symptoms, call your local emergency number immediately.
          </p>
        </div>
      </section>
    </main>
  );
}

/* ------------------------------ Components ------------------------------ */

function FAQList({ items }) {
  return (
    <ul className="divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white shadow-sm">
      {items.map((item, i) => (
        <li key={i}>
          <FAQItem index={i} question={item.q} answer={item.a} />
        </li>
      ))}
    </ul>
  );
}

function FAQItem({ index, question, answer }) {
  const [open, setOpen] = useState(false);
  const panelId = useId();

  return (
    <div className="group">
      <h3 className="m-0">
        <button
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((v) => !v)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              setOpen((v) => !v);
            }
            if ((e.key === "ArrowDown" || e.key === "j") && !open) setOpen(true);
            if ((e.key === "ArrowUp" || e.key === "k") && open) setOpen(false);
          }}
          className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
        >
          <span className="text-base font-semibold text-slate-900 sm:text-lg">
            {question}
          </span>
          <span
            className={`shrink-0 inline-flex h-7 w-7 items-center justify-center rounded-full border text-sm transition-all duration-300 ${
              open
                ? "border-blue-300 bg-blue-50 text-blue-700"
                : "border-slate-300 bg-slate-50 text-slate-600 group-hover:border-slate-400"
            }`}
            aria-hidden="true"
          >
            <ChevronDown
              className={`h-4 w-4 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
            />
          </span>
        </button>
      </h3>

      <div
        id={panelId}
        role="region"
        aria-labelledby={`faq-q-${index}`}
        className={`grid overflow-hidden transition-all duration-300 ease-out ${
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="min-h-0 px-5 pb-5 text-sm leading-relaxed text-slate-700 sm:text-base">
          {answer}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------ Inline SVGs ----------------------------- */

function ChevronDown({ className = "h-4 w-4" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" aria-hidden="true">
      <path d="M6 9l6 6 6-6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SearchIcon({ className = "h-4 w-4" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" aria-hidden="true">
      <circle cx="11" cy="11" r="7" strokeWidth="2" />
      <line x1="16.65" y1="16.65" x2="21" y2="21" strokeWidth="2" />
    </svg>
  );
}
