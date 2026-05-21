"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sparkles, ChevronLeft, ChevronRight } from "lucide-react";
import type { HeroCarouselData } from "@/lib/home-sections-types";

export function HeroCarousel({ data }: { data: HeroCarouselData }) {
  const slides = data.slides ?? [];
  const [active, setActive] = useState(0);
  const autoplayMs = (data.autoplay_seconds ?? 6) * 1000;

  useEffect(() => {
    if (slides.length <= 1) return;
    const t = setInterval(() => {
      setActive((i) => (i + 1) % slides.length);
    }, autoplayMs);
    return () => clearInterval(t);
  }, [slides.length, autoplayMs]);

  if (slides.length === 0) return null;
  const slide = slides[active];

  return (
    <section className="px-4 pt-4">
      <div className="mx-auto max-w-6xl">
        <div className="relative overflow-hidden rounded-[2.5rem] min-h-[460px] sm:min-h-[560px] flex flex-col justify-end text-white">
          <Image
            key={slide.image}
            src={slide.image}
            alt={slide.title_1 || "SpaceFut"}
            fill
            priority
            className="object-cover"
          />
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.45) 45%, rgba(0,0,0,0.20) 80%)",
            }}
          />
          <div className="relative z-10 p-6 sm:p-12 max-w-xl flex flex-col gap-4">
            {slide.tag && (
              <span className="inline-flex items-center gap-1.5 self-start rounded-full bg-brand-yellow/95 text-foreground px-3 py-1 text-xs font-bold">
                <Sparkles className="size-3.5" /> {slide.tag}
              </span>
            )}
            <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-[0.95]">
              {slide.title_1}
              {slide.title_2 && (
                <>
                  <br />
                  <span className="text-brand-yellow">{slide.title_2}</span>
                </>
              )}
            </h1>
            {slide.description && (
              <p className="text-white/85 text-base sm:text-lg max-w-md">
                {slide.description}
              </p>
            )}
            <div className="flex flex-wrap gap-3 mt-2">
              {slide.cta_label && (
                <Link
                  href={slide.cta_link || "#camisas"}
                  className="inline-flex items-center gap-2 rounded-full bg-brand-yellow text-foreground font-bold px-6 py-3 hover:bg-yellow-300 transition"
                >
                  {slide.cta_label} <ArrowRight className="size-4" />
                </Link>
              )}
            </div>
          </div>

          {slides.length > 1 && (
            <>
              <button
                onClick={() => setActive((i) => (i - 1 + slides.length) % slides.length)}
                aria-label="Anterior"
                className="absolute left-3 top-1/2 -translate-y-1/2 z-20 size-10 rounded-full bg-white/20 backdrop-blur hover:bg-white/30 grid place-items-center transition"
              >
                <ChevronLeft className="size-5 text-white" />
              </button>
              <button
                onClick={() => setActive((i) => (i + 1) % slides.length)}
                aria-label="Próximo"
                className="absolute right-3 top-1/2 -translate-y-1/2 z-20 size-10 rounded-full bg-white/20 backdrop-blur hover:bg-white/30 grid place-items-center transition"
              >
                <ChevronRight className="size-5 text-white" />
              </button>
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
                {slides.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActive(i)}
                    aria-label={`Slide ${i + 1}`}
                    className={`h-1.5 rounded-full transition-all ${
                      i === active ? "w-8 bg-white" : "w-1.5 bg-white/50"
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
