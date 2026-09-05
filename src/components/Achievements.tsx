'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Reveal } from './Reveal';
import { CertificateDocument } from './CertificateDocument';

interface Certificate {
  tier?: 'badge';
  kind?: 'course' | 'exam' | 'badge';
  src?: string;
  width?: number;
  height?: number;
  alt: string;
  issuer: string;
  description: string;
  issued?: string;
  credentialId?: string;
}

const certificates: Certificate[] = [
  { alt: 'Operationalising EU Space for Security', issuer: 'EUSPA', description: 'EU Agency for the Space Programme course on operationalising EU space services for border security and geospatial intelligence.', issued: 'Aug 2026', credentialId: '6966612178c62e5fe0048a0f' },
  { src: '/certifications/matlab-onramp.jpg', width: 1014, height: 824, alt: 'MATLAB Onramp', issuer: 'MathWorks', description: 'Hands-on introduction to MATLAB for numerical computing and data analysis.', issued: 'Jul 2026' },
  { src: '/certifications/aws-cloudformation-macros.jpg', width: 757, height: 510, alt: 'Advanced CloudFormation: Macros', issuer: 'AWS', description: 'Extending AWS CloudFormation templates with macros for reusable infrastructure as code.', issued: 'Jul 2026' },
  { alt: 'Machine Learning with Python', issuer: 'MIT Professional Education', description: 'Supervised and unsupervised learning foundations implemented in Python.', issued: 'Jul 2026', credentialId: '4b7ac91e0f3d82c56a19fe0332d8a17' },
  { alt: 'Computational Probability and Inference', issuer: 'MIT Professional Education', description: 'Probabilistic modelling and inference methods for data-driven systems.', issued: 'Jun 2026', credentialId: 'e4ecfea7a7014b2483579dd1e7356c23' },
  { src: '/certifications/digital-skill-web-analytics_certificate_of_achievement_v6zgddz_page-0001.jpg', width: 708, height: 1000, alt: 'Web Analytics by Accenture', issuer: 'Accenture / FutureLearn', description: 'Web analytics for data-driven decisions, delivered by Accenture on FutureLearn.', issued: 'Apr 2026', credentialId: 'v6zgddz' },
  { src: '/certifications/software-egeenier-hacker-rank.png', width: 1000, height: 750, alt: 'Certified Software Engineer', issuer: 'HackerRank', description: 'Verified software engineering and problem-solving proficiency.', issued: 'Apr 2026', credentialId: 'b6411a6e46da' },
  { src: '/certifications/agile-foundation-by-linkedin.jpeg', width: 1280, height: 989, alt: 'Agile Foundations', issuer: 'LinkedIn / PMI', description: 'Agile foundations in collaboration with the Project Management Institute.', issued: 'Apr 2026' },
  { src: '/certifications/sql-relational-databases.jpg', width: 1140, height: 706, alt: 'SQL and Relational Databases 101', issuer: 'Cognitive Class / IBM Skills Network', description: 'Relational database design and SQL querying fundamentals.', issued: 'Mar 2026', credentialId: '6acdbc63fde448e3a5d2304cd0333ea8' },
  { src: '/certifications/anthropic---claude-with-amazon-bedrock.jpg', width: 1000, height: 773, alt: 'Claude in Amazon Bedrock', issuer: 'Anthropic', description: 'Integrating and optimizing Claude models on Amazon Bedrock, including the Model Context Protocol.', issued: 'Mar 2026', credentialId: 'wfq8d7zjnka8' },
  { alt: 'Chronicle SOAR Developer', issuer: 'Google Cloud Skills Boost', description: 'Building security orchestration, automation and response playbooks on Google Chronicle SOAR.', issued: 'Feb 2026', credentialId: '22073529' },
  { src: '/certifications/building-language-models-on-AWS.png', width: 981, height: 678, alt: 'Building Language Models on AWS', issuer: 'AWS', description: 'Training and deploying language models on Amazon Web Services.', issued: 'Dec 2025' },
  { src: '/certifications/Google-Ads-apps.png', width: 567, height: 435, alt: 'Google Ads Apps Certification', issuer: 'Google Cloud Skills Boost', description: 'Building and integrating applications with Google Ads APIs.', issued: 'Dec 2025', credentialId: '169263387' },
  { src: '/certifications/Microsoft-azure-professional.png', width: 795, height: 537, alt: 'Azure Cloud Computing', issuer: 'Microsoft', description: 'Architecting secure, scalable solutions on Microsoft Azure.', issued: 'May 2025', credentialId: 'AdilMunawar4765' },
  { src: '/certifications/application-modern.png', width: 1000, height: 909, alt: 'Application Modernization with Google Cloud', tier: 'badge', issuer: 'Google', description: 'Modernizing legacy architectures for performance, scalability and security.', issued: 'Mar 2025', credentialId: '14164265' },
  { src: '/certifications/Linkedin-Content-and-creative-design.png', width: 810, height: 594, alt: 'LinkedIn Content and Creative Design', issuer: 'LinkedIn', description: 'Technical content and creative design fundamentals.', issued: 'Mar 2025', credentialId: 'zn7dbp7a2cw3' },
  { src: '/certifications/MLOPS-with-vertex-AI.png', width: 1000, height: 909, alt: 'MLOps with Vertex AI', tier: 'badge', issuer: 'Google', description: 'Managing machine learning models at scale on Vertex AI.', issued: 'Feb 2025', credentialId: '14116643' },
  { src: '/certifications/MLOPS.png', width: 1000, height: 908, alt: 'Machine Learning Operations for Generative AI', tier: 'badge', issuer: 'Google', description: 'MLOps workflows across the machine learning lifecycle for generative AI.', issued: 'Feb 2025', credentialId: '14101465' },
  { src: '/certifications/advance-webhook-concepts.png', width: 1000, height: 909, alt: 'Advanced Webhook Concepts', tier: 'badge', issuer: 'Google Cloud', description: 'Advanced webhook concepts for real-time data synchronization between applications.' },
  { src: '/certifications/advanced-performance-measurements.png', width: 1000, height: 909, alt: 'Advanced Performance Measurements', tier: 'badge', issuer: 'Google', description: 'Enterprise performance measurement for high-speed applications.' },
  { src: '/certifications/CCAI-frontend-Integrations.png', width: 1000, height: 909, alt: 'CCAI Frontend Integrations', tier: 'badge', issuer: 'Google Cloud', description: 'Contact Center AI frontend integrations with user-centric interfaces.' },
];

const GRID_SIZES = '(max-width: 639px) 50vw, (max-width: 1023px) 33vw, 270px';

const Tile = ({ item, index }: { item: Certificate; index: number }) => {
  const [shown, setShown] = useState(false);
  const ratio = item.src && item.width && item.height ? `${item.width} / ${item.height}` : '4 / 3';
  return (
    <Reveal delay={(index % 4) * 40} className="cert-masonry__item">
      <div
        className="cert-tile group relative w-full overflow-hidden rounded-[4px] bg-[#0b0f17]"
        style={{ aspectRatio: ratio }}
        onClick={() => setShown((v) => !v)}
        onMouseLeave={() => setShown(false)}
      >
        {item.src ? (
          <Image src={item.src} alt={`${item.alt}, ${item.issuer}`} fill sizes={GRID_SIZES} className="object-cover" />
        ) : (
          <CertificateDocument title={item.alt} issuer={item.issuer} issued={item.issued} credentialId={item.credentialId} />
        )}
        <div className={`cert-tile__caption pointer-events-none absolute inset-x-0 bottom-0 flex flex-col justify-end bg-gradient-to-t from-[#0b0f17]/90 via-[#0b0f17]/60 to-transparent p-3 transition-opacity duration-200 ${shown ? 'opacity-100' : 'opacity-0 md:group-hover:opacity-100'}`}>
          <p className="text-[12px] font-medium leading-snug text-[#f2f4f8]">{item.alt}</p>
          <p className="mt-0.5 text-[11px] text-[#a4adbe]">
            {item.issuer}
            {item.issued ? ` · ${item.issued}` : ''}
          </p>
        </div>
      </div>
    </Reveal>
  );
};

const Achievements = () => (
  <div className="cert-masonry">
    {certificates.map((item, i) => (
      <Tile key={item.alt} item={item} index={i} />
    ))}
  </div>
);

export default Achievements;
