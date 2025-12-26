import { useState, useEffect } from 'react';
import { X, CreditCard, Banknote, Smartphone, Split, Printer, CheckCircle } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const CheckoutModal = ({ cart, total, onClose, onOrderComplete }) => {
    const { user } = useAuth();
    const [step, setStep] = useState('cart'); // cart, payment, success
    const [subtotal] = useState(total);
    const [tax] = useState(Math.round(total * 0.05)); // 5% GST
    const [grandTotal] = useState(total + Math.round(total * 0.05));

    const [paymentMethod, setPaymentMethod] = useState('Cash');
    const [customerName, setCustomerName] = useState(user?.username || 'Walk-in');
    const [splitDetails, setSplitDetails] = useState({ Cash: 0, Card: 0, UPI: 0 });
    const [orderId, setOrderId] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user && user.role === 'customer') {
            setCustomerName(user.username);
        }
    }, [user]);

    const handleSplitChange = (method, amount) => {
        setSplitDetails(prev => ({ ...prev, [method]: parseInt(amount) || 0 }));
    };

    const getSplitTotal = () => Object.values(splitDetails).reduce((a, b) => a + b, 0);

    const handlePlaceOrder = async () => {
        if (paymentMethod === 'Split' && getSplitTotal() !== grandTotal) {
            alert(`Split total (${getSplitTotal()}) must match Grand Total (${grandTotal})`);
            return;
        }

        const orderData = {
            items: cart.map(item => ({ name: item.name, price: item.price, quantity: item.quantity })),
            subtotal,
            tax,
            service_charge: 0,
            grand_total: grandTotal,
            payment_method: paymentMethod,
            split_details: paymentMethod === 'Split' ? splitDetails : null,
            customer_name: customerName
        };

        setLoading(true);
        try {
            const res = await axios.post('http://localhost:8000/api/orders', orderData);
            if (res.data.status === 'success') {
                setOrderId(res.data.order_id);
                setStep('success');
                onOrderComplete();
            }
        } catch (err) {
            console.error(err);
            const msg = err.response?.data?.detail || 'Order failed. Please try again.';
            alert(msg);
        } finally {
            setLoading(false);
        }
    };

    const handlePrint = () => {
        window.print();
    };

    const isCustomer = user?.role === 'customer';

    // Helper to get image (duplicated logic from Menu.jsx, ideally should be a util or passed in)
    const getImage = (item) => {
        if (item.image_url) return item.image_url;
        // Fallback logic if image_url is missing
        return '/images/latte.png';
    };

    if (step === 'success') {
        return (
            <div className="modal-overlay" style={{ backdropFilter: 'blur(8px)', background: 'rgba(0,0,0,0.6)', zIndex: 1000 }}>
                <div className="glass" style={{
                    padding: '3rem', borderRadius: '2rem', width: '90%', maxWidth: '420px', textAlign: 'center',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
                }}>
                    <div style={{
                        margin: '0 auto 2rem', width: '90px', height: '90px', borderRadius: '50%',
                        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: '0 0 30px rgba(16, 185, 129, 0.4)'
                    }}>
                        <CheckCircle size={48} color="white" />
                    </div>
                    <h2 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.5rem', background: 'linear-gradient(to right, #fff, #a7f3d0)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Order Confirmed!</h2>
                    <p style={{ fontSize: '1.2rem', margin: '0.5rem 0 2rem', color: 'var(--text)' }}>Order ID: <span style={{ fontFamily: 'monospace', background: 'rgba(255,255,255,0.1)', padding: '0.2rem 0.5rem', borderRadius: '0.4rem' }}>#{orderId}</span></p>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', marginBottom: '2.5rem', lineHeight: 1.6 }}>Please wait at your table.<br />We'll call your name shortly.</p>

                    <div style={{ display: 'flex', gap: '1rem' }}>
                        {!isCustomer && (
                            <button onClick={handlePrint} className="btn-secondary" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.8rem' }}>
                                <Printer size={18} /> Receipt
                            </button>
                        )}
                        <button onClick={onClose} className="btn-primary" style={{ flex: 1 }}>
                            {isCustomer ? 'Close' : 'New Order'}
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="modal-overlay" style={{ backdropFilter: 'blur(12px)', background: 'rgba(0,0,0,0.7)', zIndex: 1000 }}>
            <div className="glass" style={{
                padding: '0', borderRadius: '2rem', width: '95%', maxWidth: '550px',
                maxHeight: '90vh', overflow: 'hidden', display: 'flex', flexDirection: 'column',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
            }}>
                <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.02)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        {step === 'payment' && (
                            <button
                                onClick={() => setStep('cart')}
                                style={{ background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '50%', padding: '0.5rem', color: 'white', cursor: 'pointer', display: 'flex' }}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
                            </button>
                        )}
                        <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 700 }}>
                            {step === 'cart' ? 'Your Cart' : 'Checkout'}
                        </h2>
                    </div>
                    <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', borderRadius: '50%', padding: '0.5rem', display: 'flex', transition: 'all 0.2s' }} onMouseOver={e => { e.currentTarget.style.background = 'rgba(255,50,50,0.1)'; e.currentTarget.style.color = '#f87171'; }}>
                        <X size={20} />
                    </button>
                </div>

                <div style={{ padding: '2rem', overflowY: 'auto' }}>

                    {/* CART STEP */}
                    {step === 'cart' && (
                        <div style={{ animation: 'fadeIn 0.3s ease' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
                                {cart.map((item, idx) => (
                                    <div key={idx} style={{
                                        display: 'flex', alignItems: 'center', gap: '1rem',
                                        background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '1rem',
                                        border: '1px solid rgba(255,255,255,0.05)'
                                    }}>
                                        <div style={{ width: '60px', height: '60px', borderRadius: '0.8rem', overflow: 'hidden', flexShrink: 0 }}>
                                            <img src={getImage(item)} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <h4 style={{ margin: '0 0 0.25rem', fontSize: '1.1rem', fontWeight: 600 }}>{item.name}</h4>
                                            <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Qty: {item.quantity}</p>
                                        </div>
                                        <div style={{ fontSize: '1.2rem', fontWeight: 700 }}>
                                            ₹{item.price * item.quantity}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1.5rem', marginBottom: '1.5rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>
                                    <span>Subtotal</span>
                                    <span>₹{subtotal}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>
                                    <span>Tax (5%)</span>
                                    <span>₹{tax}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem', fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary)' }}>
                                    <span>Total</span>
                                    <span>₹{grandTotal}</span>
                                </div>
                            </div>

                            <button
                                onClick={() => setStep('payment')}
                                className="btn-primary"
                                style={{ width: '100%', padding: '1.2rem', fontSize: '1.1rem', background: 'var(--primary-gradient)', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}
                            >
                                Proceed to Checkout <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                            </button>
                        </div>
                    )}

                    {/* PAYMENT STEP */}
                    {step === 'payment' && (
                        <div style={{ animation: 'slideIn 0.3s ease' }}>
                            {/* Compact Summary */}
                            <div style={{
                                background: 'rgba(139, 92, 246, 0.1)', border: '1px solid rgba(139, 92, 246, 0.2)',
                                borderRadius: '1rem', padding: '1rem', marginBottom: '2rem',
                                display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                            }}>
                                <span style={{ color: 'var(--text-secondary)' }}>Total Amount</span>
                                <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary)' }}>₹{grandTotal}</span>
                            </div>

                            <div style={{ marginBottom: '2rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.75rem', fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Customer Name</label>
                                <input
                                    type="text"
                                    value={customerName}
                                    onChange={e => setCustomerName(e.target.value)}
                                    readOnly={isCustomer}
                                    style={{
                                        width: '100%', padding: '1rem', borderRadius: '1rem',
                                        background: isCustomer ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.2)',
                                        border: '1px solid rgba(255,255,255,0.1)', color: 'white',
                                        cursor: isCustomer ? 'not-allowed' : 'text',
                                        outline: 'none', transition: 'all 0.2s', fontSize: '1rem'
                                    }}
                                    onFocus={!isCustomer ? e => e.target.style.borderColor = 'var(--primary)' : undefined}
                                    onBlur={!isCustomer ? e => e.target.style.borderColor = 'rgba(255,255,255,0.1)' : undefined}
                                />
                            </div>

                            <div style={{ marginBottom: '2.5rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.75rem', fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Payment Method</label>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
                                    {['Cash', 'Card', 'UPI', 'Split'].map(method => (
                                        <button
                                            key={method}
                                            onClick={() => setPaymentMethod(method)}
                                            style={{
                                                padding: '1rem 0.5rem', borderRadius: '1rem',
                                                border: '1px solid ' + (paymentMethod === method ? 'var(--primary)' : 'rgba(255,255,255,0.05)'),
                                                background: paymentMethod === method ? 'rgba(139, 92, 246, 0.15)' : 'rgba(255,255,255,0.03)',
                                                color: paymentMethod === method ? 'white' : 'var(--text-secondary)',
                                                cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem',
                                                fontSize: '0.85rem', fontWeight: 600, transition: 'all 0.2s',
                                                boxShadow: paymentMethod === method ? '0 4px 12px rgba(139, 92, 246, 0.2)' : 'none'
                                            }}
                                        >
                                            {method === 'Cash' && <Banknote size={22} />}
                                            {method === 'Card' && <CreditCard size={22} />}
                                            {method === 'UPI' && <Smartphone size={22} />}
                                            {method === 'Split' && <Split size={22} />}
                                            {method}
                                        </button>
                                    ))}
                                </div>

                                {paymentMethod === 'Split' && (
                                    <div className="glass" style={{ padding: '1.25rem', borderRadius: '1rem', background: 'rgba(0,0,0,0.2)' }}>
                                        <div style={{
                                            marginBottom: '1rem', textAlign: 'center',
                                            color: getSplitTotal() === grandTotal ? 'var(--success)' : '#f87171',
                                            fontWeight: 600, fontSize: '0.95rem'
                                        }}>
                                            {getSplitTotal() === grandTotal ? 'Total Matched! Ready to Pay.' : `Remaining: ₹${grandTotal - getSplitTotal()}`}
                                        </div>
                                        {['Cash', 'Card', 'UPI'].map(m => (
                                            <div key={m} style={{ display: 'flex', alignItems: 'center', marginBottom: '0.75rem', gap: '1rem' }}>
                                                <span style={{ width: '50px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{m}</span>
                                                <input
                                                    type="number"
                                                    value={splitDetails[m]}
                                                    onChange={e => handleSplitChange(m, e.target.value)}
                                                    style={{
                                                        flex: 1, padding: '0.75rem', borderRadius: '0.75rem', border: '1px solid rgba(255,255,255,0.1)',
                                                        background: 'rgba(0,0,0,0.2)', color: 'white', outline: 'none'
                                                    }}
                                                    onFocus={e => e.target.style.borderColor = 'var(--primary)'}
                                                    onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <button
                                onClick={handlePlaceOrder}
                                className="btn-primary"
                                disabled={loading}
                                style={{
                                    width: '100%', padding: '1.2rem', fontSize: '1.1rem',
                                    opacity: loading ? 0.7 : 1, cursor: loading ? 'not-allowed' : 'pointer',
                                    background: 'var(--primary-gradient)'
                                }}
                            >
                                {loading ? 'Processing...' : 'Confirm & Pay'}
                            </button>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};

export default CheckoutModal;
