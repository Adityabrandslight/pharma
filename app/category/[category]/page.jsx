"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter, useParams } from "next/navigation";
import { ShoppingBag, Package, Shield, Clock } from "lucide-react";
import { ToastNotification } from "@/components/Toatnotification";

// Robust slugify
const toSlug = (s = "") =>
  s
    .toString()
    .toLowerCase()
    .replace(/\bweight\s+loss\b/g, "weightloss")
    .replace(/&/g, "-")
    .replace(/\bhealth\b/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

const stripWeak = (s = "") => s.replace(/-/g, "");

export default function CategoryPage() {
  const { category } = useParams();
  const router = useRouter();

  const [products, setProducts] = useState([]);
  const [toastMessage, setToastMessage] = useState("");
  const [selectedTiers, setSelectedTiers] = useState({}); // Track selected tier per product

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("/data/products.json");
      const data = await res.json();

      const catSlug = String(category || "").toLowerCase();
      const catLoose = stripWeak(catSlug);

      const filtered = (data?.products || []).filter((p) => {
        const pSlug = toSlug(p.category || "");
        const pLoose = stripWeak(pSlug);

        return (
          pSlug === catSlug ||
          pSlug.includes(catSlug) ||
          catSlug.includes(pSlug) ||
          pLoose === catLoose ||
          pLoose.includes(catLoose) ||
          catLoose.includes(pLoose)
        );
      });

      setProducts(filtered);

      // default tier = first option
      const initialTiers = {};
      filtered.forEach((p) => {
        initialTiers[p.slug] = p.pricing?.[0] || { quantity: "Default", price: p.price, mrp: p.mrp };
      });
      setSelectedTiers(initialTiers);
    };

    fetchData();
  }, [category]);

  // 🛒 Add to cart with selected tier
  const addToCart = (product) => {
    const tier = selectedTiers[product.slug] || product.pricing?.[0] || {};
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");

    const existingItem = cart.find(
      (item) =>
        item.slug === product.slug &&
        item.selectedTier?.quantity === tier.quantity
    );

    if (existingItem) existingItem.qty = (existingItem.qty || 1) + 1;
    else cart.push({ ...product, qty: 1, selectedTier: tier });

    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("cart-updated"));

    setToastMessage(`${product.name} (${tier.quantity}) added to cart!`);
    setTimeout(() => setToastMessage(""), 4000);
  };

  // ⚡ Buy Now
  const buyNow = (product) => {
    addToCart(product);
    router.push(`/checkout/${product.slug}`);
  };

  // Loading / No Products
  if (!products.length)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="text-center">
          <Package className="w-16 h-16 mx-auto text-slate-300 mb-4" />
          <p className="text-slate-600 text-lg font-medium">
            No products found in this category.
          </p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-1 w-12 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full"></div>
            <span className="text-sm font-semibold text-blue-600 uppercase tracking-wider">
              Category
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 capitalize mb-4">
            {(category || "").replaceAll("-", " ")}
          </h1>
          <p className="text-slate-600 max-w-2xl">
            Browse our curated selection of quality pharmaceutical products with verified authenticity and fast delivery.
          </p>
        </div>
      </div>

      {/* Trust Indicators */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { icon: Shield, text: "100% Authentic" },
            { icon: Clock, text: "Fast Delivery" },
            { icon: Package, text: "Secure Packaging" },
          ].map(({ icon: Icon, text }, i) => (
            <div
              key={i}
              className="bg-white/80 backdrop-blur-sm rounded-lg px-4 py-3 flex items-center gap-3 border border-slate-200"
            >
              <Icon className="w-5 h-5 text-blue-600" />
              <span className="text-xs md:text-sm font-medium text-slate-700">
                {text}
              </span>
            </div>
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => {
            const tier = selectedTiers[product.slug] || {};
            const price = tier.price || product.price;
            const mrp = tier.mrp || product.mrp;
            const discount =
              mrp > price ? Math.round(((mrp - price) / mrp) * 100) : 0;

            return (
              <div
                key={product.slug}
                className="group bg-white rounded-2xl border-2 border-slate-200 hover:border-blue-300 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden cursor-pointer relative"
                onClick={() => router.push(`/product/${product.slug}`)}
              >
                {discount > 0 && (
                  <div className="absolute top-3 right-3 z-10 bg-gradient-to-r from-emerald-500 to-green-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                    {discount}% OFF
                  </div>
                )}

                {/* Product Image */}
                <div className="relative aspect-[4/3] bg-white p-6 group-hover:scale-[1.02] transition-transform duration-300">
                  <Image
                    src={product.img}
                    alt={product.name}
                    fill
                    className="object-contain"
                  />
                </div>

                {/* Product Details */}
                <div
                  className="p-5 flex-1 flex flex-col justify-between bg-gray-100"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div>
                    <h2 className="text-base font-bold text-slate-900 line-clamp-2 mb-3 group-hover:text-sky-600 transition-colors">
                      {product.name}
                    </h2>

                    {/* Price */}
                    <div className="flex items-baseline gap-2 mb-1">
                      <span className="text-2xl font-semibold text-slate-900">
                        ${price.toLocaleString()}
                      </span>
                      {discount > 0 && (
                        <span className="text-slate-400 line-through text-sm font-medium">
                          ${mrp.toLocaleString()}
                        </span>
                      )}
                    </div>
                    {discount > 0 && (
                      <p className="text-xs text-emerald-600 font-semibold">
                        You save ${(mrp - price).toLocaleString()}
                      </p>
                    )}

                    {/* Pricing Options */}
                    {product.pricing?.length > 1 && (
                      <select
                        value={tier.quantity}
                        onChange={(e) =>
                          setSelectedTiers((prev) => ({
                            ...prev,
                            [product.slug]: product.pricing.find(
                              (p) =>
                                String(p.quantity) === e.target.value
                            ),
                          }))
                        }
                        className="mt-3 w-full border border-slate-300 rounded-md text-sm px-3 py-2 font-medium text-gray-700 hover:border-sky-400 focus:ring-2 focus:ring-sky-200 focus:border-sky-500 transition-all"
                      >
                        {product.pricing.map((p, idx) => (
                          <option key={idx} value={p.quantity}>
                            {p.quantity} — ${p.price.toLocaleString()}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-5 flex gap-2">
                    <button
                      onClick={() => addToCart(product)}
                      className="flex-1 flex items-center justify-center gap-2 bg-white border-2 border-sky-600 text-sky-600 hover:bg-blue-600 hover:text-white font-semibold py-2.5 rounded-md transition-all duration-200"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      <span className="text-sm">Add</span>
                    </button>
                    <button
                      onClick={() => buyNow(product)}
                      className="flex-1 bg-sky-600 hover:bg-sky-700 text-white font-semibold py-2.5 rounded-md transition-all duration-200 shadow-md text-sm"
                    >
                      Buy Now
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Support Section */}
        <div className="mt-12 bg-sky-600 rounded-2xl p-6 text-center text-white">
          <h3 className="text-xl font-bold mb-2">
            Need Help Finding the Right Product?
          </h3>
          <p className="text-blue-100 mb-4">
            Our pharmaceutical experts are here to assist you
          </p>
          <button className="bg-white text-sky-600 font-semibold px-6 py-2.5 rounded-lg hover:bg-blue-50 transition-colors">
            Contact Support
          </button>
        </div>
      </div>

      <ToastNotification message={toastMessage} />
    </div>
  );
}
