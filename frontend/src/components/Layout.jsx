import { Link, Outlet, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, UserCog, Coffee, ShoppingCart, Package, Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

const Layout = () => {
    const location = useLocation();
    const { theme, toggleTheme } = useTheme();
    const { user, logout } = useAuth();
    const isActive = (path) => location.pathname === path;

    const allNavItems = [
        { path: '/', label: 'Dashboard', icon: <LayoutDashboard size={20} />, roles: ['owner', 'manager'] },
        { path: '/pos', label: 'POS', icon: <ShoppingCart size={20} />, roles: ['owner', 'manager', 'cashier'] },
        { path: '/menu', label: 'Menu', icon: <Coffee size={20} />, roles: ['owner', 'manager', 'cashier', 'customer'] },
        { path: '/customers', label: 'Customers', icon: <Users size={20} />, roles: ['owner', 'manager', 'cashier'] },
        { path: '/employees', label: 'Employees', icon: <UserCog size={20} />, roles: ['owner', 'manager'] },
        { path: '/inventory', label: 'Inventory', icon: <Package size={20} />, roles: ['owner', 'manager'] },
    ];

    const navItems = allNavItems.filter(item => item.roles.includes(user?.role));

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--background)', color: 'var(--text)', fontFamily: 'var(--font-family)' }}>
            <nav className="glass" style={{
                width: '280px', padding: '2rem', display: 'flex', flexDirection: 'column',
                borderRight: '1px solid var(--glass-border)', height: '100vh', position: 'sticky', top: 0,
                background: 'rgba(15, 23, 42, 0.6)' // Slightly darker glass for sidebar
            }}>
                <div style={{ marginBottom: '3rem', display: 'flex', alignItems: 'center', gap: '1rem', fontWeight: 800, fontSize: '1.5rem', color: 'white', paddingLeft: '0.5rem' }}>
                    <div style={{
                        width: '42px', height: '42px', borderRadius: '12px',
                        background: 'var(--primary-gradient)', display: 'flex', alignItems: 'center',
                        justifyContent: 'center', boxShadow: '0 4px 15px rgba(139, 92, 246, 0.4)'
                    }}>
                        <Coffee size={24} color="white" />
                    </div>
                    <span style={{ background: 'linear-gradient(to right, #fff, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        MongoCafe
                    </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            style={{
                                display: 'flex', alignItems: 'center', gap: '1rem',
                                padding: '1rem 1.25rem',
                                borderRadius: '1rem',
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                background: isActive(item.path) ? 'var(--primary-gradient)' : 'transparent',
                                color: isActive(item.path) ? 'white' : 'var(--text-secondary)',
                                fontWeight: isActive(item.path) ? 600 : 500,
                                fontSize: '1rem',
                                textDecoration: 'none',
                                boxShadow: isActive(item.path) ? '0 8px 20px -4px rgba(139, 92, 246, 0.4)' : 'none',
                                transform: isActive(item.path) ? 'translateY(-1px)' : 'none',
                                border: isActive(item.path) ? 'none' : '1px solid transparent'
                            }}
                            onMouseEnter={(e) => {
                                if (!isActive(item.path)) {
                                    e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                                    e.currentTarget.style.color = 'var(--text)';
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (!isActive(item.path)) {
                                    e.currentTarget.style.background = 'transparent';
                                    e.currentTarget.style.color = 'var(--text-secondary)';
                                }
                            }}
                        >
                            {item.icon}
                            {item.label}
                        </Link>
                    ))}
                </div>

                <div style={{ marginTop: 'auto', paddingTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                    <button
                        onClick={logout}
                        style={{
                            width: '100%', padding: '0.9rem', borderRadius: '1rem',
                            background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)',
                            color: '#f87171', fontSize: '0.95rem', fontWeight: 600,
                            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem',
                            transition: 'all 0.2s'
                        }}
                        onMouseOver={e => {
                            e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)';
                            e.currentTarget.style.transform = 'translateY(-1px)';
                        }}
                        onMouseOut={e => {
                            e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)';
                            e.currentTarget.style.transform = 'translateY(0)';
                        }}
                    >
                        Sign Out
                    </button>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem', padding: '1rem', background: 'rgba(0,0,0,0.2)', borderRadius: '1rem', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Logged in as</span>
                            <span style={{ fontSize: '0.9rem', fontWeight: '700', color: 'white' }}>{user?.username}</span>
                        </div>
                        <button
                            onClick={toggleTheme}
                            style={{
                                background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                                color: 'var(--text)', padding: '0.6rem', borderRadius: '0.75rem',
                                cursor: 'pointer', transition: 'all 0.2s', display: 'flex'
                            }}
                            onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                            onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                        >
                            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                        </button>
                    </div>
                </div>
            </nav>
            <main style={{ flex: 1, padding: '2rem', overflowY: 'auto', position: 'relative' }}>
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;
