"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, StarHalf, Heart, MessageCircle } from "lucide-react";

// WhatsApp number: country code + number, bina "+"
const WHATSAPP_NUMBER = "919999999999";

const TAGS = ["all", "bestseller", "latest", "deals"];

function Stars({ rating }) {
  const full = Math.floor(rating);
  const frac = rating - full;
  const half = frac >= 0.25 && frac < 0.75;
  const empty = 5 - full - (half ? 1 : 0);
  return (
    <div className="flex items-center gap-0.5 text-yellow-500">
      {Array.from({ length: full }).map((_, i) => (
        <Star key={`f${i}`} className="h-4 w-4 fill-yellow-400" />
      ))}
      {half && <StarHalf className="h-4 w-4 fill-yellow-400" />}
      {Array.from({ length: empty }).map((_, i) => (
        <Star key={`e${i}`} className="h-4 w-4 text-slate-300" />
      ))}
    </div>
  );
}

function Price({ price, mrp }) {
  const off = mrp > price ? Math.round(((mrp - price) / mrp) * 100) : 0;
  return (
    <div className="flex items-baseline gap-2">
      <span className="text-base font-semibold text-slate-900">₹{price}</span>
      {mrp > price && (
        <>
          <span className="text-sm text-slate-400 line-through">₹{mrp}</span>
          <span className="text-xs font-semibold text-green-600">{off}% off</span>
        </>
      )}
    </div>
  );
}

function CardSkeleton() {
  return (
    <li className="animate-pulse rounded-2xl border border-sky-100 bg-white p-3">
      <div className="relative overflow-hidden rounded-xl border border-sky-100 bg-slate-100">
        <div className="aspect-square" />
      </div>
      <div className="mt-3 space-y-2">
        <div className="h-4 w-2/3 rounded bg-slate-200" />
        <div className="h-3 w-24 rounded bg-slate-200" />
        <div className="h-4 w-32 rounded bg-slate-200" />
      </div>
      <div className="mt-3 flex gap-2">
        <div className="h-9 flex-1 rounded bg-slate-200" />
        <div className="h-9 w-9 rounded bg-slate-200" />
      </div>
    </li>
  );
}

function ProductCard({ p, onWishlist }) {
  const waText = encodeURIComponent(
    `Hello! I want to enquire about:\n• Product: ${p.name}\n• Slug: ${p.slug}\n• Price: ₹${p.price}\nPlease share availability, delivery, and best offer.`
  );
  const waHref = `https://wa.me/${WHATSAPP_NUMBER}?text=${waText}`;

  return (
    <li className="group rounded-2xl border border-sky-100 bg-white p-3 shadow-sm transition hover:shadow-md">
      <Link href={`/product/${p.slug}`} className="block">
        <div className="relative overflow-hidden rounded-xl border border-sky-100">
          <div className="relative aspect-square p-3 bg-white">
            <Image
              src={p.img}
              alt={p.name}
              fill
              sizes="(max-width: 1024px) 50vw, 25vw"
              className="object-contain transition-transform duration-300 group-hover:scale-[1.03]"
              priority={false}
            />
            {p.badge && (
              <span className="absolute left-3 top-3 rounded-full border border-sky-200 bg-sky-600/90 px-2 py-0.5 text-[11px] font-semibold text-white">
                {p.badge}
              </span>
            )}
          </div>
        </div>
        <div className="mt-3 space-y-1">
          <h3 className="line-clamp-2 text-sm font-semibold text-slate-900">{p.name}</h3>
          <div className="flex items-center gap-2">
            <Stars rating={p.rating} />
            <span className="text-xs text-slate-500">({p.reviews})</span>
          </div>
          <Price price={p.price} mrp={p.mrp} />
        </div>
      </Link>

      <div className="mt-3 flex items-center gap-2">
        {/* Enquiry replaces Add to cart */}
        <a
          href={waHref}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-emerald-600 px-3 py-2 text-sm font-medium text-white hover:bg-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300"
        >
          <MessageCircle className="h-4 w-4" />
          Enquire on WhatsApp
        </a>

        <button
          aria-label="Add to wishlist"
          className="inline-flex items-center justify-center rounded-lg border border-sky-200 bg-white p-2 text-sky-700 hover:bg-sky-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300"
          onClick={(e) => {
            e.preventDefault();
            onWishlist?.(p);
          }}
        >
          <Heart className="h-4 w-4" />
        </button>
      </div>
    </li>
  );
}

export default function Bestseller() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({ products: [] });
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("All");
  const [tag, setTag] = useState("all"); // all | bestseller | latest | deals
  const [sort, setSort] = useState("popular"); // popular | price_asc | price_desc | rating

  useEffect(() => {
    let alive = true;
    fetch("/data/products.json")
      .then((r) => r.json())
      .then((json) => {
        if (!alive) return;
        setData(json);
        setLoading(false);
      })
      .catch(() => setLoading(false));
    return () => {
      alive = false;
    };
  }, []);

  const categories = useMemo(
    () => ["All", ...Array.from(new Set(data.products.map((p) => p.category)))],
    [data]
  );

  const filtered = useMemo(() => {
    let list = [...data.products];

    if (tag !== "all") {
      list = list.filter((p) => Array.isArray(p.tags) && p.tags.includes(tag));
    }

    list = list.filter((p) => cat === "All" || p.category === cat);

    if (q.trim()) {
      const needle = q.toLowerCase();
      list = list.filter(
        (p) => p.name.toLowerCase().includes(needle) || p.slug.toLowerCase().includes(needle)
      );
    }

    if (sort === "price_asc") list.sort((a, b) => a.price - b.price);
    if (sort === "price_desc") list.sort((a, b) => b.price - a.price);
    if (sort === "rating") list.sort((a, b) => b.rating - a.rating);
    if (sort === "popular") list.sort((a, b) => b.reviews - a.reviews);

    return list;
  }, [data, q, cat, tag, sort]);

  const onWishlist = (p) => console.log("Wishlist:", p.id);

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-sky-600">Bestselling Products</h2>
          <p className="text-sm text-slate-600">Trustworthy picks. Minimal drama.</p>
        </div>

        {/* Controls */}
        <div className="flex flex-col items-stretch gap-2 sm:flex-row sm:items-center">
          <div className="flex gap-2">
            <select
              value={cat}
              onChange={(e) => setCat(e.target.value)}
              className="rounded-lg border border-sky-200 bg-white px-3 py-2 text-sm text-slate-800 focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>

            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="rounded-lg border border-sky-200 bg-white px-3 py-2 text-sm text-slate-800 focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
            >
              <option value="popular">Sort: Popular</option>
              <option value="rating">Sort: Rating</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
          </div>

          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search bestsellers…"
            className="rounded-lg border border-sky-200 bg-white px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
          />
        </div>
      </div>

      {/* Tag tabs */}
      <div className="mb-6 flex flex-wrap items-center gap-2">
        {TAGS.map((t) => (
          <button
            key={t}
            onClick={() => setTag(t)}
            className={`rounded-full border px-3 py-1.5 text-sm transition ${
              tag === t
                ? "border-sky-300 bg-sky-600 text-white"
                : "border-sky-200 bg-white text-slate-800 hover:bg-sky-50"
            }`}
          >
            {t === "all" ? "All" : t[0].toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {/* Grid or skeletons */}
      {loading ? (
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </ul>
      ) : filtered.length > 0 ? (
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {filtered.map((p) => (
            <ProductCard key={p.id} p={p} onWishlist={onWishlist} />
          ))}
        </ul>
      ) : (
        <div className="rounded-2xl border border-sky-100 bg-white p-8 text-center text-slate-600">
          Nothing matches your filters. Try fewer constraints.
        </div>
      )}
    </section>
  );
}
