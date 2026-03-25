import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { Providers } from "@/components/providers";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Change this when you buy a custom domain
const BASE_URL = "https://stock-analysis-two-psi.vercel.app";

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
        url: `${BASE_URL}/og-image.png`,
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
        url: `${BASE_URL}/og-image.png`,
        alt: "PSX Stock Analyzer — Free Pakistan Stock Exchange analysis tool for beginners",
      },
    ],
  },
  verification: {
    google: "HahM2s5z9jWUt1JshB_gegjrRqFOImX4hOLI1ZZiyRU",
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

// JSON-LD structured data
const webApplicationSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "PSX Stock Analyzer",
  url: BASE_URL,
  description:
    "Free Pakistan Stock Exchange (PSX) stock analysis tool for beginner Pakistani investors. Analyze KSE 100 companies in plain English — P/E ratio, dividend history, Shariah compliance, financial statements, and a plain-language verdict.",
  applicationCategory: "FinanceApplication",
  operatingSystem: "All",
  browserRequirements: "Requires JavaScript",
  inLanguage: "en-PK",
  isAccessibleForFree: true,
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "PKR",
  },
  featureList: [
    "PSX stock analysis in plain English",
    "KSE 100 company financial data",
    "P/E ratio and valuation metrics",
    "Dividend history and yield",
    "Shariah compliance indicator",
    "Side-by-side stock comparison",
    "Annual and quarterly financial statements",
    "Revenue and profit charts",
    "52-week price range",
    "Risk level assessment",
  ],
  screenshot: `${BASE_URL}/og-image.png`,
  creator: {
    "@type": "Organization",
    name: "PSX Stock Analyzer",
    url: BASE_URL,
  },
  about: {
    "@type": "Thing",
    name: "Pakistan Stock Exchange",
    description:
      "Pakistan's national stock exchange listing over 500 companies. Home of the KSE-100 index.",
  },
  audience: {
    "@type": "Audience",
    audienceType: "Pakistani beginner investors",
    geographicArea: {
      "@type": "Country",
      name: "Pakistan",
    },
  },
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "PSX Stock Analyzer",
  url: BASE_URL,
  logo: {
    "@type": "ImageObject",
    url: `${BASE_URL}/icon.svg`,
    width: 512,
    height: 512,
  },
  description:
    "Free stock analysis tool for the Pakistan Stock Exchange (PSX). Helping beginner Pakistani investors understand KSE 100 stocks in plain English.",
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
    "KSE 100",
    "PSX stocks",
    "Stock analysis",
    "Shariah compliant investing",
    "Dividend investing Pakistan",
    "Financial statement analysis",
  ],
  sameAs: [],
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is the Pakistan Stock Exchange (PSX)?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "PSX is the national stock exchange of Pakistan, located in Karachi. It lists over 500 companies across sectors like banking, cement, oil & gas, fertilizer, and technology. The KSE-100 index tracks the top 100 companies by market capitalization.",
      },
    },
    {
      "@type": "Question",
      name: "Do I need a finance degree to use this PSX analysis tool?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Not at all! This tool is built specifically for beginners. Every metric is explained in plain English. We translate complex financial jargon into simple, easy-to-understand language so anyone can make informed decisions.",
      },
    },
    {
      "@type": "Question",
      name: "Where does the PSX stock data come from?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Stock prices and company data come directly from the PSX Data Portal (dps.psx.com.pk). Financial statements (Income Statement, Balance Sheet, Cash Flow) are sourced from Yahoo Finance. Shariah compliance is checked against the KMI All Shares index.",
      },
    },
    {
      "@type": "Question",
      name: "Is this financial advice for PSX investing?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. This tool is for educational purposes only. It provides data and analysis to help you understand PSX stocks, but you should always do your own research and consult a qualified financial advisor before investing.",
      },
    },
    {
      "@type": "Question",
      name: "What does Shariah Compliant mean for PSX stocks?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Stocks that meet Islamic finance screening criteria are part of the KMI (KSE Meezan Index) All Shares index. PSX screens companies based on their business activities and financial ratios against Shariah guidelines. Look for the green Shariah Compliant badge on qualifying stocks.",
      },
    },
    {
      "@type": "Question",
      name: "How often is the PSX stock data updated?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Stock prices and trading data are fetched live from PSX each time you analyze a stock. Financial statements update quarterly or annually based on company filings. The stock list is cached for 1 hour.",
      },
    },
    {
      "@type": "Question",
      name: "Can I compare two PSX stocks against each other?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes! Use the Compare tab to run a side-by-side comparison of any two PSX-listed companies. The tool scores each stock across 7 key metrics — P/E ratio, profit margin, EPS growth, dividend yield, market cap, revenue growth, and risk level — and declares an overall winner.",
      },
    },
    {
      "@type": "Question",
      name: "Is the PSX Stock Analyzer free to use?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, PSX Stock Analyzer is completely free to use. There are no subscriptions, no sign-ups, and no hidden fees. Simply search for any PSX-listed company and get instant analysis.",
      },
    },
  ],
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "PSX Stock Analyzer",
  url: BASE_URL,
  description:
    "Free Pakistan Stock Exchange (PSX) stock analysis for beginner investors. Understand KSE 100 stocks in plain English.",
  inLanguage: "en-PK",
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${BASE_URL}/?q={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-PK">
      <head>
        {/* AdSense */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2132134425369055"
          crossOrigin="anonymous"
        />
        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(webApplicationSchema),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(faqSchema),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteSchema),
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
