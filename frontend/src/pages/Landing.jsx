import { Link } from 'react-router-dom';
import { Coffee, UserCog, User, ArrowRight } from 'lucide-react';

const Landing = () => {
    return (
        <div style={{ display: 'flex', height: '100vh', flexDirection: 'column' }}>
            <div style={{ flex: 1, display: 'flex' }}>
                {/* Left: Customer */}
                <Link to="/customer/login" style={{ flex: 1, textDecoration: 'none', position: 'relative', overflow: 'hidden', transition: 'all 0.3s' }}>
                    <div style={{
                        height: '100%', display: 'flex', flexDirection: 'column',
                        justifyContent: 'center', alignItems: 'center',
                        background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
                        color: 'white', padding: '2rem', textAlign: 'center'
                    }}
                        className="hover-scale"
                    >
                        <div style={{
                            width: '120px', height: '120px', borderRadius: '50%',
                            background: 'rgba(59, 130, 246, 0.2)', display: 'flex',
                            alignItems: 'center', justifyContent: 'center', marginBottom: '2rem'
                        }}>
                            <User size={64} className="text-blue-400" />
                        </div>
                        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>I'm a Customer</h1>
                        <p style={{ fontSize: '1.2rem', color: '#94a3b8', maxWidth: '300px' }}>Order quickly from our self-service kiosk.</p>
                        <div style={{ marginTop: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#60a5fa', fontWeight: 'bold' }}>
                            Start Ordering <ArrowRight size={20} />
                        </div>
                    </div>
                </Link>

                {/* Right: Staff */}
                <Link to="/staff/login" style={{ flex: 1, textDecoration: 'none', position: 'relative', overflow: 'hidden' }}>
                    <div style={{
                        height: '100%', display: 'flex', flexDirection: 'column',
                        justifyContent: 'center', alignItems: 'center',
                        background: 'linear-gradient(135deg, #3730a3 0%, #312e81 100%)',
                        color: 'white', padding: '2rem', textAlign: 'center'
                    }}
                        className="hover-scale"
                    >
                        <div style={{
                            width: '120px', height: '120px', borderRadius: '50%',
                            background: 'rgba(129, 140, 248, 0.2)', display: 'flex',
                            alignItems: 'center', justifyContent: 'center', marginBottom: '2rem'
                        }}>
                            <UserCog size={64} className="text-indigo-400" />
                        </div>
                        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>I'm Staff</h1>
                        <p style={{ fontSize: '1.2rem', color: '#a5b4fc', maxWidth: '300px' }}>Login to POS, Dashboard, and Management.</p>
                        <div style={{ marginTop: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#818cf8', fontWeight: 'bold' }}>
                            Employee Access <ArrowRight size={20} />
                        </div>
                    </div>
                </Link>
            </div>

            {/* Branding Footer */}
            <div style={{
                position: 'absolute', bottom: '20px', left: '0', right: '0',
                textAlign: 'center', pointerEvents: 'none'
            }}>
                <div style={{
                    display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                    background: 'rgba(0,0,0,0.5)', padding: '0.5rem 1rem',
                    borderRadius: '2rem', backdropFilter: 'blur(10px)'
                }}>
                    <Coffee size={18} color="white" />
                    <span style={{ color: 'white', fontWeight: 'bold', letterSpacing: '1px' }}>MONGO CAFE</span>
                </div>
            </div>
        </div>
    );
};

export default Landing;
