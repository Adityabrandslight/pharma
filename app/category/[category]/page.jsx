"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter, useParams } from "next/navigation";
import { ShoppingBag, Package, Shield, Clock } from "lucide-react";
import { ToastNotification } from "@/components/Toatnotification";

export default function CategoryPage() {
  const { category } = useParams();
  const router = useRouter();

  const [products, setProducts] = useState([]);
  const [toastMessage, setToastMessage] = useState("");

  // Fetch products
  useEffect(() => {
    fetch("/data/products.json")
      .then((res) => res.json())
      .then((data) => {
        const filtered = data.products.filter(
          (p) => p.category.toLowerCase().replace(/ & /g, "-") === category
        );
        setProducts(filtered);
      });
  }, [category]);

  // Add to Cart
  const addToCart = (product) => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const existingItem = cart.find((item) => item.slug === product.slug);

    if (existingItem) {
      existingItem.qty = (existingItem.qty || 1) + 1;
    } else {
      cart.push({ ...product, qty: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("cart-updated"));

    setToastMessage(`${product.name} added to cart!`);
    setTimeout(() => setToastMessage(""), 4000);
  };

  // Buy Now
  const buyNow = (product) => {
    addToCart(product);
    router.push(`/checkout/${product.slug}`);
  };

  if (!products.length)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="text-center">
          <Package className="w-16 h-16 mx-auto text-slate-300 mb-4" />
          <p className="text-slate-600 text-lg font-medium">No products found in this category.</p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50">
      {/* Header Section */}
      <div className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-1 w-12 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full"></div>
            <span className="text-sm font-semibold text-blue-600 uppercase tracking-wider">Category</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 capitalize mb-4">
            {category.replace("-", " & ")}
          </h1>
          <p className="text-slate-600 max-w-2xl">
            Browse our curated selection of quality pharmaceutical products with verified authenticity and fast delivery.
          </p>
        </div>
      </div>

      {/* Trust Indicators */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-lg px-4 py-3 flex items-center gap-3 border border-slate-200">
            <Shield className="w-5 h-5 text-blue-600 flex-shrink-0" />
            <span className="text-xs md:text-sm font-medium text-slate-700">100% Authentic</span>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-lg px-4 py-3 flex items-center gap-3 border border-slate-200">
            <Clock className="w-5 h-5 text-blue-600 flex-shrink-0" />
            <span className="text-xs md:text-sm font-medium text-slate-700">Fast Delivery</span>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-lg px-4 py-3 flex items-center gap-3 border border-slate-200">
            <Package className="w-5 h-5 text-blue-600 flex-shrink-0" />
            <span className="text-xs md:text-sm font-medium text-slate-700">Secure Packaging</span>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => {
            const discount = product.mrp > product.price ? Math.round(((product.mrp - product.price) / product.mrp) * 100) : 0;

            return (
              <div
                key={product.slug}
                className="group bg-white rounded-2xl border-2 border-slate-200 hover:border-blue-300 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden cursor-pointer relative"
                onClick={() => router.push(`/product/${product.slug}`)}
              >
                {/* Discount Badge */}
                {discount > 0 && (
                  <div className="absolute top-3 right-3 z-10 bg-gradient-to-r from-emerald-500 to-green-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                    {discount}% OFF
                  </div>
                )}

                {/* Product Image */}
                <div className="relative aspect-[4/3] bg-gradient-to-br from-slate-50 to-blue-50 p-6 group-hover:scale-[1.02] transition-transform duration-300">
                  <Image
                    src={product.img}
                    alt={product.name}
                    fill
                    className="object-contain"
                  />
                </div>

                {/* Product Info */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h2 className="text-base font-bold text-slate-900 line-clamp-2 mb-3 group-hover:text-blue-600 transition-colors">
                      {product.name}
                    </h2>
                    
                    {/* Price Section */}
                    <div className="flex items-baseline gap-2 mb-1">
                      <span className="text-2xl font-bold text-slate-900">₹{product.price}</span>
                      {discount > 0 && (
                        <span className="text-slate-400 line-through text-sm font-medium">₹{product.mrp}</span>
                      )}
                    </div>
                    {discount > 0 && (
                      <p className="text-xs text-emerald-600 font-semibold">
                        You save ₹{product.mrp - product.price}
                      </p>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div
                    className="mt-5 flex gap-2"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      onClick={() => addToCart(product)}
                      className="flex-1 flex items-center justify-center gap-2 bg-white border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white font-semibold py-2.5 rounded-xl transition-all duration-200 group/btn"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      <span className="text-sm">Add</span>
                    </button>
                    <button
                      onClick={() => buyNow(product)}
                      className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold py-2.5 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg text-sm"
                    >
                      Buy Now
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Info Banner */}
        <div className="mt-12 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl p-6 text-center text-white">
          <h3 className="text-xl font-bold mb-2">Need Help Finding the Right Product?</h3>
          <p className="text-blue-100 mb-4">Our pharmaceutical experts are here to assist you</p>
          <button className="bg-white text-blue-600 font-semibold px-6 py-2.5 rounded-lg hover:bg-blue-50 transition-colors">
            Contact Support
          </button>
        </div>
      </div>

      <ToastNotification message={toastMessage} />
    </div>
  );
}