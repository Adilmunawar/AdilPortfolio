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
  const { totalContributions, contributions } = contributionData;

  const getLevelColor = (level: number) => {
    switch (level) {
      case 1: return 'bg-indigo-900';
      case 2: return 'bg-indigo-700';
      case 3: return 'bg-indigo-500';
      case 4: return 'bg-indigo-400';
      case 0:
      default:
        return 'bg-gray-800/60';
    }
  };

  const getWeeks = () => {
    if (!contributions || contributions.length === 0) {
      return [];
    }

    const weeks: (ContributionDay | null)[][] = [];
    let currentWeek: (ContributionDay | null)[] = [];

    // Get the day of the week for the first contribution day (0=Sun, 1=Mon, ...)
    const firstDay = new Date(contributions[0].date);
    const startDayOfWeek = firstDay.getUTCDay();

    // Add padding for the first week if it doesn't start on Sunday
    for (let i = 0; i < startDayOfWeek; i++) {
      currentWeek.push(null);
    }

    contributions.forEach((day) => {
      currentWeek.push(day);
      if (currentWeek.length === 7) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
    });

    // Push any remaining days in the last week
    if (currentWeek.length > 0) {
       while (currentWeek.length < 7) {
         currentWeek.push(null);
       }
       weeks.push(currentWeek);
    }
    
    // Transpose the data to be column-major (weeks as columns)
    const columns: (ContributionDay | null)[][] = [];
    for (let i = 0; i < 7; i++) {
        const column = weeks.map(week => week[i]).filter(day => day !== undefined);
        columns.push(column);
    }

    return columns;
  };

  const dayColumns = getWeeks();
  
  if (!totalContributions || totalContributions === 0) {
    return (
      <Card className="p-8 bg-cyber-gray/20 border-cyber-purple/30 backdrop-blur-xl">
        <div className="text-center text-gray-400">
          <p className="font-semibold text-lg mb-2">Loading GitHub Contributions...</p>
          <p className="text-sm">If this persists, run the 'Update GitHub Contribution Stats' action in your repository's Actions tab.</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-8 bg-cyber-gray/20 border-cyber-purple/30 backdrop-blur-xl hover:border-cyber-purple/60 transition-all duration-500 group overflow-hidden relative">
      <div className="absolute inset-0 bg-gradient-to-br from-cyber-purple/5 via-cyber-blue/5 to-indigo-900/5 opacity-0 group-hover:opacity-100 transition-all duration-700"></div>
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyber-purple via-cyber-blue to-indigo-900 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-1000 origin-left"></div>
      
      <div className="relative z-10">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-white animate-fade-in-up">
            GitHub Contributions
          </h3>
          <div className="text-gray-300 font-mono text-lg font-bold animate-scale-in">
            <span className="inline-block text-indigo-400">
              {totalContributions.toLocaleString()}
            </span>
            <span className="ml-2 text-sm text-gray-400">contributions</span>
          </div>
        </div>
        
        <div className="mb-6">
          <div className="text-sm text-gray-400 mb-3 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
            @AdilMunawar - Last 12 months
          </div>
        </div>
        
        <div className="overflow-x-auto pb-2">
           <div className="grid grid-flow-col auto-cols-max gap-1">
            {dayColumns.map((col, colIndex) => (
              <div key={colIndex} className="grid grid-rows-7 gap-1">
                {col.map((day, dayIndex) => {
                  if (!day) {
                    return <div key={`empty-${colIndex}-${dayIndex}`} className="w-3 h-3" />;
                  }
                  return (
                    <div
                      key={day.date}
                      className={`w-3 h-3 rounded-sm ${getLevelColor(day.level)} hover:ring-2 hover:ring-cyber-blue/50 transition-all duration-300 cursor-pointer group/day hover:scale-125`}
                      title={`${day.count} contributions on ${new Date(day.date).toLocaleDateString('en-US', { timeZone: 'UTC' })}`}
                    >
                      <div className="w-full h-full rounded-sm group-hover/day:animate-pulse transition-all duration-200"></div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
        
        <div className="flex justify-between items-center mt-6 text-xs text-gray-400 animate-fade-in-up" style={{ animationDelay: '400ms' }}>
          <span className="hover:text-gray-300 transition-colors">Less</span>
          <div className="flex gap-1">
            {[0, 1, 2, 3, 4].map(level => (
              <div 
                key={level} 
                className={`w-3 h-3 rounded-sm ${getLevelColor(level)}`}
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
