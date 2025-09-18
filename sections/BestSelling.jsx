"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Star, StarHalf, ShoppingCart, Heart } from "lucide-react";

const PRODUCTS = [
  {
    id: "paracetamol-650",
    name: "Paracetamol 650 mg",
    img: "/images/imageone.JPG",
    price: 89,
    mrp: 120,
    rating: 4.6,
    reviews: 1432,
    badge: "Bestseller",
    category: "Pain Relief",
  },
  {
    id: "vitamin-c-1000",
    name: "Vitamin C 1000 mg",
    img: "/images/imagetwo.JPG",
    price: 349,
    mrp: 499,
    rating: 4.7,
    reviews: 980,
    badge: "Top Rated",
    category: "Vitamins",
  },
  {
    id: "d3-calcium",
    name: "Vitamin D3 + Calcium",
    img: "/images/imagethree.JPG",
    price: 299,
    mrp: 420,
    rating: 4.5,
    reviews: 764,
    badge: "Bestseller",
    category: "Vitamins",
  },
  {
    id: "bp-monitor",
    name: "Digital BP Monitor",
    img: "/images/imagefour.JPG",
    price: 1799,
    mrp: 2499,
    rating: 4.4,
    reviews: 312,
    badge: "Hot",
    category: "Devices",
  },
  {
    id: "cough-syrup",
    name: "Herbal Cough Syrup",
    img: "/images/imagefive.JPG",
    price: 159,
    mrp: 210,
    rating: 4.2,
    reviews: 540,
    badge: "Trending",
    category: "Cough & Cold",
  },
  {
    id: "glucose-meter",
    name: "Glucose Meter Kit",
    img: "/images/imagesix.JPG",
    price: 1299,
    mrp: 1899,
    rating: 4.6,
    reviews: 451,
    badge: "Bestseller",
    category: "Diabetes",
  },
  {
    id: "probiotic",
    name: "Daily Probiotic",
    img: "/images/imageseven.JPG",
    price: 399,
    mrp: 520,
    rating: 4.3,
    reviews: 220,
    badge: "Popular",
    category: "Digestive Health",
  },
  {
    id: "sunscreen-50",
    name: "Sunscreen SPF 50",
    img: "/images/imageeight.JPG",
    price: 449,
    mrp: 599,
    rating: 4.5,
    reviews: 870,
    badge: "Derm Pick",
    category: "Skin Care",
  },
  {
    id: "omega3",
    name: "Omega-3 Fish Oil",
    img: "/images/imagetwo.JPG",
    price: 599,
    mrp: 799,
    rating: 4.4,
    reviews: 390,
    badge: "Heart Care",
    category: "Heart Care",
  },
  {
    id: "nebulizer",
    name: "Portable Nebulizer",
    img: "/images/imagefive.JPG",
    price: 1699,
    mrp: 2399,
    rating: 4.1,
    reviews: 180,
    badge: "Hot",
    category: "Devices",
  },
  {
    id: "ayur-ashwagandha",
    name: "Ayurvedic Ashwagandha",
    img: "/images/imageone.JPG",
    price: 299,
    mrp: 399,
    rating: 4.6,
    reviews: 650,
    badge: "Ayurveda",
    category: "Ayurveda",
  },
  {
    id: "iron-folic",
    name: "Iron + Folic Acid",
    img: "/images/imagefour.JPG",
    price: 249,
    mrp: 329,
    rating: 4.3,
    reviews: 415,
    badge: "Women’s Health",
    category: "Women’s Health",
  },
];

const CATEGORIES = ["All", ...Array.from(new Set(PRODUCTS.map(p => p.category)))];

function Stars({ rating }) {
  // Cute little star renderer without 3rd-party junk
  const full = Math.floor(rating);
  const half = rating - full >= 0.25 && rating - full < 0.75; // mid rounding
  const empty = 5 - full - (half ? 1 : 0);
  return (
    <div className="flex items-center gap-0.5 text-yellow-500">
      {Array.from({ length: full }).map((_, i) => <Star key={`f${i}`} className="h-4 w-4 fill-yellow-400" />)}
      {half && <StarHalf className="h-4 w-4 fill-yellow-400" />}
      {Array.from({ length: empty }).map((_, i) => <Star key={`e${i}`} className="h-4 w-4 text-slate-300" />)}
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

function ProductCard({ p }) {
  return (
    <li className="group rounded-2xl border border-blue-100 bg-white p-3 shadow-sm transition hover:shadow-md">
      <Link href={`/product/${p.id}`} className="block">
        <div className="relative overflow-hidden rounded-xl border border-blue-100">
          <div className="relative aspect-[4/3]">
            <Image
              src={p.img}
              alt={p.name}
              fill
              sizes="(max-width: 1024px) 50vw, 25vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              priority={false}
            />
           {/*  {p.badge && (
              <span className="absolute left-2 top-2 rounded-full bg-blue-500/90 px-2 py-1 text-[11px] font-semibold text-white">
                {p.badge}
              </span>
            )} */}
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
        <button
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-blue-500 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300"
          onClick={(e) => {
            e.preventDefault();
            // plug into your cart logic here
            console.log("Add to cart:", p.id);
          }}
        >
          <ShoppingCart className="h-4 w-4" />
          Add to cart
        </button>
        <button
          aria-label="Add to wishlist"
          className="inline-flex items-center justify-center rounded-lg border border-blue-200 bg-white p-2 text-blue-700 hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300"
          onClick={(e) => {
            e.preventDefault();
            console.log("Wishlist:", p.id);
          }}
        >
          <Heart className="h-4 w-4" />
        </button>
      </div>
    </li>
  );
}

export default function Bestseller() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("All");
  const [sort, setSort] = useState("popular"); // popular | price_asc | price_desc | rating

  const filtered = useMemo(() => {
    let list = PRODUCTS.filter(p =>
      (cat === "All" || p.category === cat) &&
      p.name.toLowerCase().includes(q.toLowerCase())
    );

    if (sort === "price_asc") list.sort((a, b) => a.price - b.price);
    if (sort === "price_desc") list.sort((a, b) => b.price - a.price);
    if (sort === "rating") list.sort((a, b) => b.rating - a.rating);
    // "popular" can just use reviews desc
    if (sort === "popular") list.sort((a, b) => b.reviews - a.reviews);

    return list;
  }, [q, cat, sort]);

  return (
    <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-blue-500">Bestselling Products</h1>
          <p className="text-sm text-slate-600">Trusted picks your customers keep re-ordering. Sensible, unlike most roadmaps.</p>
        </div>

        {/* Controls */}
        <div className="flex flex-col items-stretch gap-2 sm:flex-row sm:items-center">
          <div className="flex gap-2">
            <select
              value={cat}
              onChange={(e) => setCat(e.target.value)}
              className="rounded-lg border border-blue-200 bg-white px-3 py-2 text-sm text-slate-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="rounded-lg border border-blue-200 bg-white px-3 py-2 text-sm text-slate-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
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
            className="rounded-lg border border-blue-200 bg-white px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          />
        </div>
      </div>

      {/* Grid */}
      <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {filtered.map((p) => (
          <ProductCard key={p.id} p={p} />
        ))}
      </ul>

      {/* Empty state */}
      {filtered.length === 0 && (
        <div className="mt-20 rounded-2xl border border-blue-100 bg-white p-8 text-center text-slate-600">
          Nothing matches your filters. Try fewer constraints, like every product page ever made.
        </div>
      )}
    </main>
  );
}
