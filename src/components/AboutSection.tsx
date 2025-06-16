import { Card } from '@/components/ui/card';
import ProfileCard from './ProfileCard';
import { useState, useEffect } from 'react';
import { 
  MapPin, 
  Calendar, 
  Award, 
  Coffee, 
  Code2, 
  Zap, 
  Heart,
  Download,
  ExternalLink,
  Github,
  Linkedin,
  Instagram,
  Phone,
  Mail,
  MessageSquare,
  Star,
  Users,
  Trophy,
  Target
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const AboutSection = () => {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  const dynamicTexts = [
    "Passionate Developer",
    "Full-Stack Engineer", 
    "Problem Solver",
    "Innovation Driver",
    "Tech Enthusiast",
    "Creative Thinker"
  ];

  const socialLinks = [
    {
      Icon: Github,
      href: 'https://github.com/adilmunawar',
      label: 'GitHub',
      color: 'hover:text-gray-300',
      bgGradient: 'from-gray-500/20 to-slate-500/20',
      hoverGradient: 'hover:from-gray-500/40 hover:to-slate-500/40',
      borderColor: 'border-gray-400/30 hover:border-gray-400/60',
      shadowColor: 'hover:shadow-gray-500/40',
      count: '50+ Repos'
    },
    {
      Icon: Linkedin,
      href: 'https://linkedin.com/in/adilmunawar',
      label: 'LinkedIn',
      color: 'hover:text-blue-400',
      bgGradient: 'from-blue-500/20 to-indigo-500/20',
      hoverGradient: 'hover:from-blue-500/40 hover:to-indigo-500/40',
      borderColor: 'border-blue-400/30 hover:border-blue-400/60',
      shadowColor: 'hover:shadow-blue-500/40',
      count: '500+ Connections'
    },
    {
      Icon: Instagram,
      href: 'https://instagram.com/adilmunawarx',
      label: 'Instagram',
      color: 'hover:text-pink-400',
      bgGradient: 'from-pink-500/20 to-purple-500/20',
      hoverGradient: 'hover:from-pink-500/40 hover:to-purple-500/40',
      borderColor: 'border-pink-400/30 hover:border-pink-400/60',
      shadowColor: 'hover:shadow-pink-500/40',
      count: '1K+ Followers'
    },
    {
      Icon: Phone,
      href: 'https://wa.me/923244965220',
      label: 'WhatsApp',
      color: 'hover:text-green-400',
      bgGradient: 'from-green-500/20 to-emerald-500/20',
      hoverGradient: 'hover:from-green-500/40 hover:to-emerald-500/40',
      borderColor: 'border-green-400/30 hover:border-green-400/60',
      shadowColor: 'hover:shadow-green-500/40',
      count: 'Quick Chat'
    }
  ];

  const stats = [
    { icon: Code2, label: 'Projects Completed', value: '50+', color: 'text-cyber-cyan' },
    { icon: Users, label: 'Happy Clients', value: '25+', color: 'text-green-400' },
    { icon: Coffee, label: 'Cups of Coffee', value: '1000+', color: 'text-amber-400' },
    { icon: Trophy, label: 'Years Experience', value: '3+', color: 'text-purple-400' }
  ];

  const achievements = [
    { icon: Award, title: 'Full-Stack Certification', desc: 'Advanced Web Development' },
    { icon: Star, title: 'Top Rated Developer', desc: 'Client Satisfaction 98%' },
    { icon: Target, title: 'Project Success Rate', desc: '100% On-Time Delivery' },
    { icon: Zap, title: 'Innovation Award', desc: 'Creative Problem Solving' }
  ];

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Users },
    { id: 'stats', label: 'Stats', icon: Trophy },
    { id: 'achievements', label: 'Achievements', icon: Award }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTextIndex((prev) => (prev + 1) % dynamicTexts.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    const section = document.getElementById('about-section');
    if (section) observer.observe(section);

    return () => observer.disconnect();
  }, []);

  return (
    <section id="about" className="min-h-screen py-20 px-4 relative overflow-hidden bg-gradient-to-br from-cyber-dark via-cyber-gray/5 to-cyber-dark">
      <div id="about-section" className="max-w-7xl mx-auto relative z-10">
        {/* Enhanced title section */}
        <div className="text-center mb-20">
          <div className={`transition-all duration-1000 ${
            isVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-12'
          }`}>
            <div className="inline-block mb-6">
              <span className="text-cyber-cyan text-sm font-semibold tracking-widest uppercase bg-cyber-cyan/5 px-6 py-3 rounded-full border border-cyber-cyan/20 backdrop-blur-sm animate-pulse">
                <Heart className="inline w-4 h-4 mr-2" />
                About Me
              </span>
            </div>
            
            <h2 className="text-5xl md:text-7xl font-bold mb-8 text-gradient animate-shimmer drop-shadow-2xl">
              Know Me Better
            </h2>
            
            {/* Dynamic subtitle */}
            <div className="h-12 mb-8 flex items-center justify-center">
              <h3 className={`text-2xl md:text-3xl font-medium text-cyber-cyan transition-all duration-700 ${
                isVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-8'
              }`}>
                {dynamicTexts[currentTextIndex]}
              </h3>
            </div>
          </div>
        </div>

        {/* Main content grid */}
        <div className="grid lg:grid-cols-2 gap-16 items-start mb-20">
          {/* Enhanced ProfileCard */}
          <div className={`flex justify-center order-2 lg:order-1 transition-all duration-1000 ${
            isVisible ? 'opacity-100 transform translate-x-0' : 'opacity-0 transform -translate-x-12'
          }`}>
            <div className="relative group">
              {/* Floating elements around profile card */}
              <div className="absolute -top-4 -left-4 w-8 h-8 bg-cyber-cyan/20 rounded-full animate-float blur-sm"></div>
              <div className="absolute -bottom-4 -right-4 w-6 h-6 bg-cyber-blue/20 rounded-full animate-float-delayed blur-sm"></div>
              <div className="absolute top-1/2 -right-8 w-4 h-4 bg-purple-500/20 rounded-full animate-pulse"></div>
              
              <ProfileCard
                name="Adil Munawar"
                title="Prompt Engineer"
                handle="Adil Munawar"
                status="Online"
                contactText="Contact Me"
                avatarUrl="/lovable-uploads/eaf50e40-682a-4730-ac3c-407cf3e4896e.png"
                miniAvatarUrl="/lovable-uploads/eaf50e40-682a-4730-ac3c-407cf3e4896e.png"
                showUserInfo={true}
                enableTilt={true}
                onContactClick={() => console.log('Contact clicked')}
              />
              
              {/* Enhanced glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-cyber-cyan/10 via-cyber-blue/10 to-purple-500/10 rounded-3xl blur-3xl opacity-0 group-hover:opacity-100 transition-all duration-1000 -z-10 scale-110"></div>
            </div>
          </div>

          {/* Enhanced content with tabs */}
          <div className={`space-y-8 order-1 lg:order-2 transition-all duration-1000 ${
            isVisible ? 'opacity-100 transform translate-x-0' : 'opacity-0 transform translate-x-12'
          }`}>
            
            {/* Tab Navigation */}
            <div className="flex space-x-2 bg-cyber-gray/20 p-2 rounded-2xl backdrop-blur-sm border border-cyber-cyan/20">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-3 rounded-xl transition-all duration-300 flex-1 justify-center ${
                    activeTab === tab.id
                      ? 'bg-cyber-cyan/20 text-cyber-cyan border border-cyber-cyan/30 shadow-lg shadow-cyber-cyan/20'
                      : 'text-gray-400 hover:text-gray-300 hover:bg-cyber-gray/30'
                  }`}
                >
                  <tab.icon size={18} />
                  <span className="font-medium">{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="min-h-[400px]">
              {activeTab === 'overview' && (
                <div className="space-y-6 animate-fade-in">
                  {/* Main about card */}
                  <Card className="relative group overflow-hidden bg-cyber-gray/10 border-cyber-cyan/20 backdrop-blur-xl hover:border-cyber-cyan/40 transition-all duration-500">
                    <div className="absolute inset-0 bg-gradient-to-br from-cyber-cyan/5 via-transparent to-cyber-blue/5 opacity-0 group-hover:opacity-100 transition-all duration-700"></div>
                    
                    <div className="p-8 relative z-10">
                      <div className="flex items-center mb-6">
                        <div className="w-1 h-8 bg-gradient-to-b from-cyber-cyan to-cyber-blue rounded-full mr-4"></div>
                        <h3 className="text-2xl font-bold text-cyber-cyan">Who I Am</h3>
                      </div>
                      
                      <div className="space-y-4 text-gray-300 leading-relaxed">
                        <p className="text-lg group-hover:text-white transition-colors duration-500">
                          I am a <span className="text-cyber-cyan font-semibold">passionate and results-driven developer</span> with extensive experience in frontend development, backend systems, and mobile/web app integration.
                        </p>
                        <p className="group-hover:text-white transition-colors duration-500">
                          Over the years, I've built a strong presence in the tech space through innovative projects, each crafted to solve real-world problems and push the boundaries of design and functionality.
                        </p>
                      </div>
                    </div>
                  </Card>

                  {/* Quick info cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="relative group overflow-hidden bg-cyber-gray/10 border-cyber-cyan/20 backdrop-blur-xl hover:border-cyber-cyan/40 transition-all duration-500">
                      <div className="p-6 relative z-10">
                        <div className="flex items-center space-x-3">
                          <MapPin className="w-5 h-5 text-cyber-cyan" />
                          <div>
                            <p className="text-cyber-cyan font-semibold text-sm uppercase tracking-wider">Location</p>
                            <p className="text-white font-mono">Pakistan (Remote Available)</p>
                          </div>
                        </div>
                      </div>
                    </Card>
                    
                    <Card className="relative group overflow-hidden bg-cyber-gray/10 border-cyber-cyan/20 backdrop-blur-xl hover:border-cyber-cyan/40 transition-all duration-500">
                      <div className="p-6 relative z-10">
                        <div className="flex items-center space-x-3">
                          <Calendar className="w-5 h-5 text-cyber-blue" />
                          <div>
                            <p className="text-cyber-blue font-semibold text-sm uppercase tracking-wider">Experience</p>
                            <p className="text-white font-mono">3+ Years</p>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </div>

                  {/* Action buttons */}
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button className="flex-1 bg-gradient-to-r from-cyber-cyan to-cyber-blue text-black hover:from-cyber-blue hover:to-purple-500 px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 shadow-lg shadow-cyber-cyan/20 hover:shadow-cyber-blue/30 group">
                      <Download size={18} className="mr-2 group-hover:animate-bounce" />
                      Download Resume
                    </Button>
                    <Button variant="outline" className="flex-1 border-cyber-cyan/30 text-cyber-cyan hover:bg-cyber-cyan/10 hover:border-cyber-cyan/60 px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 group">
                      <ExternalLink size={18} className="mr-2 group-hover:rotate-45 transition-transform duration-300" />
                      View Portfolio
                    </Button>
                  </div>
                </div>
              )}

              {activeTab === 'stats' && (
                <div className="space-y-6 animate-fade-in">
                  <div className="grid grid-cols-2 gap-6">
                    {stats.map((stat, index) => (
                      <Card key={index} className="relative group overflow-hidden bg-cyber-gray/10 border-cyber-cyan/20 backdrop-blur-xl hover:border-cyber-cyan/40 transition-all duration-500 hover:scale-105">
                        <div className="p-6 text-center relative z-10">
                          <stat.icon className={`w-8 h-8 ${stat.color} mx-auto mb-3 group-hover:scale-110 transition-transform duration-300`} />
                          <div className={`text-3xl font-bold ${stat.color} mb-2 group-hover:animate-pulse`}>{stat.value}</div>
                          <div className="text-gray-400 text-sm group-hover:text-gray-300 transition-colors duration-300">{stat.label}</div>
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-br from-cyber-cyan/5 to-cyber-blue/5 opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'achievements' && (
                <div className="space-y-4 animate-fade-in">
                  {achievements.map((achievement, index) => (
                    <Card key={index} className="relative group overflow-hidden bg-cyber-gray/10 border-cyber-cyan/20 backdrop-blur-xl hover:border-cyber-cyan/40 transition-all duration-500 hover:scale-102">
                      <div className="p-6 relative z-10">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-cyber-cyan/20 to-cyber-blue/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                            <achievement.icon className="w-6 h-6 text-cyber-cyan" />
                          </div>
                          <div className="flex-1">
                            <h4 className="text-lg font-semibold text-white group-hover:text-cyber-cyan transition-colors duration-300">{achievement.title}</h4>
                            <p className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300">{achievement.desc}</p>
                          </div>
                        </div>
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-r from-cyber-cyan/5 to-cyber-blue/5 opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Enhanced Social Media Section */}
        <div className={`transition-all duration-1000 ${
          isVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-12'
        }`}>
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-white mb-4">Let's Connect</h3>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Follow my journey and connect with me across different platforms
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {socialLinks.map((social, index) => (
              <Card 
                key={index}
                className={`group relative overflow-hidden bg-gradient-to-br ${social.bgGradient} ${social.hoverGradient} border-2 ${social.borderColor} backdrop-blur-xl transition-all duration-700 hover:scale-110 cursor-pointer animate-scale-in hover:shadow-2xl ${social.shadowColor}`}
                style={{ animationDelay: `${index * 0.1}s` }}
                onClick={() => window.open(social.href, '_blank')}
              >
                <div className="p-6 text-center relative z-10">
                  <div className="relative mb-4">
                    <social.Icon size={32} className={`mx-auto transition-all duration-500 group-hover:scale-125 ${social.color} group-hover:drop-shadow-lg`} />
                    
                    {/* Animated ring */}
                    <div className="absolute inset-0 border-2 border-transparent group-hover:border-current rounded-full animate-spin-slow opacity-0 group-hover:opacity-30 transition-all duration-500"></div>
                  </div>
                  
                  <h4 className="font-bold text-white mb-2 group-hover:text-current transition-colors duration-500">{social.label}</h4>
                  <p className="text-gray-400 text-sm group-hover:text-gray-300 transition-colors duration-500">{social.count}</p>
                  
                  {/* Hover indicator */}
                  <div className="mt-4 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0">
                    <ExternalLink size={16} className="mx-auto animate-bounce" />
                  </div>
                </div>

                {/* Enhanced animated border effect */}
                <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                  <div className={`absolute inset-0 rounded-lg border-2 ${social.borderColor} animate-pulse`}></div>
                </div>
                
                {/* Ripple effect */}
                <div className="absolute inset-0 rounded-lg overflow-hidden">
                  <div className={`absolute w-0 h-0 rounded-full bg-gradient-to-r ${social.bgGradient} group-hover:w-full group-hover:h-full transition-all duration-1000 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-20`}></div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
      
      {/* Enhanced background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyber-cyan/3 rounded-full blur-3xl will-change-transform animate-drift-1"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-cyber-blue/3 rounded-full blur-3xl will-change-transform animate-drift-2"></div>
        <div className="absolute top-3/4 left-1/2 w-72 h-72 bg-purple-500/2 rounded-full blur-3xl will-change-transform animate-drift-3"></div>
      </div>
    </section>
  );
};

export default AboutSection;