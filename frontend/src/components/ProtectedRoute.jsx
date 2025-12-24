import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Layout from './Layout';

const ProtectedRoute = ({ allowedRoles = [] }) => {
    // If not authenticated, redirect to Landing Page (the new root)
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0f172a', color: 'white' }}>
                Loading...
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/landing" replace />;
    }

    // Role-based Access Control
    if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
        return (
            <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'white', background: '#0f172a' }}>
                <h1 style={{ fontSize: '3rem', color: 'var(--error)' }}>403</h1>
                <p>Unauthorized Access</p>
                <div style={{ marginTop: '1rem', color: '#94a3b8' }}>
                    Your role ({user.role}) cannot access this page.
                </div>
                <button
                    onClick={() => window.history.back()}
                    style={{ marginTop: '2rem', padding: '0.8rem 1.5rem', background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', borderRadius: '0.5rem', cursor: 'pointer', fontSize: '1rem' }}
                >
                    Go Back
                </button>
            </div>
        );
    }

    // Render Layout here so it wraps all protected pages
    // OLD CODE might have had Layout inside App.jsx, but ProtectedRoute handling it is safer for nesting
    return (
        <Layout>
            <Outlet />
        </Layout>
    );
};

export default ProtectedRoute;
