import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const COLORS = ['#6d28d9', '#ec4899', '#22c55e', '#ef4444', '#eab308'];

const PopularItemsChart = ({ data }) => {
    return (
        <div className="glass" style={{
            padding: '1.5rem', borderRadius: '1.5rem', height: '420px',
            border: '1px solid var(--glass-border)', boxShadow: 'var(--glass-shadow)',
            display: 'flex', flexDirection: 'column'
        }}>
            <h3 style={{ marginBottom: '1rem', color: 'var(--text)', fontSize: '1.25rem', fontWeight: 700 }}>Popular Items</h3>
            <div style={{ flex: 1, width: '100%', minHeight: 0 }}>
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={80}
                            outerRadius={120}
                            paddingAngle={5}
                            dataKey="quantity"
                            stroke="none"
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
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
                        />
                        <Legend
                            verticalAlign="bottom"
                            height={36}
                            iconType="circle"
                            formatter={(value) => <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginLeft: '5px' }}>{value}</span>}
                        />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default PopularItemsChart;
