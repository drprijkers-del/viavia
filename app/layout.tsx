import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "ViaVia - Freelance opdrachten, zonder WhatsApp-scrollen",
  description: "Beheer via-via opdrachten voor al je WhatsApp-groepen op één plek. Reageren doe je gewoon via WhatsApp.",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "ViaVia",
  },
  icons: {
    icon: "/icons/icon-192.svg",
    apple: "/icons/icon-192.svg",
  },
  openGraph: {
    title: "ViaVia - Freelance opdrachten, zonder WhatsApp-scrollen",
    description: "Beheer via-via opdrachten voor al je WhatsApp-groepen op één plek.",
    type: "website",
    locale: "nl_NL",
  },
};

export const viewport: Viewport = {
  themeColor: "#1C1C1E",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nl">
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="ViaVia" />
        <meta name="mobile-web-app-capable" content="yes" />
        <link rel="apple-touch-icon" href="/icons/icon-192.svg" />
      </head>
      <body className="bg-[#1C1C1E] text-gray-100 antialiased">
        <Providers>
          <div className="min-h-screen flex justify-center">
            <div className="w-full max-w-lg min-h-screen">
              {children}
            </div>
          </div>
        </Providers>
      </body>
    </html>
  );
}
