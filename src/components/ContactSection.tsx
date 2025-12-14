'use client';
import { Card } from '@/components/ui/card';
import { Mail, Phone, Github, Instagram, MessageSquare, Linkedin, Send, MapPin, Clock } from 'lucide-react';
import { useState } from 'react';

const ContactSection = () => {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const contactMethods = [
    {
      Icon: Mail,
      label: 'Email',
      value: 'adilmunawar@gmail.com',
      description: 'Drop me a line anytime',
      link: 'mailto:adilmunawar@gmail.com',
      color: 'text-neon-cyan',
      bgColor: 'from-neon-cyan/5 to-frost-cyan/5',
      hoverColor: 'hover:from-neon-cyan/15 hover:to-frost-cyan/15',
      borderColor: 'border-neon-cyan/20 hover:border-neon-cyan/40',
      glowColor: 'shadow-neon-cyan/10'
    },
    {
      Icon: Phone,
      label: 'WhatsApp',
      value: '+92 324 4965220',
      description: 'Quick chat & instant replies',
      link: 'https://wa.me/923244965220',
      color: 'text-frost-cyan',
      bgColor: 'from-neon-cyan/5 to-frost-cyan/5',
      hoverColor: 'hover:from-neon-cyan/15 hover:to-frost-cyan/15',
      borderColor: 'border-neon-cyan/20 hover:border-neon-cyan/40',
      glowColor: 'shadow-neon-cyan/10'
    },
    {
      Icon: Instagram,
      label: 'Instagram',
      value: '@adilmunawarx',
      description: 'Creative content & stories',
      link: 'https://instagram.com/adilmunawarx',
      color: 'text-neon-cyan',
      bgColor: 'from-neon-cyan/5 to-frost-cyan/5',
      hoverColor: 'hover:from-neon-cyan/15 hover:to-frost-cyan/15',
      borderColor: 'border-neon-cyan/20 hover:border-neon-cyan/40',
      glowColor: 'shadow-neon-cyan/10'
    },
    {
      Icon: MessageSquare,
      label: 'Telegram',
      value: '@adilmunawarx',
      description: 'Secure messaging platform',
      link: 'https://t.me/adilmunawar',
      color: 'text-frost-cyan',
      bgColor: 'from-neon-cyan/5 to-frost-cyan/5',
      hoverColor: 'hover:from-neon-cyan/15 hover:to-frost-cyan/15',
      borderColor: 'border-neon-cyan/20 hover:border-neon-cyan/40',
      glowColor: 'shadow-neon-cyan/10'
    },
    {
      Icon: Linkedin,
      label: 'LinkedIn',
      value: 'Professional Network',
      description: 'Connect for opportunities',
      link: 'https://linkedin.com/in/adilmunawar',
      color: 'text-neon-cyan',
      bgColor: 'from-neon-cyan/5 to-frost-cyan/5',
      hoverColor: 'hover:from-neon-cyan/15 hover:to-frost-cyan/15',
      borderColor: 'border-neon-cyan/20 hover:border-neon-cyan/40',
      glowColor: 'shadow-neon-cyan/10'
    },
    {
      Icon: Github,
      label: 'GitHub',
      value: 'Open Source Projects',
      description: 'Explore my repositories',
      link: 'https://github.com/adilmunawar',
      color: 'text-frost-cyan',
      bgColor: 'from-neon-cyan/5 to-frost-cyan/5',
      hoverColor: 'hover:from-neon-cyan/15 hover:to-frost-cyan/15',
      borderColor: 'border-neon-cyan/20 hover:border-neon-cyan/40',
      glowColor: 'shadow-neon-cyan/10'
    }
  ];

  const footerSocials = [
    {
      Icon: Linkedin,
      link: 'https://linkedin.com/in/adilmunawar',
      color: 'hover:text-white',
      bgGradient: 'from-neon-cyan/10 to-frost-cyan/10',
      hoverGradient: 'hover:from-neon-cyan/25 hover:to-frost-cyan/25',
      borderColor: 'border-neon-cyan/20 hover:border-neon-cyan/40',
      shadowColor: 'hover:shadow-neon-cyan/20',
      dotColor: 'bg-neon-cyan'
    },
    {
      Icon: Github,
      link: 'https://github.com/adilmunawar',
      color: 'hover:text-white',
      bgGradient: 'from-neon-cyan/10 to-frost-cyan/10',
      hoverGradient: 'hover:from-neon-cyan/25 hover:to-frost-cyan/25',
      borderColor: 'border-neon-cyan/20 hover:border-neon-cyan/40',
      shadowColor: 'hover:shadow-neon-cyan/20',
      dotColor: 'bg-neon-cyan'
    },
    {
      Icon: Instagram,
      link: 'https://instagram.com/adilmunawarx',
      color: 'hover:text-white',
      bgGradient: 'from-neon-cyan/10 to-frost-cyan/10',
      hoverGradient: 'hover:from-neon-cyan/25 hover:to-frost-cyan/25',
      borderColor: 'border-neon-cyan/20 hover:border-neon-cyan/40',
      shadowColor: 'hover:shadow-neon-cyan/20',
      dotColor: 'bg-neon-cyan'
    },
    {
      Icon: Phone,
      link: 'https://wa.me/+923244965220',
      color: 'hover:text-white',
      bgGradient: 'from-neon-cyan/10 to-frost-cyan/10',
      hoverGradient: 'hover:from-neon-cyan/25 hover:to-frost-cyan/25',
      borderColor: 'border-neon-cyan/20 hover:border-neon-cyan/40',
      shadowColor: 'hover:shadow-neon-cyan/20',
      dotColor: 'bg-neon-cyan'
    }
  ];

  return (
    <section id="contact" className="min-h-screen py-20 px-4 relative">
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-20">
          <div className="inline-block mb-8">
            <span className="text-frost-cyan text-sm font-semibold tracking-widest uppercase bg-neon-cyan/5 px-6 py-3 rounded-full border border-neon-cyan/20 backdrop-blur-sm animate-pulse">
              Get In Touch
            </span>
          </div>
          <h2 className="text-5xl md:text-7xl font-bold mb-8 text-gradient-slow animate-fade-in-up drop-shadow-2xl">
            Let's Connect
          </h2>
          <p className="text-xl text-frost-cyan animate-fade-in-up max-w-4xl mx-auto leading-relaxed" style={{ animationDelay: '0.2s' }}>
            Ready to start a conversation? Choose your preferred 
            <span className="text-frost-white font-semibold"> communication channel</span> and 
            let's bring your ideas to life together
          </p>
          <div className="flex justify-center gap-8 mt-12">
            <div className="flex items-center gap-3 text-frost-cyan/80 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              <MapPin size={20} className="text-frost-white" />
              <span>Pakistan (Remote Available)</span>
            </div>
            <div className="flex items-center gap-3 text-frost-cyan/80 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
              <Clock size={20} className="text-frost-white" />
              <span>Usually responds within 24h</span>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
          {contactMethods.map((method, index) => (
            <Card 
              key={index} 
              className={`group relative p-8 bg-gray-900/40 backdrop-blur-xl border-2 ${method.borderColor} transition-all duration-700 hover:scale-105 cursor-pointer overflow-hidden animate-scale-in hover:shadow-2xl ${method.glowColor}`} 
              style={{ animationDelay: `${index * 0.15}s` }} 
              onClick={() => window.open(method.link, '_blank')}
              onMouseEnter={() => setHoveredCard(index)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${method.bgColor} opacity-0 group-hover:opacity-100 transition-all duration-700`} />
              
              <div className="absolute top-4 right-4 w-2 h-2 bg-white/60 rounded-full animate-ping opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute bottom-6 left-6 w-1 h-1 bg-white rounded-full animate-pulse opacity-0 group-hover:opacity-100 transition-opacity duration-700" style={{ animationDelay: '0.3s' }}></div>

              <div className="relative text-center transform group-hover:translate-y-1 transition-transform duration-500">
                <div className={`w-20 h-20 rounded-2xl border-2 ${method.borderColor} bg-gray-800/40 backdrop-blur-sm flex items-center justify-center mx-auto mb-6 group-hover:scale-125 group-hover:rotate-12 transition-all duration-700 shadow-xl ${method.glowColor} ${hoveredCard === index ? 'animate-bounce' : ''}`}>
                  <method.Icon size={36} className={`group-hover:drop-shadow-lg transition-all duration-500 ${method.color}`} />
                </div>
                
                <h3 className="font-bold text-xl text-frost-white mb-2 group-hover:text-white transition-colors duration-500">{method.label}</h3>
                <p className="text-frost-cyan/80 text-sm mb-3 group-hover:text-frost-cyan transition-colors duration-500">{method.description}</p>
                <p className={`text-sm font-semibold group-hover:text-white transition-colors duration-500 ${method.color}`}>{method.value}</p>
                
                <div className="mt-6 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0">
                  <Send size={16} className="mx-auto text-white animate-bounce" />
                </div>
              </div>

              <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                <div className={`absolute inset-0 rounded-lg border-2 ${method.borderColor} animate-pulse`}></div>
              </div>
              
              <div className="absolute inset-0 rounded-lg overflow-hidden">
                <div className={`absolute w-0 h-0 rounded-full bg-gradient-to-r ${method.bgColor} group-hover:w-full group-hover:h-full transition-all duration-1000 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-20`}></div>
              </div>
            </Card>
          ))}
        </div>

        <div className="relative">
          <div className="relative mb-12">
            <div className="h-px bg-gradient-to-r from-transparent via-neon-cyan/30 to-transparent"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-neon-cyan rounded-full animate-pulse"></div>
          </div>
          
          <div className="flex flex-col lg:flex-row justify-between items-center gap-8 animate-fade-in-up" style={{ animationDelay: '1s' }}>
            <div className="text-center lg:text-left relative">
              <div className="inline-block relative">
                <h4 className="text-2xl font-bold text-frost-white mb-2">
                  Crafted with <span className="text-red-500 animate-pulse">♥</span> by 
                  <span className="text-gradient-slow ml-2">Adil Munawar</span>
                </h4>
                <p className="text-frost-cyan/80 mb-2">Full Stack Developer & UI/UX Enthusiast</p>
                <p className="text-frost-cyan/60 text-sm">© 2025 All Rights Reserved.</p>
                
                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-neon-cyan to-frost-cyan group-hover:w-full transition-all duration-700"></div>
              </div>
            </div>
            
            <div className="flex space-x-6">
              {footerSocials.map((social, index) => (
                <a 
                  key={index} 
                  href={social.link} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className={`group relative w-16 h-16 bg-gradient-to-br ${social.bgGradient} ${social.hoverGradient} rounded-2xl flex items-center justify-center transition-all duration-700 hover:scale-125 hover:rotate-12 backdrop-blur-sm border-2 ${social.borderColor} hover:shadow-2xl ${social.shadowColor} text-primary`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <social.Icon size={24} className="transition-all duration-500 group-hover:scale-110" />
                  
                  <div className={`absolute -top-1 -right-1 w-3 h-3 ${social.dotColor} rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 animate-pulse`}></div>
                  
                  <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${social.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                  
                  <div className="absolute inset-0 rounded-2xl border-2 border-neon-cyan/30 scale-0 group-hover:scale-110 opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="fixed bottom-8 right-8 z-50">
          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} 
            className="group relative w-16 h-16 bg-gradient-to-r from-neon-cyan/80 to-frost-cyan/80 text-white rounded-2xl flex items-center justify-center transition-all duration-700 hover:scale-125 hover:rotate-12 shadow-2xl shadow-neon-cyan/30 hover:shadow-neon-cyan/50 backdrop-blur-sm border-2 border-white/20 animate-float"
          >
            <span className="text-2xl font-bold group-hover:scale-110 transition-transform duration-500">↑</span>
            
            <div className="absolute inset-0 rounded-2xl border-2 border-white/30 animate-ping opacity-75"></div>
            
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-white/20 to-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          </button>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
