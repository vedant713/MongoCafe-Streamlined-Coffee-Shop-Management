import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const SalesChart = ({ data }) => {
    return (
        <div className="glass" style={{
            padding: '1.5rem', borderRadius: '1.5rem', height: '420px',
            border: '1px solid var(--glass-border)', boxShadow: 'var(--glass-shadow)',
            display: 'flex', flexDirection: 'column'
        }}>
            <h3 style={{ marginBottom: '2rem', color: 'var(--text)', fontSize: '1.25rem', fontWeight: 700 }}>Peak Hours</h3>
            <div style={{ flex: 1, width: '100%', minHeight: 0 }}>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                        <XAxis
                            dataKey="hour"
                            stroke="var(--text-secondary)"
                            tick={{ fill: 'var(--text-secondary)', fontSize: 12 }}
                            tickLine={false}
                            axisLine={false}
                            dy={10}
                        />
                        <YAxis
                            stroke="var(--text-secondary)"
                            tick={{ fill: 'var(--text-secondary)', fontSize: 12 }}
                            tickLine={false}
                            axisLine={false}
                            dx={-10}
                        />
                        <Tooltip
                            contentStyle={{
                                background: 'rgba(15, 23, 42, 0.9)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: '0.75rem',
                                color: 'var(--text)',
                                boxShadow: '0 10px 25px -5px rgba(0,0,0,0.5)',
                                backdropFilter: 'blur(10px)'
                            }}
                            itemStyle={{ color: 'var(--text)' }}
                            cursor={{ fill: 'rgba(255,255,255,0.03)' }}
                        />
                        <Bar
                            dataKey="orders"
                            fill="url(#colorGradient)"
                            radius={[6, 6, 0, 0]}
                            maxBarSize={50}
                        />
                        <defs>
                            <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#8b5cf6" stopOpacity={1} />
                                <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.5} />
                            </linearGradient>
                        </defs>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default SalesChart;
