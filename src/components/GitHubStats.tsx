
'use client';
import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import contributionData from '@/lib/github-contributions.json';

interface ContributionDay {
  date: string;
  count: number;
  level: number;
}

const GitHubStats = () => {
  const [animateStats, setAnimateStats] = useState(false);
  const { totalContributions, contributions } = contributionData;

  useEffect(() => {
    // Animate stats shortly after component mounts
    const timer = setTimeout(() => setAnimateStats(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const getLevelColor = (level: number) => {
    switch (level) {
      case 0: return 'bg-gray-800/60';
      case 1: return 'bg-indigo-900/80';
      case 2: return 'bg-indigo-800';
      case 3: return 'bg-indigo-600';
      case 4: return 'bg-indigo-400';
      default: return 'bg-gray-800/60';
    }
  };

  const getWeeks = () => {
    if (!contributions || contributions.length === 0) {
      return [];
    }

    const weeks: ContributionDay[][] = [];
    let currentWeek: ContributionDay[] = [];

    const firstDay = new Date(contributions[0].date);
    const dayOfWeek = firstDay.getUTCDay();
    
    for (let i = 0; i < dayOfWeek; i++) {
      currentWeek.push({
        date: `padding-${i}`,
        count: 0,
        level: -1,
      });
    }

    contributions.forEach((day) => {
      currentWeek.push(day);
      if (new Date(day.date).getUTCDay() === 6) { 
        weeks.push(currentWeek);
        currentWeek = [];
      }
    });

    if (currentWeek.length > 0) {
      weeks.push(currentWeek);
    }

    return weeks;
  };
  
  if (totalContributions === 0) {
      return (
          <Card className="p-8 bg-cyber-gray/20 border-cyber-purple/30 backdrop-blur-xl">
              <div className="text-center text-gray-400">
                  <p className="font-semibold text-lg mb-2">Loading GitHub Contributions...</p>
                  <p className="text-sm">Or run the 'Update GitHub Contribution Stats' action in your repository's Actions tab.</p>
              </div>
          </Card>
      )
  }

  return (
    <Card className="p-8 bg-cyber-gray/20 border-cyber-purple/30 backdrop-blur-xl hover:border-cyber-purple/60 transition-all duration-500 group overflow-hidden relative">
      <div className="absolute inset-0 bg-gradient-to-br from-cyber-purple/5 via-cyber-blue/5 to-indigo-900/5 opacity-0 group-hover:opacity-100 transition-all duration-700"></div>
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyber-purple via-cyber-blue to-indigo-900 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-1000 origin-left"></div>
      
      <div className="relative z-10">
        <div className="flex justify-between items-center mb-6">
          <h3 className={`text-2xl font-bold text-white transition-all duration-500 ${animateStats ? 'animate-fade-in-up' : 'opacity-0'}`}>
            GitHub Contributions
          </h3>
          <div className={`text-gray-300 font-mono text-lg font-bold transition-all duration-700 ${animateStats ? 'animate-scale-in' : 'opacity-0'}`}>
            <span className="inline-block animate-bounce text-indigo-400">
              {totalContributions.toLocaleString()}
            </span>
            <span className="ml-2 text-sm text-gray-400">contributions</span>
          </div>
        </div>
        
        <div className="mb-6">
          <div className={`text-sm text-gray-400 mb-3 transition-all duration-500 ${animateStats ? 'animate-fade-in-up' : 'opacity-0'}`} style={{ animationDelay: '200ms' }}>
            @AdilMunawar - Last 12 months
          </div>
        </div>
        
        <div className="overflow-x-auto pb-2">
          <div className="grid grid-flow-col auto-cols-max gap-1 min-w-full">
            {getWeeks().map((week, weekIndex) => (
              <div key={weekIndex} className="grid grid-rows-7 gap-1">
                {Array.from({ length: 7 }).map((_, dayIndex) => {
                  const day = week[dayIndex];
                  if (!day || day.level === -1) {
                    return <div key={`empty-${weekIndex}-${dayIndex}`} className="w-3 h-3" />;
                  }
                  return (
                    <div
                      key={day.date}
                      className={`w-3 h-3 rounded-sm ${getLevelColor(day.level)} hover:ring-2 hover:ring-cyber-blue/50 transition-all duration-300 cursor-pointer group/day hover:scale-125 animate-scale-in`}
                      title={`${day.count} contributions on ${new Date(day.date).toLocaleDateString('en-US', { timeZone: 'UTC' })}`}
                      style={{ 
                        animationDelay: `${(weekIndex * 7 + dayIndex) * 2}ms`,
                        animationDuration: '0.5s'
                      }}
                    >
                      <div className="w-full h-full rounded-sm group-hover/day:animate-pulse transition-all duration-200"></div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
        
        <div className={`flex justify-between items-center mt-6 text-xs text-gray-400 transition-all duration-700 ${animateStats ? 'animate-fade-in-up' : 'opacity-0'}`} style={{ animationDelay: '400ms' }}>
          <span className="hover:text-gray-300 transition-colors">Less</span>
          <div className="flex gap-1">
            {[0, 1, 2, 3, 4].map(level => (
              <div 
                key={level} 
                className={`w-3 h-3 rounded-sm ${getLevelColor(level)} hover:scale-125 transition-transform duration-200 animate-scale-in`}
                style={{ animationDelay: `${500 + level * 100}ms` }}
              ></div>
            ))}
          </div>
          <span className="hover:text-gray-300 transition-colors">More</span>
        </div>
      </div>
    </Card>
  );
};

export default GitHubStats;
