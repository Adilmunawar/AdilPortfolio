
'use client';
import { Card } from '@/components/ui/card';
import leetCodeStats from '@/lib/leetcode-stats.json';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Trophy, CheckCircle, Target } from 'lucide-react';

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
    
    const difficultyData = [
        { name: 'Easy', solved: easy.solved, total: easy.total, color: '#00B8A3' },
        { name: 'Medium', solved: medium.solved, total: medium.total, color: '#FFC01E' },
        { name: 'Hard', solved: hard.solved, total: hard.total, color: '#FF375F' },
    ];
    
    const chartData = {
        easy: [{ value: easy.solved }, { value: easy.total - easy.solved }],
        medium: [{ value: medium.solved }, { value: medium.total - medium.solved }],
        hard: [{ value: hard.solved }, { value: hard.total - hard.solved }],
    };

    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            const parentName = payload[0].name.split('-')[0]; // Easy, Medium, or Hard
            const solvedValue = data.value;
            const parentData = difficultyData.find(d => d.name === parentName);
            if (!parentData || payload[0].name.includes('remaining')) return null;

            return (
                <div className="p-2 bg-cyber-dark/80 border border-neon-cyan/30 rounded-lg text-frost-white text-sm backdrop-blur-sm">
                    <p className="font-bold" style={{ color: parentData.color }}>
                        {parentName}: {solvedValue} / {parentData.total}
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
                    {/* Left side: Chart */}
                    <div className="relative w-full h-60">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Tooltip content={<CustomTooltip />} cursor={{fill: 'transparent'}}/>

                                {/* Hard Arc */}
                                <Pie
                                    data={chartData.hard}
                                    dataKey="value"
                                    cx="50%"
                                    cy="50%"
                                    innerRadius="85%"
                                    outerRadius="100%"
                                    startAngle={90}
                                    endAngle={-270}
                                    paddingAngle={-10}
                                    stroke="none"
                                >
                                    <Cell fill={difficultyData[2].color} />
                                    <Cell fill="hsl(var(--muted) / 0.3)" />
                                </Pie>

                                {/* Medium Arc */}
                                <Pie
                                    data={chartData.medium}
                                    dataKey="value"
                                    cx="50%"
                                    cy="50%"
                                    innerRadius="65%"
                                    outerRadius="80%"
                                    startAngle={90}
                                    endAngle={-270}
                                    paddingAngle={-10}
                                    stroke="none"
                                >
                                    <Cell fill={difficultyData[1].color} />
                                    <Cell fill="hsl(var(--muted) / 0.3)" />
                                </Pie>

                                {/* Easy Arc */}
                                <Pie
                                    data={chartData.easy}
                                    dataKey="value"
                                    cx="50%"
                                    cy="50%"
                                    innerRadius="45%"
                                    outerRadius="60%"
                                    startAngle={90}
                                    endAngle={-270}
                                    paddingAngle={-10}
                                    stroke="none"
                                >
                                    <Cell fill={difficultyData[0].color} />
                                    <Cell fill="hsl(var(--muted) / 0.3)" />
                                </Pie>

                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
                            <p className="text-4xl font-bold text-white drop-shadow-lg animate-scale-in">
                                {totalSolved}
                            </p>
                            <p className="text-sm text-frost-cyan mt-1 animate-fade-in-up" style={{ animationDelay: '100ms' }}>Solved</p>
                        </div>
                    </div>

                    {/* Right side: Stats */}
                    <div className="flex flex-col gap-6">
                        <div className="flex justify-around text-center">
                            <div className="flex flex-col items-center animate-scale-in" style={{animationDelay: '200ms'}}>
                                <Trophy className="w-7 h-7 text-neon-cyan mb-2" />
                                <p className="text-2xl font-bold text-white">{ranking.toLocaleString()}</p>
                                <p className="text-xs text-frost-cyan">Ranking</p>
                            </div>
                            <div className="flex flex-col items-center animate-scale-in" style={{animationDelay: '300ms'}}>
                                <Target className="w-7 h-7 text-neon-cyan mb-2" />
                                <p className="text-2xl font-bold text-white">{acceptanceRate.toFixed(1)}%</p>
                                <p className="text-xs text-frost-cyan">Acceptance</p>
                            </div>
                        </div>

                        <div className="space-y-3">
                            {difficultyData.map((data, index) => (
                                <div key={data.name} className="animate-fade-in-up" style={{animationDelay: `${400 + index * 100}ms`}}>
                                    <div className="flex justify-between items-center text-sm mb-1">
                                        <span className="font-semibold" style={{color: data.color}}>{data.name}</span>
                                        <span className="font-mono text-white">{data.solved} <span className="text-gray-400">/ {data.total}</span></span>
                                    </div>
                                    <div className="w-full bg-cyber-dark/40 rounded-full h-2.5 border border-neon-cyan/20">
                                        <div 
                                            className="h-full rounded-full" 
                                            style={{ 
                                                width: `${(data.solved / data.total) * 100}%`,
                                                backgroundColor: data.color,
                                                boxShadow: `0 0 8px ${data.color}80`
                                            }}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    );
};

export default LeetCodeStats;
