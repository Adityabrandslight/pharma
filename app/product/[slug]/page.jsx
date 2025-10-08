"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { ShoppingBag, Shield, Truck, Award, CheckCircle, ArrowLeft, Heart, Share2, Info } from "lucide-react";
import { ToastNotification } from "@/components/Toatnotification";
import Link from "next/link";
import { FaCartPlus } from "react-icons/fa";

export default function ProductPage() {
  const { slug } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [toastMessage, setToastMessage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("benefits");

  useEffect(() => {
    fetch("/data/products.json")
      .then((r) => r.json())
      .then((json) => {
        const products = json.products;
        const found = products.find((p) => p.slug === slug);
        setProduct(found || null);

        if (found) {
          // Related products = same category, exclude current
          const related = products
            .filter((p) => p.category === found.category && p.slug !== found.slug)
            .slice(0, 4); // max 4
          setRelatedProducts(related);
        }
      });
  }, [slug]);

  if (!product) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-2 border-gray-300 border-t-sky-600 rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-600 font-medium">Loading product information...</p>
        </div>
      </div>
    );
  }

  const addToCart = () => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const existingItem = cart.find((item) => item.slug === product.slug);

    if (existingItem) {
      existingItem.qty = (existingItem.qty || 1) + quantity;
    } else {
      cart.push({ ...product, qty: quantity });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("cart-updated"));

    setToastMessage(`${product.name} added to cart successfully!`);
    setTimeout(() => setToastMessage(""), 4000);
  };

  const buyNow = () => {
    addToCart();
    router.push(`/checkout/${product.slug}`);
  };

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= 10) {
      setQuantity(newQuantity);
    }
  };

  const discount = product.mrp > product.price
    ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
    : 0;

  const totalPrice = product.price * quantity;

  return (
    <div className="min-h-screen bg-white">
      {/* Header Navigation */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.back()}
              className="flex items-center space-x-2 text-gray-600 hover:text-black transition-colors duration-200"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="font-medium text-sm tracking-wide uppercase">Back to Products</span>
            </button>

            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-600 hover:text-sky-600 transition-colors duration-200">
                <Heart className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-600 hover:text-sky-600 transition-colors duration-200">
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        {/* Product Main Section */}
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* Product Image */}
          <div className="space-y-6">
            <div className="relative aspect-square bg-gradient-to-br from-sky-50 to-gray-50 rounded-lg overflow-hidden border border-gray-200">
              <Image
                src={product.img}
                alt={product.name}
                fill
                className="object-contain p-8"
              />
              {discount > 0 && (
                <div className="absolute top-4 right-4 bg-sky-600 text-white px-3 py-1 rounded-full font-semibold text-sm">
                  {discount}% OFF
                </div>
              )}
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4">
              <div className="flex flex-col items-center text-center p-4 bg-gray-50 rounded-lg">
                <Shield className="w-6 h-6 text-sky-600 mb-2" />
                <span className="text-xs text-gray-700 font-medium">100% Authentic</span>
              </div>
              <div className="flex flex-col items-center text-center p-4 bg-gray-50 rounded-lg">
                <Truck className="w-6 h-6 text-sky-600 mb-2" />
                <span className="text-xs text-gray-700 font-medium">Fast Delivery</span>
              </div>
              <div className="flex flex-col items-center text-center p-4 bg-gray-50 rounded-lg">
                <Award className="w-6 h-6 text-sky-600 mb-2" />
                <span className="text-xs text-gray-700 font-medium">Quality Assured</span>
              </div>
            </div>
          </div>

          {/* Product Information */}
          <div className="space-y-6">
            {/* Category */}
            <div>
              <span className="inline-block bg-sky-50 text-sky-700 px-3 py-1 text-xs font-semibold tracking-wider uppercase rounded">
                {product.category}
              </span>
            </div>

            {/* Product Name */}
            <h1 className="text-3xl lg:text-4xl font-bold text-black leading-tight">
              {product.name}
            </h1>

            {/* Short Description */}
            <p className="text-gray-600 text-lg leading-relaxed">
              {product.content.shortDescription}
            </p>

            {/* Pricing */}
            <div className="space-y-3 py-6 border-y border-gray-200">
              <div className="flex items-baseline space-x-4">
                <span className="text-4xl font-bold text-sky-600">
                  ${product.price.toLocaleString()}
                </span>
                {product.mrp > product.price && (
                  <span className="text-xl text-gray-400 line-through">
                    ${product.mrp.toLocaleString()}
                  </span>
                )}
              </div>
              {discount > 0 && (
                <p className="text-sm text-green-600 font-medium">
                  You save ${(product.mrp - product.price).toLocaleString()} ({discount}% discount)
                </p>
              )}
              <p className="text-xs text-gray-500">
                *Inclusive of all taxes
              </p>
            </div>

            {/* Quantity Selector */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-black tracking-wide uppercase">
                Quantity
              </label>
              <div className="flex items-center space-x-4">
                <div className="flex items-center border border-gray-300 rounded">
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                    className="px-4 py-2 text-gray-600 hover:text-black hover:bg-gray-50 transition-colors duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    -
                  </button>
                  <span className="px-6 py-2 font-semibold text-black border-x border-gray-300 min-w-[60px] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= 10}
                    className="px-4 py-2 text-gray-600 hover:text-black hover:bg-gray-50 transition-colors duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    +
                  </button>
                </div>
                {quantity > 1 && (
                  <div className="text-sm text-gray-600">
                    Total: <span className="font-bold text-sky-600">${totalPrice.toLocaleString()}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4 pt-4">
              <button
                onClick={buyNow}
                className="w-full bg-sky-600 hover:bg-sky-700 text-white py-4 px-8 rounded font-semibold tracking-wide uppercase transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg shadow-sky-600/20"
              >
                <ShoppingBag className="w-5 h-5" />
                <span>Buy Now</span>
              </button>

              <button
                onClick={addToCart}
                className="w-full bg-black hover:bg-gray-800 text-white py-4 px-8 rounded font-semibold tracking-wide uppercase transition-all duration-200 flex items-center justify-center space-x-2"
              >
                <ShoppingBag className="w-5 h-5" />
                <span>Add to Cart</span>
              </button>
            </div>

            {/* Important Notice */}
            <div className="bg-sky-50 border-l-4 border-sky-600 p-4 rounded">
              <div className="flex items-start space-x-3">
                <Info className="w-5 h-5 text-sky-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-gray-700">
                  <p className="font-semibold text-sky-900 mb-1">Important Information</p>
                  <p>Please consult your physician before using this product. Free shipping on orders above $999.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="border-t border-gray-200 pt-12">
          {/* Tab Navigation */}
          <div className="flex space-x-8 border-b border-gray-200 mb-8">
            <button
              onClick={() => setActiveTab("benefits")}
              className={`pb-4 px-2 font-semibold text-sm tracking-wide uppercase transition-colors duration-200 ${
                activeTab === "benefits"
                  ? "text-sky-600 border-b-2 border-sky-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Key Benefits
            </button>
            <button
              onClick={() => setActiveTab("features")}
              className={`pb-4 px-2 font-semibold text-sm tracking-wide uppercase transition-colors duration-200 ${
                activeTab === "features"
                  ? "text-sky-600 border-b-2 border-sky-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Key Features
            </button>
            <button
              onClick={() => setActiveTab("description")}
              className={`pb-4 px-2 font-semibold text-sm tracking-wide uppercase transition-colors duration-200 ${
                activeTab === "description"
                  ? "text-sky-600 border-b-2 border-sky-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Full Description
            </button>
          </div>

          {/* Tab Content */}
          <div className="max-w-4xl">
            {activeTab === "benefits" && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-black mb-6">Key Benefits</h2>
                <ul className="space-y-3">
                  {product.content.keyBenefits.map((benefit, i) => (
                    <li key={i} className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-sky-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700 leading-relaxed">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {activeTab === "features" && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-black mb-6">Key Features</h2>
                <ul className="space-y-3">
                  {product.content.keyFeatures.map((feature, i) => (
                    <li key={i} className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-sky-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700 leading-relaxed">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {activeTab === "description" && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-black mb-6">Full Description</h2>
                <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {product.content.longDescription}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {/* Related Products */}
{relatedProducts.length > 0 && (
  <div className="mt-16">
    <h2 className="text-2xl font-bold mb-6">Related Products</h2>
    <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
      {relatedProducts.map((p) => (
        <div key={p.slug} className="border p-4 rounded hover:shadow-md flex flex-col items-center">
          <Link href={`/product/${p.slug}`} className="w-full">
            <Image src={p.img} alt={p.name} width={200} height={200} className="object-contain rounded" />
            <p className="mt-2 text-sm font-medium">{p.name}</p>
            <p className="text-sm text-gray-600">${p.price.toLocaleString()}</p>
          </Link>

          <div className="mt-3 flex  sm:space-x-2 w-full gap-2">
  {/* Add to Cart Icon Only */}
  <button
    onClick={() => {
      const cart = JSON.parse(localStorage.getItem("cart") || "[]");
      const existingItem = cart.find((item) => item.slug === p.slug);
      if (existingItem) {
        existingItem.qty = (existingItem.qty || 1) + 1;
      } else {
        cart.push({ ...p, qty: 1 });
      }
      localStorage.setItem("cart", JSON.stringify(cart));
      window.dispatchEvent(new Event("cart-updated"));
      setToastMessage(`${p.name} added to cart successfully!`);
      setTimeout(() => setToastMessage(""), 3000);
    }}
    className="flex justify-center items-center w-25 py-3 px-0 rounded-lg border border-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
  >
    <FaCartPlus className="w-5 h-5" />
  </button>

  {/* Buy Now */}
  <button
    onClick={() => {
      const cart = JSON.parse(localStorage.getItem("cart") || "[]");
      const existingItem = cart.find((item) => item.slug === p.slug);
      if (existingItem) {
        existingItem.qty = (existingItem.qty || 1) + 1;
      } else {
        cart.push({ ...p, qty: 1 });
      }
      localStorage.setItem("cart", JSON.stringify(cart));
      window.dispatchEvent(new Event("cart-updated"));
      router.push(`/checkout/${p.slug}`);
    }}
    className="flex-1 flex justify-center items-center py-3 px-4 rounded-lg font-semibold text-md bg-sky-600 text-white hover:bg-sky-700 transition-colors"
  >
    Buy Now
  </button>
</div>

        </div>
      ))}
    </div>
  </div>
)}

      </div>

      <ToastNotification message={toastMessage} />
    </div>
  );
}
