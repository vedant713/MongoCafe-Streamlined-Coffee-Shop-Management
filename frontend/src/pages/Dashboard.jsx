import { useNavigate } from 'react-router-dom';
import { DollarSign, ShoppingBag, Users, ArrowRight } from 'lucide-react';

const StatCard = ({ title, value, icon, color }) => (
    <div className="glass" style={{ padding: '1.5rem', borderRadius: '1rem', display: 'flex', alignItems: 'center', gap: '1rem', transition: 'transform 0.2s', cursor: 'default' }}>
        <div style={{ background: `rgba(${color}, 0.2)`, padding: '0.75rem', borderRadius: '0.75rem', color: `rgb(${color})` }}>
            {icon}
        </div>
        <div>
            <h4 style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{title}</h4>
            <p style={{ margin: 0, fontSize: '1.5rem', fontWeight: 'bold' }}>{value}</p>
        </div>
    </div>
);

const QuickAction = ({ title, to, color }) => {
    const navigate = useNavigate();
    return (
        <button
            onClick={() => navigate(to)}
            className="glass"
            style={{
                width: '100%', padding: '1.5rem', borderRadius: '1rem',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem',
                border: `1px solid rgba(${color}, 0.2)`,
                textAlign: 'center', transition: 'all 0.2s'
            }}
        >
            <h3 style={{ margin: 0, fontSize: '1.1rem' }}>{title}</h3>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                Go to page <ArrowRight size={14} />
            </span>
        </button>
    );
};

const Dashboard = () => {
    return (
        <div>
            <div style={{ marginBottom: '2rem' }}>
                <h2 style={{ margin: 0 }}>Overview</h2>
                <p style={{ color: 'var(--text-secondary)' }}>Welcome back to MongoCafe</p>
            </div>

            {/* Stats Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
                <StatCard
                    title="Total Sales"
                    value="$12,450"
                    icon={<DollarSign size={24} />}
                    color="34, 197, 94" // Green
                />
                <StatCard
                    title="Total Orders"
                    value="1,245"
                    icon={<ShoppingBag size={24} />}
                    color="236, 72, 153" // Pink
                />
                <StatCard
                    title="Active Employees"
                    value="8"
                    icon={<Users size={24} />}
                    color="59, 130, 246" // Blue
                />
            </div>

            {/* Quick Actions */}
            <h3 style={{ marginBottom: '1.5rem' }}>Quick Actions</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                <QuickAction title="Manage Customers" to="/customers" color="147, 51, 234" />
                <QuickAction title="Update Menu" to="/menu" color="234, 179, 8" />
                <QuickAction title="Manage Staff" to="/employees" color="59, 130, 246" />
            </div>
        </div>
    );
};

export default Dashboard;
