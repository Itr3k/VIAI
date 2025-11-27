import React from 'react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';
import { SentimentTrend } from '../types';

interface SentimentChartProps {
    data: SentimentTrend[];
}

const SentimentChart: React.FC<SentimentChartProps> = ({ data }) => {
    if (!data || data.length === 0) {
        return (
            <div className="h-64 flex items-center justify-center bg-slate-50 rounded-xl border border-slate-200">
                <p className="text-slate-400 text-sm">No sentiment data available</p>
            </div>
        );
    }

    return (
        <div className="h-64 w-full bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="text-sm font-bold text-slate-700 mb-4">Sentiment Trend (Last 7 Days)</h3>
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                    data={data}
                    margin={{
                        top: 10,
                        right: 10,
                        left: -20,
                        bottom: 0,
                    }}
                >
                    <defs>
                        <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis
                        dataKey="date"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12, fill: '#94a3b8' }}
                        dy={10}
                    />
                    <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12, fill: '#94a3b8' }}
                        domain={[0, 100]}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: '#fff',
                            border: '1px solid #e2e8f0',
                            borderRadius: '8px',
                            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                        }}
                        itemStyle={{ color: '#1e293b', fontWeight: 600 }}
                        cursor={{ stroke: '#cbd5e1', strokeWidth: 1 }}
                    />
                    <Area
                        type="monotone"
                        dataKey="score"
                        stroke="#6366f1"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#colorScore)"
                        activeDot={{ r: 6, strokeWidth: 0 }}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
};

export default SentimentChart;
