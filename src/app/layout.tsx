import type { Metadata } from "next";
import type { Viewport } from "next";
import { Barlow, Barlow_Condensed } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getLocale } from "next-intl/server";
import "./globals.css";
import { Providers } from "@/components/providers";
import { getStoreProfile } from "@/server/services/store";

const barlow = Barlow({
  variable: "--font-barlow",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  preload: true,
});
const barlowCondensed = Barlow_Condensed({
  variable: "--font-barlow-condensed",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
  preload: true,
});

const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export async function generateMetadata(): Promise<Metadata> {
  const profile = await getStoreProfile().catch(() => ({}));
  const name = (profile as { storeName?: string }).storeName ?? "CREASE";
  return {
    metadataBase: new URL(appUrl),
    title: {
      default: `${name} — Gear That Performs`,
      template: `%s · ${name}`,
    },
    description:
      "Pro-grade cricket equipment, engineered for every player. Bats, kits, protection and footwear — built for the pitch.",
    keywords: ["cricket equipment", "cricket bat", "cricket shoes", "batting gloves", "cricket kit bag", "premium cricket gear", "English willow bat"],
    openGraph: {
      type: "website",
      siteName: name,
      title: `${name} — Gear That Performs`,
      description: "Pro-grade cricket equipment, engineered for every player.",
      url: appUrl,
    },
    twitter: { card: "summary_large_image" },
    manifest: "/manifest.webmanifest",
    appleWebApp: { capable: true, statusBarStyle: "black-translucent", title: name },
    formatDetection: { telephone: false },
  };
}

export const viewport: Viewport = {
  themeColor: "#07090c",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const locale = await getLocale();
  return (
    <html
      lang={locale}
      data-scroll-behavior="smooth"
      className={`${barlow.variable} ${barlowCondensed.variable} h-full antialiased`}
    >
      <body className="aurora-bg flex min-h-full flex-col">
        <NextIntlClientProvider>
          <Providers>{children}</Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
