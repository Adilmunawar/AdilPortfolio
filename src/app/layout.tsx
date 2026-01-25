
import type { Metadata } from "next";
import Script from "next/script";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import ZenithAssistant from "@/components/Zenith/ZenithAssistant";
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import "@/app/globals.css";

// 👇 Metadata Base (Critical for Social Sharing)
export const metadata: Metadata = {
  metadataBase: new URL('https://adilmunawar.vercel.app'), 
  
  title: {
    default: "Adil Munawar - Strategic Web Developer & AI Architect",
    template: "%s | Adil Munawar"
  },
  description: "Portfolio of Adil Munawar, Project Lead at Nexsus Orbits and Senior Full Stack Developer. Specializing in High-Performance Next.js, RAG AI Agents (Zenith), and TSQL Database Administration.",
  keywords: [
    "Adil Munawar", "AdilMunawarX", "Project Lead Nexsus Orbits", 
    "Web Developer Lahore", "AI Architect Pakistan", "Ethical Hacker",
    "TSQL Expert", "RAG AI Specialist", "Next.js Developer"
  ],
  authors: [{ name: "Adil Munawar" }],
  creator: "Adil Munawar",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://adilmunawar.vercel.app",
    title: "Adil Munawar - Strategic Web Developer",
    description: "Building the next generation of web applications with AI, RAG, and Enterprise architecture.",
    siteName: "Adil Munawar Portfolio",
    images: [
      {
        url: "/zenith.png",
        width: 1200,
        height: 630,
        alt: "Adil Munawar Portfolio & Zenith AI",
      },
    ],
  },
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
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
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
  
  // 🧠 The "Master Entity" Graph
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Adil Munawar",
    "alternateName": ["AdilMunawarX", "Zenith Architect", "Adil Khokhar"],
    "familyName": "Khokhar",
    "gender": "Male",
    "url": "https://adilmunawar.vercel.app",
    "image": "https://adilmunawar.vercel.app/adil-munawar-uploads/eaf50e40-682a-4730-ac3c-407cf3e4896e.png",
    
    // 📅 Vital Stats
    "birthDate": "2005-06-10",
    "telephone": "+92-324-4965220",
    "nationality": {
      "@type": "Country",
      "name": "Pakistan"
    },
    "homeLocation": {
      "@type": "Place",
      "name": "Walled City, Lahore",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Lahore",
        "addressRegion": "Punjab",
        "addressCountry": "PK"
      }
    },

    // 🎓 Education
    "alumniOf": {
      "@type": "CollegeOrUniversity",
      "name": "Govt. Islamia Graduate College Civil Lines",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Lahore"
      }
    },

    // 💼 Professional Roles (Multi-Role Support)
    "jobTitle": ["Project Lead", "Database Administrator", "Senior Web Developer"],
    "worksFor": [
      {
        "@type": "Organization",
        "name": "Nexsus Orbits",
        "url": "https://nexsusorbits.com",
        "jobTitle": "Project Lead & Web Developer"
      },
      {
        "@type": "Organization",
        "name": "AOS",
        "jobTitle": "Database Administrator"
      },
      {
        "@type": "Organization",
        "name": "AdiCorp",
        "jobTitle": "Founder"
      }
    ],

    // 🏆 The "Bragging Rights" Section
    "award": [
      "LeetCode Top 5% Global Solver",
      "GitHub Achievement: Pull Shark (Gold)",
      "GitHub Achievement: Pair Extraordinaire (Gold)",
      "GitHub Achievement: Galaxy Brain (Silver)",
      "Google Ads Apps Certification (2025)",
      "AWS Building Language Models (2025)",
      "Microsoft Azure Cloud Computing (2025)"
    ],

    // 🔗 The Social Authority Web
    "sameAs": [
      "https://github.com/AdilMunawar",
      "https://www.linkedin.com/in/adilmunawar/", 
      "https://x.com/adilmunawarx",
      "https://dev.to/adilmunawar", 
      "https://leetcode.com/u/AdilMunawar/",
      "https://www.instagram.com/adilmunawarx/",
      "https://www.facebook.com/AdilMunawarX",
      "https://steamcommunity.com/id/AdilMunawar",
      "https://discordapp.com/users/1097023241586544650"
    ],

    // 🧠 The "Top Notch" Skills Matrix
    "knowsAbout": [
      // Core Stack
      "MERN Stack (MongoDB, Express, React, Node.js)",
      "Next.js Architecture",
      "Supabase & Firebase",
      
      // Database Mastery
      "Transact-SQL (TSQL)",
      "Database Administration",
      
      // AI & Advanced Tech
      "RAG (Retrieval-Augmented Generation)",
      "Ethical Hacking (EC-Council Standards)",
      "Building LLMs on AWS",
      
      // DevOps & Tools
      "Docker Containerization",
      "Kubernetes Orchestration",
      "GitHub Actions (CI/CD)",
      "Python Automation"
    ],
    
    "description": "Adil Munawar is a Project Lead at Nexsus Orbits and Database Admin at AOS. A specialist in RAG AI Agents and TSQL, he holds 'Gold Pull Shark' status on GitHub and ranks in the Top 5% on LeetCode."
  };

  return (
    <html lang="en" className={`${GeistSans.className} ${GeistMono.variable} dark scroll-smooth`}>
       <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="antialiased bg-background text-foreground">
        <TooltipProvider>
          <Toaster />
          <Sonner />
          {children}
          <ZenithAssistant />
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
