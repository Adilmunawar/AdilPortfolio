'use client';
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

const BadgeRow = ({ title, badges }: { title: string, badges: BadgeItem[] }) => {
  return (
    <div className="w-full flex flex-col items-center mb-16">
      <h4 className="text-xl font-semibold text-slate-300 mb-8 uppercase tracking-widest">{title}</h4>
      <div className="flex flex-wrap justify-center items-center gap-6 md:gap-10">
        {badges.map((badge, index) => (
          <motion.div
            key={badge.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.05 }}
            className="relative w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center cursor-pointer group"
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{
                duration: 4,
                ease: "easeInOut",
                repeat: Infinity,
                delay: (index % 5) * 0.2, // Offset animation so they don't move exactly together
              }}
              className="relative w-full h-full transform transition-transform duration-300 group-hover:scale-110"
            >
               <Image
                  src={badge.src}
                  alt={badge.alt}
                  fill
                  className="object-contain filter drop-shadow-lg group-hover:drop-shadow-[0_0_15px_rgba(59,130,246,0.6)] transition-all duration-300"
               />
            </motion.div>
            
            {/* Tooltip on hover */}
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap bg-slate-900/90 text-xs text-white px-3 py-1 rounded-md border border-slate-700 backdrop-blur-md z-10">
              {badge.alt}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default function BadgesShowcase() {
  return (
    <div className="w-full flex flex-col items-center py-10">
      <BadgeRow title="GitHub Badges" badges={GITHUB_BADGES} />
      <BadgeRow title="LeetCode Badges" badges={LEETCODE_BADGES} />
      <BadgeRow title="Microsoft & AWS Badges" badges={MS_AWS_BADGES} />
      <BadgeRow title="Google Badges" badges={GOOGLE_BADGES} />
    </div>
  );
}
