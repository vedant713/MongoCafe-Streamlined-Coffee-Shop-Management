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
        <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#0f172a' }}>
            <div className="glass" style={{ padding: '2rem', borderRadius: '1.5rem', width: '100%', maxWidth: '420px' }}>

                {/* Tabs */}
                <div style={{ display: 'flex', background: 'rgba(255,255,255,0.05)', borderRadius: '1rem', padding: '0.4rem', marginBottom: '2rem' }}>
                    <button
                        onClick={() => setMode('pin')}
                        style={{ flex: 1, padding: '0.8rem', borderRadius: '0.8rem', border: 'none', background: mode === 'pin' ? 'var(--primary)' : 'transparent', color: 'white', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                    >
                        <Grid size={18} />
                        PIN Login
                    </button>
                    <button
                        onClick={() => setMode('password')}
                        style={{ flex: 1, padding: '0.8rem', borderRadius: '0.8rem', border: 'none', background: mode === 'password' ? 'var(--primary)' : 'transparent', color: 'white', cursor: 'pointer', fontWeight: 'bold' }}
                    >Password</button>
                </div>

                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <Coffee size={40} color="var(--primary)" style={{ marginBottom: '1rem' }} />
                    <h2>Staff Access</h2>
                    {error && <p style={{ color: 'var(--error)', marginTop: '0.5rem' }}>{error}</p>}
                </div>

                {mode === 'password' ? (
                    <form onSubmit={handlePasswordLogin}>
                        <div style={{ position: 'relative', marginBottom: '1rem' }}>
                            <User size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                            <input type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} style={{ width: '100%', padding: '1rem 1rem 1rem 3rem', borderRadius: '0.8rem', background: 'rgba(255,255,255,0.05)', border: 'none', color: 'white' }} />
                        </div>
                        <div style={{ position: 'relative', marginBottom: '2rem' }}>
                            <Lock size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                            <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} style={{ width: '100%', padding: '1rem 1rem 1rem 3rem', borderRadius: '0.8rem', background: 'rgba(255,255,255,0.05)', border: 'none', color: 'white' }} />
                        </div>
                        <button type="submit" className="btn-primary" style={{ width: '100%', padding: '1rem', borderRadius: '0.8rem' }}>Sign In</button>
                    </form>
                ) : (
                    <div>
                        {/* User Selector */}
                        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
                            {pinUsers.map(u => (
                                <button
                                    key={u.id}
                                    onClick={() => setSelectedUser(u.id)}
                                    style={{
                                        padding: '0.8rem 1.2rem', borderRadius: '0.8rem', border: '1px solid ' + (selectedUser === u.id ? 'var(--primary)' : 'rgba(255,255,255,0.1)'),
                                        background: selectedUser === u.id ? 'rgba(59, 130, 246, 0.2)' : 'transparent', color: 'white', cursor: 'pointer', whiteSpace: 'nowrap'
                                    }}
                                >
                                    {u.name}
                                </button>
                            ))}
                        </div>

                        {/* PIN Display */}
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '2rem' }}>
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} style={{ width: '15px', height: '15px', borderRadius: '50%', background: i <= pin.length ? 'var(--primary)' : 'rgba(255,255,255,0.2)' }} />
                            ))}
                        </div>

                        {/* Numpad */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', maxWidth: '300px', margin: '0 auto' }}>
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => (
                                <button key={n} onClick={() => handlePinChange(n.toString())} style={{ padding: '1rem', borderRadius: '50%', border: 'none', background: 'rgba(255,255,255,0.05)', color: 'white', fontSize: '1.2rem', cursor: 'pointer' }}>{n}</button>
                            ))}
                            <button onClick={() => handlePinChange('clear')} style={{ padding: '1rem', borderRadius: '50%', border: 'none', background: 'rgba(239, 68, 68, 0.2)', color: '#f87171', fontSize: '0.9rem', cursor: 'pointer' }}>C</button>
                            <button onClick={() => handlePinChange('0')} style={{ padding: '1rem', borderRadius: '50%', border: 'none', background: 'rgba(255,255,255,0.05)', color: 'white', fontSize: '1.2rem', cursor: 'pointer' }}>0</button>
                            <button onClick={() => handlePinLogin(selectedUser)} style={{ padding: '0.8rem', borderRadius: '50%', border: 'none', background: 'var(--primary)', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><ArrowRight /></button>
                        </div>
                        <div style={{ textAlign: 'center', marginTop: '1rem', color: 'var(--text-secondary)', fontSize: '0.8rem' }}>Default PIN: 1111 (Owner), 2222 (Manager), 3333 (Cashier)</div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StaffLogin;
