'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

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
  { id: 'lc-sql-50', src: '/Badges/Top_SQL_50 leetcode.png', alt: 'LeetCode Top SQL 50' },
  { id: 'lc-algo-decomp', src: '/Badges/algorithm deconstructor badge leetcode.png', alt: 'LeetCode Algorithm Deconstructor' },
  { id: 'lc-arch-build', src: '/Badges/architecture builder badge leetcode.png', alt: 'LeetCode Architecture Builder' },
  { id: 'lc-data-nav', src: '/Badges/data navigator badge leetcode.png', alt: 'LeetCode Data Navigator' },
  { id: 'lc-math-insight', src: '/Badges/mathematical insight badge leetcode.png', alt: 'LeetCode Mathematical Insight' },
  { id: 'lc-pandas', src: '/Badges/Introduction_to_Pandas_Badge leetcode.png', alt: 'LeetCode Introduction to Pandas' },
  { id: 'lc-100-2025', src: '/Badges/100 days badge leetcode 2025.png', alt: 'LeetCode 100 Days 2025' },
  { id: 'lc-100-2026', src: '/Badges/100 days badge leetcode 2026.png', alt: 'LeetCode 100 Days 2026' },
  { id: 'lc-50-2025', src: '/Badges/50 days badge leetcode 2025.png', alt: 'LeetCode 50 Days 2025' },
  { id: 'lc-50-2026', src: '/Badges/50 days badge leetcode 2026.png', alt: 'LeetCode 50 Days 2026' },
];

const MS_AWS_BADGES: BadgeItem[] = [
  { id: 'ms-azure-vm', src: '/Badges/Azure virtual machines badge.svg', alt: 'Azure Virtual Machines' },
  { id: 'ms-deploy-compute', src: '/Badges/Deploy and manage Azure compute resources badge.svg', alt: 'Deploy and Manage Azure Compute' },
  { id: 'ms-fabric', src: '/Badges/Implement a Lakehouse with Microsoft Fabric.svg', alt: 'Implement a Lakehouse with Microsoft Fabric' },
  { id: 'ms-md102', src: '/Badges/MD-102 Explore endpoint management.svg', alt: 'MD-102 Explore Endpoint Management' },
  { id: 'ms-entra', src: '/Badges/Manage Microsoft Entra Identity Protection.svg', alt: 'Manage Microsoft Entra Identity Protection' },
  { id: 'ms-azure-ml', src: '/Badges/Manage and review models in Azure Machine Learning.svg', alt: 'Manage and Review Models in Azure ML' },
  { id: 'ms-azure-data', src: '/Badges/Microsoft Azure Data core data concepts.svg', alt: 'Microsoft Azure Data Core Concepts' },
  { id: 'ms-azure-backup', src: '/Badges/Protect your virtual machines by using Azure Backup badge.svg', alt: 'Protect VMs with Azure Backup' },
  { id: 'ms-dax', src: '/Badges/Use DAX time intelligence functions in semantic models.svg', alt: 'Use DAX Time Intelligence Functions' },
  { id: 'ms-365-def', src: '/Badges/mitigate-threats-using-microsoft-365-defender.svg', alt: 'Mitigate Threats using Microsoft 365 Defender' },
  { id: 'ms-storage-sec', src: '/Badges/storage-security-configure badge.svg', alt: 'Configure Storage Security' },
  { id: 'aws-ai', src: '/Badges/AWS certified generative AI developer.webp', alt: 'AWS Certified Generative AI Developer' },
];

const GOOGLE_BADGES: BadgeItem[] = [
  { id: 'ggl-android', src: '/Badges/Android Studio User.svg', alt: 'Android Studio User' },
  { id: 'ggl-firebase', src: '/Badges/Firebase Studio Developer Community.svg', alt: 'Firebase Studio Developer Community' },
  { id: 'ggl-gemini-cli', src: '/Badges/Gemini CLI user Badge.png', alt: 'Gemini CLI User' },
  { id: 'ggl-cloud-nvidia', src: '/Badges/Google Cloud & NVIDIA community member.svg', alt: 'Google Cloud & NVIDIA Community Member' },
  { id: 'ggl-innovator', src: '/Badges/Google Cloud Innovator.svg', alt: 'Google Cloud Innovator' },
  { id: 'ggl-dev-prog', src: '/Badges/Google Developer Program premium tier.svg', alt: 'Google Developer Program Premium Tier' },
  { id: 'ggl-gen-ai-leader', src: '/Badges/google generative AI leader.webp', alt: 'Google Generative AI Leader' },
  { id: 'ggl-dom', src: '/Badges/DOM Detective.svg', alt: 'DOM Detective' },
];

const BadgeItemComponent = ({ badge, glowColor }: { badge: BadgeItem, glowColor: string }) => {
  const [showName, setShowName] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6 }}
      onClick={() => setShowName(!showName)}
      className="relative w-24 h-24 sm:w-28 sm:h-28 flex flex-col items-center justify-center cursor-pointer group"
    >
      {/* Smooth synchronized float with professional, subtle contour-hugging glow */}
      <motion.div
        animate={{ 
          y: [0, -6, 0],
          filter: [
            `drop-shadow(0px 0px 6px ${glowColor}40) drop-shadow(0px 0px 6px ${glowColor}00)`,
            `drop-shadow(0px 0px 12px ${glowColor}90) drop-shadow(0px 0px 20px ${glowColor}60)`,
            `drop-shadow(0px 0px 6px ${glowColor}40) drop-shadow(0px 0px 6px ${glowColor}00)`
          ]
        }}
        transition={{ duration: 6, ease: "easeInOut", repeat: Infinity }}
        className="relative w-full h-full transform transition-transform duration-700 group-hover:scale-110 group-hover:z-20 z-10"
      >
         <Image
            src={badge.src}
            alt={badge.alt}
            fill
            sizes="(max-width: 768px) 96px, 112px"
            className="object-contain transition-all duration-300"
         />
      </motion.div>
      
      {/* Name Badge (Visible on hover OR click) */}
      <div 
        className={`absolute -bottom-10 sm:-bottom-12 left-1/2 -translate-x-1/2 w-[120px] sm:w-[140px] bg-cyber-dark/95 text-[10px] sm:text-xs px-2 py-1.5 rounded-lg border border-white/10 backdrop-blur-xl z-30 font-medium tracking-wide flex items-center justify-center text-center shadow-lg transition-all duration-500 ${showName ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto'}`}
      >
        <span className="line-clamp-2 text-slate-200">{badge.alt}</span>
      </div>
    </motion.div>
  );
};

const BadgeRow = ({ title, badges, glowColor, isLast = false }: { title: string, badges: BadgeItem[], glowColor: string, isLast?: boolean }) => {
  return (
    <div className={`w-full flex flex-col items-center ${isLast ? 'mb-0' : 'mb-24'} relative`}>
      <div className="w-full flex justify-center mb-10 px-4">
        <h4 className="text-xl md:text-2xl font-semibold text-slate-200 tracking-wider uppercase">
          {title}
        </h4>
      </div>

      <div className="flex flex-wrap justify-center items-center gap-x-8 gap-y-16 md:gap-x-12 px-4 max-w-6xl">
        {badges.map((badge) => (
          <BadgeItemComponent key={badge.id} badge={badge} glowColor={glowColor} />
        ))}
      </div>
    </div>
  );
};

export default function BadgesShowcase() {
  return (
    <div className="w-full flex flex-col items-center pt-20 pb-0 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-blue-600/5 blur-[150px] rounded-full pointer-events-none -z-20" />
      <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-blue-500/5 blur-[150px] rounded-full pointer-events-none -z-20" />

      <BadgeRow title="GitHub Badges" badges={GITHUB_BADGES} glowColor="#0066ff" />
      <BadgeRow title="LeetCode Badges" badges={LEETCODE_BADGES} glowColor="#0066ff" />
      <BadgeRow title="Microsoft & AWS Badges" badges={MS_AWS_BADGES} glowColor="#0066ff" />
      <BadgeRow title="Google Badges" badges={GOOGLE_BADGES} glowColor="#0066ff" isLast={true} />
    </div>
  );
}
