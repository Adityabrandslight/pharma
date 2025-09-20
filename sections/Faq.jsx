"use client";

import { useState, useId, useMemo } from "react";


export default function PharmaFAQ() {
  const faqs = useMemo(
    () => [
      {
        q: "What should I do if I miss a dose?",
        a: "If you miss a dose, take it as soon as you remember unless it’s close to your next scheduled dose. Do not double the dose. For product‑specific guidance, review the Patient Information Leaflet or consult your healthcare professional.",
      },
      {
        q: "How are your medicines quality‑checked?",
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
        q: "Do you offer patient assistance or cost‑support programs?",
        a: "Yes. Eligible patients may qualify for copay support or free medication through our assistance programs. Visit the Patient Support section for enrollment criteria.",
      },
    ],
    []
  );

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
    <main className="min-h-screen bg-slate-50">
      <section className="mx-auto max-w-3xl px-4 py-16">
        {/* SEO */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

        <header className="mb-10">
          <p className="text-xs uppercase tracking-widest text-sky-700 font-semibold">Support</p>
          <h1 className="mt-2 text-3xl sm:text-4xl font-bold text-slate-900">Frequently Asked Questions</h1>
          <p className="mt-3 text-slate-600">
            Information provided here is educational and not a substitute for professional medical advice. Always
            consult your healthcare provider about your personal situation.
          </p>
        </header>

        <FAQList items={faqs} />

        <div className="mt-10 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="font-semibold text-slate-900">Still need help?</h2>
          <p className="mt-2 text-slate-600">Contact our medical information team or report a safety concern.</p>
          <div className="mt-4 flex flex-wrap gap-3">
            <a
              href="/contact"
              className="inline-flex items-center justify-center rounded-xl border border-sky-200 bg-sky-50 px-4 py-2 text-sky-800 hover:bg-sky-100 transition"
            >
              Contact Support
            </a>
            <a
              href="/safety-reporting"
              className="inline-flex items-center justify-center rounded-xl border border-rose-200 bg-rose-50 px-4 py-2 text-rose-800 hover:bg-rose-100 transition"
            >
              Report Side Effect
            </a>
          </div>
        </div>

        <p className="mt-8 text-xs text-slate-500">
          In case of emergency or severe symptoms, call your local emergency number immediately.
        </p>
      </section>
    </main>
  );
}

function FAQList({ items }) {
  return (
    <ul className="divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white shadow-sm">
      {items.map((item, i) => (
        <li key={i} className="p-0">
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
          className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
        >
          <span className="text-base sm:text-lg font-semibold text-slate-900">
            {question}
          </span>
          <span
            className={`shrink-0 inline-flex h-7 w-7 items-center justify-center rounded-full border text-sm transition-all duration-200 ${
              open
                ? "rotate-45 border-sky-300 bg-sky-50 text-sky-700"
                : "border-slate-300 bg-slate-50 text-slate-600 group-hover:border-slate-400"
            }`}
            aria-hidden="true"
          >
            +
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
        <div className="px-5 pb-5 text-slate-700 text-sm sm:text-base leading-relaxed min-h-0">
          {answer}
        </div>
      </div>
    </div>
  );
}
