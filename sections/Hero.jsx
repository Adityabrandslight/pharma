"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const IMAGES = [
  "/images/bannerone.png",
  "/images/bannerone.png",
  "/images/bannerone.png",
];

const AUTOPLAY_MS = 5000;
const SWIPE_THRESHOLD = 40; // px

export default function BannerSlider() {
  // We render: [lastClone, ...IMAGES, firstClone]
  // Start at index=1 (the first real slide)
  const [index, setIndex] = useState(1);
  const [enableTransition, setEnableTransition] = useState(true);
  const [isPaused, setIsPaused] = useState(false);

  const len = IMAGES.length;
  const slides = [IMAGES[len - 1], ...IMAGES, IMAGES[0]]; // clones
  const realIndex = (index - 1 + len) % len; // for dots

  const touchStartX = useRef(null);
  const timerRef = useRef(null);

  const next = () => setIndex((i) => i + 1);
  const prev = () => setIndex((i) => i - 1);

  // Keyboard
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Autoplay with reduced-motion + tab visibility
  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const tick = () => {
      if (!prefersReduced && !document.hidden && !isPaused) next();
    };
    timerRef.current = setInterval(tick, AUTOPLAY_MS);
    return () => clearInterval(timerRef.current);
  }, [isPaused]);

  // Handle infinite wrap on transition end
  const onTransitionEnd = () => {
    // If we went to the right clone (past last real slide), jump to first real
    if (index === len + 1) {
      setEnableTransition(false);
      setIndex(1);
      // re-enable transition on next frame
      requestAnimationFrame(() => requestAnimationFrame(() => setEnableTransition(true)));
    }
    // If we went to the left clone (before first real slide), jump to last real
    if (index === 0) {
      setEnableTransition(false);
      setIndex(len);
      requestAnimationFrame(() => requestAnimationFrame(() => setEnableTransition(true)));
    }
  };

  // Touch swipe
  const onTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e) => {
    if (touchStartX.current == null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > SWIPE_THRESHOLD) {
      dx < 0 ? next() : prev();
    }
    touchStartX.current = null;
  };

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Featured banners"
      className="relative w-full bg-black"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div
        className="relative h-[420px] sm:h-[480px] lg:h-[560px] overflow-hidden"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {/* Track */}
        <div
          className={`flex h-full will-change-transform ${enableTransition ? "transition-transform duration-700 ease-in-out" : ""}`}
          style={{ transform: `translateX(-${index * 100}%)` }}
          onTransitionEnd={onTransitionEnd}
        >
          {slides.map((src, i) => (
            <div key={`${src}-${i}`} className="relative w-full flex-shrink-0" role="group" aria-roledescription="slide">
              <img
                src={src}
                alt={`Banner ${((i - 1 + len) % len) + 1}`}
                className="h-full w-full object-cover select-none"
                loading={i === 1 ? "eager" : "lazy"}
                draggable={false}
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-black/10 to-transparent" />
            </div>
          ))}
        </div>

        {/* Controls */}
        <button
          onClick={prev}
          aria-label="Previous slide"
          className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full border border-sky-200/70 bg-white/90 p-2 text-sky-700 shadow-sm backdrop-blur hover:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <button
          onClick={next}
          aria-label="Next slide"
          className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full border border-sky-200/70 bg-white/90 p-2 text-sky-700 shadow-sm backdrop-blur hover:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
        >
          <ChevronRight className="h-6 w-6" />
        </button>

        {/* Indicators */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {IMAGES.map((_, i) => {
            const active = i === realIndex;
            return (
              <button
                key={i}
                aria-label={`Go to slide ${i + 1}`}
                onClick={() => setIndex(i + 1)} // +1 because of leading clone
                className={`h-2.5 w-6 rounded-full border transition-all ${
                  active ? "bg-sky-600 border-sky-600" : "bg-white/70 border-white/80 hover:bg-white"
                }`}
              />
            );
          })}
        </div>

        <p className="sr-only" aria-live="polite">
          Slide {realIndex + 1} of {len}
        </p>
      </div>
    </section>
  );
}
