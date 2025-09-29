import React from "react";


const stats = [
  { number: "25+", label: "Years of excellence", icon: TrophyIcon },
  { number: "50M+", label: "Patients served", icon: UsersIcon },
  { number: "200+", label: "Products", icon: PillIcon },
  { number: "15", label: "Countries", icon: GlobeIcon },
];

const certifications = [
  { image: "/images/pharmalogo1.png", alt: "Certification 1" },
  { image: "/images/pharmalogo2.jpeg", alt: "Certification 2" },
  { image: "/images/pharmalogo3.png", alt: "Certification 3" },
  { image: "/images/pharmalogo4.png", alt: "Certification 4" },
];

const leadership = [
  {
    name: "Dr. ",
    role: "Chief Executive Officer",
    credentials: "MD, MBA, 20+ years experience",
    image: "/images/ceo.jpg",
  },
  {
    name: "Dr. ",
    role: "Chief Scientific Officer",
    credentials: "PhD in Pharmaceutical Sciences",
    image: "/images/cso.jpg",
  },
  {
    name: "Mr. ",
    role: "Chief Operating Officer",
    credentials: "M.Pharm, Operations Excellence",
    image: "/images/coo.jpg",
  },
];

export default function AboutUs() {
  return (
    <div className="bg-white text-slate-900">
      {/* HERO */}
      <section className="border-b">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:py-24">
          <div className="flex flex-col items-start gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700">Since 1999</span>
              <h1 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
                Empowering health with science
              </h1>
              <p className="mt-4 text-base leading-relaxed text-slate-600 sm:text-lg">
                PharmaCare advances patient outcomes through rigorous research, reliable manufacturing, and thoughtful delivery. We design therapies that are effective, accessible, and responsibly made.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <PrimaryButton>Explore products</PrimaryButton>
                <OutlineButton>Contact us</OutlineButton>
              </div>
            </div>
            <div className="w-full max-w-xl">
              <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                <img
                  src='/images/about-image.jpeg'
                  alt="PharmaCare research facility"
                  className="h-72 w-full object-cover lg:h-80"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="bg-slate-50">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-4">
            {stats.map((s, i) => (
              <div key={i} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-center gap-3">
                  <s.icon className="h-6 w-6 text-slate-800" />
                  <div>
                    <div className="text-2xl font-bold leading-tight">{s.number}</div>
                    <div className="text-sm text-slate-600">{s.label}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section className="border-t">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:py-20">
          <div className="grid gap-12 lg:grid-cols-2">
            <div className="space-y-6">
              <span className="inline-flex w-fit items-center rounded-md border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-700">About PharmaCare</span>
              <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">Pioneering excellence in pharmaceutical care</h2>
              <p className="text-slate-700 leading-relaxed">
                Since 1999 we have focused on quality, precision, and integrity. Behind every prescription is a person seeking healing, and our work starts there.
              </p>
              <p className="text-slate-700 leading-relaxed">
                Our mission is to deliver life‑enhancing healthcare products built to global standards and tuned to the realities of modern medicine.
              </p>
              <p className="text-slate-700 leading-relaxed">
                From discovery to delivery, our scientists and engineers apply rigorous methods to create therapies that are safe, effective, and scalable.
              </p>

              <div className="grid gap-4 sm:grid-cols-2">
                <Feature
                  icon={<CheckIcon className="h-5 w-5 text-emerald-600" />}
                  title="Global standards"
                  desc="WHO‑GMP & FDA compliance"
                />
                <Feature
                  icon={<FlaskIcon className="h-5 w-5 text-blue-600" />}
                  title="R&D excellence"
                  desc="Cutting‑edge research"
                />
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="grid gap-4 sm:grid-cols-2">
                <ValueCard
                  title="Vision"
                  desc="Lead globally in pharma excellence, setting new standards for patient outcomes."
                />
                <ValueCard
                  title="Mission"
                  desc="Deliver high‑quality, affordable therapies that improve lives at scale."
                />
                <ValueCard
                  title="Values"
                  desc="Innovation, compassion, quality, integrity, collaboration, sustainability."
                />
                <ValueCard
                  title="Impact"
                  desc="Responsible manufacturing and equitable access across regions."
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CERTIFICATIONS */}
      <section className="bg-slate-50">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <div className="mb-10">
            <h3 className="text-xl font-bold tracking-tight sm:text-2xl">Certifications & compliance</h3>
            <p className="mt-2 text-slate-600">Commitment to quality, validated by international standards.</p>
          </div>
          <div className="grid grid-cols-2 items-center gap-6 sm:grid-cols-4">
            {certifications.map((c, i) => (
              <div key={i} className="rounded-xl border border-slate-200 bg-white p-4 text-center shadow-sm">
                <img
                  src={c.image}
                  alt={c.alt}
                  className="mx-auto max-h-16   transition  "
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LEADERSHIP */}
      <section>
        <div className="mx-auto max-w-7xl px-6 py-16 lg:py-20">
          <div className="mb-10">
            <h3 className="text-xl font-bold tracking-tight sm:text-2xl">Leadership</h3>
            <p className="mt-2 text-slate-600">People who keep the mission honest, disciplined, and useful.</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {leadership.map((leader, i) => (
              <LeaderCard key={i} leader={leader} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t bg-slate-50">
        <div className="mx-auto max-w-5xl px-6 py-16 text-center">
          <h3 className="text-2xl font-extrabold tracking-tight sm:text-3xl">Partner with excellence</h3>
          <p className="mx-auto mt-3 max-w-2xl text-slate-600">
            Discover how PharmaCare can support your needs with reliable therapies and transparent partnerships.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <PrimaryButton>Explore products</PrimaryButton>
            <OutlineButton>Talk to sales</OutlineButton>
          </div>
        </div>
      </section>
    </div>
  );
}

/* --------------------------- Small UI helpers --------------------------- */
function PrimaryButton({ children }) {
  return (
    <button className="inline-flex items-center justify-center rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
      {children}
    </button>
  );
}

function OutlineButton({ children }) {
  return (
    <button className="inline-flex items-center justify-center rounded-full border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-300 focus:ring-offset-2">
      {children}
    </button>
  );
}

function Feature({ icon, title, desc }) {
  return (
    <div className="flex items-start gap-3">
      {icon}
      <div>
        <div className="font-semibold">{title}</div>
        <div className="text-sm text-slate-600">{desc}</div>
      </div>
    </div>
  );
}

function ValueCard({ title, desc }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5">
      <div className="text-sm font-semibold text-slate-900">{title}</div>
      <p className="mt-2 text-sm leading-relaxed text-slate-600">{desc}</p>
    </div>
  );
}

function LeaderCard({ leader }) {
  const initials = leader.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="flex items-start gap-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="h-14 w-14 overflow-hidden rounded-full border border-slate-200 bg-slate-100">
        {leader.image ? (
          <img src={leader.image} alt={leader.name} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm font-semibold text-slate-700">{initials}</div>
        )}
      </div>
      <div>
        <div className="font-semibold leading-tight">{leader.name}</div>
        <div className="text-sm text-slate-600">{leader.role}</div>
        <div className="mt-2 text-sm text-slate-600">{leader.credentials}</div>
      </div>
    </div>
  );
}

/* ------------------------------ Inline SVGs ----------------------------- */
function TrophyIcon({ className = "h-5 w-5" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className={className}>
      <path strokeWidth="2" d="M8 21h8M12 17a5 5 0 005-5V4H7v8a5 5 0 005 5z"/>
      <path strokeWidth="2" d="M7 6H4a3 3 0 003 3m10-3h3a3 3 0 01-3 3"/>
    </svg>
  );
}
function UsersIcon({ className = "h-5 w-5" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className={className}>
      <path strokeWidth="2" d="M16 11c1.657 0 3-1.79 3-4s-1.343-4-3-4-3 1.79-3 4 1.343 4 3 4zM8 13c1.657 0 3-1.79 3-4S9.657 5 8 5 5 6.79 5 9s1.343 4 3 4z"/>
      <path strokeWidth="2" d="M6 22v-2a4 4 0 014-4h4a4 4 0 014 4v2"/>
    </svg>
  );
}
function PillIcon({ className = "h-5 w-5" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className={className}>
      <rect x="3" y="8" width="10" height="8" rx="4" strokeWidth="2"/>
      <rect x="11" y="8" width="10" height="8" rx="4" strokeWidth="2"/>
      <path strokeWidth="2" d="M8 8v8"/>
    </svg>
  );
}
function GlobeIcon({ className = "h-5 w-5" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className={className}>
      <circle cx="12" cy="12" r="9" strokeWidth="2"/>
      <path strokeWidth="2" d="M3 12h18M12 3a15 15 0 010 18M12 3a15 15 0 000 18"/>
    </svg>
  );
}
function CheckIcon({ className = "h-5 w-5" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className={className}>
      <path strokeWidth="2" d="M20 6L9 17l-5-5"/>
    </svg>
  );
}
function FlaskIcon({ className = "h-5 w-5" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className={className}>
      <path strokeWidth="2" d="M10 2v5l-5 8a4 4 0 003.4 6h7.2A4 4 0 0019 15l-5-8V2"/>
    </svg>
  );
}
