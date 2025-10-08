"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { Menu, X, Search, ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";
import { ToastNotification } from "./Toatnotification";

export default function Topbar() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [toastMessage, setToastMessage] = useState("");

  const links = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
    { href: "/blog", label: "Blog" },
  ];

  // search states (same as before)
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState([]);
  const [results, setResults] = useState([]);
  const [isOpenSuggestions, setIsOpenSuggestions] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const inputRef = useRef(null);
  const containerRef = useRef(null);
  const debounceRef = useRef(null);

  // WhatsApp config
  const WA_NUMBER_RAW = "+91 98600 66098";
  const WA_NUMBER = "919860066098"; // wa.me expects country code + number, no plus or spaces
  const WA_DEFAULT_MSG = encodeURIComponent("Hi! I need help with an order.");

  // Load cart count from localStorage
  useEffect(() => {
    const loadCart = () => {
      try {
        const saved = localStorage.getItem("cart");
        if (saved) {
          const items = JSON.parse(saved);
          const total = items.reduce((acc, item) => acc + (item.qty || 1), 0);
          setCartCount(total);
        } else {
          setCartCount(0);
        }
      } catch (e) {
        setCartCount(0);
      }
    };

    loadCart();
    window.addEventListener("cart-updated", loadCart);
    return () => window.removeEventListener("cart-updated", loadCart);
  }, []);

  // Load products.json once
  useEffect(() => {
    let mounted = true;
    fetch("/data/products.json")
      .then((r) => {
        if (!r.ok) throw new Error("Failed to fetch products");
        return r.json();
      })
      .then((data) => {
        if (mounted) setProducts(data?.products || []);
      })
      .catch(() => {
        if (mounted) setProducts([]);
      });
    return () => {
      mounted = false;
    };
  }, []);

  // Debounced search
  useEffect(() => {
    clearTimeout(debounceRef.current);
    if (!query || query.trim().length < 1) {
      setResults([]);
      setIsOpenSuggestions(false);
      setHighlightIndex(-1);
      return;
    }

    debounceRef.current = setTimeout(() => {
      const q = query.trim().toLowerCase();
      const matches = products
        .map((p) => {
          const name = String(p.name || "").toLowerCase();
          const cat = String(p.category || "").toLowerCase();
          const slug = String(p.slug || "").toLowerCase();
          let score = 0;
          if (name.includes(q)) score += 3;
          if (cat.includes(q)) score += 1;
          if (slug.includes(q)) score += 1;
          return { p, score };
        })
        .filter((x) => x.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 6)
        .map((x) => x.p);

      setResults(matches);
      setIsOpenSuggestions(matches.length > 0);
      setHighlightIndex(-1);
    }, 300);

    return () => clearTimeout(debounceRef.current);
  }, [query, products]);

  // close suggestions on outside click
  useEffect(() => {
    function onDocClick(e) {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(e.target)) {
        setIsOpenSuggestions(false);
        setHighlightIndex(-1);
      }
    }
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  // keyboard navigation for suggestions
  const onInputKeyDown = (e) => {
    if (!isOpenSuggestions) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      if (highlightIndex >= 0 && results[highlightIndex]) {
        e.preventDefault();
        const slug = results[highlightIndex].slug;
        setIsOpenSuggestions(false);
        setQuery("");
        router.push(`/product/${encodeURIComponent(slug)}`);
      } else {
        e.preventDefault();
        setIsOpenSuggestions(false);
        router.push(`/search?q=${encodeURIComponent(query)}`);
        setQuery("");
      }
    } else if (e.key === "Escape") {
      setIsOpenSuggestions(false);
      setHighlightIndex(-1);
    }
  };

  const formatPrice = (v) => {
    const n = Number(v) || 0;
    return `$${n.toLocaleString()}`;
  };

  // wa.me link builder (open in new tab)
  const buildWaLink = (msg = WA_DEFAULT_MSG) =>
    `https://wa.me/${WA_NUMBER}?text=${msg}`;

  return (
    <header className="border-b border-sky-200 bg-white">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left: Logo */}
        <div className="flex items-center gap-2">
          <Link href="/" className="text-xl font-bold tracking-tight text-sky-600">
            MEDISHIPPER
          </Link>
        </div>

        {/* Center: Links (desktop) */}
        <ul className="hidden md:flex items-center gap-6">
          {links.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className="relative text-sm font-medium text-gray-800 hover:text-sky-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 rounded px-1 py-1
                  after:absolute after:left-0 after:-bottom-0.5 after:h-[2px] after:w-0 after:bg-sky-600 after:transition-all after:duration-300 hover:after:w-full"
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Right: Search + Cart + WhatsApp (desktop) */}
        <div className="hidden md:flex items-center gap-4" ref={containerRef}>
          <div className="relative">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!query || !query.trim()) return;
                setIsOpenSuggestions(false);
                router.push(`/search?q=${encodeURIComponent(query.trim())}`);
                setQuery("");
              }}
              className="flex items-center gap-2"
            >
              <div className="relative">
                <Search className="pointer-events-none absolute left-2 top-2.5 h-4 w-4 text-sky-400" />
                <input
                  ref={inputRef}
                  name="q"
                  type="search"
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                  }}
                  onKeyDown={onInputKeyDown}
                  placeholder="Search products..."
                  className="w-56 rounded-md border border-sky-200 bg-white pl-8 pr-3 py-2 text-sm text-gray-800 placeholder:text-gray-400 focus:border-sky-500 focus:ring-2 focus:ring-sky-200 outline-none"
                  aria-autocomplete="list"
                  aria-expanded={isOpenSuggestions}
                  aria-controls="search-suggestions"
                />
              </div>
              <button
                type="submit"
                className="rounded-md bg-sky-600 px-3 py-2 text-sm font-medium text-white hover:bg-sky-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
              >
                Search
              </button>
            </form>

            {/* Suggestions dropdown */}
            {isOpenSuggestions && results.length > 0 && (
              <ul
                id="search-suggestions"
                role="listbox"
                className="absolute z-50 mt-2 w-80 max-h-72 overflow-auto rounded-xl bg-white border border-slate-200 shadow-lg"
              >
                {results.map((r, idx) => (
                  <li
                    key={r.slug || idx}
                    role="option"
                    aria-selected={highlightIndex === idx}
                    onMouseEnter={() => setHighlightIndex(idx)}
                    onMouseLeave={() => setHighlightIndex(-1)}
                    className={`flex gap-3 items-center px-3 py-2 cursor-pointer hover:bg-sky-50 ${
                      highlightIndex === idx ? "bg-sky-50" : ""
                    }`}
                    onClick={() => {
                      setIsOpenSuggestions(false);
                      setQuery("");
                      router.push(`/product/${encodeURIComponent(r.slug)}`);
                    }}
                  >
                    <div className="w-12 h-12 rounded-md overflow-hidden bg-slate-50 flex-shrink-0 border border-slate-100">
                      <img src={r.img} alt={r.name} className="w-full h-full object-contain p-1" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-slate-900 line-clamp-2">{r.name}</div>
                      <div className="text-xs text-slate-500">
                        {r.category ? `${r.category} • ` : ""}
                        <span className="font-bold text-sky-600">{formatPrice(r.price)}</span>
                      </div>
                    </div>
                  </li>
                ))}
                <li className="px-3 py-2 border-t border-slate-100 text-sm">
                  <button
                    onClick={() => {
                      setIsOpenSuggestions(false);
                      router.push(`/search?q=${encodeURIComponent(query)}`);
                      setQuery("");
                    }}
                    className="w-full text-left text-slate-700 hover:text-sky-700"
                  >
                    See all results for "{query}"
                  </button>
                </li>
              </ul>
            )}
          </div>

          {/* Cart Icon */}
          <Link href="/cart" className="relative inline-flex">
            <ShoppingCart className="h-6 w-6 text-sky-700" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 rounded-full bg-red-600 text-white text-xs font-semibold px-1.5 py-0.5">
                {cartCount}
              </span>
            )}
          </Link>

          {/* WhatsApp button - desktop (inline) */}
          <a
            href={buildWaLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-3 py-2 rounded-md border border-slate-200 hover:border-sky-400 hover:shadow-sm transition-colors"
            aria-label={`Chat on WhatsApp ${WA_NUMBER_RAW}`}
          >
            {/* WhatsApp SVG */}
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M20.52 3.48A11.93 11.93 0 0012 0C5.37 0 .03 5.34.03 12c0 2.12.56 4.08 1.54 5.8L0 24l6.41-1.65A11.94 11.94 0 0012 24c6.63 0 12-5.37 12-12 0-1.93-.45-3.76-1.48-5.52z" fill="#25D366"/>
              <path d="M17.2 14.08c-.26-.13-1.54-.76-1.77-.85-.23-.09-.4-.13-.57.13-.16.26-.66.85-.8 1.03-.15.18-.3.2-.56.07-.26-.13-1.09-.4-2.07-1.28-.77-.69-1.29-1.55-1.44-1.82-.15-.26-.02-.4.12-.53.12-.12.26-.3.4-.45.14-.15.19-.26.3-.43.11-.16.05-.3-.03-.43-.08-.13-.57-1.37-.78-1.88-.2-.48-.4-.41-.57-.41-.15 0-.33-.01-.51-.01-.18 0-.46.07-.7.33-.24.26-.91.89-.91 2.17 0 1.28.93 2.52 1.06 2.7.12.18 1.83 2.8 4.44 3.91 3.05 1.33 3.05.89 3.6.83.55-.06 1.78-.72 2.03-1.41.25-.7.25-1.3.18-1.41-.07-.11-.25-.18-.51-.31z" fill="#fff"/>
            </svg>
            <span className="text-sm font-semibold text-slate-700">WhatsApp</span>
          </a>
        </div>

        {/* Mobile: Cart + Hamburger (Search icon removed) */}
        <div className="flex md:hidden items-center gap-3">
          {/* Mobile Cart */}
          <Link href="/cart" className="relative inline-flex p-2 text-sky-600 hover:bg-sky-50 rounded-md">
            <ShoppingCart className="h-5 w-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 rounded-full bg-red-600 text-white text-xs font-semibold px-1.5 py-0.5">
                {cartCount}
              </span>
            )}
          </Link>

          {/* Mobile hamburger */}
          <button
            onClick={() => setOpen((v) => !v)}
            className="inline-flex items-center justify-center rounded-md border border-sky-200 p-2 text-sky-600 hover:bg-sky-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile Search Bar - Always visible */}
      <div className="md:hidden border-t border-sky-100 bg-white px-4 py-3" ref={containerRef}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!query || !query.trim()) return;
            setIsOpenSuggestions(false);
            router.push(`/search?q=${encodeURIComponent(query.trim())}`);
            setQuery("");
          }}
          className="flex items-center gap-2"
        >
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-sky-400" />
            <input
              id="mobile-search-input"
              ref={inputRef}
              name="q"
              type="search"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
              }}
              onKeyDown={onInputKeyDown}
              placeholder="Search products..."
              className="w-full rounded-md border border-sky-200 bg-white pl-10 pr-3 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:border-sky-500 focus:ring-2 focus:ring-sky-200 outline-none"
              aria-autocomplete="list"
              aria-expanded={isOpenSuggestions}
              aria-controls="search-suggestions"
            />
          </div>
          <button
            type="submit"
            className="rounded-md bg-sky-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-sky-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 flex-shrink-0"
          >
            Search
          </button>
        </form>

        {/* Mobile Suggestions dropdown */}
        {isOpenSuggestions && results.length > 0 && (
          <ul
            id="search-suggestions"
            role="listbox"
            className="absolute z-50 left-4 right-4 mt-2 max-h-72 overflow-auto rounded-xl bg-white border border-slate-200 shadow-lg"
          >
            {results.map((r, idx) => (
              <li
                key={r.slug || idx}
                role="option"
                aria-selected={highlightIndex === idx}
                onMouseEnter={() => setHighlightIndex(idx)}
                onMouseLeave={() => setHighlightIndex(-1)}
                className={`flex gap-3 items-center px-3 py-2 cursor-pointer hover:bg-sky-50 ${
                  highlightIndex === idx ? "bg-sky-50" : ""
                }`}
                onClick={() => {
                  setIsOpenSuggestions(false);
                  setQuery("");
                  router.push(`/product/${encodeURIComponent(r.slug)}`);
                }}
              >
                <div className="w-12 h-12 rounded-md overflow-hidden bg-slate-50 flex-shrink-0 border border-slate-100">
                  <img src={r.img} alt={r.name} className="w-full h-full object-contain p-1" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-slate-900 line-clamp-2">{r.name}</div>
                  <div className="text-xs text-slate-500">
                    {r.category ? `${r.category} • ` : ""}
                    <span className="font-bold text-sky-600">{formatPrice(r.price)}</span>
                  </div>
                </div>
              </li>
            ))}
            <li className="px-3 py-2 border-t border-slate-100 text-sm">
              <button
                onClick={() => {
                  setIsOpenSuggestions(false);
                  router.push(`/search?q=${encodeURIComponent(query)}`);
                  setQuery("");
                }}
                className="w-full text-left text-slate-700 hover:text-sky-700"
              >
                See all results for "{query}"
              </button>
            </li>
          </ul>
        )}
      </div>

      {/* Mobile menu panel */}
      <div
        className={`md:hidden border-t border-sky-200 bg-white transition-[max-height] duration-300 overflow-hidden ${open ? "max-h-96" : "max-h-0"}`}
      >
        <ul className="flex flex-col gap-1 px-4 py-3">
          {links.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className="relative block rounded-md px-3 py-2 text-sm font-medium text-gray-800 hover:text-sky-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500
                  after:absolute after:left-3 after:-bottom-0.5 after:h-[2px] after:w-0 after:bg-sky-600 after:transition-all after:duration-300 hover:after:w-[calc(100%-1.5rem)]"
                onClick={() => setOpen(false)}
              >
                {l.label}
              </Link>
            </li>
          ))}
          
          {/* Mobile WhatsApp inline link (in menu) */}
          <li className="mt-2">
            <a
              href={buildWaLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-gray-800 hover:text-sky-700"
              onClick={() => setOpen(false)}
              aria-label={`Chat on WhatsApp ${WA_NUMBER_RAW}`}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M20.52 3.48A11.93 11.93 0 0012 0C5.37 0 .03 5.34.03 12c0 2.12.56 4.08 1.54 5.8L0 24l6.41-1.65A11.94 11.94 0 0012 24c6.63 0 12-5.37 12-12 0-1.93-.45-3.76-1.48-5.52z" fill="#25D366"/>
                <path d="M17.2 14.08c-.26-.13-1.54-.76-1.77-.85-.23-.09-.4-.13-.57.13-.16.26-.66.85-.8 1.03-.15.18-.3.2-.56.07-.26-.13-1.09-.4-2.07-1.28-.77-.69-1.29-1.55-1.44-1.82-.15-.26-.02-.4.12-.53.12-.12.26-.3.4-.45.14-.15.19-.26.3-.43.11-.16.05-.3-.03-.43-.08-.13-.57-1.37-.78-1.88-.2-.48-.4-.41-.57-.41-.15 0-.33-.01-.51-.01-.18 0-.46.07-.7.33-.24.26-.91.89-.91 2.17 0 1.28.93 2.52 1.06 2.7.12.18 1.83 2.8 4.44 3.91 3.05 1.33 3.05.89 3.6.83.55-.06 1.78-.72 2.03-1.41.25-.7.25-1.3.18-1.41-.07-.11-.25-.18-.51-.31z" fill="#fff"/>
              </svg>
              Chat with us on WhatsApp
            </a>
          </li>
        </ul>
      </div>

      {/* Floating WhatsApp Button for Mobile (bottom-right) */}
      <div className="md:hidden">
        <a
          href={buildWaLink()}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Chat on WhatsApp ${WA_NUMBER_RAW}`}
          className="fixed right-4 bottom-4 z-50 inline-flex items-center justify-center w-14 h-14 rounded-full shadow-lg transform transition-all hover:scale-105"
          style={{ background: "linear-gradient(180deg,#25D366,#128C7E)" }}
        >
          <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M20.52 3.48A11.93 11.93 0 0012 0C5.37 0 .03 5.34.03 12c0 2.12.56 4.08 1.54 5.8L0 24l6.41-1.65A11.94 11.94 0 0012 24c6.63 0 12-5.37 12-12 0-1.93-.45-3.76-1.48-5.52z" fill="#25D366"/>
            <path d="M17.2 14.08c-.26-.13-1.54-.76-1.77-.85-.23-.09-.4-.13-.57.13-.16.26-.66.85-.8 1.03-.15.18-.3.2-.56.07-.26-.13-1.09-.4-2.07-1.28-.77-.69-1.29-1.55-1.44-1.82-.15-.26-.02-.4.12-.53.12-.12.26-.3.4-.45.14-.15.19-.26.3-.43.11-.16.05-.3-.03-.43-.08-.13-.57-1.37-.78-1.88-.2-.48-.4-.41-.57-.41-.15 0-.33-.01-.51-.01-.18 0-.46.07-.7.33-.24.26-.91.89-.91 2.17 0 1.28.93 2.52 1.06 2.7.12.18 1.83 2.8 4.44 3.91 3.05 1.33 3.05.89 3.6.83.55-.06 1.78-.72 2.03-1.41.25-.7.25-1.3.18-1.41-.07-.11-.25-.18-.51-.31z" fill="#fff"/>
          </svg>
        </a>
      </div>

      {/* Toast Notification */}
      <ToastNotification message={toastMessage} />
    </header>
  );
}