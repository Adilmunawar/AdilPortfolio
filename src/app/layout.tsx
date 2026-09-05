import type { Metadata } from "next";
import Script from "next/script";
import { Inter, JetBrains_Mono } from "next/font/google";
import { Analytics } from '@vercel/analytics/next';
import ZenithAssistant from "@/components/Zenith/ZenithAssistant";
import ChunkReload from "@/components/ChunkReload";
import "@/app/globals.css";

const sans = Inter({ subsets: ["latin"], axes: ["opsz"], variable: "--font-sans", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-mono", display: "swap" });

//  Metadata Base (Critical for Social Sharing)
export const metadata: Metadata = {
  metadataBase: new URL('https://adilmunawar.vercel.app'),
  alternates: {
    canonical: '/', // Fixes duplicate content warning
  },
  title: {
    default: "Adil Munawar — ML engineer, agricultural remote sensing",
    template: "%s | Adil Munawar"
  },
  description: "Machine-learning engineer building crop and field-mapping models from satellite imagery, and full-stack developer. Lahore, remote worldwide.",
  keywords: ["Adil Munawar", "AdilMunawarX", "machine learning engineer", "agricultural remote sensing", "Sentinel-2", "field boundary segmentation", "full-stack developer Lahore", "Next.js"],
  authors: [{ name: "Adil Munawar", url: "https://adilmunawar.vercel.app" }],
  creator: "Adil Munawar",
  publisher: "Adil Munawar",
  category: "technology", // Fixes "missing category" warning
  openGraph: {
    type: "profile",
    locale: "en_US",
    url: "https://adilmunawar.vercel.app",
    title: "Adil Munawar — ML engineer, agricultural remote sensing",
    description: "Machine-learning engineer building crop and field-mapping models from satellite imagery, and full-stack developer. Lahore, remote worldwide.",
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
    title: "Adil Munawar — ML engineer, agricultural remote sensing",
    description: "Machine-learning engineer building crop and field-mapping models from satellite imagery, and full-stack developer.",
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
    "@graph": [
      {
        "@type": "WebSite",
        "@id": "https://adilmunawar.vercel.app/#website",
        "url": "https://adilmunawar.vercel.app",
        "name": "Adil Munawar Portfolio",
        "inLanguage": "en",
        "about": { "@id": "https://adilmunawar.vercel.app/#person" },
        "publisher": { "@id": "https://adilmunawar.vercel.app/#person" }
      },
      {
        "@type": "Person",
        "@id": "https://adilmunawar.vercel.app/#person",
        "name": "Adil Munawar",
        "alternateName": ["AdilMunawarX", "Adil Khokhar"],
        "familyName": "Khokhar",
        "gender": "Male",
        "url": "https://adilmunawar.vercel.app",
        "mainEntityOfPage": { "@id": "https://adilmunawar.vercel.app/#website" },
        "image": {
          "@type": "ImageObject",
          "url": "https://adilmunawar.vercel.app/adil-munawar-uploads/eaf50e40-682a-4730-ac3c-407cf3e4896e.png",
          "width": 800,
          "height": 800
        },
        "email": "mailto:adilmunawarx@gmail.com",
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
        "alumniOf": {
          "@type": "CollegeOrUniversity",
          "name": "Govt. Islamia Graduate College Civil Lines",
          "address": {
            "@type": "PostalAddress",
            "addressLocality": "Lahore"
          }
        },
        "jobTitle": [
          "Machine Learning Engineer — agricultural remote sensing",
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
            "name": "AOS"
          }
        ],
        "award": [
          "LeetCode Top 5% Global Solver",
          "GitHub Achievement: Pull Shark (Gold)",
          "GitHub Achievement: Pair Extraordinaire (Gold)",
          "GitHub Achievement: Galaxy Brain (Silver)",
          "Google Ads Apps Certification (2025)",
          "AWS Building Language Models (2025)",
          "Microsoft Azure Cloud Computing (2025)"
        ],
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
        "knowsAbout": [
          {
            "@type": "DefinedTerm",
            "name": "Machine learning",
            "sameAs": "https://www.wikidata.org/wiki/Q2539"
          },
          {
            "@type": "DefinedTerm",
            "name": "Remote sensing"
          },
          {
            "@type": "DefinedTerm",
            "name": "Sentinel-2",
            "url": "https://sentinel.esa.int/web/sentinel/missions/sentinel-2"
          },
          {
            "@type": "DefinedTerm",
            "name": "PyTorch",
            "url": "https://pytorch.org",
            "sameAs": "https://www.wikidata.org/wiki/Q47509047"
          },
          {
            "@type": "DefinedTerm",
            "name": "XGBoost",
            "url": "https://xgboost.ai"
          },
          {
            "@type": "DefinedTerm",
            "name": "Next.js",
            "url": "https://nextjs.org",
            "sameAs": "https://www.wikidata.org/wiki/Q110465063"
          },
          {
            "@type": "DefinedTerm",
            "name": "PostgreSQL",
            "url": "https://www.postgresql.org",
            "sameAs": "https://www.wikidata.org/wiki/Q192490"
          },
          {
            "@type": "DefinedTerm",
            "name": "Model Context Protocol",
            "url": "https://modelcontextprotocol.io"
          },
          "Agricultural remote sensing",
          "Crop-type classification from satellite time series",
          "Field boundary delineation (HRNet-W48 semantic segmentation)",
          "Cloud and shadow masking for Sentinel-2",
          "NDVI / EVI phenology and change detection",
          "Crop yield prediction with XGBoost and SHAP",
          "Temporal CNN and LSTM sequence models",
          "U-Net and ResNet for multispectral imagery",
          "RAG (Retrieval-Augmented Generation) with pgvector and hybrid retrieval",
          "MCP tool servers and agentic workflows",
          "Google Earth Engine, GDAL, Rasterio, GeoPandas, PostGIS",
          "TypeScript, React, Next.js, Tailwind CSS",
          "Supabase, PostgreSQL, Transact-SQL, database administration",
          "Python, FastAPI, Docker, MLOps, Azure, Vercel, GitHub Actions"
        ],
        "hasOfferCatalog": {
          "@type": "OfferCatalog",
          "name": "Machine learning, geospatial and full-stack services",
          "itemListElement": [
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Machine learning & remote sensing",
                "description": "Segmentation and time-series models on Sentinel-2 and high-resolution imagery for field boundaries, crop type and phenology, with training, evaluation and MLOps included. You get a trained model, an evaluation report and a deployable inference endpoint.",
                "areaServed": [{ "@type": "City", "name": "Lahore" }, { "@type": "Place", "name": "Worldwide (Remote)" }]
              }
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "RAG & agentic systems",
                "description": "Retrieval pipelines, MCP servers and multi-step agents that connect language models to your own documents and internal APIs. You get a working system with grounded answers, an evaluation set and cost controls.",
                "areaServed": [{ "@type": "City", "name": "Lahore" }, { "@type": "Place", "name": "Worldwide (Remote)" }]
              }
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Full-stack products",
                "description": "Web products in Next.js, TypeScript and PostgreSQL that put models and maps in front of people, from prototype to production. You get a deployed product with source, tests and hand-over notes.",
                "areaServed": [{ "@type": "City", "name": "Lahore" }, { "@type": "Place", "name": "Worldwide (Remote)" }]
              }
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Data & cloud engineering",
                "description": "Geospatial and tabular pipelines built with GDAL, PostGIS and Python, deployed on Azure or Vercel with Docker and CI. You get reproducible pipelines, infrastructure as code and monitoring.",
                "areaServed": [{ "@type": "City", "name": "Lahore" }, { "@type": "Place", "name": "Worldwide (Remote)" }]
              }
            }
          ]
        },
        "subjectOf": [
          { "@type": "CreativeWork", "name": "llms.txt", "url": "https://adilmunawar.vercel.app/llms.txt", "encodingFormat": "text/markdown" },
          { "@type": "CreativeWork", "name": "llms-full.txt", "url": "https://adilmunawar.vercel.app/llms-full.txt", "encodingFormat": "text/markdown" },
          { "@type": "Dataset", "name": "ai-profile.json", "url": "https://adilmunawar.vercel.app/ai-profile.json", "encodingFormat": "application/json" }
        ],
        "description": "Adil Munawar is a machine-learning engineer for agricultural remote sensing and a full-stack developer in Lahore, Pakistan, working remotely worldwide. He trains segmentation and time-series models on Sentinel-2 and high-resolution satellite imagery for field boundary delineation, crop-type classification and phenology, builds RAG pipelines and MCP-based agentic systems, and ships Next.js, TypeScript and PostgreSQL products. He is Project Lead & Web Developer at Nexsus Orbits and Database Administrator at AOS."
      }
    ]
  };

  return (
    <html lang="en" suppressHydrationWarning className={`${sans.variable} ${mono.variable} dark scroll-smooth`}>
       <head>
        {/* Marks JS-enabled documents so scroll-reveal styles never hide
            content from crawlers or users whose scripts fail to load. */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="antialiased bg-bg-0 text-foreground font-sans">
        {children}
        <ZenithAssistant />
        <ChunkReload />

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
        {process.env.VERCEL ? <Analytics /> : null}
      </body>
    </html>
  );
}
