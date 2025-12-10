'use client';
import { Card } from '@/components/ui/card';
import leetCodeStats from '@/lib/leetcode-stats.json';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const LeetCodeStats = () => {
    const {
        totalQuestions,
        totalSolved,
        easy,
        medium,
        hard,
        acceptanceRate,
        ranking,
    } = leetCodeStats;

    if (!totalSolved && !ranking) {
        return (
          <Card className="p-8 bg-cyber-gray/20 border-neon-cyan/30 backdrop-blur-xl">
            <div className="text-center text-gray-400">
              <p className="font-semibold text-lg mb-2">Generating LeetCode Stats...</p>
              <p className="text-sm">Run the 'Update LeetCode Stats' action in your repository's Actions tab to populate data.</p>
            </div>
          </Card>
        );
    }
    
    const solvedData = [
        { name: 'Easy', value: easy.solved, color: '#00B8A3' },
        { name: 'Medium', value: medium.solved, color: '#FFC01E' },
        { name: 'Hard', value: hard.solved, color: '#FF375F' },
        { name: 'Unsolved', value: totalQuestions - totalSolved, color: 'transparent' }
    ];

    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            const data = payload[0];
            if (data.name === 'Unsolved') return null;
            return (
                <div className="p-2 bg-cyber-dark/80 border border-neon-cyan/30 rounded-lg text-frost-white text-sm backdrop-blur-sm">
                    <p className="font-bold" style={{ color: data.payload.color }}>
                        {data.name}: {data.value} Solved
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <Card className="p-8 glass-card hover:border-neon-cyan/60 transition-all duration-500 group overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-br from-neon-cyan/5 via-frost-cyan/5 to-cyber-dark/5 opacity-0 group-hover:opacity-100 transition-all duration-700"></div>
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-neon-cyan via-frost-cyan to-cyber-dark transform scale-x-0 group-hover:scale-x-100 transition-transform duration-1000 origin-left"></div>

            <div className="relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                    <h3 className="text-2xl font-bold text-frost-white animate-fade-in-up mb-4 md:mb-0">
                        LeetCode Stats
                    </h3>
                    <a 
                        href="https://leetcode.com/AdilMunawar/" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-sm text-frost-cyan hover:text-white transition-colors animate-fade-in-up" 
                        style={{animationDelay: '100ms'}}>
                        @AdilMunawar
                    </a>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                    <div className="relative w-full h-64 md:h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'none', fill: 'transparent' }}/>
                                <Pie
                                    data={[{ value: totalQuestions }]}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius="80%"
                                    outerRadius="100%"
                                    startAngle={90}
                                    endAngle={-270}
                                    dataKey="value"
                                    stroke="none"
                                    isAnimationActive={false}
                                >
                                     <Cell fill="hsl(var(--muted) / 0.3)" />
                                </Pie>
                                <Pie
                                    data={solvedData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius="80%"
                                    outerRadius="100%"
                                    startAngle={90}
                                    endAngle={-270}
                                    dataKey="value"
                                    stroke="none"
                                    paddingAngle={2}
                                >
                                    {solvedData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} className="transition-all duration-300 hover:opacity-80"/>
                                    ))}
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
                            <p className="text-4xl font-bold text-white drop-shadow-lg">
                                {totalSolved}<span className="text-2xl text-gray-400">/{totalQuestions}</span>
                            </p>
                            <p className="text-lg text-frost-cyan mt-1">Solved</p>
                        </div>
                    </div>

                    <div className="flex flex-col gap-6">
                       <div className="flex justify-around text-center">
                            <div className="animate-scale-in" style={{animationDelay: '200ms'}}>
                                <p className="text-3xl font-bold text-white">{ranking.toLocaleString()}</p>
                                <p className="text-sm text-frost-cyan">Ranking</p>
                            </div>
                            <div className="animate-scale-in" style={{animationDelay: '300ms'}}>
                                <p className="text-3xl font-bold text-white">{acceptanceRate.toFixed(1)}%</p>
                                <p className="text-sm text-frost-cyan">Acceptance</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="p-4 rounded-lg bg-cyber-dark/40 border border-neon-cyan/20 animate-fade-in-up" style={{animationDelay: '400ms'}}>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="font-semibold" style={{color: solvedData[0].color}}>Easy</span>
                                    <span className="font-mono text-white">{easy.solved} <span className="text-gray-400">/ {easy.total}</span></span>
                                </div>
                            </div>
                            <div className="p-4 rounded-lg bg-cyber-dark/40 border border-neon-cyan/20 animate-fade-in-up" style={{animationDelay: '500ms'}}>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="font-semibold" style={{color: solvedData[1].color}}>Medium</span>
                                    <span className="font-mono text-white">{medium.solved} <span className="text-gray-400">/ {medium.total}</span></span>
                                </div>
                            </div>
                            <div className="p-4 rounded-lg bg-cyber-dark/40 border border-neon-cyan/20 animate-fade-in-up" style={{animationDelay: '600ms'}}>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="font-semibold" style={{color: solvedData[2].color}}>Hard</span>
                                    <span className="font-mono text-white">{hard.solved} <span className="text-gray-400">/ {hard.total}</span></span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    );
};

export default LeetCodeStats;
