import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Providers } from "@/components/providers";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const BASE_URL = "https://psxstocksanalyzer.com";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#4BC232",
};

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default:
      "PSX Stock Analyzer - Free Pakistan Stock Exchange Analysis for Beginners",
    template: "%s | PSX Stock Analyzer",
  },
  description:
    "Free PSX stock analysis tool for Pakistani investors. Analyze any KSE 100 company in plain English — P/E ratio, dividends, Shariah compliance, financials & more. No finance degree needed.",
  keywords: [
    "PSX stock analysis",
    "Pakistan Stock Exchange",
    "KSE 100",
    "KSE 100 stocks",
    "PSX stocks",
    "stock analysis Pakistan",
    "Pakistan stock market",
    "PSX stock screener",
    "KSE stock analysis",
    "Pakistan shares",
    "halal stocks Pakistan",
    "Shariah compliant stocks PSX",
    "KMI 30 stocks",
    "Islamic stocks Pakistan",
    "dividend stocks Pakistan",
    "PSX dividend history",
    "PSX stock comparison",
    "compare PSX stocks",
    "best stocks Pakistan",
    "stock market Pakistan beginners",
    "PSX company analysis",
    "PSX financial statements",
    "Pakistan stock market beginners",
    "KSE 100 companies",
    "PSX P/E ratio",
    "Pakistan stock price",
    "PSX market cap",
    "free stock analysis Pakistan",
    "PSX investment tool",
    "Pakistan equity market",
    "Karachi stock exchange",
    "PSX EPS growth",
    "PSX profit margin",
    "stock market Pakistan 2025",
    "PSX listed companies",
    "how to invest PSX",
    "PSX trading data",
    "PSX fundamental analysis",
    "Pakistan stock screener free",
  ],
  authors: [{ name: "PSX Stock Analyzer", url: BASE_URL }],
  creator: "PSX Stock Analyzer",
  publisher: "PSX Stock Analyzer",
  category: "Finance",
  classification: "Finance, Stock Market, Investment Tools",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: BASE_URL,
    languages: {
      "en-PK": BASE_URL,
      "en-US": BASE_URL,
    },
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "PSX Analyzer",
  },
  openGraph: {
    type: "website",
    locale: "en_PK",
    alternateLocale: ["en_US"],
    url: BASE_URL,
    siteName: "PSX Stock Analyzer",
    title:
      "PSX Stock Analyzer - Free Pakistan Stock Exchange Analysis for Beginners",
    description:
      "Analyze any PSX / KSE 100 stock in plain English. Get P/E ratio, dividend history, Shariah compliance badge, financials & plain-language verdict — completely free.",
    images: [
      {
        url: `${BASE_URL}/og-img.png`,
        width: 1200,
        height: 630,
        alt: "PSX Stock Analyzer — Free Pakistan Stock Exchange analysis tool for beginners",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@psxstockanalyzer",
    creator: "@psxstockanalyzer",
    title:
      "PSX Stock Analyzer - Free Pakistan Stock Exchange Analysis for Beginners",
    description:
      "Analyze any PSX / KSE 100 stock in plain English. P/E ratio, dividends, Shariah compliance & more — no finance degree needed.",
    images: [
      {
        url: `${BASE_URL}/og-img.png`,
        alt: "PSX Stock Analyzer — Free Pakistan Stock Exchange analysis tool for beginners",
      },
    ],
  },
  verification: {
    google: "1wzYGb4EKRXFu3pEizjcUWa5ats8vquWomV8ukRGUtI",
  },
  other: {
    "application-name": "PSX Stock Analyzer",
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
    "apple-mobile-web-app-title": "PSX Analyzer",
    "format-detection": "telephone=no",
    "geo.region": "PK",
    "geo.placename": "Pakistan",
    "geo.position": "30.3753;69.3451",
    ICBM: "30.3753, 69.3451",
    rating: "General",
    revisit: "7 days",
    language: "English",
    "content-language": "en-PK",
    "og:locale:alternate": "en_US",
    "theme-color": "#4BC232",
  },
};

// JSON-LD structured data — combined @graph for better LLM parsing
const jsonLdGraph = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      "@id": `${BASE_URL}/#application`,
      name: "PSX Stock Analyzer",
      url: BASE_URL,
      description:
        "PSX Stock Analyzer is a free Pakistan Stock Exchange (PSX) analysis tool that explains stocks in plain English for beginner Pakistani investors. Analyze any KSE-100 company — P/E ratio, dividend history, Shariah compliance, financial statements, and a plain-language verdict — without needing a finance degree.",
      applicationCategory: "FinanceApplication",
      operatingSystem: "All",
      browserRequirements: "Requires JavaScript",
      inLanguage: "en-PK",
      isAccessibleForFree: true,
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "PKR",
        description: "Completely free. No sign-up, no subscription, no hidden fees.",
      },
      featureList: [
        "Analyze any PSX-listed stock in plain English",
        "Compare two PSX stocks head-to-head across 7 key metrics",
        "KSE-100, KSE-30, and KMI All Shares index tracking",
        "P/E ratio, profit margin, and EPS growth analysis",
        "Dividend history table with yield calculation",
        "Shariah compliance badge (KMI All Shares index check)",
        "Annual and quarterly financial statements (Income, Balance Sheet, Cash Flow)",
        "Revenue and profit bar charts",
        "52-week price range and trading data",
        "Risk level assessment with plain-language verdict",
        "Educational formulas for Book Value, Dividend Yield, P/E Ratio, EPS",
        "Glossary with Roman Urdu toggle",
      ],
      screenshot: `${BASE_URL}/og-img.png`,
      creator: { "@id": `${BASE_URL}/#organization` },
      about: {
        "@type": "Thing",
        name: "Pakistan Stock Exchange",
        description:
          "Pakistan's national stock exchange, located in Karachi, listing over 500 companies. Home of the KSE-100 index.",
      },
      audience: {
        "@type": "Audience",
        audienceType: "Beginner Pakistani investors, non-finance professionals, retail investors",
        geographicArea: {
          "@type": "Country",
          name: "Pakistan",
        },
      },
    },
    {
      "@type": "Organization",
      "@id": `${BASE_URL}/#organization`,
      name: "PSX Stock Analyzer",
      url: BASE_URL,
      logo: {
        "@type": "ImageObject",
        url: `${BASE_URL}/icon.svg`,
        width: 512,
        height: 512,
      },
      description:
        "PSX Stock Analyzer is a free stock analysis tool for the Pakistan Stock Exchange (PSX). It helps beginner Pakistani investors understand KSE-100 stocks in plain English — no finance degree needed.",
      foundingLocation: {
        "@type": "Place",
        name: "Pakistan",
      },
      areaServed: {
        "@type": "Country",
        name: "Pakistan",
      },
      knowsAbout: [
        "Pakistan Stock Exchange",
        "KSE 100 index",
        "KSE 30 index",
        "KMI All Shares index",
        "PSX stock analysis",
        "Shariah compliant investing",
        "Dividend investing Pakistan",
        "Financial statement analysis",
        "P/E ratio analysis",
        "Stock comparison",
      ],
      sameAs: [
        "https://github.com/imuaz/stock-analysis",
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${BASE_URL}/#website`,
      name: "PSX Stock Analyzer",
      url: BASE_URL,
      description:
        "Free Pakistan Stock Exchange (PSX) stock analysis for beginner investors. Understand KSE-100 stocks in plain English.",
      inLanguage: "en-PK",
      publisher: { "@id": `${BASE_URL}/#organization` },
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: `${BASE_URL}/?q={search_term_string}`,
        },
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${BASE_URL}/#breadcrumb`,
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: BASE_URL,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "About",
          item: `${BASE_URL}/about`,
        },
        {
          "@type": "ListItem",
          position: 3,
          name: "FAQ",
          item: `${BASE_URL}/faq`,
        },
        {
          "@type": "ListItem",
          position: 4,
          name: "Contact",
          item: `${BASE_URL}/contact`,
        },
      ],
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-PK" suppressHydrationWarning>
      <head>
        {/* JSON-LD Structured Data — Combined @graph */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLdGraph),
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <Navbar />
          {children}
          <Footer />
        </Providers>
        <SpeedInsights />
      </body>
    </html>
  );
}
