"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Minus, Plus, X, ShoppingBag, ArrowRight } from "lucide-react";

export default function CartPage() {
  const [cart, setCart] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load cart from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("cart");
    if (saved) setCart(JSON.parse(saved));
    setIsLoading(false);
  }, []);

  // Save cart whenever it changes
  const updateCart = (newCart) => {
    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
  };

  const removeItem = (id) => {
    updateCart(cart.filter((item) => item.id !== id));
  };

  const increaseQty = (id) => {
    const newCart = cart.map((item) =>
      item.id === id ? { ...item, qty: (item.qty || 1) + 1 } : item
    );
    updateCart(newCart);
  };

  const decreaseQty = (id) => {
    const newCart = cart.map((item) =>
      item.id === id && item.qty > 1 ? { ...item, qty: item.qty - 1 } : item
    );
    updateCart(newCart);
  };

  const total = cart.reduce(
    (acc, item) => acc + item.price * (item.qty || 1),
    0
  );

  const itemCount = cart.reduce((acc, item) => acc + (item.qty || 1), 0);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-2 border-neutral-200 border-t-neutral-800 rounded-full animate-spin mx-auto"></div>
          <p className="text-neutral-600 text-sm font-medium">Loading your cart...</p>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-neutral-50">
        <div className="max-w-2xl mx-auto px-6 py-16">
          <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 p-12">
            <div className="text-center space-y-6">
              <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto">
                <ShoppingBag className="h-8 w-8 text-neutral-400" />
              </div>
              <div>
                <h1 className="text-2xl font-semibold text-neutral-900 mb-2">Your cart is empty</h1>
                <p className="text-neutral-500">Discover our products and add them to your cart</p>
              </div>
              <Link
                href="/"
                className="inline-flex items-center gap-2 bg-neutral-900 text-white px-6 py-3 rounded-lg font-medium hover:bg-neutral-800 transition-colors"
              >
                Start Shopping
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Create a slug string with all the product slugs in the cart
  const slugs = cart.map((item) => item.slug).join(",").trim();

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-2xl font-semibold text-neutral-900">Shopping Cart</h1>
            <Link
              href="/"
              className="text-sm text-neutral-600 hover:text-neutral-900 transition-colors font-medium"
            >
              Continue Shopping
            </Link>
          </div>
          <p className="text-neutral-500 text-sm">
            {itemCount} {itemCount === 1 ? 'item' : 'items'} in your cart
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-lg shadow-sm border border-neutral-100 p-6"
              >
                <div className="flex items-center gap-4">
                  {/* Product Image */}
                  <div className="w-20 h-20 bg-neutral-50 rounded-lg overflow-hidden flex-shrink-0">
                    <Image
                      src={item.img}
                      alt={item.name}
                      width={80}
                      height={80}
                      className="w-full h-full object-contain"
                    />
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-neutral-900 text-sm mb-1 line-clamp-2">
                      {item.name}
                    </h3>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="font-semibold text-neutral-900">
                        ₹{item.price.toLocaleString()}
                      </span>
                      {item.mrp && item.mrp > item.price && (
                        <span className="text-sm text-neutral-400 line-through">
                          ₹{item.mrp.toLocaleString()}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      {/* Quantity Controls */}
                      <div className="flex items-center border border-neutral-200 rounded-lg">
                        <button
                          onClick={() => decreaseQty(item.id)}
                          disabled={item.qty <= 1}
                          className="p-2 hover:bg-neutral-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed rounded-l-lg"
                        >
                          <Minus className="h-3 w-3 text-neutral-600" />
                        </button>
                        <span className="px-3 py-2 text-sm font-medium text-neutral-900 min-w-8 text-center">
                          {item.qty || 1}
                        </span>
                        <button
                          onClick={() => increaseQty(item.id)}
                          className="p-2 hover:bg-neutral-50 transition-colors rounded-r-lg"
                        >
                          <Plus className="h-3 w-3 text-neutral-600" />
                        </button>
                      </div>

                      {/* Item Total & Remove */}
                      <div className="flex items-center gap-3">
                        <span className="font-semibold text-neutral-900 text-sm">
                          ₹{(item.price * (item.qty || 1)).toLocaleString()}
                        </span>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="p-1 text-neutral-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                          title="Remove item"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-neutral-100 p-6 sticky top-8">
              <h2 className="text-lg font-semibold text-neutral-900 mb-4">Order Summary</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-600">Subtotal ({itemCount} items)</span>
                  <span className="font-medium text-neutral-900">
                    ₹{total.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-600">Shipping</span>
                  <span className="font-medium text-emerald-600">Free</span>
                </div>
                <div className="border-t border-neutral-100 pt-3 flex justify-between">
                  <span className="font-semibold text-neutral-900">Total</span>
                  <span className="text-lg font-bold text-neutral-900">
                    ₹{total.toLocaleString()}
                  </span>
                </div>
              </div>

              <Link
                href={`/checkout/${encodeURIComponent(slugs)}`}
                className="w-full bg-neutral-900 text-white py-3 px-4 rounded-lg font-medium hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2 text-sm"
              >
                Proceed to Checkout
                <ArrowRight className="h-4 w-4" />
              </Link>

              <p className="text-xs text-neutral-500 text-center mt-4">
                Shipping and taxes calculated at checkout
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}