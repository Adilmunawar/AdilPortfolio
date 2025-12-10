
'use client';
import { Card } from '@/components/ui/card';
import leetCodeStats from '@/lib/leetcode-stats.json';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Trophy, CheckCircle, Target, TrendingUp } from 'lucide-react';

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

    if (!totalQuestions) {
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
        { name: 'Easy', solved: easy.solved, total: easy.total, color: '#00C49F' },
        { name: 'Medium', solved: medium.solved, total: medium.total, color: '#FFBB28' },
        { name: 'Hard', solved: hard.solved, total: hard.total, color: '#FF8042' },
    ];
    
    const RADIAN = Math.PI / 180;
    const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, payload }: any) => {
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);

        return (
            <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" className="text-xs font-bold">
                {`${payload.solved}`}
            </text>
        );
    };

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
          const data = payload[0].payload;
          return (
            <div className="p-2 bg-cyber-dark/80 border border-neon-cyan/30 rounded-lg text-frost-white text-sm backdrop-blur-sm">
              <p className="font-bold">{`${data.name}: ${data.solved} / ${data.total}`}</p>
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

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10 text-center">
                    <div className="flex flex-col items-center justify-center p-4 rounded-lg bg-cyber-dark/40 border border-neon-cyan/20 animate-scale-in" style={{animationDelay: '200ms'}}>
                        <CheckCircle className="w-8 h-8 text-neon-cyan mb-3" />
                        <p className="text-3xl font-bold text-white">{totalSolved}</p>
                        <p className="text-sm text-frost-cyan">Total Solved</p>
                    </div>
                    <div className="flex flex-col items-center justify-center p-4 rounded-lg bg-cyber-dark/40 border border-neon-cyan/20 animate-scale-in" style={{animationDelay: '300ms'}}>
                        <Target className="w-8 h-8 text-neon-cyan mb-3" />
                        <p className="text-3xl font-bold text-white">{acceptanceRate.toFixed(2)}%</p>
                        <p className="text-sm text-frost-cyan">Acceptance Rate</p>
                    </div>
                    <div className="flex flex-col items-center justify-center p-4 rounded-lg bg-cyber-dark/40 border border-neon-cyan/20 animate-scale-in" style={{animationDelay: '400ms'}}>
                        <Trophy className="w-8 h-8 text-neon-cyan mb-3" />
                        <p className="text-3xl font-bold text-white">~{Math.round(ranking / 1000)}k</p>
                        <p className="text-sm text-frost-cyan">Global Ranking</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {difficultyData.map((data, index) => (
                        <div key={data.name} className={`flex flex-col items-center animate-fade-in-up`} style={{ animationDelay: `${500 + index * 100}ms` }}>
                            <h4 className="font-bold text-lg mb-4" style={{ color: data.color }}>{data.name}</h4>
                            <div style={{ width: '100%', height: 150 }}>
                                <ResponsiveContainer>
                                    <PieChart>
                                        <defs>
                                            <linearGradient id={`gradient-${data.name}`} x1="0" y1="0" x2="1" y2="1">
                                                <stop offset="0%" stopColor={data.color} stopOpacity={0.8}/>
                                                <stop offset="100%" stopColor={data.color} stopOpacity={1}/>
                                            </linearGradient>
                                        </defs>
                                        <Pie
                                            data={[{ value: data.solved }, { value: data.total - data.solved }]}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            label={renderCustomizedLabel}
                                            innerRadius={45}
                                            outerRadius={60}
                                            startAngle={90}
                                            endAngle={-270}
                                            paddingAngle={-10}
                                            dataKey="value"
                                            stroke="none"
                                        >
                                           <Cell fill={`url(#gradient-${data.name})`} cornerRadius={10} />
                                           <Cell fill="#334155" cornerRadius={10} />
                                        </Pie>
                                        <Tooltip content={<CustomTooltip />} />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                            <p className="text-frost-white font-semibold mt-2">{data.solved} / {data.total}</p>
                        </div>
                    ))}
                </div>
            </div>
        </Card>
    );
};

export default LeetCodeStats;
