
'use client';
import { Card } from '@/components/ui/card';
import contributionData from '@/lib/github-contributions.json';

interface ContributionDay {
  date: string;
  count: number;
  level: number;
}

const GitHubStats = () => {
  const { totalContributions, contributions } = contributionData as {
    totalContributions: number;
    contributions: ContributionDay[];
  };

  const getLevelColor = (level: number) => {
    switch (level) {
      case 1: return 'bg-sky-900';
      case 2: return 'bg-sky-700';
      case 3: return 'bg-sky-500';
      case 4: return 'bg-sky-400';
      case 0:
      default:
        return 'bg-gray-800/80';
    }
  };

  const getWeeks = () => {
    if (!contributions || contributions.length === 0) {
      return [];
    }
  
    const contributionsMap = new Map<string, ContributionDay>();
    contributions.forEach(day => {
      contributionsMap.set(day.date, day);
    });
  
    const weeks: (ContributionDay | null)[][] = Array.from({ length: 52 }, () => Array(7).fill(null));
    
    const today = new Date();
    const endDate = new Date(today);
    // Align end date to the end of the week (Saturday)
    endDate.setDate(today.getDate() + (6 - today.getDay()));

    const startDate = new Date(endDate);
    startDate.setDate(endDate.getDate() - (52 * 7 - 1));
  
    for (let i = 0; i < 52 * 7; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);
      const dateKey = currentDate.toISOString().split('T')[0];
      const weekIndex = Math.floor(i / 7);
      const dayIndex = i % 7;
  
      if (weekIndex < 52) {
        const dayData = contributionsMap.get(dateKey);
        weeks[weekIndex][dayIndex] = dayData || { date: dateKey, count: 0, level: 0 };
      }
    }
  
    return weeks;
  };
  
  const weekColumns = getWeeks();

  if (!totalContributions) {
    return (
      <div className="p-8">
        <div className="text-center text-frost-cyan">
          <p className="font-semibold text-lg mb-2">Generating GitHub Contributions...</p>
          <p className="text-sm">Run the 'Update GitHub Contribution Stats' action in your repository's Actions tab to populate data.</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="p-8 group relative bg-cyber-dark/80 rounded-2xl border border-neon-cyan/20 backdrop-blur-sm">
      <div className="relative z-10">
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold text-white animate-fade-in-up">
            GitHub Contributions
          </h3>
          <div className="text-gray-300 text-lg font-bold animate-scale-in mt-2">
            <span className="inline-block text-neon-cyan">
              {totalContributions.toLocaleString()}
            </span>
            <span className="ml-2 text-sm text-gray-400">contributions</span>
          </div>
        </div>
        
        <div className="text-center mb-6">
          <div className="text-sm text-gray-400 mb-3 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
            @AdilMunawar - Last 12 months
          </div>
        </div>
        
        <div className="overflow-x-auto pb-2">
           <div className="flex justify-center">
             <div className="grid grid-flow-col auto-cols-max gap-1">
              {weekColumns.map((week, weekIndex) => (
                <div key={weekIndex} className="grid grid-cols-1 gap-1">
                  {week.map((day, dayIndex) => {
                    if (!day) {
                      return <div key={`empty-${weekIndex}-${dayIndex}`} className="w-3 h-3 rounded-sm bg-gray-800/20" />;
                    }
                    return (
                      <div
                        key={day.date}
                        className={`w-3 h-3 rounded-sm ${getLevelColor(day.level)} hover:ring-2 hover:ring-sky-400/50 transition-all duration-300 cursor-pointer group/day hover:scale-125`}
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
        </div>
        
        <div className="flex justify-between items-center mt-6 text-xs text-gray-400 animate-fade-in-up max-w-xs mx-auto" style={{ animationDelay: '400ms' }}>
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
    </div>
  );
};

export default GitHubStats;
