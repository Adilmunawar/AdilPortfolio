
import { useState, useEffect, useRef } from 'react';
import { Instagram, Github, Linkedin, Phone, Mail, MessageSquare } from 'lucide-react';

const AdvancedSocialIcons = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredIcon, setHoveredIcon] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const socialLinks = [
    {
      Icon: Instagram,
      href: 'https://instagram.com/adilmunawarx',
      label: 'Instagram',
      username: '@adilmunawarx',
      color: 'from-pink-500 to-purple-600',
      glowColor: 'shadow-pink-500/50',
      borderColor: 'border-pink-400/50',
      bgColor: 'bg-pink-500/10',
      textColor: 'text-pink-400',
      description: 'Follow my creative journey'
    },
    {
      Icon: Github,
      href: 'https://github.com/adilmunawar',
      label: 'GitHub',
      username: '@AdilMunawar',
      color: 'from-gray-400 to-gray-600',
      glowColor: 'shadow-gray-400/50',
      borderColor: 'border-gray-400/50',
      bgColor: 'bg-gray-500/10',
      textColor: 'text-gray-300',
      description: 'Explore my repositories'
    },
    {
      Icon: Linkedin,
      href: 'https://linkedin.com/in/adilmunawar',
      label: 'LinkedIn',
      username: 'Adil Munawar',
      color: 'from-blue-500 to-blue-700',
      glowColor: 'shadow-blue-500/50',
      borderColor: 'border-blue-400/50',
      bgColor: 'bg-blue-500/10',
      textColor: 'text-blue-400',
      description: 'Professional network'
    },
    {
      Icon: Phone,
      href: 'https://wa.me/923244965220',
      label: 'WhatsApp',
      username: '+92 324 4965220',
      color: 'from-green-500 to-green-700',
      glowColor: 'shadow-green-500/50',
      borderColor: 'border-green-400/50',
      bgColor: 'bg-green-500/10',
      textColor: 'text-green-400',
      description: 'Quick messaging'
    },
    {
      Icon: Mail,
      href: 'mailto:adilmunawar@gmail.com',
      label: 'Email',
      username: 'adilmunawar@gmail.com',
      color: 'from-red-500 to-red-700',
      glowColor: 'shadow-red-500/50',
      borderColor: 'border-red-400/50',
      bgColor: 'bg-red-500/10',
      textColor: 'text-red-400',
      description: 'Drop me a line'
    },
    {
      Icon: MessageSquare,
      href: 'https://t.me/adilmunawar',
      label: 'Telegram',
      username: '@adilmunawar',
      color: 'from-cyan-500 to-cyan-700',
      glowColor: 'shadow-cyan-500/50',
      borderColor: 'border-cyan-400/50',
      bgColor: 'bg-cyan-500/10',
      textColor: 'text-cyan-400',
      description: 'Secure messaging'
    }
  ];

  // Intersection Observer for performance
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Preload links on hover for faster navigation
  const handleIconHover = (index: number, href: string) => {
    setHoveredIcon(index);
    
    // Preload the link
    const link = document.createElement('link');
    link.rel = 'preconnect';
    link.href = new URL(href).origin;
    document.head.appendChild(link);
  };

  return (
    <div 
      ref={containerRef}
      className="relative py-20 px-4 overflow-hidden bg-gradient-to-b from-cyber-dark via-gray-900/50 to-cyber-dark"
    >
      {/* Optimized background effects */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      {/* Performance-optimized floating orbs */}
      {isVisible && (
        <>
          <div className="absolute top-1/4 left-1/6 w-64 h-64 bg-gradient-to-r from-cyber-cyan/10 to-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/6 w-72 h-72 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </>
      )}

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-block mb-6">
            <span className="text-cyber-cyan text-sm font-semibold tracking-widest uppercase bg-cyber-cyan/10 px-4 py-2 rounded-full border border-cyber-cyan/30 backdrop-blur-sm">
              Connect With Me
            </span>
          </div>
          <h2 className="text-4xl md:text-6xl font-bold mb-6 text-gradient-slow">
            Let's Stay Connected
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Choose your preferred platform and let's start a conversation
          </p>
        </div>

        {/* Advanced Social Icons Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-12">
          {socialLinks.map((social, index) => (
            <div
              key={index}
              className={`group relative transform transition-all duration-500 ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
              }`}
              style={{ 
                transitionDelay: `${index * 100}ms`,
                willChange: 'transform, opacity'
              }}
              onMouseEnter={() => handleIconHover(index, social.href)}
              onMouseLeave={() => setHoveredIcon(null)}
            >
              {/* Main icon container */}
              <a
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`
                  relative block w-20 h-20 mx-auto rounded-2xl 
                  bg-gradient-to-br ${social.color} 
                  border-2 ${social.borderColor}
                  backdrop-blur-sm transition-all duration-300
                  hover:scale-110 hover:rotate-3 hover:-translate-y-2
                  hover:shadow-2xl ${social.glowColor}
                  group-hover:border-opacity-100
                `}
                aria-label={social.label}
              >
                <div className={`absolute inset-0 rounded-2xl ${social.bgColor} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                
                {/* Icon */}
                <div className="relative flex items-center justify-center w-full h-full">
                  <social.Icon 
                    size={28} 
                    className="text-white drop-shadow-lg group-hover:scale-110 transition-transform duration-300" 
                  />
                </div>

                {/* Animated particles */}
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 animate-ping transition-opacity duration-300"></div>
                <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-cyber-cyan rounded-full opacity-0 group-hover:opacity-100 animate-pulse transition-opacity duration-500" style={{ animationDelay: '0.2s' }}></div>

                {/* Ripple effect */}
                <div className="absolute inset-0 rounded-2xl border-2 border-white/20 scale-100 group-hover:scale-125 opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
              </a>

              {/* Tooltip with user info */}
              <div className={`
                absolute top-full left-1/2 transform -translate-x-1/2 mt-4 
                bg-gray-900/95 backdrop-blur-xl border ${social.borderColor} 
                rounded-xl p-4 w-48 text-center
                opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0
                transition-all duration-300 pointer-events-none z-20
                ${hoveredIcon === index ? 'block' : 'hidden'}
              `}>
                <div className={`text-sm font-semibold ${social.textColor} mb-1`}>
                  {social.label}
                </div>
                <div className="text-xs text-gray-400 mb-2">
                  {social.username}
                </div>
                <div className="text-xs text-gray-500">
                  {social.description}
                </div>
                
                {/* Tooltip arrow */}
                <div className={`absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-gray-900 border-l ${social.borderColor} border-t rotate-45`}></div>
              </div>

              {/* Platform label */}
              <div className="text-center mt-3">
                <span className="text-xs text-gray-500 group-hover:text-gray-400 transition-colors duration-300">
                  {social.label}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Quick stats */}
        <div className="flex justify-center items-center gap-8 text-center">
          <div className="flex flex-col items-center">
            <div className="text-2xl font-bold text-cyber-cyan">24h</div>
            <div className="text-xs text-gray-500">Response Time</div>
          </div>
          <div className="w-px h-8 bg-gray-700"></div>
          <div className="flex flex-col items-center">
            <div className="text-2xl font-bold text-green-400">Online</div>
            <div className="text-xs text-gray-500">Status</div>
          </div>
          <div className="w-px h-8 bg-gray-700"></div>
          <div className="flex flex-col items-center">
            <div className="text-2xl font-bold text-purple-400">5+</div>
            <div className="text-xs text-gray-500">Platforms</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedSocialIcons;
