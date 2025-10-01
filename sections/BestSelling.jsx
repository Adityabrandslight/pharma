"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, ShoppingBag, Search, SlidersHorizontal, Heart } from "lucide-react";
import { ToastNotification } from "@/components/Toatnotification";

const TAGS = ["all", "bestseller", "latest", "deals"];

function StarRating({ rating, reviews }) {
  const stars = Array.from({ length: 5 }, (_, i) => (
    <Star
      key={i}
      className={`w-3.5 h-3.5 ${i < Math.floor(rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300 fill-gray-300"}`}
    />
  ));

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-0.5">{stars}</div>
      <span className="text-xs font-medium text-gray-600">{rating} ({reviews})</span>
    </div>
  );
}

function PriceDisplay({ price, mrp }) {
  const discount = mrp > price ? Math.round(((mrp - price) / mrp) * 100) : 0;

  return (
    <div className="space-y-1">
      <div className="flex items-center gap-3">
        <span className="text-xl font-bold text-gray-900">₹{price.toLocaleString("en-IN")}</span>
        {discount > 0 && <span className="text-sm text-gray-500 line-through">₹{mrp.toLocaleString("en-IN")}</span>}
      </div>
      {discount > 0 && <span className="inline-block text-xs font-semibold text-green-600 bg-green-100 px-2 py-1 rounded">Save {discount}%</span>}
    </div>
  );
}

function ProductSkeleton() {
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden animate-pulse">
      <div className="aspect-[4/3] bg-gray-200" />
      <div className="p-6 space-y-4">
        <div className="space-y-2">
          <div className="h-4 bg-gray-300 rounded w-3/4" />
          <div className="h-3 bg-gray-300 rounded w-1/2" />
        </div>
        <div className="h-6 bg-gray-300 rounded w-2/3" />
        <div className="flex gap-2">
          <div className="h-10 bg-gray-300 rounded flex-1" />
          <div className="h-10 w-10 bg-gray-300 rounded" />
        </div>
      </div>
    </div>
  );
}

function ProductCard({ product, onAddToCart }) {
  const [isWishlisted, setIsWishlisted] = useState(false);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onAddToCart(product);
  };

  const toggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
  };

  return (
    <div className="group bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-all duration-300 hover:shadow-md overflow-hidden h-auto">
      <Link href={`/product/${product.slug}`}>
        <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
          <Image
            src={product.img}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-contain p-4 transition-transform duration-500 group-hover:scale-105"
          />
          {/* Badge removed */}
          <button
            onClick={toggleWishlist}
            className="absolute top-4 right-4 p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-all duration-200 opacity-0 group-hover:opacity-100"
          >
            <Heart
              className={`w-4 h-4 transition-colors ${isWishlisted ? "text-red-500 fill-red-500" : "text-gray-400 hover:text-red-500"}`}
            />
          </button>
        </div>
        <div className="p-4 space-y-2">
          <h3 className="font-semibold text-gray-900 line-clamp-2 leading-tight group-hover:text-gray-700 transition-colors">{product.name}</h3>
{/*           <StarRating rating={product.rating} reviews={product.reviews} />
 */}          <PriceDisplay price={product.price} mrp={product.mrp} />
        </div>
      </Link>
      <div className="px-4 pb-4 flex items-center gap-3">
        <Link
          href={`/checkout/${product.slug}`}
          className="flex-1 bg-blue-500 text-white font-semibold py-2 px-3 rounded-lg transition-all duration-200 text-center text-sm shadow-md hover:shadow-lg"
        >
          Buy Now
        </Link>
        <button
          onClick={handleAddToCart}
          className="flex items-center justify-center w-12 h-12 border-2 border-gray-200 hover:border-gray-900 rounded-lg transition-all duration-200 group/btn bg-white hover:bg-gray-50"
        >
          <ShoppingBag className="w-5 h-5 text-gray-600 group-hover/btn:text-gray-900 transition-colors" />
        </button>
      </div>
    </div>
  );
}

function Header({ title, subtitle, productsCount }) {
  return (
    <div className="text-center space-y-4 mb-12">
      <div className="space-y-2">
        <h1 className="text-4xl lg:text-5xl font-bold text-gray-900">{title}</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">{subtitle}</p>
      </div>
      {productsCount > 0 && <p className="text-sm font-medium text-gray-500">{productsCount} products available</p>}
    </div>
  );
}

function FilterBar({ categories, filters, onFiltersChange, onToggleFilters, showFilters }) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search products..."
            value={filters.search}
            onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
            className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-600 focus:border-transparent text-gray-900 placeholder:text-gray-400 shadow-sm"
          />
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleFilters}
            className={`flex items-center gap-2 px-4 py-3.5 rounded-lg font-medium transition-all duration-200 ${showFilters ? "bg-gray-900 text-white shadow-md" : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"}`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
          </button>
          <select
            value={filters.sort}
            onChange={(e) => onFiltersChange({ ...filters, sort: e.target.value })}
            className="px-4 py-3.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-600 text-gray-900 font-medium shadow-sm min-w-[160px]"
          >
            <option value="popular">Most Popular</option>
            <option value="rating">Highest Rated</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
          </select>
        </div>
      </div>
      {showFilters && (
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm space-y-6">
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Categories</h3>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => onFiltersChange({ ...filters, category })}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${filters.category === category ? "bg-gray-900 text-white shadow-md" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Collections</h3>
            <div className="flex flex-wrap gap-2">
              {TAGS.map((tag) => (
                <button
                  key={tag}
                  onClick={() => onFiltersChange({ ...filters, tag })}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${filters.tag === tag ? "bg-gray-900 text-white shadow-md" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                >
                  {tag === "all" ? "All Products" : tag.charAt(0).toUpperCase() + tag.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="text-center py-20">
      <div className="max-w-md mx-auto space-y-6">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
          <Search className="w-10 h-10 text-gray-400" />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-gray-900">No products found</h3>
          <p className="text-gray-600">We couldn't find any products matching your criteria. Try adjusting your filters.</p>
        </div>
      </div>
    </div>
  );
}

export default function Bestseller() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({ products: [] });
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({ search: "", category: "All", tag: "all", sort: "popular" });
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    let mounted = true;

    const loadData = async () => {
      try {
        const response = await fetch("/data/products.json");
        const json = await response.json();
        if (mounted) {
          setData(json);
          setLoading(false);
        }
      } catch (error) {
        if (mounted) setLoading(false);
      }
    };

    loadData();
    return () => { mounted = false; };
  }, []);

  const categories = useMemo(() => ["All", ...Array.from(new Set(data.products.map((p) => p.category)))], [data]);

  const filteredProducts = useMemo(() => {
    let products = [...data.products];

    if (filters.tag !== "all") {
      products = products.filter((p) => Array.isArray(p.tags) && p.tags.includes(filters.tag));
    }

    if (filters.category !== "All") {
      products = products.filter((p) => p.category === filters.category);
    }

    if (filters.search.trim()) {
      const searchTerm = filters.search.toLowerCase();
      products = products.filter((p) =>
        p.name.toLowerCase().includes(searchTerm) || p.category.toLowerCase().includes(searchTerm)
      );
    }

    products.sort((a, b) => {
      switch (filters.sort) {
        case "price_asc": return a.price - b.price;
        case "price_desc": return b.price - a.price;
        case "rating": return b.rating - a.rating;
        case "popular": 
        default: return b.reviews - a.reviews;
      }
    });

    return products;
  }, [data, filters]);

  const handleAddToCart = (product) => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const existingItem = cart.find((item) => item.id === product.id);

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {Array.from({ length: 12 }, (_, i) => (
              <ProductSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Header title="Bestsellers" subtitle="Discover our most loved products, carefully curated for excellence" productsCount={filteredProducts.length} />
        <FilterBar categories={categories} filters={filters} onFiltersChange={setFilters} onToggleFilters={() => setShowFilters(!showFilters)} showFilters={showFilters} />
        <div className="mt-12">
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} />
              ))}
            </div>
          ) : (
            <EmptyState />
          )}
        </div>
      </div>
      <ToastNotification message={toastMessage} />
    </div>
  );
}
