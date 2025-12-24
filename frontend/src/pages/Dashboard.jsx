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
                width: '100%', padding: '1.5rem', borderRadius: '1rem',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem',
                border: `1px solid ${color}33`, // 20% opacity approx
                textAlign: 'center', transition: 'all 0.2s',
                color: 'var(--text)'
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
        <div>
            <div style={{ marginBottom: '2rem' }}>
                <h2 style={{ margin: 0 }}>Overview</h2>
                <p style={{ color: 'var(--text-secondary)' }}>Welcome back to MongoCafe</p>
            </div>

            {/* Stats Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
                <StatsCard
                    title="Total Sales"
                    value={`$${stats.total_sales}`}
                    icon={<DollarSign size={24} />}
                    color="#22c55e"
                />
                <StatsCard
                    title="Total Orders"
                    value={stats.total_orders}
                    icon={<ShoppingBag size={24} />}
                    color="#ec4899"
                />
                <StatsCard
                    title="System Status"
                    value="Online"
                    icon={<Users size={24} />}
                    color="#3b82f6"
                />
            </div>

            {/* Charts Section */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
                <SalesChart data={peakHours} />
                <PopularItemsChart data={popularItems} />
            </div>

            {/* Quick Actions */}
            <h3 style={{ marginBottom: '1.5rem' }}>Quick Actions</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                <QuickAction title="Manage Customers" to="/customers" color="#9333ea" />
                <QuickAction title="Update Menu" to="/menu" color="#eab308" />
                <QuickAction title="Manage Staff" to="/employees" color="#3b82f6" />
                <QuickAction title="Inventory" to="/inventory" color="#f97316" />
            </div>
        </div>
    );
};

export default Dashboard;
