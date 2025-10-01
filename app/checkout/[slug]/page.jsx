"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { Shield, ChevronDown, Lock, Truck, CreditCard, FileText, CheckCircle, Info } from "lucide-react";

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
    state: "",
    country: "",
    prescription: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

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
  const shipping = subtotal >= 999 ? 0 : 50;
  const total = subtotal + shipping;

  if (products.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-600 font-medium">Loading your order...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-black tracking-tight">
              Secure Checkout
            </h1>
            <p className="text-gray-600">
              Complete your order in a few simple steps
            </p>
          </div>

          {/* Progress Steps */}
          <div className="mt-8 flex items-center justify-center space-x-4">
            <div className="flex items-center">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-600 text-white font-semibold">
                1
              </div>
              <span className="ml-3 text-sm font-medium text-blue-600">Order Details</span>
            </div>
            <div className="w-16 h-0.5 bg-gray-300"></div>
            <div className="flex items-center">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 text-gray-600 font-semibold">
                2
              </div>
              <span className="ml-3 text-sm font-medium text-gray-500">Confirmation</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Order Summary - Right Side (Sticky) */}
          <div className="lg:col-span-1 order-2 lg:order-1">
            <div className="sticky top-24 space-y-6">
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <h2 className="text-lg font-bold text-black mb-6 uppercase tracking-wide">
                  Order Summary
                </h2>
                
                <div className="space-y-4 mb-6">
                  {products.map((product) => (
                    <div key={product.id} className="flex gap-4 pb-4 border-b border-gray-200 last:border-0">
                      <div className="w-20 h-20 bg-white rounded-lg overflow-hidden flex-shrink-0 border border-gray-200">
                        <Image
                          src={product.img}
                          alt={product.name}
                          width={80}
                          height={80}
                          className="w-full h-full object-contain p-2"
                        />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-black text-sm line-clamp-2 mb-2">
                          {product.name}
                        </h3>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-blue-600">
                            ₹{product.price.toLocaleString()}
                          </span>
                          {product.mrp > product.price && (
                            <span className="text-xs text-gray-400 line-through">
                              ₹{product.mrp.toLocaleString()}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pricing Breakdown */}
                <div className="space-y-3 pt-4 border-t border-gray-300">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="text-black font-semibold">
                      ₹{subtotal.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Shipping</span>
                    <span className="text-black font-semibold">
                      {shipping === 0 ? "Free" : `₹${shipping}`}
                    </span>
                  </div>
                  {subtotal < 999 && (
                    <p className="text-xs text-blue-600 bg-blue-50 p-2 rounded">
                      Add ₹{(999 - subtotal).toLocaleString()} more for free shipping!
                    </p>
                  )}
                  <div className="flex justify-between font-bold text-lg pt-4 border-t border-gray-300">
                    <span className="text-black">Total Amount</span>
                    <span className="text-blue-600">
                      ₹{total.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Trust Badges */}
                <div className="mt-6 pt-6 border-t border-gray-300 space-y-3">
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <Shield className="w-5 h-5 text-blue-600 flex-shrink-0" />
                    <span>100% Secure Payment</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <Truck className="w-5 h-5 text-blue-600 flex-shrink-0" />
                    <span>Fast & Reliable Delivery</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0" />
                    <span>Genuine Products Only</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Checkout Form - Left Side */}
          <div className="lg:col-span-2 order-1 lg:order-2">
            <div className="bg-white border border-gray-200 rounded-lg p-8">
              <h2 className="text-xl font-bold text-black mb-6 uppercase tracking-wide">
                Shipping Information
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Information Section */}
                <div className="space-y-6">
                  <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200 pb-2">
                    Personal Details
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-black mb-2">
                        Full Name <span className="text-blue-600">*</span>
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all text-gray-900 placeholder-gray-400"
                        placeholder="Enter your full name"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-black mb-2">
                        Email Address <span className="text-blue-600">*</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all text-gray-900 placeholder-gray-400"
                        placeholder="your.email@example.com"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-black mb-2">
                      Phone Number <span className="text-blue-600">*</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all text-gray-900 placeholder-gray-400"
                      placeholder="+91 00000 00000"
                      required
                    />
                  </div>
                </div>

                {/* Address Section */}
                <div className="space-y-6">
                  <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200 pb-2">
                    Delivery Address
                  </h3>
                  
                  <div>
                    <label className="block text-sm font-semibold text-black mb-2">
                      Street Address <span className="text-blue-600">*</span>
                    </label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all text-gray-900 placeholder-gray-400 resize-none"
                      placeholder="House/Flat No., Building Name, Street, Area"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-black mb-2">
                        City <span className="text-blue-600">*</span>
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all text-gray-900 placeholder-gray-400"
                        placeholder="Enter city"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-black mb-2">
                        State <span className="text-blue-600">*</span>
                      </label>
                      <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all text-gray-900 placeholder-gray-400"
                        placeholder="Enter state"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-black mb-2">
                        PIN Code <span className="text-blue-600">*</span>
                      </label>
                      <input
                        type="text"
                        name="pincode"
                        value={formData.pincode}
                        onChange={handleInputChange}
                        pattern="[0-9]{6}"
                        maxLength="6"
                        className="w-full px-4 py-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all text-gray-900 placeholder-gray-400"
                        placeholder="000000"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-black mb-2">
                      Country <span className="text-blue-600">*</span>
                    </label>
                    <div className="relative">
                      <select
                        name="country"
                        value={formData.country}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all text-gray-900 appearance-none bg-white"
                        required
                      >
                        <option value="">Select Country</option>
                        <option value="India">India</option>
                        <option value="USA">United States</option>
                        <option value="UK">United Kingdom</option>
                        <option value="Canada">Canada</option>
                        <option value="Australia">Australia</option>
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* Delivery Preferences */}
                <div className="space-y-6">
                  <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200 pb-2">
                    Delivery Preferences
                  </h3>
                  
                  <div>
                    <label className="block text-sm font-semibold text-black mb-3">
                      Preferred Delivery Time
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <label className="relative flex items-center p-4 border-2 border-gray-300 rounded cursor-pointer hover:border-blue-600 transition-colors">
                        <input
                          type="radio"
                          name="deliveryTime"
                          value="morning"
                          className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-600"
                        />
                        <div className="ml-3">
                          <span className="block text-sm font-semibold text-black">Morning</span>
                          <span className="text-xs text-gray-500">9 AM - 12 PM</span>
                        </div>
                      </label>
                      <label className="relative flex items-center p-4 border-2 border-gray-300 rounded cursor-pointer hover:border-blue-600 transition-colors">
                        <input
                          type="radio"
                          name="deliveryTime"
                          value="afternoon"
                          className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-600"
                          defaultChecked
                        />
                        <div className="ml-3">
                          <span className="block text-sm font-semibold text-black">Afternoon</span>
                          <span className="text-xs text-gray-500">12 PM - 5 PM</span>
                        </div>
                      </label>
                      <label className="relative flex items-center p-4 border-2 border-gray-300 rounded cursor-pointer hover:border-blue-600 transition-colors">
                        <input
                          type="radio"
                          name="deliveryTime"
                          value="evening"
                          className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-600"
                        />
                        <div className="ml-3">
                          <span className="block text-sm font-semibold text-black">Evening</span>
                          <span className="text-xs text-gray-500">5 PM - 9 PM</span>
                        </div>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-black mb-2">
                      Special Instructions (Optional)
                    </label>
                    <textarea
                      name="specialInstructions"
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all text-gray-900 placeholder-gray-400 resize-none"
                      placeholder="Any specific delivery instructions or notes..."
                    />
                  </div>
                </div>
                <div className="space-y-6">
                  <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200 pb-2">
                    Prescription (Optional)
                  </h3>
                  
                  <div>
                    <label className="block text-sm font-semibold text-black mb-2">
                      Upload Prescription
                    </label>
                    <div className="relative">
                      <input
                        type="file"
                        name="prescription"
                        accept="image/*,application/pdf"
                        onChange={handleFileChange}
                        className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded focus:border-blue-600 transition-all text-gray-900 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-blue-600 file:text-white file:font-medium hover:file:bg-blue-700 cursor-pointer"
                      />
                    </div>
                    {formData.prescription && (
                      <div className="mt-2 flex items-center gap-2 text-sm text-green-600">
                        <CheckCircle className="w-4 h-4" />
                        <span>File uploaded: {formData.prescription.name}</span>
                      </div>
                    )}
                    <p className="mt-2 text-xs text-gray-500">
                      Accepted formats: JPG, PNG, PDF (Max size: 5MB)
                    </p>
                  </div>
                </div>

                {/* Important Notice */}
                <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded">
                  <div className="flex items-start gap-3">
                    <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-semibold text-blue-900 mb-1">Important Notice</p>
                      <p className="text-gray-700">
                        Please ensure all information is accurate. Orders cannot be modified once placed. For prescription medicines, a valid prescription is mandatory.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Security Notice */}
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex items-start gap-3">
                    <Lock className="w-5 h-5 text-gray-700 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-black">Secure Checkout</p>
                      <p className="text-xs text-gray-600 mt-1">
                        Your personal and payment information is protected with 256-bit SSL encryption.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-6">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-blue-600 text-white py-4 px-8 rounded font-bold text-lg tracking-wide uppercase hover:bg-blue-700 focus:ring-4 focus:ring-blue-600 focus:ring-opacity-30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-lg shadow-blue-600/20"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Processing Your Order...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-5 h-5" />
                        <span>Confirm Order • ₹{total.toLocaleString()}</span>
                      </>
                    )}
                  </button>
                  <p className="mt-3 text-center text-sm text-gray-600">
                    Payment will be collected on delivery (Cash on Delivery)
                  </p>
                </div>

                <p className="text-xs text-gray-500 text-center leading-relaxed">
                  By completing your order, you agree to our <span className="text-blue-600 underline cursor-pointer">Terms of Service</span> and <span className="text-blue-600 underline cursor-pointer">Privacy Policy</span>. All transactions are secure and encrypted.
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}