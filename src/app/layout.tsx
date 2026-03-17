import type { Metadata } from "next";
import { Playfair_Display, Source_Sans_3 } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600", "700", "800", "900"]
});

const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-body"
});

export const metadata: Metadata = {
  title: "Serreva Glasshouses - Luxury Hospitality Structures",
  description: "Bespoke glasshouse structures for luxury hotels, resorts, and event venues. Hotel conservatories, resort pavilions, and event venue glasshouses.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${sourceSans.variable}`}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `window.MEGA_TAG_CONFIG={siteKey:"sk_placeholder",pixelId:"463293916614192"};window.API_ENDPOINT="https://optimizer.gomega.ai";window.TRACKING_API_ENDPOINT="https://events-api.gomega.ai";`,
          }}
        />
        <script src="https://cdn.gomega.ai/scripts/optimizer.min.js" async />
        <Script src="https://572388.tctm.co/t.js" strategy="afterInteractive" />
      </head>
      <body className={`${sourceSans.className} antialiased`}>
        {children}
      </body>
    </html>
  );
}