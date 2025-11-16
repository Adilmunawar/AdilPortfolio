import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/app/globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Adil Munawar",
  description: "Adil Munawar Portfolio - Passionate Full-Stack Developer",
  openGraph: {
    title: "Adil Munawar",
    description: "Adil Munawar Portfolio - Passionate Full-Stack Developer",
    url: "https://adilmunawar.vercel.app/",
    type: "website",
    images: [
      {
        url: "https://adilmunawar.vercel.app/your-preview-image.png",
        width: 1200,
        height: 630,
        alt: "Adil Munawar Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Adil Munawar",
    description: "Adil Munawar Portfolio - Passionate Full-Stack Developer",
    images: ["https://adilmunawar.vercel.app/your-preview-image.png"],
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
