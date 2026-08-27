import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import "./globals.css";
import BottomNav from "@/components/BottomNav";
import SWRegister from "@/components/SWRegister";
import HapticSwitch from "@/components/HapticSwitch";
import FloatingElleButton from "@/components/FloatingElleButton";

/**
 * Brand faces from the Elle guide: Cormorant Garamond for display, Manrope for
 * body. Both self-hosted by next/font, so they work offline and the service
 * worker caches them — no third-party request, nothing leaves the device.
 *
 * Manrope replaces the system stack. That was the right call while GAL had no
 * brand; it is the wrong call now that it does. Two subset faces is real weight
 * on roaming data, so keep the weight list tight.
 */
const display = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-cormorant",
  display: "swap",
});

const body = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-manrope",
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
  /* The status bar follows the paper, not the accent — the installed app should
     read as one continuous surface rather than a coloured bar above a page. */
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FFFCFA" },
    { media: "(prefers-color-scheme: dark)", color: "#1B0F13" },
  ],
  width: "device-width",
  initialScale: 1,
  // Stops iOS zooming the page when she taps an input.
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${display.variable} ${body.variable}`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(() => { try { const t = localStorage.getItem("gal.theme"); if (t === "light" || t === "dark") document.documentElement.dataset.theme = t; } catch (_) {} })();`,
          }}
        />
      </head>
      <body className="bg-paper text-ink font-sans antialiased">
        <a href="#main" className="skip">
          Skip to content
        </a>
        <SWRegister />
        <HapticSwitch />
        <FloatingElleButton />
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
