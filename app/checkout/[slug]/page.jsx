"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { Shield, ChevronDown } from "lucide-react";

export default function CheckoutPage() {
  const { slug } = useParams();
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    pincode: "",
    country: "",
    prescription: null,  // Added for storing the uploaded prescription file
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const decodedSlugs = decodeURIComponent(slug).split(",");
    if (decodedSlugs.length === 0) {
      setProducts([]);
      return;
    }

    fetch("/data/products.json")
      .then((r) => r.json())
      .then((data) => {
        const foundProducts = data.products.filter((p) =>
          decodedSlugs.includes(p.slug)
        );
        setProducts(foundProducts || []);
      })
      .catch(() => setProducts([]));
  }, [slug]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData((prev) => ({ ...prev, [name]: files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    await new Promise((res) => setTimeout(res, 2000));
    console.log("Order submitted:", { products, formData });

    setIsSubmitting(false);
    alert("Order placed successfully!");
  };

  const subtotal = products.reduce((acc, item) => acc + item.price, 0);

  if (products.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-2 border-neutral-200 border-t-neutral-800 rounded-full animate-spin mx-auto"></div>
          <p className="text-neutral-600 text-sm font-medium">Loading your order...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-neutral-100 bg-white">
        <div className="max-w-5xl mx-auto px-6 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-semibold text-neutral-900 tracking-tight">
              Checkout
            </h1>
            <p className="text-neutral-500 text-sm mt-1">
              Review your order and complete your purchase
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-5 gap-16">
          {/* Order Summary - Left Side */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h2 className="text-lg font-medium text-neutral-900 mb-6">
                Order Summary
              </h2>
              
              <div className="space-y-4">
                {products.map((product) => (
                  <div key={product.id} className="flex gap-4 p-4 border border-neutral-100 rounded-xl">
                    <div className="w-16 h-16 bg-neutral-50 rounded-lg overflow-hidden flex-shrink-0">
                      <Image
                        src={product.img}
                        alt={product.name}
                        width={64}
                        height={64}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-neutral-900 text-sm line-clamp-2 mb-1">
                        {product.name}
                      </h3>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-neutral-900">
                          ₹{product.price.toLocaleString()}
                        </span>
                        {product.mrp > product.price && (
                          <span className="text-xs text-neutral-400 line-through">
                            ₹{product.mrp.toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pricing Summary */}
              <div className="border-t border-neutral-100 mt-8 pt-6 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-600">Subtotal</span>
                  <span className="text-neutral-900 font-medium">
                    ₹{subtotal.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-600">Shipping</span>
                  <span className="text-neutral-900 font-medium">Free</span>
                </div>
                <div className="flex justify-between font-semibold text-lg pt-3 border-t border-neutral-100">
                  <span className="text-neutral-900">Total</span>
                  <span className="text-neutral-900">
                    ₹{subtotal.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Checkout Form - Right Side */}
          <div className="lg:col-span-3">
            <h2 className="text-lg font-medium text-neutral-900 mb-8">
              Shipping Information
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-neutral-200 rounded-lg focus:ring-1 focus:ring-neutral-900 focus:border-neutral-900 transition-colors text-sm bg-white"
                    placeholder="Enter your full name"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-neutral-200 rounded-lg focus:ring-1 focus:ring-neutral-900 focus:border-neutral-900 transition-colors text-sm bg-white"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-neutral-200 rounded-lg focus:ring-1 focus:ring-neutral-900 focus:border-neutral-900 transition-colors text-sm bg-white"
                  placeholder="Enter your phone number"
                  required
                />
              </div>

              {/* Address Information */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Street Address
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-3 border border-neutral-200 rounded-lg focus:ring-1 focus:ring-neutral-900 focus:border-neutral-900 transition-colors text-sm resize-none bg-white"
                  placeholder="Enter your complete address"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    City
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-neutral-200 rounded-lg focus:ring-1 focus:ring-neutral-900 focus:border-neutral-900 transition-colors text-sm bg-white"
                    placeholder="Enter city"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    PIN Code
                  </label>
                  <input
                    type="text"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleInputChange}
                    pattern="[0-9]{6}"
                    className="w-full px-4 py-3 border border-neutral-200 rounded-lg focus:ring-1 focus:ring-neutral-900 focus:border-neutral-900 transition-colors text-sm bg-white"
                    placeholder="000000"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Country
                  </label>
                  <div className="relative">
                    <select
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-neutral-200 rounded-lg focus:ring-1 focus:ring-neutral-900 focus:border-neutral-900 transition-colors text-sm bg-white appearance-none"
                      required
                    >
                      <option value="">Select</option>
                      <option value="India">India</option>
                      <option value="USA">USA</option>
                      <option value="UK">UK</option>
                      <option value="Canada">Canada</option>
                      <option value="Australia">Australia</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-400 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Prescription Upload */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Prescription Upload (Optional)
                </label>
                <input
                  type="file"
                  name="prescription"
                  accept="image/*,application/pdf"
                  onChange={handleFileChange}
                  className="w-full px-4 py-3 border border-neutral-200 rounded-lg focus:ring-1 focus:ring-neutral-900 focus:border-neutral-900 transition-colors text-sm bg-white"
                />
              </div>

              {/* Security Notice */}
              <div className="bg-neutral-50 rounded-lg p-4 flex items-start gap-3">
                <Shield className="h-5 w-5 text-neutral-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-neutral-900">Secure Checkout</p>
                  <p className="text-xs text-neutral-600 mt-1">
                    Your personal information is protected with industry-standard encryption.
                  </p>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-neutral-900 text-white py-4 px-6 rounded-lg font-medium hover:bg-neutral-800 focus:ring-2 focus:ring-neutral-900 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Processing Order...
                    </>
                  ) : (
                    `Complete Order • ₹${subtotal.toLocaleString()}`
                  )}
                </button>
              </div>

              <p className="text-xs text-neutral-500 text-center">
                By completing your order, you agree to our Terms of Service and Privacy Policy.
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
