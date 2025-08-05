
import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';

interface ContributionDay {
  date: string;
  count: number;
  level: number;
}
const GitHubStats = () => {
  const [contributions, setContributions] = useState<ContributionDay[]>([]);
  const [totalContributions, setTotalContributions] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [animateStats, setAnimateStats] = useState(false);
  useEffect(() => {
    // Generate mock data since GitHub API requires authentication
    const generateMockData = () => {
      const data: ContributionDay[] = [];
      const today = new Date();
      const oneYearAgo = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate());
      let total = 0;
      for (let d = new Date(oneYearAgo); d <= today; d.setDate(d.getDate() + 1)) {
        const count = Math.floor(Math.random() * 15);
        const level = count === 0 ? 0 : count <= 3 ? 1 : count <= 6 ? 2 : count <= 9 ? 3 : 4;
        
        data.push({
          date: new Date(d).toISOString().split('T')[0],
          count,
          level
        });
        total += count;
      }
      
      setContributions(data);
      setTotalContributions(total);
      setIsLoading(false);
      
      // Trigger animation after data loads
      setTimeout(() => setAnimateStats(true), 100);
    };

    generateMockData();
  }, []);

  const getLevelColor = (level: number) => {
    switch (level) {
      case 0: return 'bg-gray-800/60';
      case 1: return 'bg-emerald-900/80';
      case 2: return 'bg-emerald-700';
      case 3: return 'bg-emerald-500';
      case 4: return 'bg-emerald-300';
      default: return 'bg-gray-800/60';
    }
  };

  const getWeeks = () => {
    const weeks: ContributionDay[][] = [];
    let currentWeek: ContributionDay[] = [];
    
    contributions.forEach((day, index) => {
      const dayOfWeek = new Date(day.date).getDay();
      
      if (dayOfWeek === 0 && currentWeek.length > 0) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
      
      currentWeek.push(day);
      
      if (index === contributions.length - 1) {
        weeks.push(currentWeek);
      }
    });
    
    return weeks;
  };

  if (isLoading) {
    return (
      <Card className="p-8 bg-cyber-gray/20 border-cyber-cyan/30 backdrop-blur-xl relative overflow-hidden">
        {/* Advanced loading animation */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyber-cyan/10 to-transparent animate-pulse"></div>
        <div className="animate-pulse relative z-10">
          <div className="h-6 bg-gradient-to-r from-gray-700 to-gray-600 rounded w-1/3 mb-6 animate-shimmer"></div>
          <div className="grid grid-cols-52 gap-1">
            {Array.from({ length: 365 }).map((_, i) => (
              <div 
                key={i} 
                className="w-3 h-3 bg-gray-800/40 rounded-sm animate-pulse" 
                style={{ animationDelay: `${i * 2}ms` }}
              ></div>
            ))}
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-8 bg-cyber-gray/20 border-cyber-cyan/30 backdrop-blur-xl hover:border-cyber-cyan/60 transition-all duration-500 group overflow-hidden relative">
      {/* Advanced background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-cyan-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-all duration-700"></div>
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-cyan-500 to-purple-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-1000 origin-left"></div>
      
      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-cyber-cyan rounded-full animate-float opacity-30"
            style={{
              left: `${20 + i * 20}%`,
              top: `${30 + i % 3 * 20}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${3 + i}s`
            }}
          ></div>
        ))}
      </div>
      
      <div className="relative z-10">
        <div className="flex justify-between items-center mb-6">
          <h3 className={`text-2xl font-bold text-white transition-all duration-500 ${animateStats ? 'animate-fade-in-up' : 'opacity-0'}`}>
            GitHub Contributions
          </h3>
          <div className={`text-cyber-cyan font-mono text-lg font-bold transition-all duration-700 ${animateStats ? 'animate-scale-in' : 'opacity-0'}`}>
            <span className="inline-block animate-bounce">
              {totalContributions.toLocaleString()}
            </span>
            <span className="ml-2 text-sm text-gray-400">contributions</span>
          </div>
        </div>
        
        <div className="mb-6">
          <div className={`text-sm text-gray-400 mb-3 transition-all duration-500 ${animateStats ? 'animate-fade-in-up' : 'opacity-0'}`} style={{ animationDelay: '200ms' }}>
            @adilmunawar - Last 12 months
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <div className="grid grid-flow-col auto-cols-max gap-1 min-w-full">
            {getWeeks().map((week, weekIndex) => (
              <div key={weekIndex} className="grid grid-rows-7 gap-1">
                {week.map((day, dayIndex) => (
                  <div
                    key={day.date}
                    className={`w-3 h-3 rounded-sm ${getLevelColor(day.level)} hover:ring-2 hover:ring-cyber-cyan/50 transition-all duration-300 cursor-pointer group/day hover:scale-125 animate-scale-in`}
                    title={`${day.count} contributions on ${new Date(day.date).toLocaleDateString()}`}
                    style={{ 
                      animationDelay: `${(weekIndex * 7 + dayIndex) * 10}ms`,
                      animationDuration: '0.5s'
                    }}
                  >
                    <div className="w-full h-full rounded-sm group-hover/day:animate-pulse transition-all duration-200"></div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
        
        <div className={`flex justify-between items-center mt-6 text-xs text-gray-400 transition-all duration-700 ${animateStats ? 'animate-fade-in-up' : 'opacity-0'}`} style={{ animationDelay: '400ms' }}>
          <span className="hover:text-cyber-cyan transition-colors">Less</span>
          <div className="flex gap-1">
            {[0, 1, 2, 3, 4].map(level => (
              <div 
                key={level} 
                className={`w-3 h-3 rounded-sm ${getLevelColor(level)} hover:scale-125 transition-transform duration-200 animate-scale-in`}
                style={{ animationDelay: `${500 + level * 100}ms` }}
              ></div>
            ))}
          </div>
          <span className="hover:text-cyber-cyan transition-colors">More</span>
        </div>
      </div>
    </Card>
  );
};

export default GitHubStats;
