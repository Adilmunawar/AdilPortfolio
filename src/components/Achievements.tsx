'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Reveal } from './Reveal';

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
  { alt: 'Advanced CloudFormation: Macros', issuer: 'AWS', description: 'Extending AWS CloudFormation templates with macros for reusable infrastructure as code.', issued: 'Jul 2026' },
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

const CertificateDocument = ({ item }: { item: Certificate }) => {
  const id = item.alt.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const title = item.alt.length > 34 ? [item.alt.slice(0, item.alt.lastIndexOf(' ', 34)), item.alt.slice(item.alt.lastIndexOf(' ', 34) + 1)] : [item.alt];
  return (
    <svg viewBox="0 0 640 480" width="100%" height="100%" role="img" aria-label={`${item.alt}, ${item.issuer}`} className="block">
      <defs>
        <linearGradient id={`${id}-paper`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fbfbf9" />
          <stop offset="1" stopColor="#eef1f6" />
        </linearGradient>
        <linearGradient id={`${id}-band`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#0b3d91" />
          <stop offset="1" stopColor="#0066ff" />
        </linearGradient>
      </defs>
      <rect width="640" height="480" fill={`url(#${id}-paper)`} />
      <rect x="18" y="18" width="604" height="444" fill="none" stroke="#0b3d91" strokeOpacity="0.35" strokeWidth="1.5" />
      <rect x="26" y="26" width="588" height="428" fill="none" stroke="#0b3d91" strokeOpacity="0.15" strokeWidth="1" />
      <rect x="0" y="0" width="640" height="10" fill={`url(#${id}-band)`} />
      <text x="320" y="86" textAnchor="middle" fontFamily="Georgia, 'Times New Roman', serif" fontSize="13" letterSpacing="4" fill="#0b3d91">CERTIFICATE OF COMPLETION</text>
      <text x="320" y="124" textAnchor="middle" fontFamily="inherit" fontSize="13" fill="#5b6472">{item.issuer}</text>
      <text x="320" y="176" textAnchor="middle" fontFamily="inherit" fontSize="12" fill="#5b6472">This certifies that</text>
      <text x="320" y="220" textAnchor="middle" fontFamily="Georgia, 'Times New Roman', serif" fontSize="34" fontWeight="600" fill="#101828">Adil Munawar</text>
      <line x1="200" y1="236" x2="440" y2="236" stroke="#0b3d91" strokeOpacity="0.4" strokeWidth="1" />
      <text x="320" y="266" textAnchor="middle" fontFamily="inherit" fontSize="12" fill="#5b6472">has successfully completed</text>
      {title.map((line, i) => (
        <text key={line} x="320" y={302 + i * 28} textAnchor="middle" fontFamily="Georgia, 'Times New Roman', serif" fontSize="22" fontWeight="600" fill="#0b3d91">{line}</text>
      ))}
      <g transform="translate(88 392)">
        <circle r="30" fill="none" stroke="#0b3d91" strokeOpacity="0.5" strokeWidth="1.5" />
        <circle r="22" fill="none" stroke="#0066ff" strokeOpacity="0.5" strokeWidth="1" strokeDasharray="3 3" />
        <text textAnchor="middle" y="4" fontFamily="inherit" fontSize="9" letterSpacing="1.5" fill="#0b3d91">RECORD</text>
      </g>
      {item.issued && <text x="160" y="388" fontFamily="inherit" fontSize="11" fill="#5b6472">Issued {item.issued}</text>}
      {item.credentialId && (
        <text x="160" y="408" fontFamily="ui-monospace, Menlo, monospace" fontSize="10.5" fill="#101828">Credential ID {item.credentialId}</text>
      )}
      <text x="160" y="428" fontFamily="inherit" fontSize="9.5" fill="#8a94a6">Verify with the issuer using the credential ID.</text>
    </svg>
  );
};

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
          <CertificateDocument item={item} />
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
