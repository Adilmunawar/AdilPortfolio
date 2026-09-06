'use client';

import { useEffect, useRef, useState, type CSSProperties } from 'react';
import Image from 'next/image';
import { Cloud, Code2, Github, Sparkles, type LucideIcon } from 'lucide-react';
import { Reveal } from './Reveal';

interface BadgeItem {
  id: string;
  src: string;
  alt: string;
}

const GITHUB_BADGES: BadgeItem[] = [
  { id: 'gh-actions', src: '/Badges/Github Actions badge.webp', alt: 'GitHub Actions' },
  { id: 'gh-admin', src: '/Badges/Github Admin Badge.webp', alt: 'GitHub Admin' },
  { id: 'gh-adv-sec', src: '/Badges/github advance securtiy badge.webp', alt: 'GitHub Advanced Security' },
  { id: 'gh-agentic-ai', src: '/Badges/github-agentic-ai-developer.svg', alt: 'GitHub Agentic AI Developer' },
];

const LEETCODE_BADGES: BadgeItem[] = [
  { id: 'lc-sql-50', src: '/Badges/Top_SQL_50 leetcode.png', alt: 'Top SQL 50' },
  { id: 'lc-algo-decomp', src: '/Badges/algorithm deconstructor badge leetcode.png', alt: 'Algorithm Deconstructor' },
  { id: 'lc-arch-build', src: '/Badges/architecture builder badge leetcode.png', alt: 'Architecture Builder' },
  { id: 'lc-data-nav', src: '/Badges/data navigator badge leetcode.png', alt: 'Data Navigator' },
  { id: 'lc-math-insight', src: '/Badges/mathematical insight badge leetcode.png', alt: 'Mathematical Insight' },
  { id: 'lc-pandas', src: '/Badges/Introduction_to_Pandas_Badge leetcode.png', alt: 'Introduction to Pandas' },
  { id: 'lc-100-2025', src: '/Badges/100 days badge leetcode 2025.png', alt: '100 Days 2025' },
  { id: 'lc-100-2026', src: '/Badges/100 days badge leetcode 2026.png', alt: '100 Days 2026' },
  { id: 'lc-50-2025', src: '/Badges/50 days badge leetcode 2025.png', alt: '50 Days 2025' },
  { id: 'lc-50-2026', src: '/Badges/50 days badge leetcode 2026.png', alt: '50 Days 2026' },
];

const MS_AWS_BADGES: BadgeItem[] = [
  { id: 'ms-azure-vm', src: '/Badges/Azure virtual machines badge.svg', alt: 'Azure Virtual Machines' },
  { id: 'ms-deploy-compute', src: '/Badges/Deploy and manage Azure compute resources badge.svg', alt: 'Azure Compute Resources' },
  { id: 'ms-fabric', src: '/Badges/Implement a Lakehouse with Microsoft Fabric.svg', alt: 'Lakehouse with Microsoft Fabric' },
  { id: 'ms-md102', src: '/Badges/MD-102 Explore endpoint management.svg', alt: 'MD-102 Endpoint Management' },
  { id: 'ms-entra', src: '/Badges/Manage Microsoft Entra Identity Protection.svg', alt: 'Entra Identity Protection' },
  { id: 'ms-azure-ml', src: '/Badges/Manage and review models in Azure Machine Learning.svg', alt: 'Azure Machine Learning Models' },
  { id: 'ms-azure-data', src: '/Badges/Microsoft Azure Data core data concepts.svg', alt: 'Azure Core Data Concepts' },
  { id: 'ms-azure-backup', src: '/Badges/Protect your virtual machines by using Azure Backup badge.svg', alt: 'Azure Backup' },
  { id: 'ms-dax', src: '/Badges/Use DAX time intelligence functions in semantic models.svg', alt: 'DAX Time Intelligence' },
  { id: 'ms-365-def', src: '/Badges/mitigate-threats-using-microsoft-365-defender.svg', alt: 'Microsoft 365 Defender' },
  { id: 'ms-storage-sec', src: '/Badges/storage-security-configure badge.svg', alt: 'Azure Storage Security' },
  { id: 'aws-ai', src: '/Badges/AWS certified generative AI developer.webp', alt: 'AWS Generative AI Developer' },
];

const GOOGLE_BADGES: BadgeItem[] = [
  { id: 'ggl-android', src: '/Badges/Android Studio User.svg', alt: 'Android Studio User' },
  { id: 'ggl-firebase', src: '/Badges/Firebase Studio Developer Community.svg', alt: 'Firebase Studio Community' },
  { id: 'ggl-gemini-cli', src: '/Badges/Gemini CLI user Badge.png', alt: 'Gemini CLI User' },
  { id: 'ggl-cloud-nvidia', src: '/Badges/Google Cloud & NVIDIA community member.svg', alt: 'Google Cloud & NVIDIA Community' },
  { id: 'ggl-innovator', src: '/Badges/Google Cloud Innovator.svg', alt: 'Google Cloud Innovator' },
  { id: 'ggl-dev-prog', src: '/Badges/Google Developer Program premium tier.svg', alt: 'Google Developer Program Premium' },
  { id: 'ggl-gen-ai-leader', src: '/Badges/google generative AI leader.webp', alt: 'Google Generative AI Leader' },
  { id: 'ggl-dom', src: '/Badges/DOM Detective.svg', alt: 'DOM Detective' },
];

const GROUPS: { title: string; icon: LucideIcon; badges: BadgeItem[] }[] = [
  { title: 'GitHub', icon: Github, badges: GITHUB_BADGES },
  { title: 'LeetCode', icon: Code2, badges: LEETCODE_BADGES },
  { title: 'Microsoft & AWS', icon: Cloud, badges: MS_AWS_BADGES },
  { title: 'Google', icon: Sparkles, badges: GOOGLE_BADGES },
];

const Badge = ({ badge, index }: { badge: BadgeItem; index: number }) => (
  <div className="min-w-0 sm:w-[88px]" role="listitem" style={{ '--i': index } as CSSProperties}>
    <figure className="badge-float m-0 flex w-full flex-col items-center" style={{ '--float-delay': `${-(index % 7) * 0.8}s` } as CSSProperties}>
      <div className="badge-tile">
        <div className="relative h-full w-full">
          <Image src={badge.src} alt={badge.alt} fill sizes="(max-width: 640px) 25vw, 88px" className="object-contain" />
        </div>
      </div>
      <figcaption className="mt-1 line-clamp-2 w-full text-center text-[8px] leading-tight text-[#6f7888] sm:mt-1.5 sm:text-[11px]">
        {badge.alt}
      </figcaption>
    </figure>
  </div>
);

export default function BadgesShowcase() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [live, setLive] = useState(false);

  useEffect(() => {
    const el = rootRef.current;
    if (!el || !('IntersectionObserver' in window)) return;
    const io = new IntersectionObserver(([entry]) => setLive(entry.isIntersecting), { rootMargin: '80px 0px' });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={rootRef} className={`space-y-6 sm:space-y-10 ${live ? 'is-live' : ''}`}>
      {GROUPS.map((group, i) => {
        const Icon = group.icon;
        return (
          <Reveal key={group.title} delay={Math.min(i, 2) * 60}>
            <p className="text-center text-[13px] font-medium text-[#f2f4f8]">{group.title}</p>
            <div className="cascade mt-3 grid grid-cols-6 gap-x-1.5 gap-y-3 sm:mt-4 sm:flex sm:flex-wrap sm:justify-center sm:gap-x-4 sm:gap-y-6" role="list" aria-label={`${group.title} badges`}>
              {group.badges.map((badge, j) => (
                <Badge key={badge.id} badge={badge} index={j} />
              ))}
            </div>
          </Reveal>
        );
      })}
    </div>
  );
}
