import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Coffee, UserCog, User, ArrowRight, Sparkles, ChefHat } from 'lucide-react';

const Landing = () => {
    const [hovered, setHovered] = useState(null); // 'customer' | 'staff' | null

    return (
        <div style={{
            display: 'flex', height: '100vh', flexDirection: 'column',
            fontFamily: 'var(--font-family)', overflow: 'hidden', position: 'relative'
        }}>

            <div style={{ flex: 1, display: 'flex', width: '100%' }}>

                {/* LEFT SIDE: CUSTOMER */}
                <Link
                    to="/customer/login"
                    onMouseEnter={() => setHovered('customer')}
                    onMouseLeave={() => setHovered(null)}
                    style={{
                        flex: hovered === 'customer' ? 1.5 : (hovered === 'staff' ? 0.8 : 1),
                        textDecoration: 'none', position: 'relative', overflow: 'hidden',
                        transition: 'all 0.6s cubic-bezier(0.25, 1, 0.5, 1)',
                        display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
                        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
                        borderRight: '1px solid rgba(255,255,255,0.05)'
                    }}
                >
                    {/* Dynamic Background Pattern */}
                    <div style={{
                        position: 'absolute', inset: 0, opacity: hovered === 'customer' ? 0.2 : 0.05,
                        backgroundImage: 'radial-gradient(circle at 20% 40%, rgba(96, 165, 250, 0.4) 1px, transparent 1px)',
                        backgroundSize: '40px 40px', transition: 'opacity 0.5s ease', pointerEvents: 'none'
                    }} />

                    {/* Glow Effect */}
                    <div style={{
                        position: 'absolute', width: '500px', height: '500px', borderRadius: '50%',
                        background: 'radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, transparent 70%)',
                        top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                        opacity: hovered === 'customer' ? 1 : 0.5, transition: 'all 0.6s ease'
                    }} />

                    {/* Content */}
                    <div style={{
                        zIndex: 10, textAlign: 'center', padding: '2rem',
                        transform: hovered === 'customer' ? 'scale(1.05)' : 'scale(1)',
                        transition: 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)'
                    }}>
                        <div className="animate-float" style={{
                            width: '120px', height: '120px', borderRadius: '35px',
                            background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(37, 99, 235, 0.1))',
                            backdropFilter: 'blur(10px)', border: '1px solid rgba(96, 165, 250, 0.3)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem',
                            boxShadow: '0 20px 40px -10px rgba(59, 130, 246, 0.3)'
                        }}>
                            <User size={64} style={{ color: '#60a5fa' }} />
                        </div>

                        <h2 className="animate-title" style={{
                            fontSize: '4rem', fontWeight: 800, margin: '0 0 1rem',
                            background: 'linear-gradient(to right, #60a5fa, #93c5fd, #60a5fa)',
                            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                            lineHeight: 1.1
                        }}>
                            Customer
                        </h2>

                        <p style={{
                            fontSize: '1.25rem', color: '#94a3b8', maxWidth: '400px', margin: '0 auto 3rem',
                            lineHeight: 1.6, opacity: hovered === 'customer' ? 1 : 0.8, transition: 'opacity 0.3s'
                        }}>
                            Craving something delicious? Order from our kiosk in seconds.
                        </p>

                        <div style={{
                            display: 'inline-flex', alignItems: 'center', gap: '0.75rem',
                            padding: '1rem 2rem', borderRadius: '50px',
                            background: hovered === 'customer' ? 'rgba(59, 130, 246, 0.2)' : 'rgba(255,255,255,0.05)',
                            border: '1px solid rgba(96, 165, 250, 0.3)', color: '#60a5fa', fontWeight: 700,
                            boxShadow: hovered === 'customer' ? '0 0 30px rgba(59, 130, 246, 0.2)' : 'none',
                            transition: 'all 0.3s ease'
                        }}>
                            Start Ordering <ArrowRight size={20} />
                        </div>
                    </div>
                </Link>


                {/* RIGHT SIDE: STAFF */}
                <Link
                    to="/staff/login"
                    onMouseEnter={() => setHovered('staff')}
                    onMouseLeave={() => setHovered(null)}
                    style={{
                        flex: hovered === 'staff' ? 1.5 : (hovered === 'customer' ? 0.8 : 1),
                        textDecoration: 'none', position: 'relative', overflow: 'hidden',
                        transition: 'all 0.6s cubic-bezier(0.25, 1, 0.5, 1)',
                        display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
                        background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)'
                    }}
                >
                    {/* Dynamic Background Pattern */}
                    <div style={{
                        position: 'absolute', inset: 0, opacity: hovered === 'staff' ? 0.2 : 0.05,
                        backgroundImage: 'linear-gradient(45deg, rgba(129, 140, 248, 0.2) 25%, transparent 25%, transparent 50%, rgba(129, 140, 248, 0.2) 50%, rgba(129, 140, 248, 0.2) 75%, transparent 75%, transparent)',
                        backgroundSize: '40px 40px', transition: 'opacity 0.5s ease', pointerEvents: 'none'
                    }} />

                    {/* Glow Effect */}
                    <div style={{
                        position: 'absolute', width: '500px', height: '500px', borderRadius: '50%',
                        background: 'radial-gradient(circle, rgba(129, 140, 248, 0.15) 0%, transparent 70%)',
                        top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                        opacity: hovered === 'staff' ? 1 : 0.5, transition: 'all 0.6s ease'
                    }} />

                    {/* Content */}
                    <div style={{
                        zIndex: 10, textAlign: 'center', padding: '2rem',
                        transform: hovered === 'staff' ? 'scale(1.05)' : 'scale(1)',
                        transition: 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)'
                    }}>
                        <div className="animate-float" style={{
                            width: '120px', height: '120px', borderRadius: '35px',
                            background: 'linear-gradient(135deg, rgba(129, 140, 248, 0.2), rgba(79, 70, 229, 0.1))',
                            backdropFilter: 'blur(10px)', border: '1px solid rgba(129, 140, 248, 0.3)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem',
                            boxShadow: '0 20px 40px -10px rgba(99, 102, 241, 0.3)',
                            animationDelay: '0.2s' // Offset float
                        }}>
                            <UserCog size={64} style={{ color: '#818cf8' }} />
                        </div>

                        <h2 className="animate-title" style={{
                            fontSize: '4rem', fontWeight: 800, margin: '0 0 1rem',
                            background: 'linear-gradient(to right, #818cf8, #a5b4fc, #818cf8)',
                            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                            lineHeight: 1.1
                        }}>
                            Staff Loop
                        </h2>

                        <p style={{
                            fontSize: '1.25rem', color: '#a5b4fc', maxWidth: '400px', margin: '0 auto 3rem',
                            lineHeight: 1.6, opacity: hovered === 'staff' ? 1 : 0.8, transition: 'opacity 0.3s'
                        }}>
                            Access the dashboard, POS, and store management.
                        </p>

                        <div style={{
                            display: 'inline-flex', alignItems: 'center', gap: '0.75rem',
                            padding: '1rem 2rem', borderRadius: '50px',
                            background: hovered === 'staff' ? 'rgba(129, 140, 248, 0.2)' : 'rgba(255,255,255,0.05)',
                            border: '1px solid rgba(129, 140, 248, 0.3)', color: '#818cf8', fontWeight: 700,
                            boxShadow: hovered === 'staff' ? '0 0 30px rgba(129, 140, 248, 0.2)' : 'none',
                            transition: 'all 0.3s ease'
                        }}>
                            Employee Login <ArrowRight size={20} />
                        </div>
                    </div>
                </Link>

            </div>

            {/* BRANDING FOOTER */}
            <div style={{
                position: 'absolute', bottom: '40px', left: '50%', transform: 'translateX(-50%)',
                textAlign: 'center', pointerEvents: 'none', zIndex: 50
            }}>
                <div style={{
                    display: 'flex', alignItems: 'center', gap: '0.75rem',
                    background: 'rgba(15, 23, 42, 0.6)', padding: '0.75rem 1.5rem',
                    borderRadius: '100px', backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    boxShadow: '0 10px 30px -5px rgba(0,0,0,0.3)'
                }}>
                    <div style={{ background: 'linear-gradient(135deg, #8b5cf6, #6366f1)', padding: '6px', borderRadius: '50%' }}>
                        <Coffee size={20} color="white" fill="white" />
                    </div>
                    <span style={{
                        color: 'white', fontWeight: 800, letterSpacing: '1px', fontSize: '1.1rem',
                        textShadow: '0 2px 10px rgba(0,0,0,0.5)'
                    }}>MONGO CAFE</span>
                </div>
            </div>

        </div>
    );
};

export default Landing;
