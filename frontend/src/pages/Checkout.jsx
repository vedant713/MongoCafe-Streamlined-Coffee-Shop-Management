import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { ArrowLeft, CreditCard, Banknote, Smartphone, Split, CheckCircle, MapPin, User, ShieldCheck } from 'lucide-react';

const Checkout = () => {
    const { cart, getCartTotal, clearCart } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();

    const [step, setStep] = useState('payment'); // payment, success
    const [subtotal] = useState(getCartTotal());
    const [tax] = useState(Math.round(getCartTotal() * 0.05));
    const [grandTotal] = useState(getCartTotal() + Math.round(getCartTotal() * 0.05));

    const [paymentMethod, setPaymentMethod] = useState('Cash');
    const [customerName, setCustomerName] = useState(user?.username || '');
    const [deliveryAddress, setDeliveryAddress] = useState('');
    const [splitDetails, setSplitDetails] = useState({ Cash: 0, Card: 0, UPI: 0 });
    const [orderId, setOrderId] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (cart.length === 0 && step !== 'success') {
            navigate('/menu');
        }
    }, [cart, step, navigate]);

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
        if (!customerName.trim()) {
            alert("Please enter customer name");
            return;
        }

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
            customer_name: customerName,
            // delivery_address: deliveryAddress // Backend might not support this yet, but good for UI
        };

        setLoading(true);
        try {
            const res = await axios.post('http://localhost:8000/api/orders', orderData);
            if (res.data.status === 'success') {
                setOrderId(res.data.order_id);
                setStep('success');
                clearCart();
            }
        } catch (err) {
            console.error(err);
            const msg = err.response?.data?.detail || 'Order failed. Please try again.';
            alert(msg);
        } finally {
            setLoading(false);
        }
    };

    // Helper for images
    const getImage = (item) => {
        if (item.image_url) return item.image_url;
        return '/images/latte.png';
    };

    if (step === 'success') {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', background: 'radial-gradient(circle at top right, #1e1b4b, #0f172a)' }}>
                <div className="glass" style={{
                    padding: '3rem', borderRadius: '2rem', width: '100%', maxWidth: '500px', textAlign: 'center',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
                }}>
                    <div style={{
                        margin: '0 auto 2rem', width: '100px', height: '100px', borderRadius: '50%',
                        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: '0 0 40px rgba(16, 185, 129, 0.5)'
                    }}>
                        <CheckCircle size={56} color="white" />
                    </div>
                    <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.5rem', background: 'linear-gradient(to right, #fff, #a7f3d0)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Order Confirmed!</h2>
                    <p style={{ fontSize: '1.2rem', margin: '0.5rem 0 2rem', color: 'var(--text)' }}>Order ID: <span style={{ fontFamily: 'monospace', background: 'rgba(255,255,255,0.1)', padding: '0.3rem 0.6rem', borderRadius: '0.5rem', border: '1px solid rgba(255,255,255,0.1)' }}>#{orderId}</span></p>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', marginBottom: '3rem', lineHeight: 1.6 }}>
                        Thank you for your purchase.<br />
                        Your order is being prepared with ❤️
                    </p>

                    <button
                        onClick={() => navigate('/menu')}
                        className="btn-primary"
                        style={{ width: '100%', padding: '1.2rem', fontSize: '1.1rem', background: 'var(--primary-gradient)' }}
                    >
                        Return to Menu
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div style={{ minHeight: '100vh', padding: '2rem', maxWidth: '1200px', margin: '0 auto', paddingBottom: '100px' }}>
            {/* Header */}
            <header style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <button
                    onClick={() => navigate('/menu')}
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', cursor: 'pointer' }}
                >
                    <ArrowLeft size={20} />
                </button>
                <h1 style={{ fontSize: '2rem', fontWeight: 800, margin: 0 }}>Checkout</h1>
                <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--success)', background: 'rgba(34, 197, 94, 0.1)', padding: '0.5rem 1rem', borderRadius: '2rem', border: '1px solid rgba(34, 197, 94, 0.2)' }}>
                    <ShieldCheck size={18} />
                    <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>Secure Checkout</span>
                </div>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '3rem' }}>
                {/* LEFT COLUMN - FORMS */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

                    {/* Customer Details */}
                    <div className="glass" style={{ padding: '2rem', borderRadius: '1.5rem', border: '1px solid var(--glass-border)' }}>
                        <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <div style={{ background: 'var(--primary)', width: '30px', height: '30px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem', fontWeight: 'bold' }}>1</div>
                            Customer Details
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Full Name</label>
                                <div style={{ position: 'relative' }}>
                                    <User size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                                    <input
                                        type="text"
                                        value={customerName}
                                        onChange={e => setCustomerName(e.target.value)}
                                        placeholder="Enter your name"
                                        style={{ width: '100%', padding: '1rem 1rem 1rem 3rem', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '1rem', color: 'white', outline: 'none' }}
                                    />
                                </div>
                            </div>
                            {/* Address Field (Optional/Mockup for now) */}
                            {/* 
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Delivery Address</label>
                                <div style={{ position: 'relative' }}>
                                    <MapPin size={18} style={{ position: 'absolute', left: '1rem', top: '1rem', color: 'var(--text-secondary)' }} />
                                    <textarea 
                                        value={deliveryAddress}
                                        onChange={e => setDeliveryAddress(e.target.value)}
                                        placeholder="Enter delivery address (Optional)"
                                        style={{ width: '100%', padding: '1rem 1rem 1rem 3rem', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '1rem', color: 'white', outline: 'none', minHeight: '100px', resize: 'vertical' }}
                                    />
                                </div>
                            </div>
                             */}
                        </div>
                    </div>

                    {/* Payment Method */}
                    <div className="glass" style={{ padding: '2rem', borderRadius: '1.5rem', border: '1px solid var(--glass-border)' }}>
                        <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <div style={{ background: 'var(--primary)', width: '30px', height: '30px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem', fontWeight: 'bold' }}>2</div>
                            Payment Method
                        </h3>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
                            {['Cash', 'Card', 'UPI', 'Split'].map(method => (
                                <button
                                    key={method}
                                    onClick={() => setPaymentMethod(method)}
                                    style={{
                                        padding: '1.5rem 1rem', borderRadius: '1rem',
                                        border: '1px solid ' + (paymentMethod === method ? 'var(--primary)' : 'rgba(255,255,255,0.05)'),
                                        background: paymentMethod === method ? 'rgba(139, 92, 246, 0.15)' : 'rgba(255,255,255,0.03)',
                                        color: paymentMethod === method ? 'white' : 'var(--text-secondary)',
                                        cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.8rem',
                                        fontSize: '1rem', fontWeight: 600, transition: 'all 0.2s',
                                        boxShadow: paymentMethod === method ? '0 4px 20px rgba(139, 92, 246, 0.2)' : 'none'
                                    }}
                                >
                                    {method === 'Cash' && <Banknote size={28} />}
                                    {method === 'Card' && <CreditCard size={28} />}
                                    {method === 'UPI' && <Smartphone size={28} />}
                                    {method === 'Split' && <Split size={28} />}
                                    {method}
                                </button>
                            ))}
                        </div>

                        {paymentMethod === 'Split' && (
                            <div style={{ padding: '1.5rem', borderRadius: '1rem', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.05)' }}>
                                <div style={{
                                    marginBottom: '1rem', textAlign: 'center',
                                    color: getSplitTotal() === grandTotal ? 'var(--success)' : '#f87171',
                                    fontWeight: 600, fontSize: '1rem'
                                }}>
                                    {getSplitTotal() === grandTotal ? 'Total Matched! Ready to Pay.' : `Remaining: ₹${grandTotal - getSplitTotal()}`}
                                </div>
                                {['Cash', 'Card', 'UPI'].map(m => (
                                    <div key={m} style={{ display: 'flex', alignItems: 'center', marginBottom: '0.75rem', gap: '1rem' }}>
                                        <span style={{ width: '60px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{m}</span>
                                        <input
                                            type="number"
                                            value={splitDetails[m]}
                                            onChange={e => handleSplitChange(m, e.target.value)}
                                            style={{
                                                flex: 1, padding: '0.8rem', borderRadius: '0.8rem', border: '1px solid rgba(255,255,255,0.1)',
                                                background: 'rgba(0,0,0,0.2)', color: 'white', outline: 'none'
                                            }}
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* RIGHT COLUMN - SUMMARY */}
                <div style={{ position: 'sticky', top: '2rem', height: 'fit-content' }}>
                    <div className="glass" style={{ padding: '2rem', borderRadius: '1.5rem', border: '1px solid var(--glass-border)' }}>
                        <h3 style={{ fontSize: '1.5rem', margin: '0 0 1.5rem', fontWeight: 700 }}>Order Summary</h3>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem', maxHeight: '300px', overflowY: 'auto' }}>
                            {cart.map((item, idx) => (
                                <div key={idx} style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                    <img src={getImage(item)} alt={item.name} style={{ width: '50px', height: '50px', borderRadius: '0.5rem', objectFit: 'cover' }} />
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontSize: '0.95rem', fontWeight: 600 }}>{item.name}</div>
                                        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Qty: {item.quantity}</div>
                                    </div>
                                    <div style={{ fontWeight: 600 }}>₹{item.price * item.quantity}</div>
                                </div>
                            ))}
                        </div>

                        <div style={{ borderTop: '1px dashed rgba(255,255,255,0.1)', paddingTop: '1.5rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', color: 'var(--text-secondary)' }}>
                                <span>Subtotal</span>
                                <span>₹{subtotal}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>
                                <span>Tax (5% GST)</span>
                                <span>₹{tax}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary)' }}>
                                <span>Total</span>
                                <span>₹{grandTotal}</span>
                            </div>
                        </div>

                        <button
                            onClick={handlePlaceOrder}
                            disabled={loading}
                            className="btn-primary"
                            style={{
                                width: '100%', marginTop: '2rem', padding: '1.2rem',
                                background: 'var(--primary-gradient)', fontSize: '1.1rem', fontWeight: 700,
                                boxShadow: '0 10px 30px -10px rgba(139, 92, 246, 0.5)'
                            }}
                        >
                            {loading ? 'Processing...' : 'Place Order'}
                        </button>

                        <p style={{ textAlign: 'center', marginTop: '1rem', color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                            By placing an order, you agree to our Terms of Service.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
