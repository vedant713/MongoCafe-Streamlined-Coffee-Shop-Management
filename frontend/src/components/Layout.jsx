import { Link, Outlet, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, UserCog, Coffee, ShoppingCart, Package, Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const Layout = () => {
    const location = useLocation();
    const { theme, toggleTheme } = useTheme();
    const isActive = (path) => location.pathname === path;

    const navItems = [
        { path: '/', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
        { path: '/pos', label: 'POS', icon: <ShoppingCart size={20} /> },
        { path: '/menu', label: 'Menu', icon: <Coffee size={20} /> },
        { path: '/customers', label: 'Customers', icon: <Users size={20} /> },
        { path: '/employees', label: 'Employees', icon: <UserCog size={20} /> },
        { path: '/inventory', label: 'Inventory', icon: <Package size={20} /> },
    ];

    return (
        <div>
            <nav className="glass" style={{ marginBottom: '2rem', borderRadius: '1rem', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', background: 'linear-gradient(to right, var(--primary), var(--accent))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Coffee size={28} color="var(--primary)" />
                    MongoCafe
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            style={{
                                display: 'flex', alignItems: 'center', gap: '0.5rem',
                                padding: '0.5rem 1rem',
                                borderRadius: '0.5rem',
                                transition: 'all 0.3s ease',
                                background: isActive(item.path) ? 'rgba(109, 40, 217, 0.2)' : 'transparent',
                                color: isActive(item.path) ? 'var(--accent)' : 'var(--text-secondary)',
                                fontWeight: isActive(item.path) ? 'bold' : 'normal',
                                fontSize: '0.9rem'
                            }}
                        >
                            {item.icon}
                            {item.label}
                        </Link>
                    ))}
                    <button
                        onClick={toggleTheme}
                        style={{
                            background: 'transparent',
                            border: 'none',
                            color: 'var(--text)',
                            padding: '0.5rem',
                            display: 'flex',
                            alignItems: 'center',
                            cursor: 'pointer'
                        }}
                    >
                        {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                    </button>
                </div>
            </nav>
            <main>
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;
