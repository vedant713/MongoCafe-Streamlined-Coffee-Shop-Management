import { Link } from 'react-router-dom';
import { Coffee, UserCog, User, ArrowRight } from 'lucide-react';

const Landing = () => {
    return (
        <div style={{ display: 'flex', height: '100vh', flexDirection: 'column', fontFamily: 'var(--font-family)' }}>
            <div style={{ flex: 1, display: 'flex' }}>
                {/* Left: Customer */}
                <Link to="/customer/login" style={{ flex: 1, textDecoration: 'none', position: 'relative', overflow: 'hidden' }}>
                    <div style={{
                        height: '100%', display: 'flex', flexDirection: 'column',
                        justifyContent: 'center', alignItems: 'center',
                        background: 'radial-gradient(circle at top left, #1e293b 0%, #0f172a 100%)',
                        color: 'white', padding: '2rem', textAlign: 'center',
                        transition: 'transform 0.4s ease'
                    }}
                        onMouseEnter={e => e.currentTarget.style.background = 'radial-gradient(circle at top left, #334155 0%, #1e293b 100%)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'radial-gradient(circle at top left, #1e293b 0%, #0f172a 100%)'}
                    >
                        <div style={{
                            width: '140px', height: '140px', borderRadius: '50%',
                            background: 'rgba(59, 130, 246, 0.15)', display: 'flex',
                            alignItems: 'center', justifyContent: 'center', marginBottom: '2.5rem',
                            boxShadow: '0 0 40px rgba(59, 130, 246, 0.1)'
                        }}>
                            <User size={72} className="text-blue-400" />
                        </div>
                        <h1 style={{ fontSize: '3.5rem', marginBottom: '1rem', fontWeight: 700, letterSpacing: '-0.02em', background: 'linear-gradient(to right, #60a5fa, #93c5fd)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>I'm a Customer</h1>
                        <p style={{ fontSize: '1.25rem', color: '#94a3b8', maxWidth: '350px', lineHeight: 1.6 }}>Order quickly from our self-service kiosk.</p>
                        <div style={{ marginTop: '3rem', display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#60a5fa', fontWeight: 600, fontSize: '1.1rem' }}>
                            Start Ordering <ArrowRight size={22} />
                        </div>
                    </div>
                </Link>

                {/* Right: Staff */}
                <Link to="/staff/login" style={{ flex: 1, textDecoration: 'none', position: 'relative', overflow: 'hidden' }}>
                    <div style={{
                        height: '100%', display: 'flex', flexDirection: 'column',
                        justifyContent: 'center', alignItems: 'center',
                        background: 'radial-gradient(circle at top right, #312e81 0%, #1e1b4b 100%)',
                        color: 'white', padding: '2rem', textAlign: 'center',
                        transition: 'transform 0.4s ease'
                    }}
                        onMouseEnter={e => e.currentTarget.style.background = 'radial-gradient(circle at top right, #3730a3 0%, #312e81 100%)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'radial-gradient(circle at top right, #312e81 0%, #1e1b4b 100%)'}
                    >
                        <div style={{
                            width: '140px', height: '140px', borderRadius: '50%',
                            background: 'rgba(129, 140, 248, 0.15)', display: 'flex',
                            alignItems: 'center', justifyContent: 'center', marginBottom: '2.5rem',
                            boxShadow: '0 0 40px rgba(129, 140, 248, 0.1)'
                        }}>
                            <UserCog size={72} className="text-indigo-400" />
                        </div>
                        <h1 style={{ fontSize: '3.5rem', marginBottom: '1rem', fontWeight: 700, letterSpacing: '-0.02em', background: 'linear-gradient(to right, #818cf8, #a5b4fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>I'm Staff</h1>
                        <p style={{ fontSize: '1.25rem', color: '#a5b4fc', maxWidth: '350px', lineHeight: 1.6 }}>Login to POS, Dashboard, and Management.</p>
                        <div style={{ marginTop: '3rem', display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#818cf8', fontWeight: 600, fontSize: '1.1rem' }}>
                            Employee Access <ArrowRight size={22} />
                        </div>
                    </div>
                </Link>
            </div>

            {/* Branding Footer */}
            <div style={{
                position: 'absolute', bottom: '30px', left: '0', right: '0',
                textAlign: 'center', pointerEvents: 'none'
            }}>
                <div style={{
                    display: 'inline-flex', alignItems: 'center', gap: '0.75rem',
                    background: 'rgba(0,0,0,0.6)', padding: '0.75rem 1.5rem',
                    borderRadius: '3rem', backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255,255,255,0.1)'
                }}>
                    <Coffee size={24} className="text-indigo-400" />
                    <span style={{ color: 'white', fontWeight: 700, letterSpacing: '2px', fontSize: '1.1rem' }}>MONGO CAFE</span>
                </div>
            </div>
        </div>
    );
};

export default Landing;
