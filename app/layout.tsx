import type { Metadata, Viewport } from "next";
import { Fraunces } from "next/font/google";
import "./globals.css";
import BottomNav from "@/components/BottomNav";
import SWRegister from "@/components/SWRegister";
import HapticSwitch from "@/components/HapticSwitch";

/**
 * Headings only. Self-hosted by next/font, so it works offline and the service
 * worker's cache-first rule picks it up on first load — no third-party request,
 * nothing leaves the device. SOFT/WONK round the terminals off so it reads warm
 * rather than institutional.
 */
const display = Fraunces({
  subsets: ["latin"],
  axes: ["SOFT", "WONK", "opsz"],
  variable: "--font-fraunces",
  display: "swap",
});

export const metadata: Metadata = {
  /* Vercel sets VERCEL_URL itself, so og:image resolves on deploy with no
     env var to remember. */
  metadataBase: new URL(
    process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3240"
  ),
  title: "GAL",
  description: "A daily companion — mind, body, money, and knowing where to turn.",
  manifest: "/manifest.webmanifest",
  applicationName: "GAL",
  appleWebApp: {
    capable: true,
    title: "GAL",
    statusBarStyle: "default",
  },
  formatDetection: { telephone: false },
  icons: {
    icon: "/icons/icon-192.png",
    apple: "/icons/apple-touch-icon.png",
  },
  openGraph: {
    title: "GAL",
    description: "A daily companion — mind, body, money, and knowing where to turn.",
    siteName: "GAL",
    type: "website",
    images: [{ url: "/icons/icon-512.png", width: 512, height: 512, alt: "GAL" }],
  },
  /* This app is used privately. Keep it out of search results. */
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#7A2E22",
  width: "device-width",
  initialScale: 1,
  // Stops iOS zooming the page when she taps an input.
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={display.variable}>
      <body className="bg-paper text-ink font-sans antialiased">
        <a href="#main" className="skip">
          Skip to content
        </a>
        <SWRegister />
        <HapticSwitch />
        <div
          id="main"
          className="mx-auto min-h-dvh w-full max-w-md px-5 pb-28 pt-[max(1.25rem,env(safe-area-inset-top))]"
        >
          {children}
        </div>
        <BottomNav />
      </body>
    </html>
  );
}
