import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const COLORS = ['#6d28d9', '#ec4899', '#22c55e', '#ef4444', '#eab308'];

const PopularItemsChart = ({ data }) => {
    return (
        <div className="glass" style={{ padding: '1.5rem', borderRadius: '1rem', height: '400px' }}>
            <h3 style={{ marginBottom: '1.5rem', color: 'var(--text)' }}>Popular Items</h3>
            <ResponsiveContainer width="100%" height="85%">
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        fill="#8884d8"
                        paddingAngle={5}
                        dataKey="quantity"
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip contentStyle={{ background: 'var(--surface)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.5rem', color: 'var(--text)' }} />
                    <Legend />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};

export default PopularItemsChart;
