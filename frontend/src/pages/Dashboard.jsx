import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { DollarSign, ShoppingBag, Users, ArrowRight } from 'lucide-react';
import axios from 'axios';
import StatsCard from '../components/StatsCard';
import SalesChart from '../components/SalesChart';
import PopularItemsChart from '../components/PopularItemsChart';
import { playNotificationSound } from '../utils/sound';

const QuickAction = ({ title, to, color }) => {
    const navigate = useNavigate();
    return (
        <button
            onClick={() => navigate(to)}
            className="glass"
            style={{
                width: '100%', padding: '1.5rem', borderRadius: '1.5rem',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem',
                border: '1px solid var(--glass-border)',
                background: `linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0) 100%)`,
                textAlign: 'center', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                color: 'var(--text)', cursor: 'pointer',
                position: 'relative', overflow: 'hidden'
            }}
            onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.borderColor = color;
                e.currentTarget.style.boxShadow = `0 10px 30px -10px ${color}40`;
            }}
            onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = 'var(--glass-border)';
                e.currentTarget.style.boxShadow = 'none';
            }}
        >
            <div style={{
                padding: '0.8rem', borderRadius: '12px', background: `${color}15`, color: color,
                marginBottom: '0.2rem', transition: 'all 0.3s'
            }}>
                {title === 'Manage Customers' && <Users size={24} />}
                {title === 'Update Menu' && <ShoppingBag size={24} />}
                {title === 'Manage Staff' && <Users size={24} />}
                {title === 'Inventory' && <ShoppingBag size={24} />}
                {/* Fallback icon if needed, or dynamic icon passing */}
                {!['Manage Customers', 'Update Menu', 'Manage Staff', 'Inventory'].includes(title) && <ArrowRight size={24} />}
            </div>
            <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 600 }}>{title}</h3>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.25rem', opacity: 0.8 }}>
                View Details <ArrowRight size={14} />
            </span>
        </button>
    );
};

const Dashboard = () => {
    const [stats, setStats] = useState({ total_sales: 0, total_orders: 0 });
    const [peakHours, setPeakHours] = useState([]);
    const [popularItems, setPopularItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const prevOrdersRef = useRef(0);

    const fetchData = async () => {
        try {
            const [summaryRes, peakRes, popularRes] = await Promise.all([
                axios.get('http://localhost:8000/api/analytics/summary'),
                axios.get('http://localhost:8000/api/analytics/peak-hours'),
                axios.get('http://localhost:8000/api/analytics/popular-items')
            ]);

            const newStats = summaryRes.data;
            setStats(newStats);
            setPeakHours(peakRes.data);
            setPopularItems(popularRes.data);

            // Check for new orders
            if (prevOrdersRef.current > 0 && newStats.total_orders > prevOrdersRef.current) {
                playNotificationSound();
            }
            prevOrdersRef.current = newStats.total_orders;

        } catch (error) {
            console.error("Failed to fetch analytics", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 10000); // Poll every 10s
        return () => clearInterval(interval);
    }, []);

    return (
        <div style={{ maxWidth: '1400px', margin: '0 auto', fontFamily: 'var(--font-family)' }}>
            <div style={{ marginBottom: '3rem', animation: 'fadeIn 0.5s ease-out' }}>
                <h2 style={{ margin: '0 0 0.5rem 0', fontSize: '2.5rem', fontWeight: 800, background: 'linear-gradient(to right, #fff, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Dashboard</h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>Welcome back to MongoCafe Overview</p>
            </div>

            {/* Stats Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
                <StatsCard
                    title="Total Sales"
                    value={`₹${stats.total_sales}`}
                    icon={<DollarSign />}
                    color="#22c55e"
                />
                <StatsCard
                    title="Total Orders"
                    value={stats.total_orders}
                    icon={<ShoppingBag />}
                    color="#ec4899"
                />
                <StatsCard
                    title="System Status"
                    value="Online"
                    icon={<Users />}
                    color="#3b82f6"
                />
            </div>

            {/* Charts Section */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
                <div style={{ height: '100%', animation: 'slideUp 0.5s ease-out 0.1s backwards' }}>
                    <SalesChart data={peakHours} />
                </div>
                <div style={{ height: '100%', animation: 'slideUp 0.5s ease-out 0.2s backwards' }}>
                    <PopularItemsChart data={popularItems} />
                </div>
            </div>

            {/* Quick Actions */}
            <div style={{ marginBottom: '2rem', animation: 'slideUp 0.5s ease-out 0.3s backwards' }}>
                <h3 style={{ marginBottom: '1.5rem', fontSize: '1.5rem', fontWeight: 700, color: 'var(--text)' }}>Quick Actions</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
                    <QuickAction title="Manage Customers" to="/customers" color="#9333ea" />
                    <QuickAction title="Update Menu" to="/menu" color="#eab308" />
                    <QuickAction title="Manage Staff" to="/employees" color="#3b82f6" />
                    <QuickAction title="Inventory" to="/inventory" color="#f97316" />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
