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
            background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: "'Inter', sans-serif"
        }}>
            <div style={{
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(10px)',
                padding: '3rem',
                borderRadius: '20px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                width: '100%',
                maxWidth: '400px',
                textAlign: 'center',
                boxShadow: '0 20px 50px rgba(0,0,0,0.3)'
            }}>
                <div style={{
                    width: '70px',
                    height: '70px',
                    background: 'linear-gradient(135deg, #00b4db 0%, #0083b0 100%)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1.5rem',
                    boxShadow: '0 10px 20px rgba(0,180,219,0.3)'
                }}>
                    <Coffee size={32} color="white" />
                </div>

                <h2 style={{ color: 'white', marginBottom: '0.5rem', fontSize: '1.8rem' }}>Welcome!</h2>
                <p style={{ color: '#8b9bb4', marginBottom: '2rem' }}>Enter your name to start ordering.</p>

                <form onSubmit={handleLogin}>
                    <div style={{ marginBottom: '1.5rem', position: 'relative' }}>
                        <User size={18} style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#6e7a91' }} />
                        <input
                            type="text"
                            placeholder="Your Name (Optional)"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '1rem 1rem 1rem 3rem',
                                background: 'rgba(255,255,255,0.05)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: '10px',
                                color: 'white',
                                fontSize: '1rem',
                                outline: 'none'
                            }}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            width: '100%',
                            padding: '1rem',
                            background: 'linear-gradient(90deg, #00b4db 0%, #0083b0 100%)',
                            border: 'none',
                            borderRadius: '10px',
                            color: 'white',
                            fontSize: '1rem',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.5rem',
                            transition: 'transform 0.2s',
                            opacity: loading ? 0.7 : 1
                        }}
                    >
                        {loading ? 'Starting...' : 'Start Ordering'}
                        {!loading && <ArrowRight size={18} />}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CustomerLogin;
