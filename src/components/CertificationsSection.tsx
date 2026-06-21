'use client';
import { Card, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink, Award, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import Image from 'next/image';

const certifications = [
  {
    title: 'Microsoft Azure Professional',
    issuer: 'Microsoft',
    image: '/certifications/Microsoft-azure-professional.png',
  },
  {
    title: 'Building Language Models on AWS',
    issuer: 'Amazon Web Services',
    image: '/certifications/building-language-models-on-AWS.png',
  },
  {
    title: 'Anthropic - Claude with Amazon Bedrock',
    issuer: 'AWS & Anthropic',
    image: '/certifications/anthropic---claude-with-amazon-bedrock.jpg',
  },
  {
    title: 'MLOps with Vertex AI',
    issuer: 'Google Cloud',
    image: '/certifications/MLOPS-with-vertex-AI.png',
  },
  {
    title: 'MLOps Fundamentals',
    issuer: 'Google Cloud',
    image: '/certifications/MLOPS.png',
  },
  {
    title: 'CCAI Frontend Integrations',
    issuer: 'Google Cloud',
    image: '/certifications/CCAI-frontend-Integrations.png',
  },
  {
    title: 'Google Ads Apps',
    issuer: 'Google',
    image: '/certifications/Google-Ads-apps.png',
  },
  {
    title: 'LinkedIn Content & Creative Design',
    issuer: 'LinkedIn',
    image: '/certifications/Linkedin-Content-and-creative-design.png',
  },
  {
    title: 'Advance Webhook Concepts',
    issuer: 'Technical Certification',
    image: '/certifications/advance-webhook-concepts.png',
  },
  {
    title: 'Advanced Performance Measurements',
    issuer: 'Technical Certification',
    image: '/certifications/advanced-performance-measurements.png',
  },
  {
    title: 'Application Modernization',
    issuer: 'Google Cloud',
    image: '/certifications/application-modern.png',
  },
  {
    title: 'Web Analytics',
    issuer: 'Accenture',
    image: '/certifications/digital-skill-web-analytics_certificate_of_achievement_v6zgddz_page-0001.jpg',
  },
  {
    title: 'Software Engineer',
    issuer: 'HackerRank',
    image: '/certifications/software-egeenier-hacker-rank.png',
  },
  {
    title: 'Agile Foundations',
    issuer: 'LinkedIn & PMI',
    image: '/certifications/agile-foundation-by-linkedin.jpeg',
  },
];

const CertificationsSection = () => {
  return (
    <section id="certifications" className="py-32 px-4 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-vivid-blue/5 blur-[150px] rounded-full -z-10" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-blue-600/5 blur-[150px] rounded-full -z-10" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-24 space-y-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyber-dark/50 border border-vivid-blue/20 text-vivid-blue backdrop-blur-md"
          >
            <Sparkles className="w-4 h-4 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-widest">Verified Expertise</span>
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-black text-white tracking-tight"
          >
            Global <span className="text-gradient animate-shimmer">Certifications</span>
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-xl text-frost-blue/70 max-w-3xl mx-auto leading-relaxed font-medium"
          >
            A testament to my commitment to continuous learning and achieving mastery in cloud architecture, AI, and advanced web technologies.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
          {certifications.map((cert, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: (index % 3) * 0.1 }}
            >
              <Card 
                className="group h-full flex flex-col bg-cyber-dark/40 backdrop-blur-xl border border-white/10 rounded-[2rem] overflow-hidden transition-all duration-500 hover:border-vivid-blue/50 hover:shadow-[0_0_40px_-15px_rgba(0, 102, 255,0.3)]"
              >
                {/* Image Container */}
                <div className="relative h-64 overflow-hidden bg-cyber-dark/80">
                  <Image
                    src={cert.image}
                    alt={cert.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110 opacity-90 group-hover:opacity-100"
                    quality={90}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-cyber-dark via-cyber-dark/20 to-transparent" />
                  
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-vivid-blue/10 backdrop-blur-[2px]">
                    <Button
                      size="icon"
                      className="w-14 h-14 rounded-full bg-white text-black hover:bg-vivid-blue hover:text-white transition-all duration-300 transform scale-50 group-hover:scale-100"
                      onClick={() => window.open(cert.image, '_blank')}
                      title="View Full Certificate"
                    >
                      <ExternalLink size={24} />
                    </Button>
                  </div>
                </div>

                <CardHeader className="p-8 pb-2">
                  <div className="flex items-center gap-3 mb-2">
                    <Award className="w-5 h-5 text-vivid-blue" />
                    <span className="text-sm font-bold uppercase tracking-wider text-frost-blue/80">
                      {cert.issuer}
                    </span>
                  </div>
                  <CardTitle className="text-2xl font-bold text-white group-hover:text-vivid-blue transition-colors line-clamp-2 leading-tight">
                    {cert.title}
                  </CardTitle>
                </CardHeader>

                <CardFooter className="p-8 pt-4 mt-auto">
                  <Button
                    className="w-full h-12 rounded-2xl bg-vivid-blue/10 text-vivid-blue hover:bg-vivid-blue hover:text-black border border-vivid-blue/20 font-bold text-xs uppercase tracking-widest transition-all duration-300"
                    onClick={() => window.open(cert.image, '_blank')}
                  >
                    <ExternalLink size={14} className="mr-2" />
                    Verify Credential
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CertificationsSection;
