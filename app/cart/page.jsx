"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Minus,
  Plus,
  X,
  ShoppingBag,
  ArrowRight,
  Trash2,
  ShoppingCart,
  Shield,
  Truck,
} from "lucide-react";

export default function CartPage() {
  const [cart, setCart] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load cart from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("cart");
    if (saved) setCart(JSON.parse(saved));
    setIsLoading(false);
  }, []);

  // Update cart in state + localStorage
  const updateCart = (newCart) => {
    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
    window.dispatchEvent(new Event("cart-updated"));
  };

  // Remove item
  const removeItem = (slug, tierQuantity) => {
    updateCart(
      cart.filter(
        (item) =>
          !(
            item.slug === slug &&
            item.selectedTier?.quantity === tierQuantity
          )
      )
    );
  };

  // Increase/decrease quantity
  const increaseQty = (slug, tierQuantity) => {
    const newCart = cart.map((item) =>
      item.slug === slug &&
      item.selectedTier?.quantity === tierQuantity
        ? { ...item, qty: Math.min((item.qty || 1) + 1, 10) }
        : item
    );
    updateCart(newCart);
  };

  const decreaseQty = (slug, tierQuantity) => {
    const newCart = cart.map((item) =>
      item.slug === slug &&
      item.selectedTier?.quantity === tierQuantity && item.qty > 1
        ? { ...item, qty: item.qty - 1 }
        : item
    );
    updateCart(newCart);
  };

  const clearCart = () => {
    if (confirm("Are you sure you want to clear your cart?")) updateCart([]);
  };

  // Calculations based on selected tier
  const subtotal = cart.reduce(
    (acc, item) =>
      acc +
      (item.selectedTier?.price || item.price) * (item.qty || 1),
    0
  );

  const savings = cart.reduce(
    (acc, item) =>
      acc +
      ((item.selectedTier?.mrp || item.mrp || 0) -
        (item.selectedTier?.price || item.price || 0)) *
        (item.qty || 1),
    0
  );

  const shipping = subtotal >= 999 ? 0 : 50;
  const total = subtotal + shipping;
  const itemCount = cart.reduce((acc, item) => acc + (item.qty || 1), 0);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-2 border-gray-300 border-t-sky-600 rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-600 font-medium">Loading your cart...</p>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center space-y-6 p-8 bg-gray-50 border rounded-lg">
          <ShoppingCart className="w-10 h-10 text-gray-400 mx-auto" />
          <h2 className="text-2xl font-bold">Your Cart is Empty</h2>
          <p className="text-gray-500">Add items to get started!</p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-sky-600 text-white px-6 py-3 rounded font-semibold hover:bg-sky-700 transition-colors shadow-lg shadow-sky-600/20"
          >
            <ShoppingBag className="w-5 h-5" />
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  const slugs = cart.map((item) => item.slug).join(",").trim();

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-black">Shopping Cart</h1>
            <p className="text-gray-600 text-sm">
              {itemCount} {itemCount === 1 ? "item" : "items"} in your cart
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/"
              className="px-5 py-2 border border-gray-300 text-gray-700 font-medium rounded hover:border-gray-400 hover:text-black transition-colors text-sm"
            >
              Continue Shopping
            </Link>
            {cart.length > 0 && (
              <button
                onClick={clearCart}
                className="px-5 py-2 text-red-600 hover:text-red-700 font-medium flex items-center gap-2 text-sm"
              >
                <Trash2 className="h-4 w-4" />
                Clear Cart
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Cart Content */}
      <div className="max-w-7xl mx-auto px-4 py-8 grid lg:grid-cols-3 gap-10">
        {/* Left: Cart Items */}
        <div className="lg:col-span-2 space-y-5">
          {cart.map((item) => {
            const tier = item.selectedTier || {};
            const price = tier.price || item.price;
            const mrp = tier.mrp || item.mrp || 0;
            const itemTotal = price * (item.qty || 1);
            const itemSavings =
              mrp > price ? (mrp - price) * (item.qty || 1) : 0;

            return (
              <div
                key={`${item.slug}-${tier.quantity || "default"}`}
                className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition"
              >
                <div className="flex flex-col sm:flex-row gap-5">
                  {/* Image */}
                  <div className="w-full sm:w-28 h-28 bg-sky-50 rounded-lg overflow-hidden border flex items-center justify-center">
                    <Image
                      src={item.img}
                      alt={item.name}
                      width={100}
                      height={100}
                      className="object-contain p-2"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-black text-base mb-1">
                          {item.name}
                        </h3>
                        {item.category && (
                          <span className="inline-block text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded uppercase">
                            {item.category}
                          </span>
                        )}
                        {tier.quantity && (
                          <p className="text-xs text-gray-500 mt-1">
                            Variant:{" "}
                            <span className="font-semibold text-sky-600">
                              {tier.quantity}
                            </span>
                          </p>
                        )}
                      </div>

                      <button
                        onClick={() =>
                          removeItem(item.slug, tier.quantity)
                        }
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition"
                        title="Remove from cart"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>

                    <div className="flex items-center gap-3 mt-3">
                      <span className="text-lg font-bold text-sky-600">
                        ${price.toLocaleString()}
                      </span>
                      {mrp > price && (
                        <>
                          <span className="text-sm text-gray-400 line-through">
                            ${mrp.toLocaleString()}
                          </span>
                          <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded">
                            {Math.round(((mrp - price) / mrp) * 100)}% OFF
                          </span>
                        </>
                      )}
                    </div>

                    {/* Quantity + Total */}
                    <div className="flex flex-col sm:flex-row justify-between items-center mt-4 gap-3">
                      <div className="flex items-center">
                        <span className="text-sm font-semibold text-gray-700 mr-3">
                          Qty:
                        </span>
                        <div className="flex items-center border border-gray-300 rounded">
                          <button
                            onClick={() =>
                              decreaseQty(item.slug, tier.quantity)
                            }
                            disabled={item.qty <= 1}
                            className="px-3 py-2 hover:bg-gray-50 disabled:opacity-30"
                          >
                            <Minus className="w-4 h-4 text-gray-600" />
                          </button>
                          <span className="px-4 py-2 font-bold">
                            {item.qty}
                          </span>
                          <button
                            onClick={() =>
                              increaseQty(item.slug, tier.quantity)
                            }
                            disabled={item.qty >= 10}
                            className="px-3 py-2 hover:bg-gray-50 disabled:opacity-30"
                          >
                            <Plus className="w-4 h-4 text-gray-600" />
                          </button>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="text-lg font-bold text-black">
                          ${itemTotal.toLocaleString()}
                        </p>
                        {itemSavings > 0 && (
                          <p className="text-xs text-green-600 font-medium">
                            You save ${itemSavings.toLocaleString()}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right: Order Summary */}
        <div className="space-y-6">
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
            <h2 className="text-lg font-bold text-black mb-6 uppercase tracking-wide">
              Price Summary
            </h2>

            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">
                  Subtotal ({itemCount} items)
                </span>
                <span className="font-semibold text-black">
                  ${subtotal.toLocaleString()}
                </span>
              </div>

              {savings > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Total Savings</span>
                  <span className="font-semibold text-green-600">
                    - ${savings.toLocaleString()}
                  </span>
                </div>
              )}

              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Shipping Charges</span>
                <span
                  className={`font-semibold ${
                    shipping === 0 ? "text-green-600" : "text-black"
                  }`}
                >
                  {shipping === 0 ? "FREE" : `$${shipping}`}
                </span>
              </div>

              {subtotal < 999 && (
                <div className="bg-sky-50 border-l-4 border-sky-600 p-3 rounded text-xs text-gray-700">
                  Add items worth ${(999 - subtotal).toLocaleString()} more for{" "}
                  <span className="font-semibold text-sky-600">
                    FREE shipping
                  </span>
                  !
                </div>
              )}

              <div className="border-t border-gray-300 pt-3 flex justify-between items-center">
                <span className="font-bold text-black text-lg">
                  Total Amount
                </span>
                <span className="text-2xl font-bold text-sky-600">
                  ${total.toLocaleString()}
                </span>
              </div>
            </div>

            <Link
              href={`/checkout/${encodeURIComponent(slugs)}`}
              className="mt-6 block w-full bg-sky-600 text-white py-3 rounded font-bold text-center hover:bg-sky-700 transition-colors shadow-lg shadow-sky-600/20"
            >
              Proceed to Checkout
              <ArrowRight className="inline ml-2 w-5 h-5" />
            </Link>

            <p className="text-xs text-gray-500 text-center mt-3">
              Safe and secure checkout
            </p>
          </div>

          {/* Trust Badges */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
            {[
              { icon: Shield, title: "100% Secure Payment", text: "Your data is protected" },
              { icon: Truck, title: "Fast Delivery", text: "Quick and reliable shipping" },
              { icon: ShoppingBag, title: "Genuine Products", text: "100% authentic items" },
            ].map(({ icon: Icon, title, text }, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-10 h-10 bg-sky-50 rounded-full flex items-center justify-center">
                  <Icon className="w-5 h-5 text-sky-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-black">{title}</p>
                  <p className="text-xs text-gray-500">{text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
