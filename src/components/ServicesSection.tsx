'use client';
import { Card } from '@/components/ui/card';
import { Code, Server, BrainCircuit, Network, Workflow, Cloud, Bot, Cpu } from 'lucide-react';
import { motion } from 'framer-motion';

const ServicesSection = () => {
  const services = [
    {
      Icon: Code,
      title: 'Full-Stack Engineering',
      description: 'Architecting high-concurrency, scalable web applications from front to back, ensuring responsive UIs and robust enterprise-grade backend systems.',
      gradient: 'from-blue-600/20 to-blue-900/40',
      iconColor: 'text-blue-400',
    },
    {
      Icon: Server,
      title: 'Custom MCP Servers',
      description: 'Building specialized Model Context Protocol (MCP) servers to securely connect AI agents directly to your company\'s proprietary data and internal APIs.',
      gradient: 'from-cyan-600/20 to-blue-900/40',
      iconColor: 'text-cyan-400',
    },
    {
      Icon: Cpu,
      title: 'ML Model Training',
      description: 'End-to-end training, fine-tuning, and deployment of custom Machine Learning and AI models optimized for your specific business logic and datasets.',
      gradient: 'from-indigo-600/20 to-blue-900/40',
      iconColor: 'text-indigo-400',
    },
    {
      Icon: Network,
      title: 'Enterprise RAG Pipelines',
      description: 'Engineering advanced Retrieval-Augmented Generation (RAG) pipelines that seamlessly integrate massive enterprise knowledge bases with Large Language Models.',
      gradient: 'from-sky-600/20 to-blue-900/40',
      iconColor: 'text-sky-400',
    },
    {
      Icon: Workflow,
      title: 'AI Agentic Workflows',
      description: 'Designing autonomous, multi-agent AI systems capable of executing complex, multi-step reasoning tasks, data synthesis, and operational workflows.',
      gradient: 'from-blue-500/20 to-indigo-900/40',
      iconColor: 'text-blue-300',
    },
    {
      Icon: Cloud,
      title: 'Cloud & MLOps Architecture',
      description: 'Deploying highly available cloud infrastructure tailored for AI workloads, ensuring zero-downtime scalability, GPU optimization, and secure model serving.',
      gradient: 'from-teal-600/20 to-blue-900/40',
      iconColor: 'text-teal-400',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 100, damping: 20 },
    },
  };

  return (
    <section id="services" className="min-h-screen py-24 px-4 relative overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none -z-10 animate-pulse" style={{ animationDuration: '8s' }} />
      <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-indigo-600/5 blur-[150px] rounded-full pointer-events-none -z-10 animate-pulse" style={{ animationDuration: '12s' }} />

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h2 className="text-5xl md:text-6xl font-black mb-6 text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-100 to-blue-400 drop-shadow-xl tracking-tight">
            Specialized Services
          </h2>
          <p className="text-xl text-frost-blue/80 max-w-3xl mx-auto font-medium">
            Architecting intelligent systems, training custom models, and bridging the gap between raw data and autonomous AI execution.
          </p>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {services.map((service, index) => (
            <motion.div key={index} variants={itemVariants} className="h-full">
              <Card className="group relative h-full p-8 bg-black/40 backdrop-blur-xl border border-white/5 transition-all duration-500 hover:border-white/20 overflow-hidden flex flex-col hover:shadow-[0_0_40px_-10px_rgba(0,102,255,0.3)] hover:-translate-y-2 rounded-3xl cursor-default">
                
                {/* Background Ambient Gradient on Hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none`} />
                
                <div className="relative z-10 flex flex-col h-full">
                  {/* Floating Icon Container */}
                  <div className={`w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500 shadow-xl overflow-hidden relative`}>
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <service.Icon className={`w-8 h-8 ${service.iconColor} transition-colors duration-500 drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]`} />
                  </div>
                  
                  {/* Text Content */}
                  <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-blue-50 transition-colors duration-300 tracking-tight">
                    {service.title}
                  </h3>
                  <p className="text-frost-blue/70 leading-relaxed font-medium group-hover:text-frost-blue transition-colors duration-300 flex-grow">
                    {service.description}
                  </p>
                  
                  {/* Bottom Accent Line */}
                  <div className="w-0 h-1 bg-gradient-to-r from-blue-500 to-cyan-400 mt-8 rounded-full transition-all duration-500 group-hover:w-full opacity-50" />
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default ServicesSection;
