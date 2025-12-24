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
        <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--background)', color: 'var(--text)' }}>
            <nav className="glass" style={{ width: '250px', padding: '1.5rem', display: 'flex', flexDirection: 'column', borderRight: '1px solid rgba(255, 255, 255, 0.1)', height: '100vh', position: 'sticky', top: 0 }}>
                <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.8rem', fontWeight: 'bold', fontSize: '1.2rem', color: 'var(--primary)' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Coffee size={20} color="white" />
                    </div>
                    MongoCafe
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            style={{
                                display: 'flex', alignItems: 'center', gap: '0.5rem',
                                padding: '0.8rem 1rem',
                                borderRadius: '0.5rem',
                                transition: 'all 0.3s ease',
                                background: isActive(item.path) ? 'var(--primary)' : 'transparent',
                                color: isActive(item.path) ? 'white' : 'var(--text-secondary)',
                                fontWeight: isActive(item.path) ? 'bold' : 'normal',
                                fontSize: '0.9rem',
                                textDecoration: 'none'
                            }}
                        >
                            {item.icon}
                            {item.label}
                        </Link>
                    ))}
                </div>

                <button
                    onClick={logout}
                    style={{
                        background: 'rgba(239, 68, 68, 0.1)', border: 'none', color: 'var(--error)',
                        padding: '0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        cursor: 'pointer', borderRadius: '0.5rem', marginTop: '1rem', fontWeight: 'bold', width: '100%'
                    }}
                >
                    Sign Out
                </button>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem', padding: '0.8rem', background: 'rgba(255,255,255,0.05)', borderRadius: '0.5rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Logged as</span>
                        <span style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>{user?.username}</span>
                    </div>
                    <button onClick={toggleTheme} style={{ background: 'transparent', border: 'none', color: 'var(--text)', padding: '0.5rem', cursor: 'pointer' }}>
                        {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                    </button>
                </div>
            </nav>
            <main style={{ flex: 1, padding: '2rem', overflowY: 'auto' }}>
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;
