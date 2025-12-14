'use client';
import { Card } from '@/components/ui/card';
import { Code, Smartphone, Search, Wrench, TrendingUp, Zap } from 'lucide-react';

const ServicesSection = () => {
  const services = [
    {
      Icon: Code,
      title: 'Full-Stack Development',
      description: 'End-to-end web application development using modern technologies like React, Node.js, and cloud platforms. Creating scalable and efficient solutions for your business needs.',
      gradient: 'from-cyan-900 to-sky-900',
      accentColor: 'text-neon-cyan'
    },
    {
      Icon: Smartphone,
      title: 'Mobile App Development',
      description: 'Cross-platform mobile applications with seamless user experiences. Specializing in React Native and hybrid app development with native performance.',
      gradient: 'from-cyan-800 to-sky-800',
      accentColor: 'text-neon-cyan'
    },
    {
      Icon: TrendingUp,
      title: 'Digital Solutions',
      description: 'Custom digital solutions including corporate management systems, social platforms, and automation tools designed to streamline business operations.',
      gradient: 'from-cyan-900 to-sky-900',
      accentColor: 'text-neon-cyan'
    },
    {
      Icon: Wrench,
      title: 'System Integration',
      description: 'Seamless integration of various systems and APIs to create unified digital ecosystems. Database management and server configuration expertise.',
      gradient: 'from-cyan-800 to-sky-800',
      accentColor: 'text-neon-cyan'
    },
    {
      Icon: Search,
      title: 'Performance Optimization',
      description: 'Website and application performance optimization, SEO implementation, and user experience enhancement to maximize your digital presence.',
      gradient: 'from-cyan-900 to-sky-900',
      accentColor: 'text-neon-cyan'
    },
    {
      Icon: Zap,
      title: 'Rapid Prototyping',
      description: 'Quick development of MVPs and prototypes to validate ideas and accelerate time-to-market using agile development methodologies.',
      gradient: 'from-cyan-800 to-sky-800',
      accentColor: 'text-neon-cyan'
    },
  ];

  return (
    <section id="services" className="min-h-screen py-20 px-4 relative overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gradient-slow animate-fade-in-up drop-shadow-lg">
            Services
          </h2>
          <p className="text-xl text-frost-cyan max-w-3xl mx-auto animate-fade-in-up drop-shadow-md" style={{ animationDelay: '0.2s' }}>
            Delivering cutting-edge solutions with modern technologies and best practices
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <Card 
              key={index} 
              className="group relative p-8 glass-card transition-all duration-700 hover:scale-105 animate-scale-in overflow-hidden"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Animated background gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-0 group-hover:opacity-20 transition-all duration-700`}></div>
              
              {/* Glow effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-neon-cyan/20 to-frost-cyan/20 rounded-lg blur opacity-0 group-hover:opacity-100 transition-all duration-700"></div>
              
              <div className="relative text-center">
                <div className={`w-20 h-20 bg-gradient-to-br ${service.gradient} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-12 transition-all duration-700 shadow-lg group-hover:shadow-2xl backdrop-blur-sm border border-white/20`}>
                  <service.Icon size={36} className="text-frost-white drop-shadow-lg group-hover:scale-110 transition-transform duration-500" />
                </div>
                <h3 className={`text-xl font-bold mb-4 text-frost-white drop-shadow-md group-hover:text-white transition-colors duration-500 ${service.accentColor}`}>{service.title}</h3>
                <p className="text-frost-cyan leading-relaxed group-hover:text-frost-white transition-colors duration-500 drop-shadow-sm">{service.description}</p>
              </div>

              {/* Hover border animation */}
              <div className="absolute inset-0 border-2 border-transparent group-hover:border-neon-cyan/40 rounded-lg transition-all duration-700"></div>
              
              {/* Corner accents */}
              <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-neon-cyan/30 group-hover:border-neon-cyan/60 transition-colors duration-500"></div>
              <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-neon-cyan/30 group-hover:border-neon-cyan/60 transition-colors duration-500"></div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
