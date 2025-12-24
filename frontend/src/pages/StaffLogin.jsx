import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Coffee, Lock, User, Grid, ArrowRight } from 'lucide-react';

const StaffLogin = () => {
    const [mode, setMode] = useState('pin'); // 'pin' or 'password'
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [pin, setPin] = useState('');
    const [error, setError] = useState('');
    const { login, loginWithPin } = useAuth();
    const navigate = useNavigate();

    const handlePinChange = (val) => {
        if (val === 'back') {
            setPin(prev => prev.slice(0, -1));
        } else if (val === 'clear') {
            setPin('');
        } else {
            if (pin.length < 4) setPin(prev => prev + val);
        }
    };

    const handlePasswordLogin = async (e) => {
        e.preventDefault();
        setError('');
        const res = await login(username, password);
        if (res.success) navigate('/'); // Logic in Layout will route correctly
        else setError(res.message);
    };

    const handlePinLogin = async (user) => {
        if (pin.length !== 4) return setError("Enter 4-digit PIN");
        setError('');
        const res = await loginWithPin(user, pin);
        if (res.success) navigate('/');
        else setError(res.message);
    };

    // Quick user selection for PIN mode
    const pinUsers = [
        { id: 'owner', name: 'Owner', role: 'owner' },
        { id: 'manager', name: 'Manager', role: 'manager' },
        { id: 'cashier', name: 'Cashier', role: 'cashier' },
    ];
    const [selectedUser, setSelectedUser] = useState(pinUsers[2].id);

    return (
        <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'var(--gradient-bg)', fontFamily: 'var(--font-family)' }}>
            <div className="glass" style={{ padding: '3rem', borderRadius: '2rem', width: '100%', maxWidth: '440px' }}>

                {/* Tabs */}
                <div style={{ display: 'flex', background: 'rgba(255,255,255,0.03)', borderRadius: '1rem', padding: '0.5rem', marginBottom: '2.5rem', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <button
                        onClick={() => setMode('pin')}
                        style={{
                            flex: 1, padding: '0.8rem', borderRadius: '0.8rem', border: 'none',
                            background: mode === 'pin' ? 'var(--primary)' : 'transparent',
                            color: mode === 'pin' ? 'white' : 'var(--text-secondary)',
                            cursor: 'pointer', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                            transition: 'all 0.3s ease',
                            boxShadow: mode === 'pin' ? '0 4px 6px -1px rgba(0, 0, 0, 0.1)' : 'none'
                        }}
                    >
                        <Grid size={18} />
                        PIN Login
                    </button>
                    <button
                        onClick={() => setMode('password')}
                        style={{
                            flex: 1, padding: '0.8rem', borderRadius: '0.8rem', border: 'none',
                            background: mode === 'password' ? 'var(--primary)' : 'transparent',
                            color: mode === 'password' ? 'white' : 'var(--text-secondary)',
                            cursor: 'pointer', fontWeight: 600,
                            transition: 'all 0.3s ease',
                            boxShadow: mode === 'password' ? '0 4px 6px -1px rgba(0, 0, 0, 0.1)' : 'none'
                        }}
                    >Password</button>
                </div>

                <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                    <div style={{ width: '60px', height: '60px', background: 'rgba(139, 92, 246, 0.15)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', boxShadow: '0 0 20px rgba(139, 92, 246, 0.2)' }}>
                        <Coffee size={32} className="text-purple-400" color="#8b5cf6" />
                    </div>
                    <h2 style={{ fontSize: '1.8rem', fontWeight: 700 }}>Staff Access</h2>
                    {error && <p style={{ color: 'var(--error)', marginTop: '0.75rem', background: 'rgba(239, 68, 68, 0.1)', padding: '0.5rem', borderRadius: '0.5rem' }}>{error}</p>}
                </div>

                {mode === 'password' ? (
                    <form onSubmit={handlePasswordLogin}>
                        <div style={{ position: 'relative', marginBottom: '1.25rem' }}>
                            <User size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                            <input type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)}
                                style={{
                                    width: '100%', padding: '1rem 1rem 1rem 3rem', borderRadius: '1rem',
                                    background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', color: 'white',
                                    outline: 'none', transition: 'all 0.2s', fontSize: '1rem'
                                }}
                                onFocus={e => e.target.style.borderColor = 'var(--primary)'}
                                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                            />
                        </div>
                        <div style={{ position: 'relative', marginBottom: '2.5rem' }}>
                            <Lock size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                            <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)}
                                style={{
                                    width: '100%', padding: '1rem 1rem 1rem 3rem', borderRadius: '1rem',
                                    background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', color: 'white',
                                    outline: 'none', transition: 'all 0.2s', fontSize: '1rem'
                                }}
                                onFocus={e => e.target.style.borderColor = 'var(--primary)'}
                                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                            />
                        </div>
                        <button type="submit" className="btn-primary" style={{ width: '100%', padding: '1rem', fontSize: '1.1rem' }}>Sign In</button>
                    </form>
                ) : (
                    <div>
                        {/* User Selector */}
                        <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '2.5rem', overflowX: 'auto', paddingBottom: '0.5rem', scrollbarWidth: 'none' }}>
                            {pinUsers.map(u => (
                                <button
                                    key={u.id}
                                    onClick={() => setSelectedUser(u.id)}
                                    style={{
                                        padding: '0.75rem 1.25rem', borderRadius: '1rem',
                                        border: '1px solid ' + (selectedUser === u.id ? 'var(--primary)' : 'rgba(255,255,255,0.1)'),
                                        background: selectedUser === u.id ? 'rgba(139, 92, 246, 0.2)' : 'rgba(255,255,255,0.03)',
                                        color: selectedUser === u.id ? 'white' : 'var(--text-secondary)',
                                        cursor: 'pointer', whiteSpace: 'nowrap', fontSize: '0.95rem', fontWeight: 500,
                                        transition: 'all 0.2s ease'
                                    }}
                                >
                                    {u.name}
                                </button>
                            ))}
                        </div>

                        {/* PIN Display */}
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '1.25rem', marginBottom: '2.5rem' }}>
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} style={{
                                    width: '16px', height: '16px', borderRadius: '50%',
                                    background: i <= pin.length ? 'var(--primary)' : 'transparent',
                                    border: '2px solid ' + (i <= pin.length ? 'var(--primary)' : 'rgba(255,255,255,0.2)'),
                                    transition: 'all 0.2s ease'
                                }} />
                            ))}
                        </div>

                        {/* Numpad */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.25rem', maxWidth: '300px', margin: '0 auto' }}>
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => (
                                <button key={n} onClick={() => handlePinChange(n.toString())}
                                    style={{
                                        padding: '1.2rem', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.1)',
                                        background: 'rgba(255,255,255,0.03)', color: 'white', fontSize: '1.4rem', fontWeight: 500,
                                        cursor: 'pointer', transition: 'all 0.1s ease'
                                    }}
                                    className="hover:bg-white/10"
                                    onMouseDown={(e) => e.target.style.transform = 'scale(0.95)'}
                                    onMouseUp={(e) => e.target.style.transform = 'scale(1)'}
                                    onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                                >{n}</button>
                            ))}
                            <button onClick={() => handlePinChange('clear')} style={{ padding: '1.2rem', borderRadius: '50%', border: 'none', background: 'rgba(239, 68, 68, 0.15)', color: '#f87171', fontSize: '1rem', cursor: 'pointer', fontWeight: 600 }}>CLR</button>
                            <button onClick={() => handlePinChange('0')} style={{ padding: '1.2rem', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.03)', color: 'white', fontSize: '1.4rem', fontWeight: 500, cursor: 'pointer' }}>0</button>
                            <button onClick={() => handlePinLogin(selectedUser)} style={{ padding: '0.8rem', borderRadius: '50%', border: 'none', background: 'var(--primary-gradient)', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 10px rgba(139, 92, 246, 0.4)' }}><ArrowRight /></button>
                        </div>
                        <div style={{ textAlign: 'center', marginTop: '2rem', color: 'var(--text-secondary)', fontSize: '0.85rem', background: 'rgba(255,255,255,0.03)', padding: '0.5rem', borderRadius: '0.5rem' }}>
                            PINs: <span style={{ color: 'white' }}>1111</span> (Owner), <span style={{ color: 'white' }}>2222</span> (Manager), <span style={{ color: 'white' }}>3333</span> (Cashier)
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StaffLogin;
