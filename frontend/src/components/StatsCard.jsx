import React from 'react';

const StatsCard = ({ title, value, icon, color }) => (
    <div className="glass" style={{ padding: '1.5rem', borderRadius: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{ padding: '1rem', borderRadius: '50%', background: `${color}20`, color: color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {icon}
        </div>
        <div>
            <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{title}</p>
            <h3 style={{ margin: 0, fontSize: '1.5rem', color: 'var(--text)' }}>{value}</h3>
        </div>
    </div>
);

export default StatsCard;
