import type { Metadata } from "next";
import { Playfair_Display, DM_Sans } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  weight: ["400", "500", "600", "700", "800", "900"],
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dmsans",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Serreva Glasshouses — Luxury Hospitality Structures for Hotels & Resorts",
  description:
    "Bespoke glasshouse structures engineered for hotels, resorts, and event venues. Hotel conservatories, resort pavilions, event venue glasshouses. Custom climate control included.",
  openGraph: {
    title: "Serreva Glasshouses — Luxury Hospitality Structures",
    description:
      "Bespoke glasshouse structures for luxury hotels, resorts, and event venues. Turnkey design, engineering, and installation.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${dmSans.variable}`}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `window.MEGA_TAG_CONFIG={siteKey:"sk_6931f04e_f6fe749c348c"};`,
          }}
        />
        <script id="optimizer-script" src="https://cdn.gomega.ai/scripts/optimizer.min.js" async />
        <Script src="https://572388.tctm.co/t.js" strategy="afterInteractive" />
      </head>
      <body className={`${dmSans.className} antialiased`}>{children}</body>
    </html>
  );
}
