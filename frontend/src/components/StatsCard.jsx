import React from 'react';

const StatsCard = ({ title, value, icon, color }) => (
    <div className="glass" style={{
        padding: '1.5rem', borderRadius: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.5rem',
        border: '1px solid var(--glass-border)', boxShadow: 'var(--glass-shadow)',
        background: 'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)'
    }}>
        <div style={{
            padding: '1rem', borderRadius: '1rem',
            background: `linear-gradient(135deg, ${color}20 0%, ${color}10 100%)`,
            color: color, display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: `0 8px 16px -4px ${color}30`
        }}>
            {React.cloneElement(icon, { size: 28 })}
        </div>
        <div>
            <p style={{ margin: '0 0 0.25rem 0', color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 500, letterSpacing: '0.02em' }}>{title}</p>
            <h3 style={{ margin: 0, fontSize: '1.75rem', fontWeight: 700, color: 'var(--text)' }}>{value}</h3>
        </div>
    </div>
);

export default StatsCard;
