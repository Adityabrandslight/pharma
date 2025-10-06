"use client";

import { useState, useId, useMemo } from "react";

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
    <main className="bg-gray-50 min-h-screen">
      {/* SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Header */}
      <section className="mx-auto max-w-4xl px-6 pt-16 text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-blue-600">
          Support
        </p>
        <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
          Frequently Asked Questions
        </h1>
        <p className="mt-4 text-gray-700">
          Find answers to the most common questions about our medicines and services.
        </p>

        {/* Search */}
        <div className="mt-8 relative max-w-xl mx-auto">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search FAQs…"
            className="w-full rounded-2xl border border-gray-300 bg-white px-5 py-3 text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          />
          {query && (
            <p className="mt-2 text-sm text-gray-500 text-left">
              Showing {filtered.length} of {faqs.length}
            </p>
          )}
        </div>
      </section>

      {/* FAQ List */}
      <section className="mx-auto max-w-4xl px-6 py-16">
        {filtered.length ? (
          <ul className="space-y-4">
            {filtered.map((item, index) => (
              <FAQCard key={index} question={item.q} answer={item.a} />
            ))}
          </ul>
        ) : (
          <div className="rounded-xl border border-gray-200 bg-white p-6 text-center text-gray-600">
            No results. Try different keywords or browse the FAQs above.
          </div>
        )}
      </section>
    </main>
  );
}

/* -------------------- FAQ Card Component -------------------- */

function FAQCard({ question, answer }) {
  const [open, setOpen] = useState(false);
  const panelId = useId();

  return (
    <li className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex justify-between items-center px-6 py-4 text-left hover:bg-blue-50 transition"
        aria-expanded={open}
        aria-controls={panelId}
      >
        <span className="text-gray-900 font-medium">{question}</span>
        <span
          className={`transform transition-transform duration-300 ${open ? "rotate-180" : ""}`}
        >
          ▼
        </span>
      </button>
      <div
        id={panelId}
        className={`px-6 pb-4 text-gray-700 text-sm transition-all duration-300 ease-in-out ${
          open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        {answer}
      </div>
    </li>
  );
}
