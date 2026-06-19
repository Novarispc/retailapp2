"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { motion } from "motion/react";
import { ShoppingBag, Search, Home, Grid3x3, User, Heart } from "lucide-react";
import { useWishlist } from "@/stores/wishlist";
import { useTranslations } from "next-intl";
import { useCart } from "@/stores/cart";
import { useMounted } from "@/lib/use-mounted";
import { Logo } from "./logo";
import { CurrencySwitcher } from "./currency-switcher";
import { cn } from "@/lib/utils";

export function Navbar({ storeName }: { logoUrl?: string; storeName?: string }) {
  const pathname = usePathname();
  const mounted = useMounted();
  const count = useCart((s) => s.count());
  const openCart = useCart((s) => s.open);
  const wishlistCount = useWishlist((s) => s.items.length);
  const { data: session } = useSession();
  const t = useTranslations("nav");

  const NAV = [
    { href: "/", label: t("home"), icon: Home },
    { href: "/catalog", label: t("shop"), icon: Grid3x3 },
    { href: "/wishlist", label: "Saved", icon: Heart },
    { href: "/account", label: t("account"), icon: User },
  ];

  const iconBtn =
    "relative grid h-10 w-10 place-items-center rounded-full text-muted transition-colors hover:bg-[var(--surface-2)] hover:text-foreground";

  return (
    <>
      <header className="sticky top-0 z-40 px-3 pt-3 sm:px-4 sm:pt-4">
        <nav className="glass mx-auto flex max-w-7xl items-center justify-between rounded-2xl px-3 py-2.5 sm:px-5 sm:py-3">
          <Link href="/" aria-label={`${storeName ?? "CREASE"} home`}>
            <Logo />
          </Link>

          <div className="hidden items-center gap-1 md:flex">
            {NAV.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "font-display rounded-full px-4 py-2 text-sm font-semibold uppercase tracking-wide transition-colors",
                    active ? "text-foreground" : "text-muted hover:text-foreground",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-1 sm:gap-2">
            <div className="mr-1 hidden sm:flex sm:items-center">
              <CurrencySwitcher />
            </div>
            <Link href="/catalog" aria-label={t("search")} className={iconBtn}>
              <Search className="h-5 w-5" />
            </Link>

            <Link
              href="/wishlist"
              aria-label={`Wishlist (${mounted ? wishlistCount : 0})`}
              className={iconBtn}
            >
              <Heart className="h-5 w-5" />
              {mounted && wishlistCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-[var(--signal)] px-1 text-[10px] font-bold text-white">
                  {wishlistCount}
                </span>
              )}
            </Link>

            <button
              onClick={openCart}
              aria-label={`${t("cart")} (${mounted ? count : 0})`}
              className={iconBtn}
            >
              <ShoppingBag className="h-5 w-5" />
              {mounted && count > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -right-0.5 -top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-[var(--accent)] px-1 text-[10px] font-bold text-[var(--on-accent)]"
                >
                  {count}
                </motion.span>
              )}
            </button>

            {session?.user ? (
              <button
                onClick={() => signOut()}
                className="font-display ml-1 hidden rounded-full border border-[var(--border-strong)] px-4 py-2 text-sm font-semibold uppercase tracking-wide text-muted transition-colors hover:text-foreground sm:block"
              >
                {t("signOut")}
              </button>
            ) : (
              <Link
                href="/sign-in"
                className="font-display ml-1 hidden rounded-full bg-[var(--accent)] px-5 py-2 text-sm font-bold uppercase tracking-wide text-[var(--on-accent)] transition-all hover:brightness-105 sm:block"
              >
                {t("signIn")}
              </Link>
            )}
          </div>
        </nav>
      </header>

      {/* Mobile bottom nav */}
      <nav className="glass fixed inset-x-3 bottom-3 z-40 flex items-center justify-around rounded-2xl py-2 md:hidden">
        {NAV.map((item) => {
          const active = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-0.5 px-4 py-1 text-[10px] font-medium",
                active ? "text-[var(--accent)]" : "text-muted",
              )}
            >
              <Icon className="h-5 w-5" />
              {item.label}
            </Link>
          );
        })}
        <button
          onClick={openCart}
          className="relative flex flex-col items-center gap-0.5 px-4 py-1 text-[10px] font-medium text-muted"
        >
          <ShoppingBag className="h-5 w-5" />
          {t("cart")}
          {mounted && count > 0 && (
            <span className="absolute right-2 top-0 grid h-4 min-w-4 place-items-center rounded-full bg-[var(--accent)] px-1 text-[9px] font-bold text-[var(--on-accent)]">
              {count}
            </span>
          )}
        </button>
      </nav>
    </>
  );
}
