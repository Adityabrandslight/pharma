"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import {
  ShoppingBag,
  Shield,
  Truck,
  Award,
  CheckCircle,
  ArrowLeft,
  Heart,
  Share2,
  Info,
} from "lucide-react";
import { ToastNotification } from "@/components/Toatnotification";
import Link from "next/link";
import { FaCartPlus } from "react-icons/fa";

export default function ProductPage() {
  const { slug } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [toastMessage, setToastMessage] = useState("");
  const [selectedTier, setSelectedTier] = useState(null);
  const [activeTab, setActiveTab] = useState("benefits");

  useEffect(() => {
    fetch("/data/products.json")
      .then((r) => r.json())
      .then((json) => {
        const products = json.products || json; // handle both structures
        const found = products.find((p) => p.slug === slug);
        setProduct(found || null);

        if (found) {
          // Related products = same category, exclude current
          const related = products
            .filter((p) => p.category === found.category && p.slug !== found.slug)
            .slice(0, 4);
          setRelatedProducts(related);

          // Default to first pricing tier if available
          if (found.pricing && found.pricing.length > 0) {
            setSelectedTier(found.pricing[0]);
          }
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
    const existingItem = cart.find(
      (item) =>
        item.slug === product.slug &&
        item.selectedTier?.quantity === selectedTier?.quantity
    );

    if (existingItem) {
      existingItem.qty = (existingItem.qty || 1) + 1;
    } else {
      cart.push({ ...product, qty: 1, selectedTier });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("cart-updated"));

    setToastMessage(
      `${product.name} (${selectedTier?.quantity}) added to cart successfully!`
    );
    setTimeout(() => setToastMessage(""), 4000);
  };

  const buyNow = () => {
    addToCart();
    router.push(`/checkout/${product.slug}`);
  };

  const discount =
    selectedTier && selectedTier.mrp > selectedTier.price
      ? Math.round(
          ((selectedTier.mrp - selectedTier.price) / selectedTier.mrp) * 100
        )
      : 0;

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-4 flex justify-between items-center">
          <button
            onClick={() => router.back()}
            className="flex items-center space-x-2 text-gray-600 hover:text-black transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="font-medium text-sm uppercase">
              Back to Products
            </span>
          </button>
          <div className="flex items-center space-x-4">
            <Heart className="w-5 h-5 text-gray-500 hover:text-sky-600 cursor-pointer" />
            <Share2 className="w-5 h-5 text-gray-500 hover:text-sky-600 cursor-pointer" />
          </div>
        </div>
      </div>

      {/* Main Product Section */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12 grid lg:grid-cols-2 gap-12">
        {/* Left: Product Image */}
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

          {/* Badges */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { icon: Shield, text: "100% Authentic" },
              { icon: Truck, text: "Fast Delivery" },
              { icon: Award, text: "Quality Assured" },
            ].map(({ icon: Icon, text }, i) => (
              <div
                key={i}
                className="flex flex-col items-center text-center p-4 bg-gray-50 rounded-lg"
              >
                <Icon className="w-6 h-6 text-sky-600 mb-2" />
                <span className="text-xs text-gray-700 font-medium">{text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Product Details */}
        <div className="space-y-6">
          <span className="inline-block bg-sky-50 text-sky-700 px-3 py-1 text-xs font-semibold uppercase rounded">
            {product.category}
          </span>

          <h1 className="text-3xl lg:text-4xl font-bold text-black">
            {product.name}
          </h1>

          <p className="text-gray-600 text-lg leading-relaxed">
            {product.content.shortDescription}
          </p>

          {/* Multi-Tier Pricing */}
          {product.pricing && (
            <div className="space-y-3 py-6 border-y border-gray-200">
              <h3 className="text-sm font-semibold text-gray-800 uppercase">
                Select Quantity
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {product.pricing.map((tier, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedTier(tier)}
                    className={`p-4 rounded-lg border transition-all ${
                      selectedTier?.quantity === tier.quantity
                        ? "border-sky-600 bg-sky-50 text-sky-700"
                        : "border-gray-300 hover:border-sky-500"
                    }`}
                  >
                    <div className="font-semibold text-sm">
                      {tier.quantity}
                    </div>
                    <div className="text-sky-600 font-bold text-lg">
                      ${tier.price}
                    </div>
                    {tier.mrp > tier.price && (
                      <div className="text-xs text-gray-400 line-through">
                        ${tier.mrp}
                      </div>
                    )}
                  </button>
                ))}
              </div>
              {selectedTier && (
                <p className="text-sm text-gray-600 mt-2">
                  Selected:{" "}
                  <span className="font-semibold text-sky-600">
                    {selectedTier.quantity} @ ${selectedTier.price}
                  </span>
                </p>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-4 pt-4">
            <button
              onClick={buyNow}
              disabled={!selectedTier}
              className="w-full bg-sky-600 hover:bg-sky-700 disabled:opacity-50 text-white py-4 px-8 rounded font-semibold uppercase transition-all flex items-center justify-center space-x-2 shadow-lg shadow-sky-600/20"
            >
              <ShoppingBag className="w-5 h-5" />
              <span>Buy Now</span>
            </button>

            <button
              onClick={addToCart}
              disabled={!selectedTier}
              className="w-full bg-black hover:bg-gray-800 disabled:opacity-50 text-white py-4 px-8 rounded font-semibold uppercase transition-all flex items-center justify-center space-x-2"
            >
              <FaCartPlus className="w-5 h-5" />
              <span>Add to Cart</span>
            </button>
          </div>

          {/* Notice */}
          <div className="bg-sky-50 border-l-4 border-sky-600 p-4 rounded">
            <div className="flex items-start space-x-3">
              <Info className="w-5 h-5 text-sky-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-gray-700">
                <p className="font-semibold text-sky-900 mb-1">
                  Important Information
                </p>
                <p>
                  Please consult your physician before using this product. Free
                  shipping on orders above $999.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Details Tabs */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 border-t border-gray-200 pt-12">
        <div className="flex space-x-8 border-b border-gray-200 mb-8">
          {["benefits", "features", "description"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-4 px-2 font-semibold text-sm uppercase ${
                activeTab === tab
                  ? "text-sky-600 border-b-2 border-sky-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab === "benefits"
                ? "Key Benefits"
                : tab === "features"
                ? "Key Features"
                : "Full Description"}
            </button>
          ))}
        </div>

        <div className="max-w-4xl">
          {activeTab === "benefits" && (
            <ul className="space-y-3">
              {product.content.keyBenefits.map((b, i) => (
                <li key={i} className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-sky-600 mt-0.5" />
                  <span className="text-gray-700">{b}</span>
                </li>
              ))}
            </ul>
          )}

          {activeTab === "features" && (
            <ul className="space-y-3">
              {product.content.keyFeatures.map((f, i) => (
                <li key={i} className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-sky-600 mt-0.5" />
                  <span className="text-gray-700">{f}</span>
                </li>
              ))}
            </ul>
          )}

          {activeTab === "description" && (
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
              {product.content.longDescription}
            </p>
          )}
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="max-w-7xl mx-auto px-6 lg:px-8 mt-16">
          <h2 className="text-2xl font-bold mb-6">Related Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <div
                key={p.slug}
                className="border p-4 rounded hover:shadow-md flex flex-col items-center"
              >
                <Link href={`/product/${p.slug}`} className="w-full">
                  <Image
                    src={p.img}
                    alt={p.name}
                    width={200}
                    height={200}
                    className="object-contain rounded"
                  />
                  <p className="mt-2 text-sm font-medium">{p.name}</p>
                  <p className="text-sm text-gray-600">
                    ${p.pricing ? p.pricing[0].price : p.price}
                  </p>
                </Link>

                <div className="mt-3 flex gap-2 w-full">
                  <button
                    onClick={() => {
                      const cart = JSON.parse(localStorage.getItem("cart") || "[]");
                      const existingItem = cart.find((item) => item.slug === p.slug);
                      if (existingItem) existingItem.qty += 1;
                      else cart.push({ ...p, qty: 1 });
                      localStorage.setItem("cart", JSON.stringify(cart));
                      window.dispatchEvent(new Event("cart-updated"));
                      setToastMessage(`${p.name} added to cart successfully!`);
                      setTimeout(() => setToastMessage(""), 3000);
                    }}
                    className="flex justify-center items-center w-25 py-3 px-0 rounded-lg border border-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
                  >
                    <FaCartPlus className="w-5 h-5" />
                  </button>

                  <button
                    onClick={() => router.push(`/checkout/${p.slug}`)}
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

      <ToastNotification message={toastMessage} />
    </div>
  );
}
