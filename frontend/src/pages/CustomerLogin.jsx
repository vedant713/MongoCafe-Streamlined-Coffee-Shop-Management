import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Coffee, ArrowRight, User } from 'lucide-react';

const CustomerLogin = () => {
    const [name, setName] = useState('');
    const { loginGuest } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        const res = await loginGuest(name);
        if (res.success) {
            navigate('/menu');
        } else {
            alert("Something went wrong. Please try again.");
        }
        setLoading(false);
    };

    return (
        <div style={{
            height: '100vh',
            width: '100vw',
            background: 'var(--gradient-bg)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: "var(--font-family)"
        }}>
            <div className="glass" style={{
                padding: '3rem',
                borderRadius: '1.5rem',
                width: '100%',
                maxWidth: '420px',
                textAlign: 'center',
            }}>
                <div style={{
                    width: '80px',
                    height: '80px',
                    background: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 2rem',
                    boxShadow: '0 0 30px rgba(6, 182, 212, 0.3)'
                }}>
                    <Coffee size={40} color="white" />
                </div>

                <h2 style={{ color: 'white', marginBottom: '0.75rem', fontSize: '2rem', fontWeight: 700 }}>Welcome!</h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '2.5rem', fontSize: '1.1rem' }}>Enter your name to start ordering.</p>

                <form onSubmit={handleLogin}>
                    <div style={{ marginBottom: '2rem', position: 'relative' }}>
                        <User size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                        <input
                            type="text"
                            placeholder="Your Name (Optional)"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '1rem 1rem 1rem 3rem',
                                background: 'rgba(255,255,255,0.03)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: '1rem',
                                color: 'white',
                                fontSize: '1.1rem',
                                outline: 'none',
                                transition: 'all 0.2s'
                            }}
                            onFocus={e => e.target.style.borderColor = 'var(--secondary)'}
                            onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary" // Use the new class
                        style={{
                            width: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.75rem',
                            fontSize: '1.1rem',
                            background: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)', // Override to match accent
                            opacity: loading ? 0.7 : 1
                        }}
                    >
                        {loading ? 'Starting...' : 'Start Ordering'}
                        {!loading && <ArrowRight size={20} />}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CustomerLogin;
