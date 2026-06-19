"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { useTranslations } from "next-intl";
import { ArrowRight, Bot, Check, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/stores/cart";
import { useUiStore } from "@/stores/ui";
import Toasts from "@/components/ui/toast";

export type HeroProduct = {
  slug: string;
  name: string;
  blurb: string;
  price: string;
  imageUrl: string | null;
  defaultVariantId?: string | null;
  priceMinor?: number;
  currency?: string;
};

export type HeroBadge = {
  title: string;
  subtitle: string;
};

export type HeroSettings = {
  titleA?: string;
  titleB?: string;
  subtitle?: string;
  ctaLabel?: string;
  ctaHref?: string;
  badges?: HeroBadge[];
};

const STATS = [
  { value: "12k+", label: "Players geared" },
  { value: "4.9", label: "Avg. rating" },
  { value: "48h", label: "Fast dispatch" },
];

const FEATURE_BADGES = [
  { title: "Ready to ship", subtitle: "Fast delivery across India" },
  { title: "100% genuine", subtitle: "Official bat and gear brands" },
  { title: "Curated picks", subtitle: "Top-rated cricket essentials" },
];

export function Hero({
  products,
  assistantEnabled,
  heroSettings,
}: {
  products: HeroProduct[];
  assistantEnabled: boolean;
  heroSettings?: HeroSettings;
}) {
  const t = useTranslations("hero");
  const [activeIndex, setActiveIndex] = useState(0);
  const add = useCart((s) => s.add);
  const addToast = useUiStore((s) => s.addToast);
  const [addedIds, setAddedIds] = useState<Record<string, boolean>>({});

  const heroTitleA = heroSettings?.titleA?.trim() || t("titleA");
  const heroTitleB = heroSettings?.titleB?.trim() || t("titleB");
  const heroSubtitle = heroSettings?.subtitle?.trim() || t("subtitle");
  const heroCtaLabel = heroSettings?.ctaLabel?.trim() || t("explore");
  const heroCtaHref = heroSettings?.ctaHref?.trim() || "/catalog";
  const heroBadges = heroSettings?.badges?.length ? heroSettings.badges : FEATURE_BADGES;

  useEffect(() => {
    if (products.length <= 1) return;
    const timer = window.setInterval(() => {
      setActiveIndex((index) => (index + 1) % products.length);
    }, 6000);
    return () => window.clearInterval(timer);
  }, [products.length]);

  const handleAdd = (product: HeroProduct, index: number) => {
    setActiveIndex(index);
    if (!product.defaultVariantId) return;
    add({
      variantId: product.defaultVariantId,
      productSlug: product.slug,
      name: product.name,
      imageUrl: product.imageUrl,
      unitPriceMinor: product.priceMinor ?? 0,
    });
    const key = product.defaultVariantId ?? product.slug;
    setAddedIds((s) => ({ ...s, [key]: true }));
    addToast(`${product.name} added to cart`, "success", 1800);
    window.setTimeout(() => setAddedIds((s) => ({ ...s, [key]: false })), 1800);
  };

  const active =
    products[activeIndex] ??
    products[0] ?? {
      slug: "",
      name: "Pro Series English Willow",
      blurb: "Grade 1 willow · Hand-crafted · Match ready",
      price: "₹18,500",
      imageUrl: null,
    };

  return (
    <section className="relative overflow-hidden px-5 pb-8 pt-12 sm:px-6 sm:pb-12 sm:pt-16">
      <Toasts />
      {/* energy field */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_18%_8%,_rgba(194,255,54,0.16),transparent_30%),radial-gradient(circle_at_88%_18%,_rgba(52,229,255,0.12),transparent_32%)]" />

      <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
        {/* Copy */}
        <div className="space-y-7">
          <div className="inline-flex items-center gap-2 rounded-full border border-[var(--accent)]/30 bg-[var(--accent)]/10 px-3.5 py-1.5">
            <Zap className="h-3.5 w-3.5 fill-[var(--accent)] text-[var(--accent)]" />
            <span className="font-display text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--accent)]">
              Gear that performs
            </span>
          </div>

          <h1 className="display-xl text-[clamp(2.75rem,7vw,5.25rem)] text-foreground">
            {heroTitleA}{" "}
            <span className="gradient-text">{heroTitleB}</span>
          </h1>

          <p className="max-w-xl text-base text-muted sm:text-lg">{heroSubtitle}</p>

          <div className="flex flex-wrap gap-3">
            <Link href={heroCtaHref}>
              <Button size="lg" className="font-display uppercase tracking-wide">
                {heroCtaLabel} <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            {assistantEnabled && (
              <Link href="/catalog?assistant=1">
                <Button size="lg" variant="secondary" className="font-display uppercase tracking-wide">
                  <Bot className="h-4 w-4" /> {t("assistant")}
                </Button>
              </Link>
            )}
          </div>

          {/* Stat strip */}
          <div className="flex flex-wrap items-center gap-x-8 gap-y-4 border-t border-[var(--border)] pt-6">
            {STATS.map((s) => (
              <div key={s.label}>
                <p className="font-display text-3xl font-bold leading-none text-foreground">{s.value}</p>
                <p className="mt-1 text-xs uppercase tracking-wide text-muted">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Showcase card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="glass relative overflow-hidden rounded-[1.75rem] p-5 sm:p-6"
        >
          <div className="stripe-accent pointer-events-none absolute -right-10 -top-10 h-40 w-40 rotate-12 opacity-60" />

          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="eyebrow">Now trending</p>
              <h2 className="font-display mt-2 text-2xl font-bold uppercase leading-tight tracking-tight sm:text-3xl">
                {active.name}
              </h2>
              <p className="mt-2 text-sm text-muted">{active.blurb}</p>
            </div>
            <span className="font-display shrink-0 rounded-full bg-[var(--accent)]/15 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-[var(--accent)]">
              Best seller
            </span>
          </div>

          <div className="relative mt-5 aspect-[16/11] overflow-hidden rounded-2xl bg-gradient-to-br from-[var(--accent)]/12 via-[var(--surface-2)] to-transparent">
            {active.imageUrl ? (
              <Image
                src={active.imageUrl}
                alt={active.name}
                fill
                sizes="(max-width:1024px) 100vw, 520px"
                className="object-contain p-3 transition-transform duration-500 ease-[var(--ease-out)]"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-muted">No image available</div>
            )}
          </div>

          <div className="mt-5 flex items-center justify-between">
            <span className="tnum font-display text-3xl font-bold text-foreground">{active.price}</span>
            <Link
              href={active.slug ? `/product/${active.slug}` : "/catalog"}
              className="font-display inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-[var(--accent)] hover:underline"
            >
              View product <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {products.length > 1 && (
            <div className="mt-5 grid grid-cols-4 gap-2.5">
              {products.slice(0, 4).map((product, index) => {
                const key = product.defaultVariantId ?? product.slug;
                return (
                  <button
                    key={product.slug || index}
                    type="button"
                    onClick={() => handleAdd(product, index)}
                    aria-label={`Quick add ${product.name}`}
                    className={`group relative aspect-square overflow-hidden rounded-xl border p-0 transition ${
                      index === activeIndex
                        ? "border-[var(--accent)] ring-1 ring-[var(--accent)]"
                        : "border-[var(--border)] hover:border-[var(--border-strong)]"
                    }`}
                  >
                    <div className="relative h-full w-full bg-[var(--surface-2)]">
                      {product.imageUrl ? (
                        <Image src={product.imageUrl} alt={product.name} fill sizes="80px" className="object-cover" />
                      ) : (
                        <div className="grid h-full w-full place-items-center text-[10px] text-muted">No image</div>
                      )}
                    </div>
                    {addedIds[key] && (
                      <span className="absolute inset-0 grid place-items-center bg-[var(--accent)]/90 text-[var(--on-accent)]">
                        <Check className="h-5 w-5" strokeWidth={3} />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}

          <div className="mt-5 grid grid-cols-3 gap-2.5">
            {heroBadges.slice(0, 3).map((badge) => (
              <div key={badge.title} className="rounded-xl border border-[var(--border)] bg-[var(--surface-2)]/60 p-3">
                <p className="text-xs font-semibold text-foreground">{badge.title}</p>
                <p className="mt-1 text-[11px] leading-snug text-muted">{badge.subtitle}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
