"use client";

import Image from "next/image";
import Link from "next/link";

// swap these with your real categories
const CATEGORIES = [
  { name: "Antibiotics", slug: "pain-relief", img: "/images/antibiotics.png" },
  { name: "Diabeties", slug: "cough-cold", img: "/images/diabeties.png" },
  { name: "ED", slug: "digestive", img: "/images/ed.png" },
  { name: "AntiCancer", slug: "diabetes", img: "/images/anticancer.png" },
  { name: "Deaddiction", slug: "cardiac", img: "/images/deaddiction.png" },
  { name: "Painkiller", slug: "derma", img: "/images/painkiller.png" },
  { name: "Hearthealth", slug: "vitamins", img: "/images/hearthealth.png" },
  { name: "Skin", slug: "ayurveda", img: "/images/skin.png" },
  { name: "Sleep", slug: "women", img: "/images/sleep.png" },
  { name: "Steroids", slug: "baby", img: "/images/steroids.png" },
  { name: "Thyroid", slug: "elderly", img: "/images/thyroid.png" },
  { name: "Weighgtloss", slug: "devices", img: "/images/weightloss.png" },
];

export default function CategoriesGrid({ categories = CATEGORIES, title = "Shop by Category" }) {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6 flex items-end justify-between">
        <h2 className="text-2xl font-bold tracking-tight text-blue-500 uppercase">{title}</h2>
        {/* optional: view all link */}
        <Link
          href="/categories"
          className="text-sm font-medium text-blue-700 hover:text-blue-900"
        >
          View all
        </Link>
      </div>

      <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {categories.map((cat) => (
          <li key={cat.slug}>
            <Link
              href={`/category/${cat.slug}`}
              className="group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 rounded-xl"
            >
              <div className="relative overflow-hidden rounded-xl border border-blue-100 bg-white">
                {/* aspect ratio 1:1 */}
                <div className="relative aspect-square">
                  <Image
                    src={cat.img}
                    alt={cat.name}
                    fill
                    sizes="(max-width: 1024px) 33vw, 16vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    priority={false}
                  />
                </div>
              </div>
              <div className="mt-2 text-center">
                <p className="text-sm font-semibold text-slate-800">{cat.name}</p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
