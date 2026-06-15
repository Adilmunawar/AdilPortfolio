
'use client';
import { Card } from '@/components/ui/card';
import { Code, Database, Cloud, Settings, Zap, Layers } from 'lucide-react';

const ServicesSection = () => {
  const services = [
    {
      Icon: Code,
      title: 'Full-Stack Systems Engineering',
      description: 'Engineering high-concurrency, full-scale web applications. Focused on building maintainable, performance-optimized digital platforms for global use.',
      gradient: 'from-blue-900 to-blue-900',
      accentColor: 'text-vivid-blue'
    },
    {
      Icon: Cloud,
      title: 'Cloud Infrastructure & DevOps',
      description: 'Architecting robust deployment strategies and automated CI/CD pipelines. Ensuring high availability, security, and zero-downtime environments.',
      gradient: 'from-blue-800 to-blue-800',
      accentColor: 'text-vivid-blue'
    },
    {
      Icon: Database,
      title: 'Advanced Database Architecture',
      description: 'Expert-level data systems design. Handling massive datasets with complex relationships, optimized indexing, and real-time synchronization.',
      gradient: 'from-blue-900 to-blue-900',
      accentColor: 'text-vivid-blue'
    },
    {
      Icon: Settings,
      title: 'Codebase Modernization',
      description: 'Refactoring legacy systems into modern architectures. Implementing strict standards, automated testing, and scalable structures for high-performing teams.',
      gradient: 'from-blue-800 to-blue-800',
      accentColor: 'text-vivid-blue'
    },
    {
      Icon: Zap,
      title: 'Intelligent AI Automation',
      description: 'Integrating state-of-the-art Generative AI and retrieval systems into production environments to automate workflows and enhance intelligence.',
      gradient: 'from-blue-900 to-blue-900',
      accentColor: 'text-vivid-blue'
    },
    {
      Icon: Layers,
      title: 'Technical Strategy & Architecture',
      description: 'Providing end-to-end technical blueprints and strategic consulting. Bridging the gap between complex ideas and robust, shippable products.',
      gradient: 'from-blue-800 to-blue-800',
      accentColor: 'text-vivid-blue'
    },
  ];

  return (
    <section id="services" className="min-h-screen py-20 px-4 relative overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gradient-slow animate-fade-in-up drop-shadow-lg">
            Specialized Services
          </h2>
          <p className="text-xl text-frost-blue max-w-3xl mx-auto animate-fade-in-up drop-shadow-md" style={{ animationDelay: '0.2s' }}>
            Delivering high-concurrency web systems and enterprise-grade architectural solutions
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <Card 
              key={index} 
              className="group relative p-8 glass-card transition-all duration-700 hover:scale-105 animate-scale-in overflow-hidden border-vivid-blue/20"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Animated background gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-0 group-hover:opacity-20 transition-all duration-700`}></div>
              
              {/* Glow effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-vivid-blue/20 to-frost-blue/20 rounded-lg blur opacity-0 group-hover:opacity-100 transition-all duration-700"></div>
              
              <div className="relative text-center">
                <div className={`w-20 h-20 bg-gradient-to-br ${service.gradient} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-12 transition-all duration-700 shadow-lg group-hover:shadow-2xl backdrop-blur-sm border border-white/20`}>
                  <service.Icon size={36} className="text-frost-white drop-shadow-lg group-hover:scale-110 transition-transform duration-500" />
                </div>
                <h3 className={`text-xl font-bold mb-4 text-frost-white drop-shadow-md group-hover:text-white transition-colors duration-500 ${service.accentColor}`}>{service.title}</h3>
                <p className="text-frost-blue leading-relaxed group-hover:text-frost-white transition-colors duration-500 drop-shadow-sm">{service.description}</p>
              </div>

              {/* Hover border animation */}
              <div className="absolute inset-0 border-2 border-transparent group-hover:border-vivid-blue/40 rounded-lg transition-all duration-700"></div>
              
              {/* Corner accents */}
              <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-vivid-blue/30 group-hover:border-vivid-blue/60 transition-colors duration-500"></div>
              <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-vivid-blue/30 group-hover:border-vivid-blue/60 transition-colors duration-500"></div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
