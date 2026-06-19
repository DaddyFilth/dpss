import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Analytics } from "@vercel/analytics/next";
import { CartProviderWrapper } from "@/components/providers/cart-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI Dropship | Trending Products & Smart Shopping",
  description: "Discover viral TikTok products, AI-powered smart home devices, and trending dropshipping items. 85+ curated products with fast shipping and secure checkout.",
  keywords: "dropshipping, trending products, TikTok viral products, smart home, electronics, beauty products, home decor, fitness, pet supplies",
  authors: [{ name: "AI Dropship" }],
  openGraph: {
    title: "AI Dropship | Trending Products & Smart Shopping",
    description: "Discover viral TikTok products, AI-powered smart home devices, and trending dropshipping items. 85+ curated products with fast shipping.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Dropship | Trending Products & Smart Shopping",
    description: "Discover viral TikTok products, AI-powered smart home devices, and trending dropshipping items.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "AI Dropship",
              url: "https://your-domain.com",
              logo: "https://your-domain.com/logo.png",
              description: "AI-powered dropshipping with viral TikTok products and smart home devices",
              sameAs: [
                "https://instagram.com/your-username",
                "https://twitter.com/your-username",
                "https://tiktok.com/@your-username",
                "https://facebook.com/your-username"
              ],
              contactPoint: {
                "@type": "ContactPoint",
                email: "support@your-domain.com",
                contactType: "customer service",
                areaServed: "US",
                availableLanguage: "English"
              }
            })
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <CartProviderWrapper>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <Analytics />
        </CartProviderWrapper>
      </body>
    </html>
  );
}
