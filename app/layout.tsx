import type { Metadata } from "next";
import { Source_Sans_3, EB_Garamond } from "next/font/google";

import "./globals.css";
import { Toaster } from "sonner";
import { AuthProvider } from "@/contexts/AuthContext";
import LayoutContent from "@/layouts/layout-content";
import { CartProvider } from "@/hooks/CartContext";
import Script from "next/script";

const sourceSansPro = Source_Sans_3({
  variable: "--font-source-sans",
  subsets: ["latin"],
  weight: ["400"], // Regular
  preload: true,
});

const ebGaramond = EB_Garamond({
  variable: "--font-eb-garamond",
  subsets: ["latin"],
  weight: ["700"], // Bold
  preload: true,
});

export const metadata: Metadata = {
  title: "Ha Food - Quà Tặng Doanh Nghiệp",
  description:
    "Ha Food - Nơi cung cấp quà tặng doanh nghiệp uy tín và chất lượng",
  keywords:
    "quà tặng doanh nghiệp, quà tặng khách hàng, quà tặng đối tác, hộp quà cao cấp",
  metadataBase: new URL(process.env.NEXT_PUBLIC_API_URL || "https://hafood.vn"),
  authors: [{ name: "Ha Food" }],
  creator: "Ha Food",
  publisher: "Ha Food",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
    },
  },
  openGraph: {
    type: "website",
    locale: "vi_VN",
    url: process.env.NEXT_PUBLIC_API_URL || "https://hafood.vn",
    siteName: "Ha Food",
    title: "Ha Food - Quà Tặng Doanh Nghiệp",
    description:
      "Ha Food - Nơi cung cấp quà tặng doanh nghiệp uy tín và chất lượng",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Ha Food",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ha Food - Quà Tặng Doanh Nghiệp",
    description:
      "Ha Food - Nơi cung cấp quà tặng doanh nghiệp uy tín và chất lượng",
    images: ["/og-image.jpg"],
  },
  verification: {
    google: "V7r-R3Fn-Os1IzFRXA2nN42Xx9K_btIuvepVz1Bb-VY", // Replace with your Google Search Console verification code
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#B0041A" />
        <meta name="next-size-adjust" content="100%" />
      </head>
      <body
        className={`${sourceSansPro.variable} ${ebGaramond.variable} antialiased bg-primary-white`}
      >
        <AuthProvider>
          <CartProvider>
            <LayoutContent>{children}</LayoutContent>
          </CartProvider>
        </AuthProvider>
        <Toaster />

        {/* Google Analytics */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=G-HWXCWT6KQH`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-HWXCWT6KQH');
          `}
        </Script>
      </body>
    </html>
  );
}
