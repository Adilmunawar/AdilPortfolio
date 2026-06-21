'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { cn } from '@/lib/utils';

type BadgeCategory = 'All' | 'LeetCode' | 'GitHub' | 'Google & Android' | 'Microsoft & Azure' | 'Other';

interface BadgeItem {
  id: string;
  src: string;
  alt: string;
  category: BadgeCategory;
}

const BADGES: BadgeItem[] = [
  // LeetCode
  { id: 'lc-100-2025', src: '/Badges/100 days badge leetcode 2025.png', alt: 'LeetCode 100 Days 2025', category: 'LeetCode' },
  { id: 'lc-100-2026', src: '/Badges/100 days badge leetcode 2026.png', alt: 'LeetCode 100 Days 2026', category: 'LeetCode' },
  { id: 'lc-50-2025', src: '/Badges/50 days badge leetcode 2025.png', alt: 'LeetCode 50 Days 2025', category: 'LeetCode' },
  { id: 'lc-50-2026', src: '/Badges/50 days badge leetcode 2026.png', alt: 'LeetCode 50 Days 2026', category: 'LeetCode' },
  { id: 'lc-sql-50', src: '/Badges/Top_SQL_50 leetcode.png', alt: 'LeetCode Top SQL 50', category: 'LeetCode' },
  { id: 'lc-algo-decomp', src: '/Badges/algorithm deconstructor badge leetcode.png', alt: 'LeetCode Algorithm Deconstructor', category: 'LeetCode' },
  { id: 'lc-arch-build', src: '/Badges/architecture builder badge leetcode.png', alt: 'LeetCode Architecture Builder', category: 'LeetCode' },
  { id: 'lc-data-nav', src: '/Badges/data navigator badge leetcode.png', alt: 'LeetCode Data Navigator', category: 'LeetCode' },
  { id: 'lc-math-insight', src: '/Badges/mathematical insight badge leetcode.png', alt: 'LeetCode Mathematical Insight', category: 'LeetCode' },
  { id: 'lc-pull-shark', src: '/Badges/pull shark gold badge leetcode.png', alt: 'LeetCode Pull Shark Gold', category: 'LeetCode' },
  { id: 'lc-pandas', src: '/Badges/Introduction_to_Pandas_Badge leetcode.png', alt: 'LeetCode Introduction to Pandas', category: 'LeetCode' },
  // GitHub
  { id: 'gh-actions', src: '/Badges/Github Actions badge.webp', alt: 'GitHub Actions', category: 'GitHub' },
  { id: 'gh-admin', src: '/Badges/Github Admin Badge.webp', alt: 'GitHub Admin', category: 'GitHub' },
  { id: 'gh-galaxy-brain', src: '/Badges/galaxy brain badge github silver.png', alt: 'GitHub Galaxy Brain Silver', category: 'GitHub' },
  { id: 'gh-adv-sec', src: '/Badges/github advance securtiy badge.webp', alt: 'GitHub Advanced Security', category: 'GitHub' },
  { id: 'gh-agentic-ai', src: '/Badges/github-agentic-ai-developer.svg', alt: 'GitHub Agentic AI Developer', category: 'GitHub' },
  { id: 'gh-pair-extra', src: '/Badges/pair extraordinary gold github badge.png', alt: 'GitHub Pair Extraordinary Gold', category: 'GitHub' },
  // Google
  { id: 'ggl-android', src: '/Badges/Android Studio User.svg', alt: 'Android Studio User', category: 'Google & Android' },
  { id: 'ggl-firebase', src: '/Badges/Firebase Studio Developer Community.svg', alt: 'Firebase Studio Developer Community', category: 'Google & Android' },
  { id: 'ggl-gemini-cli', src: '/Badges/Gemini CLI user Badge.png', alt: 'Gemini CLI User', category: 'Google & Android' },
  { id: 'ggl-cloud-nvidia', src: '/Badges/Google Cloud & NVIDIA community member.svg', alt: 'Google Cloud & NVIDIA Community Member', category: 'Google & Android' },
  { id: 'ggl-innovator', src: '/Badges/Google Cloud Innovator.svg', alt: 'Google Cloud Innovator', category: 'Google & Android' },
  { id: 'ggl-dev-prog', src: '/Badges/Google Developer Program premium tier.svg', alt: 'Google Developer Program Premium Tier', category: 'Google & Android' },
  { id: 'ggl-gen-ai-leader', src: '/Badges/google generative AI leader.webp', alt: 'Google Generative AI Leader', category: 'Google & Android' },
  // Microsoft & Azure
  { id: 'ms-azure-vm', src: '/Badges/Azure virtual machines badge.svg', alt: 'Azure Virtual Machines', category: 'Microsoft & Azure' },
  { id: 'ms-deploy-compute', src: '/Badges/Deploy and manage Azure compute resources badge.svg', alt: 'Deploy and Manage Azure Compute', category: 'Microsoft & Azure' },
  { id: 'ms-fabric', src: '/Badges/Implement a Lakehouse with Microsoft Fabric.svg', alt: 'Implement a Lakehouse with Microsoft Fabric', category: 'Microsoft & Azure' },
  { id: 'ms-md102', src: '/Badges/MD-102 Explore endpoint management.svg', alt: 'MD-102 Explore Endpoint Management', category: 'Microsoft & Azure' },
  { id: 'ms-entra', src: '/Badges/Manage Microsoft Entra Identity Protection.svg', alt: 'Manage Microsoft Entra Identity Protection', category: 'Microsoft & Azure' },
  { id: 'ms-azure-ml', src: '/Badges/Manage and review models in Azure Machine Learning.svg', alt: 'Manage and Review Models in Azure ML', category: 'Microsoft & Azure' },
  { id: 'ms-azure-data', src: '/Badges/Microsoft Azure Data core data concepts.svg', alt: 'Microsoft Azure Data Core Concepts', category: 'Microsoft & Azure' },
  { id: 'ms-azure-backup', src: '/Badges/Protect your virtual machines by using Azure Backup badge.svg', alt: 'Protect VMs with Azure Backup', category: 'Microsoft & Azure' },
  { id: 'ms-dax', src: '/Badges/Use DAX time intelligence functions in semantic models.svg', alt: 'Use DAX Time Intelligence Functions', category: 'Microsoft & Azure' },
  { id: 'ms-365-def', src: '/Badges/mitigate-threats-using-microsoft-365-defender.svg', alt: 'Mitigate Threats using Microsoft 365 Defender', category: 'Microsoft & Azure' },
  { id: 'ms-storage-sec', src: '/Badges/storage-security-configure badge.svg', alt: 'Configure Storage Security', category: 'Microsoft & Azure' },
  // Other
  { id: 'other-aws-ai', src: '/Badges/AWS certified generative AI developer.webp', alt: 'AWS Certified Generative AI Developer', category: 'Other' },
  { id: 'other-dom', src: '/Badges/DOM Detective.svg', alt: 'DOM Detective', category: 'Other' },
];

const CATEGORIES: BadgeCategory[] = ['All', 'LeetCode', 'GitHub', 'Google & Android', 'Microsoft & Azure', 'Other'];

export default function BadgesShowcase() {
  const [activeCategory, setActiveCategory] = useState<BadgeCategory>('All');

  const filteredBadges = BADGES.filter(
    (badge) => activeCategory === 'All' || badge.category === activeCategory
  );

  return (
    <div className="w-full flex flex-col items-center">
      <div className="flex flex-wrap justify-center gap-3 mb-10">
        {CATEGORIES.map((category) => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={cn(
              "relative px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 outline-none",
              activeCategory === category 
                ? "text-white shadow-lg shadow-vivid-blue/20" 
                : "text-slate-400 hover:text-white hover:bg-slate-800/50"
            )}
          >
            {activeCategory === category && (
              <motion.div
                layoutId="activeCategoryBadge"
                className="absolute inset-0 bg-vivid-blue rounded-full -z-10"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
            {category}
          </button>
        ))}
      </div>

      <motion.div 
        layout
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 max-w-7xl w-full"
      >
        <AnimatePresence mode="popLayout">
          {filteredBadges.map((badge) => (
            <motion.div
              layout
              key={badge.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3 }}
              className="relative group aspect-square flex items-center justify-center p-4 bg-slate-900/40 rounded-2xl border border-slate-700/50 backdrop-blur-sm hover:border-vivid-blue/50 hover:bg-slate-800/60 transition-colors cursor-pointer"
            >
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-vivid-blue/0 to-transparent group-hover:from-vivid-blue/10 transition-all duration-500 pointer-events-none" />
              <div className="relative w-full h-full flex items-center justify-center transform group-hover:scale-110 transition-transform duration-500 ease-out">
                 <Image
                    src={badge.src}
                    alt={badge.alt}
                    fill
                    className="object-contain p-2 filter drop-shadow-md group-hover:drop-shadow-[0_0_8px_rgba(59,130,246,0.5)] transition-all duration-500"
                 />
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
