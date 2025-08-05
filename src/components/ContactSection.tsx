
import { Card } from '@/components/ui/card';
import { Mail, Phone, Github, Instagram, MessageSquare, Linkedin, Send, MapPin, Clock } from 'lucide-react';
import { useState } from 'react';

const ContactSection = () => {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const contactMethods = [{
    Icon: Mail,
    label: 'Email',
    value: 'adilmunawar@gmail.com',
    description: 'Drop me a line anytime',
    link: 'mailto:adilmunawar@gmail.com',
    color: 'text-red-400',
    bgColor: 'from-red-500/5 to-pink-500/5',
    hoverColor: 'hover:from-red-500/15 hover:to-pink-500/15',
    borderColor: 'border-red-400/20 hover:border-red-400/40',
    glowColor: 'shadow-red-500/10'
  }, {
    Icon: Phone,
    label: 'WhatsApp',
    value: '+92 324 4965220',
    description: 'Quick chat & instant replies',
    link: 'https://wa.me/923244965220',
    color: 'text-green-400',
    bgColor: 'from-green-500/5 to-emerald-500/5',
    hoverColor: 'hover:from-green-500/15 hover:to-emerald-500/15',
    borderColor: 'border-green-400/20 hover:border-green-400/40',
    glowColor: 'shadow-green-500/10'
  }, {
    Icon: Instagram,
    label: 'Instagram',
    value: '@adilmunawarx',
    description: 'Creative content & stories',
    link: 'https://instagram.com/adilmunawarx',
    color: 'text-pink-400',
    bgColor: 'from-pink-500/5 to-purple-500/5',
    hoverColor: 'hover:from-pink-500/15 hover:to-purple-500/15',
    borderColor: 'border-pink-400/20 hover:border-pink-400/40',
    glowColor: 'shadow-pink-500/10'
  }, {
    Icon: MessageSquare,
    label: 'Telegram',
    value: '@adilmunawarx',
    description: 'Secure messaging platform',
    link: 'https://t.me/adilmunawar',
    color: 'text-blue-400',
    bgColor: 'from-blue-500/5 to-cyan-500/5',
    hoverColor: 'hover:from-blue-500/15 hover:to-cyan-500/15',
    borderColor: 'border-blue-400/20 hover:border-blue-400/40',
    glowColor: 'shadow-blue-500/10'
  }, {
    Icon: Linkedin,
    label: 'LinkedIn',
    value: 'Professional Network',
    description: 'Connect for opportunities',
    link: 'https://linkedin.com/in/adilmunawar',
    color: 'text-blue-500',
    bgColor: 'from-blue-600/5 to-indigo-500/5',
    hoverColor: 'hover:from-blue-600/15 hover:to-indigo-500/15',
    borderColor: 'border-blue-500/20 hover:border-blue-500/40',
    glowColor: 'shadow-blue-600/10'
  }, {
    Icon: Github,
    label: 'GitHub',
    value: 'Open Source Projects',
    description: 'Explore my repositories',
    link: 'https://github.com/adilmunawar',
    color: 'text-gray-400',
    bgColor: 'from-gray-500/5 to-slate-500/5',
    hoverColor: 'hover:from-gray-500/15 hover:to-slate-500/15',
    borderColor: 'border-gray-400/20 hover:border-gray-400/40',
    glowColor: 'shadow-gray-500/10'
  }];

  const footerSocials = [{
    Icon: Linkedin,
    link: 'https://linkedin.com/in/adilmunawar',
    color: 'hover:text-blue-400',
    bgGradient: 'from-blue-500/10 to-indigo-500/10',
    hoverGradient: 'hover:from-blue-500/25 hover:to-indigo-500/25',
    borderColor: 'border-blue-400/20 hover:border-blue-400/40',
    shadowColor: 'hover:shadow-blue-500/20',
    dotColor: 'bg-blue-400'
  }, {
    Icon: Github,
    link: 'https://github.com/adilmunawar',
    color: 'hover:text-gray-300',
    bgGradient: 'from-gray-500/10 to-slate-500/10',
    hoverGradient: 'hover:from-gray-500/25 hover:to-slate-500/25',
    borderColor: 'border-gray-400/20 hover:border-gray-400/40',
    shadowColor: 'hover:shadow-gray-500/20',
    dotColor: 'bg-gray-300'
  }, {
    Icon: Instagram,
    link: 'https://instagram.com/adilmunawarx',
    color: 'hover:text-pink-400',
    bgGradient: 'from-pink-500/10 to-purple-500/10',
    hoverGradient: 'hover:from-pink-500/25 hover:to-purple-500/25',
    borderColor: 'border-pink-400/20 hover:border-pink-400/40',
    shadowColor: 'hover:shadow-pink-500/20',
    dotColor: 'bg-pink-400'
  }, {
    Icon: Phone,
    link: 'https://wa.me/+923244965220',
    color: 'hover:text-green-400',
    bgGradient: 'from-green-500/10 to-emerald-500/10',
    hoverGradient: 'hover:from-green-500/25 hover:to-emerald-500/25',
    borderColor: 'border-green-400/20 hover:border-green-400/40',
    shadowColor: 'hover:shadow-green-500/20',
    dotColor: 'bg-green-400'
  }];
  return (
    <section id="contact" className="min-h-screen py-20 px-4 relative overflow-hidden bg-gradient-to-b from-gray-900 to-cyber-dark">
      {/* Dark theme background */}
      <div className="absolute inset-0 bg-cyber-dark/90"></div>
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      {/* Animated background orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-cyber-cyan/5 to-blue-500/5 rounded-full blur-3xl animate-drift-1"></div>
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-purple-500/5 to-pink-500/5 rounded-full blur-3xl animate-drift-2"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-gradient-to-r from-green-500/3 to-cyan-500/3 rounded-full blur-3xl animate-drift-3"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Enhanced header section */}
        <div className="text-center mb-20">
          <div className="inline-block mb-8">
            <span className="text-cyber-cyan text-sm font-semibold tracking-widest uppercase bg-cyber-cyan/5 px-6 py-3 rounded-full border border-cyber-cyan/20 backdrop-blur-sm animate-pulse">
              Get In Touch
            </span>
          </div>
          <h2 className="text-5xl md:text-7xl font-bold mb-8 text-gradient-slow animate-fade-in-up drop-shadow-2xl">
            Let's Connect
          </h2>
          <p className="text-xl text-gray-400 animate-fade-in-up max-w-4xl mx-auto leading-relaxed" style={{ animationDelay: '0.2s' }}>
            Ready to start a conversation? Choose your preferred 
            <span className="text-cyber-cyan font-semibold"> communication channel</span> and 
            let's bring your ideas to life together
          </p>
          {/* Additional info cards */}
          <div className="flex justify-center gap-8 mt-12">
            <div className="flex items-center gap-3 text-gray-500 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              <MapPin size={20} className="text-cyber-cyan" />
              <span>Pakistan (Remote Available)</span>
            </div>
            <div className="flex items-center gap-3 text-gray-500 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
              <Clock size={20} className="text-cyber-cyan" />
              <span>Usually responds within 24h</span>
            </div>
          </div>
        </div>
        {/* Enhanced contact cards grid */}
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
              {/* Animated background overlay */}
              <div className={`absolute inset-0 bg-gradient-to-br ${method.bgColor} opacity-0 group-hover:opacity-100 transition-all duration-700`} />
              
              {/* Floating particles */}
              <div className="absolute top-4 right-4 w-2 h-2 bg-cyber-cyan/60 rounded-full animate-ping opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute bottom-6 left-6 w-1 h-1 bg-cyber-cyan rounded-full animate-pulse opacity-0 group-hover:opacity-100 transition-opacity duration-700" style={{ animationDelay: '0.3s' }}></div>
              {/* Content */}
              <div className="relative text-center transform group-hover:translate-y-1 transition-transform duration-500">
                {/* Enhanced icon container */}
                <div className={`w-20 h-20 rounded-2xl border-2 ${method.borderColor} bg-gray-800/40 backdrop-blur-sm flex items-center justify-center mx-auto mb-6 group-hover:scale-125 group-hover:rotate-12 transition-all duration-700 shadow-xl ${method.glowColor} ${hoveredCard === index ? 'animate-bounce' : ''}`}>
                  <method.Icon size={36} className={`${method.color} group-hover:drop-shadow-lg transition-all duration-500`} />
                </div>
                
                {/* Enhanced text content */}
                <h3 className="font-bold text-xl text-gray-300 mb-2 group-hover:text-cyber-cyan transition-colors duration-500">{method.label}</h3>
                <p className="text-gray-500 text-sm mb-3 group-hover:text-gray-400 transition-colors duration-500">{method.description}</p>
                <p className={`${method.color} text-sm font-semibold group-hover:text-cyber-cyan transition-colors duration-500`}>{method.value}</p>
                
                {/* Hover effect indicator */}
                <div className="mt-6 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0">
                  <Send size={16} className="mx-auto text-cyber-cyan animate-bounce" />
                </div>
              </div>

              {/* Enhanced animated border effect */}
              <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                <div className={`absolute inset-0 rounded-lg border-2 ${method.borderColor} animate-pulse`}></div>
              </div>
              
              {/* Ripple effect on hover */}
              <div className="absolute inset-0 rounded-lg overflow-hidden">
                <div className={`absolute w-0 h-0 rounded-full bg-gradient-to-r ${method.bgColor} group-hover:w-full group-hover:h-full transition-all duration-1000 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-20`}></div>
              </div>
            </Card>
          ))}
        </div>

        {/* Enhanced footer section */}
        <div className="relative">
          {/* Decorative line */}
          <div className="relative mb-12">
            <div className="h-px bg-gradient-to-r from-transparent via-cyber-cyan/30 to-transparent"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-cyber-cyan rounded-full animate-pulse"></div>
          </div>
          
          <div className="flex flex-col lg:flex-row justify-between items-center gap-8 animate-fade-in-up" style={{ animationDelay: '1s' }}>
            {/* Enhanced creator info */}
            <div className="text-center lg:text-left relative">
              <div className="inline-block relative">
                <h4 className="text-2xl font-bold text-gray-300 mb-2">
                  Crafted with <span className="text-red-500 animate-pulse">♥</span> by 
                  <span className="text-gradient-slow ml-2">Adil Munawar</span>
                </h4>
                <p className="text-gray-500 mb-2">Full Stack Developer & UI/UX Enthusiast</p>
                <p className="text-gray-600 text-sm">© 2025 All Rights Reserved. Built with React & Tailwind CSS</p>
                
                {/* Animated underline */}
                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-cyber-cyan to-blue-500 group-hover:w-full transition-all duration-700"></div>
              </div>
            </div>
            
            {/* Enhanced social links with rounded square design */}
            <div className="flex space-x-6">
              {footerSocials.map((social, index) => (
                <a 
                  key={index} 
                  href={social.link} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className={`group relative w-16 h-16 bg-gradient-to-br ${social.bgGradient} ${social.hoverGradient} rounded-2xl flex items-center justify-center transition-all duration-700 hover:scale-125 hover:rotate-12 backdrop-blur-sm border-2 ${social.borderColor} hover:shadow-2xl ${social.shadowColor} ${social.color}`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <social.Icon size={24} className="transition-all duration-500 group-hover:scale-110" />
                  
                  {/* Animated notification dot */}
                  <div className={`absolute -top-1 -right-1 w-3 h-3 ${social.dotColor} rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 animate-pulse`}></div>
                  
                  {/* Hover background effect */}
                  <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${social.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                  
                  {/* Ripple effect */}
                  <div className="absolute inset-0 rounded-2xl border-2 border-cyber-cyan/30 scale-0 group-hover:scale-110 opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Enhanced floating back to top button */}
        <div className="fixed bottom-8 right-8 z-50">
          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} 
            className="group relative w-16 h-16 bg-gradient-to-r from-cyber-cyan to-blue-500 text-black rounded-2xl flex items-center justify-center transition-all duration-700 hover:scale-125 hover:rotate-12 shadow-2xl shadow-cyber-cyan/30 hover:shadow-cyber-cyan/50 backdrop-blur-sm border-2 border-white/20 animate-float"
          >
            <span className="text-2xl font-bold group-hover:scale-110 transition-transform duration-500">↑</span>
            
            {/* Animated ring */}
            <div className="absolute inset-0 rounded-2xl border-2 border-cyber-cyan animate-ping opacity-75"></div>
            
            {/* Hover glow effect */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-white/20 to-cyber-cyan/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          </button>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
