"use client";

import { useState, useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { Shield, ChevronDown, Lock, Truck, CheckCircle, Info, CreditCard, Wallet, Smartphone, Building, Package, MapPin, Mail, Phone, User, FileText } from "lucide-react";

async function fileToBase64(file) {
  if (!file) return null;
  const buf = await file.arrayBuffer();
  const base64 = Buffer.from(buf).toString("base64");
  return `data:${file.type};base64,${base64}`;
}

export default function CheckoutPage() {
  const router = useRouter();
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
    specialInstructions: "",
    prescription: null,
    paymentMethod: "cod",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [loadState, setLoadState] = useState("loading");

  const subtotal = useMemo(
    () => products.reduce((acc, item) => acc + (Number(item.price) || 0), 0),
    [products]
  );
  const shipping = useMemo(() => (subtotal >= 999 ? 0 : 50), [subtotal]);
  const total = useMemo(() => subtotal + shipping, [subtotal, shipping]);

  useEffect(() => {
    try {
      const decodedSlugs = decodeURIComponent(slug).split(",").filter(Boolean);
      if (decodedSlugs.length === 0) {
        setProducts([]);
        setLoadState("empty");
        return;
      }

      fetch("/data/products.json")
        .then((r) => r.json())
        .then((data) => {
          const found = (data.products || []).filter((p) =>
            decodedSlugs.includes(p.slug)
          );
          setProducts(found);
          setLoadState(found.length ? "ready" : "empty");
        })
        .catch(() => setLoadState("error"));
    } catch {
      setLoadState("error");
    }
  }, [slug]);

  function handleInputChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  function handleFileChange(e) {
    const { name, files } = e.target;
    setFormData((prev) => ({ ...prev, [name]: files?.[0] || null }));
  }

  function basicValidate() {
    const required = ["fullName", "email", "phone", "address", "city", "pincode", "state", "country"];
    for (const key of required) {
      if (!String(formData[key] || "").trim()) return false;
    }
    if (!/^\d{6}$/.test(formData.pincode)) return false;
    return products.length > 0;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!basicValidate()) {
      alert("Please fill all required fields correctly.");
      return;
    }

    setIsSubmitting(true);
    try {
      const prescriptionDataUrl = await fileToBase64(formData.prescription);

      const orderPayload = {
        customer: {
          name: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          address: `${formData.address}, ${formData.city} - ${formData.pincode}, ${formData.state}, ${formData.country}`,
        },
        paymentMethod: formData.paymentMethod,
        specialInstructions: formData.specialInstructions || "",
        items: products.map((p) => ({
          name: p.name,
          qty: 1,
          price: Number(p.price) || 0,
          slug: p.slug,
        })),
        subtotal,
        shipping,
        total,
        prescription: prescriptionDataUrl,
      };

      const res = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload),
      });

      const json = await res.json();

      if (!res.ok || !json?.ok) {
        throw new Error(json?.error || "Failed to place order");
      }

      setCurrentStep(2);
    } catch (err) {
      console.error(err);
      alert("Order failed. Try again in a minute.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loadState === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-sky-50">
        <div className="text-center space-y-4">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-sky-100 rounded-full animate-spin mx-auto" />
            <div className="w-16 h-16 border-4 border-t-sky-600 rounded-full animate-spin mx-auto absolute inset-0" />
          </div>
          <p className="text-slate-700 font-medium">Loading your order...</p>
        </div>
      </div>
    );
  }

  if (loadState !== "ready") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-sky-50">
        <div className="text-center space-y-4 bg-white p-8 rounded-2xl shadow-lg">
          <Package className="w-16 h-16 text-slate-400 mx-auto" />
          <p className="text-xl font-semibold text-slate-900">No products found</p>
          <p className="text-slate-600">Please go back and select items again.</p>
        </div>
      </div>
    );
  }

  const paymentOptions = [
    { value: "cod", label: "Cash on Delivery", icon: Package },
    { value: "upi", label: "UPI", icon: Smartphone },
    { value: "card", label: "Credit/Debit Card", icon: CreditCard },
    { value: "netbanking", label: "Net Banking", icon: Building },
    { value: "wallet", label: "Wallet", icon: Wallet },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-sky-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-sky-600 to-sky-700 rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Secure Checkout</h1>
                <p className="text-sm text-slate-600">SSL encrypted & protected</p>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-2 text-sm text-slate-600">
              <Lock className="w-4 h-4" />
              <span>256-bit encryption</span>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-center gap-4">
            <div className={`flex items-center gap-2 ${currentStep === 1 ? 'text-sky-600' : 'text-green-600'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep === 1 ? 'bg-sky-100' : 'bg-green-100'}`}>
                {currentStep === 1 ? '1' : <CheckCircle className="w-5 h-5" />}
              </div>
              <span className="text-sm font-medium hidden sm:inline">Shipping Details</span>
            </div>
            <div className={`h-px w-12 sm:w-24 ${currentStep === 2 ? 'bg-green-600' : 'bg-slate-300'}`} />
            <div className={`flex items-center gap-2 ${currentStep === 2 ? 'text-sky-600' : 'text-slate-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep === 2 ? 'bg-sky-100' : 'bg-slate-100'}`}>
                {currentStep === 2 ? <CheckCircle className="w-5 h-5" /> : '2'}
              </div>
              <span className="text-sm font-medium hidden sm:inline">Order Confirmation</span>
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Order Summary */}
          <div className="lg:col-span-1 order-2 lg:order-1">
            <div className="sticky top-24 space-y-6">
              <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
                <div className="bg-gradient-to-r from-slate-900 to-slate-800 px-6 py-4">
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <Package className="w-5 h-5" />
                    Order Summary
                  </h2>
                </div>

                <div className="p-6 space-y-4">
                  {products.map((product) => (
                    <div key={product.id || product.slug} className="flex gap-4 pb-4 border-b border-slate-100 last:border-0">
                      <div className="w-20 h-20 bg-slate-50 rounded-xl overflow-hidden flex-shrink-0 border border-slate-200">
                        <Image
                          src={product.img}
                          alt={product.name}
                          width={80}
                          height={80}
                          className="w-full h-full object-contain p-2"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-slate-900 text-sm line-clamp-2 mb-2">
                          {product.name}
                        </h3>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sky-600 text-lg">
                            ${Number(product.price).toLocaleString()}
                          </span>
                          {product.mrp > product.price && (
                            <span className="text-xs text-slate-400 line-through">
                              ${Number(product.mrp).toLocaleString()}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pricing */}
                <div className="px-6 pb-6 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Subtotal</span>
                    <span className="text-slate-900 font-semibold">₹${subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600 flex items-center gap-1">
                      <Truck className="w-4 h-4" />
                      Shipping
                    </span>
                    <span className="text-slate-900 font-semibold">
                      {shipping === 0 ? (
                        <span className="text-green-600 font-bold">Free</span>
                      ) : (
                        `₹${shipping}`
                      )}
                    </span>
                  </div>
                  {subtotal < 999 && (
                    <div className="bg-gradient-to-r from-sky-50 to-indigo-50 border border-sky-200 p-3 rounded-lg">
                      <p className="text-xs text-sky-700 font-medium flex items-start gap-2">
                        <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
                        Add ${(999 - subtotal).toLocaleString()} more for free shipping!
                      </p>
                    </div>
                  )}
                  <div className="flex justify-between items-center pt-4 border-t-2 border-slate-200">
                    <span className="text-slate-900 font-bold text-lg">Total Amount</span>
                    <span className="text-sky-600 font-bold text-2xl">${total.toLocaleString()}</span>
                  </div>
                </div>

                {/* Trust Badges */}
                <div className="bg-slate-50 px-6 py-4 border-t border-slate-200">
                  <div className="flex items-center justify-center gap-6 text-xs text-slate-600">
                    <div className="flex items-center gap-1">
                      <Shield className="w-4 h-4 text-green-600" />
                      <span>Secure Payment</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Truck className="w-4 h-4 text-sky-600" />
                      <span>Fast Delivery</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Form / Confirmation */}
          <div className="lg:col-span-2 order-1 lg:order-2">
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
              {currentStep === 1 && (
                <>
                  <div className="bg-gradient-to-r from-sky-600 to-sky-600 px-6 sm:px-8 py-6">
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                      <MapPin className="w-6 h-6" />
                      Shipping Information
                    </h2>
                    <p className="text-sky-100 text-sm mt-1">Please provide accurate delivery details</p>
                  </div>

                  <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-8">
                    {/* Personal */}
                    <div className="space-y-6">
                      <div className="flex items-center gap-2 pb-3 border-b-2 border-slate-200">
                        <User className="w-5 h-5 text-sky-600" />
                        <h3 className="text-base font-bold text-slate-900 uppercase tracking-wide">
                          Personal Details
                        </h3>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-2">
                            Full Name <span className="text-red-500">*</span>
                          </label>
                          <div className="relative">
                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input
                              type="text"
                              name="fullName"
                              value={formData.fullName}
                              onChange={handleInputChange}
                              className="w-full pl-11 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all text-slate-900 placeholder-slate-400"
                              placeholder="John Doe"
                              required
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-2">
                            Email Address <span className="text-red-500">*</span>
                          </label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input
                              type="email"
                              name="email"
                              value={formData.email}
                              onChange={handleInputChange}
                              className="w-full pl-11 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all text-slate-900 placeholder-slate-400"
                              placeholder="john@example.com"
                              required
                            />
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          Phone Number <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            className="w-full pl-11 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all text-slate-900 placeholder-slate-400"
                            placeholder="+91 98765 43210"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    {/* Address */}
                    <div className="space-y-6">
                      <div className="flex items-center gap-2 pb-3 border-b-2 border-slate-200">
                        <MapPin className="w-5 h-5 text-sky-600" />
                        <h3 className="text-base font-bold text-slate-900 uppercase tracking-wide">
                          Delivery Address
                        </h3>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          Street Address <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          rows={3}
                          className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all text-slate-900 placeholder-slate-400 resize-none"
                          placeholder="House/Flat No., Building Name, Street, Area"
                          required
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-2">
                            City <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            name="city"
                            value={formData.city}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all text-slate-900 placeholder-slate-400"
                            placeholder="Mumbai"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-2">
                            State <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            name="state"
                            value={formData.state}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all text-slate-900 placeholder-slate-400"
                            placeholder="Maharashtra"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-2">
                            PIN Code <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            name="pincode"
                            value={formData.pincode}
                            onChange={handleInputChange}
                            pattern="[0-9]{6}"
                            maxLength="6"
                            className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all text-slate-900 placeholder-slate-400"
                            placeholder="400001"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          Country <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <select
                            name="country"
                            value={formData.country}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all text-slate-900 appearance-none bg-white"
                            required
                          >
                            <option value="">Select Country</option>
                            <option value="India">India</option>
                            <option value="USA">United States</option>
                            <option value="UK">United Kingdom</option>
                            <option value="Canada">Canada</option>
                            <option value="Australia">Australia</option>
                          </select>
                          <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400 pointer-events-none" />
                        </div>
                      </div>
                    </div>

                    {/* Payment Method */}
                    <div className="space-y-6">
                      <div className="flex items-center gap-2 pb-3 border-b-2 border-slate-200">
                        <CreditCard className="w-5 h-5 text-sky-600" />
                        <h3 className="text-base font-bold text-slate-900 uppercase tracking-wide">
                          Payment Method
                        </h3>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                        {paymentOptions.map(opt => {
                          const Icon = opt.icon;
                          return (
                            <label key={opt.value} className={`relative flex flex-col items-center justify-center p-4 border-2 rounded-xl cursor-pointer transition-all ${formData.paymentMethod === opt.value ? 'border-sky-600 bg-sky-50 shadow-md' : 'border-slate-200 hover:border-sky-400 hover:shadow-sm'}`}>
                              <input
                                type="radio"
                                name="paymentMethod"
                                value={opt.value}
                                checked={formData.paymentMethod === opt.value}
                                onChange={handleInputChange}
                                className="sr-only"
                              />
                              <Icon className={`w-8 h-8 mb-2 ${formData.paymentMethod === opt.value ? 'text-sky-600' : 'text-slate-400'}`} />
                              <span className={`text-xs font-semibold text-center ${formData.paymentMethod === opt.value ? 'text-sky-600' : 'text-slate-700'}`}>{opt.label}</span>
                              {formData.paymentMethod === opt.value && (
                                <div className="absolute top-2 right-2 w-5 h-5 bg-sky-600 rounded-full flex items-center justify-center">
                                  <CheckCircle className="w-3 h-3 text-white" />
                                </div>
                              )}
                            </label>
                          );
                        })}
                      </div>
                    </div>

                    {/* Special Instructions */}
                    <div className="space-y-6">
                      <div className="flex items-center gap-2 pb-3 border-b-2 border-slate-200">
                        <FileText className="w-5 h-5 text-sky-600" />
                        <h3 className="text-base font-bold text-slate-900 uppercase tracking-wide">
                          Additional Information
                        </h3>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          Special Instructions (Optional)
                        </label>
                        <textarea
                          name="specialInstructions"
                          value={formData.specialInstructions}
                          onChange={handleInputChange}
                          rows={3}
                          className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all text-slate-900 placeholder-slate-400 resize-none"
                          placeholder="Any specific delivery instructions, preferred time, or notes..."
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          Upload Prescription (Optional)
                        </label>
                        <div className="relative">
                          <input
                            type="file"
                            name="prescription"
                            accept="image/*,application/pdf"
                            onChange={handleFileChange}
                            className="w-full px-4 py-4 border-2 border-dashed border-slate-300 rounded-xl cursor-pointer text-slate-600 hover:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all bg-slate-50"
                          />
                          {formData.prescription && (
                            <div className="mt-2 text-sm text-green-600 flex items-center gap-2">
                              <CheckCircle className="w-4 h-4" />
                              <span>{formData.prescription.name}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-gradient-to-r from-sky-600 to-sky-600 hover:from-sky-700 hover:to-indigo-700 text-white font-bold py-4 px-6 rounded-xl focus:outline-none focus:ring-4 focus:ring-sky-300 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Placing Order...
                        </>
                      ) : (
                        <>
                          <Lock className="w-5 h-5" />
                          Place Secure Order
                        </>
                      )}
                    </button>

                    <p className="text-xs text-center text-slate-500">
                      By placing this order, you agree to our terms and conditions
                    </p>
                  </form>
                </>
              )}

              {currentStep === 2 && (
                <div className="text-center py-16 px-8 space-y-6">
                  <div className="relative inline-block">
                    <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto shadow-2xl">
                      <CheckCircle className="w-14 h-14 text-white" />
                    </div>
                    <div className="absolute inset-0 w-24 h-24 bg-green-400 rounded-full animate-ping opacity-20" />
                  </div>
                  <div className="space-y-3">
                    <h2 className="text-3xl font-bold text-slate-900">Order Placed Successfully!</h2>
                    <p className="text-slate-600 max-w-md mx-auto">
                      Your order has been confirmed. We've sent a confirmation email with your order details and tracking information.
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
                    <button
                      onClick={() => router.push('/')}
                      className="px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-xl transition-all shadow-md"
                    >
                      Continue Shopping
                    </button>
                    <button
                      onClick={() => router.push('/orders')}
                      className="px-6 py-3 border-2 border-slate-300 hover:border-slate-400 text-slate-700 font-semibold rounded-xl transition-all"
                    >
                      Track Order
                    </button>
                  </div>
                  <div className="mt-8 pt-8 border-t border-slate-200">
                    <p className="text-sm text-slate-600 mb-4">What happens next?</p>
                    <div className="grid md:grid-cols-3 gap-4 max-w-2xl mx-auto">
                      <div className="flex flex-col items-center text-center space-y-2">
                        <div className="w-12 h-12 bg-sky-100 rounded-full flex items-center justify-center">
                          <Mail className="w-6 h-6 text-sky-600" />
                        </div>
                        <p className="text-sm font-semibold text-slate-900">Email Confirmation</p>
                        <p className="text-xs text-slate-600">Check your inbox for order details</p>
                      </div>
                      <div className="flex flex-col items-center text-center space-y-2">
                        <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                          <Package className="w-6 h-6 text-orange-600" />
                        </div>
                        <p className="text-sm font-semibold text-slate-900">Order Processing</p>
                        <p className="text-xs text-slate-600">We'll prepare your package</p>
                      </div>
                      <div className="flex flex-col items-center text-center space-y-2">
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                          <Truck className="w-6 h-6 text-green-600" />
                        </div>
                        <p className="text-sm font-semibold text-slate-900">Fast Delivery</p>
                        <p className="text-xs text-slate-600">Delivered within 3-5 days</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}