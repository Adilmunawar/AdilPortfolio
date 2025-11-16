import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "@/app/globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Adil Munawar - Developer",
  description: "Adil Munawar Portfolio - Passionate Full-Stack Developer",

  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "Adil Munawar - Full-Stack Developer",
    description: "Adil Munawar Portfolio - Passionate Full-Stack Developer",
    url: "https://adilmunawar.vercel.app",
    siteName: "Adil Munawar Portfolio",
    images: [
      {
        url: "https://adilmunawar.vercel.app/og-image.png",
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Adil Munawar - Full-Stack Developer",
    description: "Adil Munawar Portfolio - Passionate Full-Stack Developer",
    images: ["https://adilmunawar.vercel.app/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          {children}
        </TooltipProvider>

        <Script
          strategy="afterInteractive"
          src="https://www.googletagmanager.com/gtag/js?id=G-8L6JGGFF0R"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-8L6JGGFF0R');
          `}
        </Script>
      </body>
    </html>
  );
}