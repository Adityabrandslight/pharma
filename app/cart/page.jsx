"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Minus, Plus, X, ShoppingBag, ArrowRight, Trash2, ShoppingCart, Shield, Truck } from "lucide-react";

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
    window.dispatchEvent(new Event("cart-updated"));
  };

  const removeItem = (id) => {
    updateCart(cart.filter((item) => item.id !== id));
  };

  const increaseQty = (id) => {
    const newCart = cart.map((item) =>
      item.id === id ? { ...item, qty: Math.min((item.qty || 1) + 1, 10) } : item
    );
    updateCart(newCart);
  };

  const decreaseQty = (id) => {
    const newCart = cart.map((item) =>
      item.id === id && item.qty > 1 ? { ...item, qty: item.qty - 1 } : item
    );
    updateCart(newCart);
  };

  const clearCart = () => {
    if (confirm("Are you sure you want to clear your cart?")) {
      updateCart([]);
    }
  };

  const subtotal = cart.reduce(
    (acc, item) => acc + item.price * (item.qty || 1),
    0
  );

  const shipping = subtotal >= 999 ? 0 : 50;
  const total = subtotal + shipping;
  const itemCount = cart.reduce((acc, item) => acc + (item.qty || 1), 0);
  const savings = cart.reduce(
    (acc, item) => acc + (item.mrp && item.mrp > item.price ? (item.mrp - item.price) * (item.qty || 1) : 0),
    0
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-600 font-medium">Loading your cart...</p>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-2xl mx-auto px-6 py-20">
          <div className="bg-gray-50 rounded-lg border border-gray-200 p-12">
            <div className="text-center space-y-6">
              <div className="w-20 h-20 bg-white border-2 border-gray-200 rounded-full flex items-center justify-center mx-auto">
                <ShoppingCart className="h-10 w-10 text-gray-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-black mb-2">Your Cart is Empty</h1>
                <p className="text-gray-600">Looks like you haven't added any products yet.</p>
              </div>
              <Link
                href="/"
                className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-3 rounded font-semibold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20"
              >
                <ShoppingBag className="h-5 w-5" />
                <span>Start Shopping</span>
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
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-black mb-2">Shopping Cart</h1>
              <p className="text-gray-600">
                {itemCount} {itemCount === 1 ? 'item' : 'items'} in your cart
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="px-6 py-2 border border-gray-300 text-gray-700 font-medium rounded hover:border-gray-400 hover:text-black transition-colors"
              >
                Continue Shopping
              </Link>
              {cart.length > 0 && (
                <button
                  onClick={clearCart}
                  className="px-6 py-2 text-red-600 font-medium hover:text-red-700 transition-colors flex items-center gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  <span>Clear Cart</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => {
              const itemTotal = item.price * (item.qty || 1);
              const itemSavings = item.mrp && item.mrp > item.price ? (item.mrp - item.price) * (item.qty || 1) : 0;
              
              return (
                <div
                  key={item.id}
                  className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex gap-6">
                    {/* Product Image */}
                    <div className="w-28 h-28 bg-gradient-to-br from-blue-50 to-gray-50 rounded-lg overflow-hidden flex-shrink-0 border border-gray-200">
                      <Image
                        src={item.img}
                        alt={item.name}
                        width={112}
                        height={112}
                        className="w-full h-full object-contain p-3"
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1 pr-4">
                          <h3 className="font-bold text-black text-base mb-1 line-clamp-2">
                            {item.name}
                          </h3>
                          {item.category && (
                            <span className="inline-block text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded uppercase">
                              {item.category}
                            </span>
                          )}
                        </div>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                          title="Remove from cart"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      </div>

                      <div className="flex items-center gap-3 mb-4">
                        <span className="text-xl font-bold text-blue-600">
                          ₹{item.price.toLocaleString()}
                        </span>
                        {item.mrp && item.mrp > item.price && (
                          <>
                            <span className="text-sm text-gray-400 line-through">
                              ₹{item.mrp.toLocaleString()}
                            </span>
                            <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded">
                              {Math.round(((item.mrp - item.price) / item.mrp) * 100)}% OFF
                            </span>
                          </>
                        )}
                      </div>

                      <div className="flex items-center justify-between">
                        {/* Quantity Controls */}
                        <div className="flex items-center">
                          <span className="text-sm font-semibold text-gray-700 mr-3">Quantity:</span>
                          <div className="flex items-center border-2 border-gray-300 rounded">
                            <button
                              onClick={() => decreaseQty(item.id)}
                              disabled={item.qty <= 1}
                              className="p-2 hover:bg-gray-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                              <Minus className="h-4 w-4 text-gray-600" />
                            </button>
                            <span className="px-4 py-2 text-sm font-bold text-black min-w-[50px] text-center border-x-2 border-gray-300">
                              {item.qty || 1}
                            </span>
                            <button
                              onClick={() => increaseQty(item.id)}
                              disabled={item.qty >= 10}
                              className="p-2 hover:bg-gray-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                              <Plus className="h-4 w-4 text-gray-600" />
                            </button>
                          </div>
                        </div>

                        {/* Item Total */}
                        <div className="text-right">
                          <div className="text-lg font-bold text-black">
                            ₹{itemTotal.toLocaleString()}
                          </div>
                          {itemSavings > 0 && (
                            <div className="text-xs text-green-600 font-medium">
                              You save ₹{itemSavings.toLocaleString()}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Order Summary - Sticky */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Price Summary */}
              <div className="bg-gray-50 rounded-lg border border-gray-200 p-6">
                <h2 className="text-lg font-bold text-black mb-6 uppercase tracking-wide">
                  Price Summary
                </h2>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal ({itemCount} items)</span>
                    <span className="font-semibold text-black">
                      ₹{subtotal.toLocaleString()}
                    </span>
                  </div>
                  
                  {savings > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Total Savings</span>
                      <span className="font-semibold text-green-600">
                        - ₹{savings.toLocaleString()}
                      </span>
                    </div>
                  )}
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Shipping Charges</span>
                    <span className={`font-semibold ${shipping === 0 ? 'text-green-600' : 'text-black'}`}>
                      {shipping === 0 ? 'FREE' : `₹${shipping}`}
                    </span>
                  </div>

                  {subtotal < 999 && (
                    <div className="bg-blue-50 border-l-4 border-blue-600 p-3 rounded text-xs text-gray-700">
                      Add items worth ₹{(999 - subtotal).toLocaleString()} more to get <span className="font-semibold text-blue-600">FREE shipping</span>!
                    </div>
                  )}

                  <div className="border-t-2 border-gray-300 pt-4 flex justify-between items-center">
                    <span className="font-bold text-black text-lg">Total Amount</span>
                    <span className="text-2xl font-bold text-blue-600">
                      ₹{total.toLocaleString()}
                    </span>
                  </div>
                </div>

                <Link
                  href={`/checkout/${encodeURIComponent(slugs)}`}
                  className="w-full bg-blue-600 text-white py-4 px-6 rounded font-bold text-center hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="h-5 w-5" />
                </Link>

                <p className="text-xs text-gray-500 text-center mt-4">
                  Safe and secure checkout
                </p>
              </div>

              {/* Trust Badges */}
              <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center flex-shrink-0">
                    <Shield className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-black">100% Secure Payment</p>
                    <p className="text-xs text-gray-500">Your data is protected</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center flex-shrink-0">
                    <Truck className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-black">Fast Delivery</p>
                    <p className="text-xs text-gray-500">Quick and reliable shipping</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center flex-shrink-0">
                    <ShoppingBag className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-black">Genuine Products</p>
                    <p className="text-xs text-gray-500">100% authentic items</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}