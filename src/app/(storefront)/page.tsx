import Link from "next/link";
import Image from "next/image";
import { Truck, ShieldCheck, Headphones, RefreshCw, ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Hero } from "@/components/magic/hero";
import { TrustSection } from "@/components/magic/trust-section";
import { ProductGrid } from "@/components/magic/product-grid";
import { CmsRenderer } from "@/components/magic/cms-renderer";
import { listFeaturedProducts, listCategories, listProductsBySlugs } from "@/server/services/catalog";
import { getCmsBlocksForPage } from "@/server/services/cms";
import { getHeroSettings } from "@/server/services/store";
import { toCardData } from "@/types/catalog";
import { formatMoney, type CurrencyCode } from "@/lib/money";
import { isEnabled } from "@/lib/flags";
import type { HeroProduct } from "@/components/magic/hero";

export const dynamic = "force-dynamic";

const FEATURES = [
  { icon: Truck, title: "Free shipping", text: "On orders over ₹3,000" },
  { icon: ShieldCheck, title: "Authentic gear", text: "100% genuine brands" },
  { icon: RefreshCw, title: "Easy returns", text: "7-day hassle-free returns" },
  { icon: Headphones, title: "Expert advice", text: "Talk to our cricket staff" },
];

const BRANDS = ["360", "BDM", "DSC", "EM", "GOWIN", "SS", "SG", "Kookaburra"];

const COLLECTIONS = [
  { tag: "01", title: "Player Editions", text: "Pro-grade bats for elite, top-order batters." },
  { tag: "02", title: "Grade 1 Willow", text: "Our highest willow standard, match-tested." },
  { tag: "03", title: "Big Blade", text: "40mm+ edges, 1170g+ profiles for hitters." },
  { tag: "04", title: "Lite Weight", text: "1100–1160g bats for fast-handed players." },
];

function SectionHead({ eyebrow, title, href, cta }: { eyebrow: string; title: string; href?: string; cta?: string }) {
  return (
    <div className="mb-7 flex items-end justify-between gap-4">
      <div>
        <p className="eyebrow mb-2">{eyebrow}</p>
        <h2 className="font-display text-3xl font-bold uppercase tracking-tight sm:text-4xl">{title}</h2>
      </div>
      {href && cta && (
        <Link href={href} className="font-display group inline-flex shrink-0 items-center gap-1.5 text-sm font-bold uppercase tracking-wide text-[var(--accent)]">
          {cta} <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      )}
    </div>
  );
}

export default async function HomePage() {
  const [featured, categories, cmsBlocks, heroSettings, t, assistantEnabled] = await Promise.all([
    listFeaturedProducts(8),
    listCategories(),
    getCmsBlocksForPage("homepage"),
    getHeroSettings(),
    getTranslations("home"),
    isEnabled("ai_assistant"),
  ]);

  const trendingSlugs = heroSettings.trendingSlugs ?? [];
  const trendingProducts = trendingSlugs.length ? await listProductsBySlugs(trendingSlugs) : [];
  const heroSource = trendingProducts.length ? trendingProducts : featured;

  const heroProducts: HeroProduct[] = heroSource.map((p) => ({
    slug: p.slug,
    name: p.name,
    blurb: p.category?.name ?? "",
    price: formatMoney(p.variants?.[0]?.priceMinor ?? 0, p.currency as CurrencyCode),
    imageUrl: p.images?.[0]?.url ?? null,
    defaultVariantId: p.variants?.[0]?.id ?? null,
    priceMinor: p.variants?.[0]?.priceMinor ?? 0,
    currency: p.currency as CurrencyCode,
  }));

  return (
    <div className="space-y-24 pb-8">
      <Hero products={heroProducts} assistantEnabled={assistantEnabled} heroSettings={heroSettings} />

      {/* Feature band */}
      <section className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {FEATURES.map((f) => (
            <div key={f.title} className="glass card-lift flex items-center gap-3 rounded-2xl p-4">
              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[var(--accent)]/12 text-[var(--accent)] ring-1 ring-inset ring-[var(--accent)]/25">
                <f.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold">{f.title}</p>
                <p className="text-xs text-muted">{f.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CMS blocks */}
      {cmsBlocks.length > 0 && (
        <CmsRenderer blocks={cmsBlocks.map((b) => ({ ...b, dataJson: b.dataJson as Record<string, unknown> }))} />
      )}

      {/* Categories — bento */}
      <section className="mx-auto max-w-7xl px-6">
        <SectionHead eyebrow="Browse the kit" title={t("shopByCategory")} href="/catalog" cta="All gear" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((c, i) => (
            <Link
              key={c.id}
              href={`/catalog?category=${c.slug}`}
              className={`card-lift group relative overflow-hidden rounded-[var(--radius)] border border-[var(--border)] ${
                i === 0 ? "sm:col-span-2 sm:row-span-1 h-56 sm:h-72" : "h-56"
              }`}
            >
              {c.imageUrl && (
                <Image
                  src={c.imageUrl}
                  alt={c.name}
                  fill
                  sizes="(max-width:768px) 100vw, 33vw"
                  className="object-cover opacity-60 transition-all duration-700 ease-[var(--ease-out)] group-hover:scale-110 group-hover:opacity-85"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--background)] via-[var(--background)]/35 to-transparent" />
              <div className="absolute bottom-5 left-5 right-5">
                <h3 className="font-display text-xl font-bold uppercase tracking-tight">{c.name}</h3>
                <p className="line-clamp-1 text-sm text-muted">{c.description}</p>
                <span className="font-display mt-2 inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wide text-[var(--accent)] opacity-0 transition-opacity group-hover:opacity-100">
                  Shop now <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Bat collections */}
      <section className="mx-auto max-w-7xl px-6">
        <SectionHead eyebrow="Curated by our experts" title="The willow lineup" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {COLLECTIONS.map((c) => (
            <Link
              key={c.title}
              href="/catalog"
              className="glass card-lift group relative flex flex-col justify-between overflow-hidden rounded-2xl p-5"
            >
              <span className="font-display absolute right-4 top-3 text-4xl font-bold text-[var(--border-strong)] transition-colors group-hover:text-[var(--accent)]/40">
                {c.tag}
              </span>
              <div className="relative">
                <h3 className="font-display text-lg font-bold uppercase tracking-tight">{c.title}</h3>
                <p className="mt-2 text-sm text-muted">{c.text}</p>
              </div>
              <span className="font-display mt-5 inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wide text-[var(--accent)]">
                Explore <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured products */}
      <section className="mx-auto max-w-7xl px-6">
        <SectionHead eyebrow="Picked for you" title={t("featured")} href="/catalog" cta={t("viewAll")} />
        <ProductGrid products={featured.map(toCardData)} />
      </section>

      {/* Trust wall */}
      <TrustSection />

      {/* Brands marquee */}
      <section className="overflow-hidden">
        <p className="font-display mb-6 text-center text-xs font-bold uppercase tracking-[0.22em] text-muted">
          Trusted brands we stock
        </p>
        <div className="relative flex overflow-hidden border-y border-[var(--border)] py-6">
          <div className="animate-marquee flex shrink-0 items-center gap-12 pr-12">
            {[...BRANDS, ...BRANDS].map((b, i) => (
              <span key={i} className="font-display text-2xl font-bold uppercase tracking-tight text-muted/60">
                {b}
              </span>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
