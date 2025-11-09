
'use client';
import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';

// Type definitions for the data we expect from our API
interface ContributionDay {
  date: string;
  count: number;
  level: number;
}

interface ApiData {
  totalContributions: number;
  contributions: ContributionDay[];
}

const GitHubStats = () => {
  const [contributions, setContributions] = useState<ContributionDay[]>([]);
  const [totalContributions, setTotalContributions] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [animateStats, setAnimateStats] = useState(false);

  useEffect(() => {
    // This function fetches the data from our own API route
    const fetchGitHubContributions = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Fetch data from the internal API route created in Step 2
        const response = await fetch('/api/github-stats');
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch stats from API');
        }

        const data: ApiData = await response.json();

        if (!data.contributions || !data.hasOwnProperty('totalContributions')) {
            throw new Error('Invalid data structure from API');
        }

        setContributions(data.contributions);
        setTotalContributions(data.totalContributions);
        
      } catch (error: any) {
        console.error('Error fetching GitHub data:', error);
        setError(error.message || 'An unexpected error occurred.');
        // You could set error state here or let it show 0 contributions
        setTotalContributions(0); // Set to 0 on error
        setContributions([]); // Clear contributions on error
      }
      
      setIsLoading(false);
      setTimeout(() => setAnimateStats(true), 100);
    };

    fetchGitHubContributions();
  }, []); // Runs once on component mount

  // Helper function to map contribution level to a color class
  const getLevelColor = (level: number) => {
    switch (level) {
      case 0: return 'bg-gray-800/60';
      case 1: return 'bg-indigo-900/80'; // Low contributions
      case 2: return 'bg-indigo-800';
      case 3: return 'bg-indigo-600';
      case 4: return 'bg-indigo-400'; // High contributions
      default: return 'bg-gray-800/60';
    }
  };

  // Organizes the flat list of days into weeks for the grid display
  const getWeeks = () => {
    if (contributions.length === 0) {
      return [];
    }

    const weeks: ContributionDay[][] = [];
    let currentWeek: ContributionDay[] = [];

    // The GitHub API starts the first week on a Sunday.
    // We need to pad the first week with empty days if it doesn't.
    const firstDay = new Date(contributions[0].date);
    const dayOfWeek = firstDay.getUTCDay(); // Use UTC day
    
    // Add empty padding days
    for (let i = 0; i < dayOfWeek; i++) {
      currentWeek.push({
        date: `padding-${i}`,
        count: 0,
        level: -1, // Use -1 to render an empty/invisible box
      });
    }

    // Process all contribution days
    contributions.forEach((day) => {
      currentWeek.push(day);
      // 6 is Saturday (end of the week)
      if (new Date(day.date).getUTCDay() === 6) { 
        weeks.push(currentWeek);
        currentWeek = [];
      }
    });

    // Push any remaining days in the last week
    if (currentWeek.length > 0) {
      weeks.push(currentWeek);
    }

    return weeks;
  };

  // Loading state
  if (isLoading) {
    return (
      <Card className="p-8 bg-cyber-gray/20 border-cyber-purple/30 backdrop-blur-xl relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyber-purple/10 to-transparent animate-pulse"></div>
        <div className="animate-pulse relative z-10">
          <div className="h-6 bg-gradient-to-r from-gray-700 to-gray-600 rounded w-1/3 mb-6 animate-shimmer"></div>
          <div className="grid grid-flow-col auto-cols-max gap-1">
            {/* Render ~53 weeks * 7 days = 371 squares for the loading skeleton */}
            {Array.from({ length: 371 }).map((_, i) => (
              <div 
                key={i} 
                className="w-3 h-3 bg-gray-800/40 rounded-sm" 
              ></div>
            ))}
          </div>
        </div>
      </Card>
    );
  }

  // Error state
  if (error) {
    return (
      <Card className="p-8 bg-red-900/20 border-red-500/30 backdrop-blur-xl">
        <div className="flex flex-col items-center justify-center text-center text-red-300">
          <AlertTriangle className="w-10 h-10 mb-4" />
          <h3 className="text-xl font-bold mb-2">Could not load GitHub stats</h3>
          <p className="text-sm text-red-300/80 max-w-sm">
            {error} Please ensure the `GITHUB_PAT` is correctly configured in your environment variables.
          </p>
        </div>
      </Card>
    );
  }


  // Loaded state
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
                {/* Ensure all 7 days are rendered, even if empty */}
                {Array.from({ length: 7 }).map((_, dayIndex) => {
                  const day = week[dayIndex];
                  if (!day || day.level === -1) {
                    // Render an empty, invisible box for padding
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
