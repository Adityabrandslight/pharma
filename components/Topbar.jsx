"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X, Search, ShoppingCart } from "lucide-react";
import { ToastNotification } from "./Toatnotification";

export default function Topbar() {
  const [open, setOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [toastMessage, setToastMessage] = useState(""); // Toast message state

  const links = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
    { href: "/blog", label: "Blog" },
  ];

  // Load cart count from localStorage
  useEffect(() => {
    const loadCart = () => {
      const saved = localStorage.getItem("cart");
      if (saved) {
        const items = JSON.parse(saved);
        const total = items.reduce((acc, item) => acc + (item.qty || 1), 0);
        setCartCount(total);
      }
    };

    loadCart();

    // Listen for cart updates from other components or tabs
    window.addEventListener("cart-updated", loadCart);
    return () => window.removeEventListener("cart-updated", loadCart);
  }, []);

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

        {/* Right: Search + Cart (desktop) */}
        <div className="hidden md:flex items-center gap-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const q = new FormData(e.currentTarget).get("q");
              // route to /search?q=...
            }}
            className="flex items-center gap-2"
          >
            <div className="relative">
              <Search className="pointer-events-none absolute left-2 top-2.5 h-4 w-4 text-sky-400" />
              <input
                name="q"
                type="search"
                placeholder="Search…"
                className="w-56 rounded-md border border-sky-200 bg-white pl-8 pr-3 py-2 text-sm text-gray-800 placeholder:text-gray-400 focus:border-sky-500 focus:ring-2 focus:ring-sky-200 outline-none"
              />
            </div>
            <button
              type="submit"
              className="rounded-md bg-sky-600 px-3 py-2 text-sm font-medium text-white hover:bg-sky-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
            >
              Search
            </button>
          </form>

          {/* Cart Icon */}
          <Link href="/cart" className="relative inline-flex">
            <ShoppingCart className="h-6 w-6 text-sky-700" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 rounded-full bg-red-600 text-white text-xs font-semibold px-1.5 py-0.5">
                {cartCount}
              </span>
            )}
          </Link>
        </div>

        {/* Mobile: hamburger */}
        <button
          onClick={() => setOpen((v) => !v)}
          className="md:hidden inline-flex items-center justify-center rounded-md border border-sky-200 p-2 text-sky-600 hover:bg-sky-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

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
          {/* Mobile Cart */}
          <li className="mt-3">
            <Link
              href="/cart"
              className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-gray-800 hover:text-sky-700"
              onClick={() => setOpen(false)}
            >
              <ShoppingCart className="h-5 w-5 text-sky-700" />
              Cart
              {cartCount > 0 && (
                <span className="ml-auto rounded-full bg-red-600 text-white text-xs font-semibold px-2 py-0.5">
                  {cartCount}
                </span>
              )}
            </Link>
          </li>
        </ul>
      </div>

      {/* Toast Notification */}
      <ToastNotification message={toastMessage} />
    </header>
  );
}
