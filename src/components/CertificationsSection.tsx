'use client';
import { Card } from '@/components/ui/card';
import { Award, ShieldCheck, Cpu, Star, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';

const certifications = [
  {
    title: 'Certified JavaScript Developer',
    issuer: 'Tech Certification Institute',
    Icon: Award,
    link: '#'
  },
  {
    title: 'Advanced React Specialist',
    issuer: 'Modern Web University',
    Icon: ShieldCheck,
    link: '#'
  },
  {
    title: 'Full-Stack Web Development',
    issuer: 'The Code Academy',
    Icon: Cpu,
    link: '#'
  },
  {
    title: 'UI/UX Design Fundamentals',
    issuer: 'DesignHub',
    Icon: Star,
    link: '#'
  },
];

const CertificationsSection = () => {
  return (
    <section id="certifications" className="py-20 px-4 relative overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-5xl md:text-7xl font-bold mb-6 text-gradient-slow drop-shadow-lg">
            My Certifications
          </h2>
          <p className="text-xl text-frost-cyan max-w-3xl mx-auto drop-shadow-md" style={{ animationDelay: '0.2s' }}>
            A testament to my commitment to continuous learning and skill mastery.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {certifications.map((cert, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
            >
              <Card 
                className="group relative p-6 text-center glass-card transition-all duration-500 hover:border-neon-cyan/80 hover:shadow-2xl hover:shadow-neon-cyan/20 hover:-translate-y-2"
              >
                <div className="flex justify-center mb-6">
                  <div className="relative w-20 h-20 bg-cyber-dark/50 rounded-full flex items-center justify-center border-2 border-neon-cyan/30 group-hover:border-neon-cyan transition-all duration-300 group-hover:scale-110">
                    <cert.Icon size={36} className="text-neon-cyan transition-all duration-300 group-hover:text-frost-white" />
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-neon-cyan/10 to-transparent group-hover:from-neon-cyan/20 transition-all duration-300"></div>
                  </div>
                </div>
                <h3 className="text-lg font-bold text-frost-white mb-2">{cert.title}</h3>
                <p className="text-sm text-frost-cyan/80 mb-6">{cert.issuer}</p>
                <a 
                  href={cert.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-sm font-semibold text-neon-cyan opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                >
                  View Credential <ExternalLink size={14} className="ml-2" />
                </a>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CertificationsSection;
