
import type { Metadata } from "next";
import Script from "next/script";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import ZenithAssistant from "@/components/Zenith/ZenithAssistant";
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import "@/app/globals.css";

//  Metadata Base (Critical for Social Sharing)
export const metadata: Metadata = {
  metadataBase: new URL('https://adilmunawar.vercel.app'),
  alternates: {
    canonical: '/', // Fixes duplicate content warning
  },
  title: {
    default: "Adil Munawar - Strategic Web Developer & AI Architect",
    template: "%s | Adil Munawar"
  },
  description: "Portfolio of Adil Munawar, Project Lead at Nexsus Orbits. Specialized in Next.js, RAG AI Agents, and Enterprise Systems. Optimized for Human & AI Interaction.",
  keywords: ["Adil Munawar", "AdilMunawarX", "AI Architect", "Web Developer Lahore", "Next.js Expert", "RAG Agent Developer"],
  authors: [{ name: "Adil Munawar", url: "https://adilmunawar.vercel.app" }],
  creator: "Adil Munawar",
  publisher: "Adil Munawar",
  category: "technology", // Fixes "missing category" warning
  openGraph: {
    type: "profile",
    locale: "en_US",
    url: "https://adilmunawar.vercel.app",
    title: "Adil Munawar - Strategic Web Developer",
    description: "Building the next generation of web applications with AI and Enterprise architecture.",
    siteName: "Adil Munawar Portfolio",
    images: [{ url: "/zenith.png", width: 1200, height: 630, alt: "Adil Munawar" }],
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
  other: {
    "ai-content": "https://adilmunawar.vercel.app/llms.txt",
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
  //  The "Master Entity" Graph
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Adil Munawar",
    "alternateName": ["AdilMunawarX", "Zenith Architect", "Adil Khokhar"],
    "familyName": "Khokhar",
    "gender": "Male",
    "url": "https://adilmunawar.vercel.app",
    "image": {
      "@type": "ImageObject",
      "url": "https://adilmunawar.vercel.app/adil-munawar-uploads/eaf50e40-682a-4730-ac3c-407cf3e4896e.png",
      "width": 800,
      "height": 800
    },
    
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Lahore",
      "addressRegion": "Punjab",
      "addressCountry": "PK"
    },
    "homeLocation": {
      "@type": "Place",
      "name": "Walled City, Lahore"
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
    "priceRange": "$$",
    //  Professional Roles (Multi-Role Support)
    "jobTitle": [
      "Project Lead & Web Developer at Nexsus Orbits",
      "Database Administrator at AOS"
    ],
    "worksFor": [
      {
        "@type": "Organization",
        "name": "Nexsus Orbits",
        "url": "https://nexsusorbits.com"
      },
      {
        "@type": "Organization",
        "name": "AOS",
        "url": "https://adilmunawar.vercel.app/#aos"
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

    //  The Social Authority Web
    "sameAs": [
      "https://github.com/AdilMunawar",
      "https://www.linkedin.com/in/adilmunawar/", 
      "https://x.com/adilmunawarx",
      "https://dev.to/adilmunawar", 
      "https://leetcode.com/u/AdilMunawar/",
      "https://www.instagram.com/adilmunawarx/",
      "https://www.facebook.com/adil.adilmunewer",
      "https://steamcommunity.com/id/AdilMunawar",
      "https://discordapp.com/users/adilmunawar"
    ],

    //  The "Top Notch" Skills Matrix
    "knowsAbout": [
      {
        "@type": "DefinedTerm",
        "name": "Next.js",
        "url": "https://nextjs.org",
        "sameAs": "https://www.wikidata.org/wiki/Q110465063"
      },
      {
        "@type": "DefinedTerm",
        "name": "Artificial Intelligence",
        "sameAs": "https://www.wikidata.org/wiki/Q11660"
      },
      {
        "@type": "DefinedTerm",
        "name": "Software Engineering",
        "sameAs": "https://www.wikidata.org/wiki/Q80993"
      },
      "MERN Stack (MongoDB, Express, React, Node.js)", "Supabase & Firebase",
      "Transact-SQL (TSQL)", "Database Administration", "RAG (Retrieval-Augmented Generation)",
      "Ethical Hacking (EC-Council Standards)", "Building LLMs on AWS", "Docker Containerization",
      "Kubernetes Orchestration", "GitHub Actions (CI/CD)", "Python Automation"
    ],
    
    //  Services Offered
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Web Development & AI Services",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Full-Stack Development",
            "description": "End-to-end web application development using modern technologies like React, Node.js, and cloud platforms.",
            "areaServed": [{ "@type": "City", "name": "Lahore" }, { "@type": "Place", "name": "Worldwide (Remote)" }]
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Mobile App Development",
            "description": "Cross-platform mobile applications with seamless user experiences. Specializing in React Native and hybrid app development.",
            "areaServed": [{ "@type": "City", "name": "Lahore" }, { "@type": "Place", "name": "Worldwide (Remote)" }]
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Digital Solutions",
            "description": "Custom digital solutions including corporate management systems, social platforms, and automation tools.",
            "areaServed": [{ "@type": "City", "name": "Lahore" }, { "@type": "Place", "name": "Worldwide (Remote)" }]
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "System Integration",
            "description": "Seamless integration of various systems and APIs to create unified digital ecosystems.",
            "areaServed": [{ "@type": "City", "name": "Lahore" }, { "@type": "Place", "name": "Worldwide (Remote)" }]
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Performance Optimization",
            "description": "Website and application performance optimization and SEO implementation to maximize your digital presence.",
            "areaServed": [{ "@type": "City", "name": "Lahore" }, { "@type": "Place", "name": "Worldwide (Remote)" }]
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Rapid Prototyping",
            "description": "Quick development of MVPs and prototypes to validate ideas and accelerate time-to-market.",
            "areaServed": [{ "@type": "City", "name": "Lahore" }, { "@type": "Place", "name": "Worldwide (Remote)" }]
          }
        }
      ]
    },

    "description": "Adil Munawar is a Project Lead at Nexsus Orbits and Database Admin at AOS. A specialist in RAG AI Agents and TSQL, he holds 'Gold Pull Shark' status on GitHub and ranks in the Top 5% on LeetCode."
  };

  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable} dark scroll-smooth`}>
       <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="antialiased bg-background text-foreground selection:bg-cyan-500/30 selection:text-cyan-200">
        <TooltipProvider>
          <Toaster />
          <Sonner />
          {children}
          <ZenithAssistant />
        </TooltipProvider>

        <Script
          strategy="lazyOnload"
          src="https://www.googletagmanager.com/gtag/js?id=G-8L6JGGFF0R"
        />
        <Script id="google-analytics" strategy="lazyOnload">
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
