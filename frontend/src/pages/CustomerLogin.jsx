import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Smartphone, ArrowRight, User } from 'lucide-react';

const CustomerLogin = () => {
    const [phoneno, setPhoneno] = useState('');
    const [otp, setOtp] = useState('');
    const [step, setStep] = useState(1); // 1: Phone, 2: OTP
    const { loginCustomer } = useAuth();
    const navigate = useNavigate();

    const handleSendOtp = (e) => {
        e.preventDefault();
        if (phoneno.length < 10) return alert("Enter valid phone number");
        setStep(2);
        // Simulate sending OTP
        console.log("OTP Sent: 123456");
    };

    const handleVerify = async (e) => {
        e.preventDefault();
        const res = await loginCustomer(phoneno, otp);
        if (res.success) {
            navigate('/menu');
        } else {
            alert(res.message);
        }
    };

    return (
        <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#0f172a' }}>
            <div className="glass" style={{ width: '100%', maxWidth: '380px', padding: '2rem', borderRadius: '1.5rem' }}>
                <h2 style={{ fontSize: '1.8rem', marginBottom: '0.5rem', textAlign: 'center' }}>
                    {step === 1 ? 'Start Ordering' : 'Verify Mobile'}
                </h2>
                <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                    {step === 1 ? 'Enter your mobile number to continue' : `OTP sent to ${phoneno}`}
                </p>

                {step === 1 ? (
                    <form onSubmit={handleSendOtp}>
                        <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
                            <Smartphone size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                            <input
                                type="tel" placeholder="Mobile Number" value={phoneno}
                                onChange={e => setPhoneno(e.target.value)}
                                style={{ width: '100%', padding: '1rem 1rem 1rem 3rem', borderRadius: '0.8rem', background: 'rgba(255,255,255,0.05)', border: 'none', color: 'white', fontSize: '1rem' }}
                                required
                            />
                        </div>
                        <button type="submit" className="btn-primary" style={{ width: '100%', padding: '1rem', borderRadius: '0.8rem', fontSize: '1rem' }}>
                            Send OTP
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleVerify}>
                        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', marginBottom: '1.5rem' }}>
                            {[...Array(6)].map((_, i) => (
                                <input
                                    key={i} type="text" maxLength="1"
                                    style={{ width: '40px', height: '50px', textAlign: 'center', fontSize: '1.2rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.5rem', color: 'white' }}
                                    value={otp[i] || ''}
                                    onChange={e => {
                                        const val = e.target.value;
                                        setOtp(prev => {
                                            const arr = prev.split('');
                                            arr[i] = val;
                                            return arr.join('');
                                        });
                                        if (val && e.target.nextSibling) e.target.nextSibling.focus();
                                    }}
                                />
                            ))}
                        </div>
                        <div style={{ textAlign: 'center', marginBottom: '1.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                            Use simplistic OTP: <b>123456</b>
                        </div>
                        <button type="submit" className="btn-primary" style={{ width: '100%', padding: '1rem', borderRadius: '0.8rem', fontSize: '1rem' }}>
                            Verify & Continue
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default CustomerLogin;
