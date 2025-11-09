'use client';
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
    
    // Create a Map for quick lookup of contributions by date
    const contributionsMap = new Map<string, ContributionDay>();
    contributions.forEach(day => {
        // Normalize date to YYYY-MM-DD format without time
        const dateKey = day.date.split('T')[0];
        contributionsMap.set(dateKey, day);
    });

    const weeks: (ContributionDay | null)[][] = [];
    const today = new Date();
    // Go back 371 days (approx 53 weeks) to fill the graph
    const startDate = new Date();
    startDate.setDate(today.getDate() - 370); 

    // Adjust startDate to be a Sunday
    startDate.setDate(startDate.getDate() - startDate.getUTCDay());

    let currentWeek: (ContributionDay | null)[] = [];

    for (let i = 0; i < 371; i++) {
        const currentDate = new Date(startDate);
        currentDate.setDate(startDate.getDate() + i);

        // Format date to 'YYYY-MM-DD' to match map keys
        const dateKey = currentDate.toISOString().split('T')[0];
        const dayData = contributionsMap.get(dateKey) || null;
        
        currentWeek.push(dayData);

        if (currentWeek.length === 7) {
            weeks.push(currentWeek);
            currentWeek = [];
        }
    }
    
    if (currentWeek.length > 0) {
      weeks.push(currentWeek);
    }
    
    // Ensure we have exactly 53 weeks for a consistent grid
    while (weeks.length < 53) {
      weeks.push(Array(7).fill(null));
    }

    return weeks.slice(0, 53);
  };
  
  const weekColumns = getWeeks();

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
            {weekColumns.map((week, weekIndex) => (
              <div key={weekIndex} className="grid grid-rows-7 gap-1">
                {week.map((day, dayIndex) => {
                  if (!day) {
                    return <div key={`empty-${weekIndex}-${dayIndex}`} className="w-3 h-3 rounded-sm bg-gray-800/20" />;
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
