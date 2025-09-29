import React from "react";
import {
  ShieldCheck,
  FlaskConical,
  Factory,
  Globe2,
  Leaf,
  HeartPulse,
  Microscope,
  Truck,
  BadgeCheck
} from "lucide-react";

export default function WhyChooseUs() {
  const points = [
    {
      title: "WHO-GMP Compliant",
      desc: "Manufacturing aligned with WHO-GMP and audited SOPs at every stage.",
      Icon: ShieldCheck,
    },
    {
      title: "Rigorous R&D",
      desc: "Pre-formulation to stability studies under validated protocols.",
      Icon: FlaskConical,
    },
    {
      title: "Quality First",
      desc: "In-process controls, QC/QA sign-offs, and batch-wise traceability.",
      Icon: BadgeCheck,
    },
    {
      title: "Modern Facilities",
      desc: "Automated lines, HVAC, cleanrooms, and data-logged environments.",
      Icon: Factory,
    },
    {
      title: "Global Reach",
      desc: "Regulatory experience across 15+ countries with on-time dossiers.",
      Icon: Globe2,
    },
    {
      title: "Patient-centric",
      desc: "Dosage forms designed for adherence, safety, and real-world use.",
      Icon: HeartPulse,
    },
    {
      title: "Evidence-driven",
      desc: "Analytical methods validated to ICH guidelines, peer-reviewed.",
      Icon: Microscope,
    },
    {
      title: "Reliable Supply",
      desc: "Cold chain, GDP logistics, and buffer inventory for continuity.",
      Icon: Truck,
    },
    {
      title: "Sustainability",
      desc: "Green chemistry initiatives and responsible waste management.",
      Icon: Leaf,
    },
  ];

  return (
    <section className="bg-gradient-to-b from-blue-50 to-white">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
            Why choose PharmaCare
          </span>
          <h2 className="mt-4 text-2xl md:text-3xl font-extrabold tracking-tight text-blue-900 sm:text-4xl">
            Built for safety, efficacy, and trust
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-slate-600">
            From R&amp;D to last-mile delivery, we keep quality measurable and outcomes accountable.
          </p>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {points.map((item, i) => (
            <FeatureCard key={i} Icon={item.Icon} title={item.title} desc={item.desc} />
          ))}
        </div>
      </div>
    </section>
  );
}

function FeatureCard({ Icon, title, desc }) {
  return (
    <div className="group rounded-2xl border border-blue-100 bg-white p-6 shadow-sm transition hover:border-blue-200 hover:shadow-md">
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
          <Icon className="h-6 w-6" aria-hidden="true" />
        </div>
        <div>
          <h3 className="text-base font-semibold text-blue-900">{title}</h3>
          <p className="mt-1 text-sm leading-relaxed text-slate-600">{desc}</p>
        </div>
      </div>
    </div>
  );
}
