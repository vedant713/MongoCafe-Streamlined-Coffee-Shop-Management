import { useState, useEffect } from 'react';
import { X, CreditCard, Banknote, Smartphone, Split, Printer, CheckCircle } from 'lucide-react';
import axios from 'axios';

const CheckoutModal = ({ cart, total, onClose, onOrderComplete }) => {
    const [step, setStep] = useState('summary'); // summary, payment, success
    const [subtotal] = useState(total);
    const [tax] = useState(Math.round(total * 0.05)); // 5% GST
    const [grandTotal] = useState(total + Math.round(total * 0.05));

    const [paymentMethod, setPaymentMethod] = useState('Cash');
    const [customerName, setCustomerName] = useState('Walk-in');
    const [splitDetails, setSplitDetails] = useState({ Cash: 0, Card: 0, UPI: 0 });
    const [orderId, setOrderId] = useState(null);

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

        try {
            const res = await axios.post('http://localhost:8000/api/orders', orderData);
            if (res.data.status === 'success') {
                setOrderId(res.data.order_id);
                setStep('success');
                onOrderComplete();
            }
        } catch (err) {
            alert('Order failed');
            console.error(err);
        }
    };

    const handlePrint = () => {
        window.print();
    };

    if (step === 'success') {
        return (
            <div className="modal-overlay">
                <div className="glass" style={{ padding: '2rem', borderRadius: '1.5rem', width: '400px', textAlign: 'center' }}>
                    <div style={{ margin: '0 auto 1.5rem', width: '80px', height: '80px', borderRadius: '50%', background: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <CheckCircle size={40} color="white" />
                    </div>
                    <h2>Order Confirmed!</h2>
                    <p style={{ fontSize: '1.2rem', margin: '1rem 0' }}>Order ID: #{orderId}</p>

                    <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                        <button onClick={handlePrint} className="btn-secondary" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                            <Printer size={18} /> Print Receipt
                        </button>
                        <button onClick={onClose} className="btn-primary" style={{ flex: 1 }}>
                            New Order
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="modal-overlay">
            <div className="glass" style={{ padding: '2rem', borderRadius: '1.5rem', width: '500px', maxHeight: '90vh', overflowY: 'auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h2>Checkout</h2>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}><X /></button>
                </div>

                {/* Bill Summary */}
                <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '1rem', marginBottom: '1.5rem' }}>
                    {cart.map((item, idx) => (
                        <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                            <span>{item.name} x {item.quantity}</span>
                            <span>${item.price * item.quantity}</span>
                        </div>
                    ))}
                    <hr style={{ borderColor: 'rgba(255,255,255,0.1)', margin: '1rem 0' }} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <span>Subtotal</span>
                        <span>${subtotal}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <span>Tax (5% GST)</span>
                        <span>${tax}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--primary)', marginTop: '0.5rem' }}>
                        <span>Grand Total</span>
                        <span>${grandTotal}</span>
                    </div>
                </div>

                {/* Customer Info */}
                <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Customer Name</label>
                    <input
                        type="text"
                        value={customerName}
                        onChange={e => setCustomerName(e.target.value)}
                        style={{ width: '100%', padding: '0.8rem', borderRadius: '0.5rem', background: 'rgba(255,255,255,0.05)', border: 'none', color: 'white' }}
                    />
                </div>

                {/* Payment Method */}
                <div style={{ marginBottom: '2rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Payment Method</label>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                        {['Cash', 'Card', 'UPI', 'Split'].map(method => (
                            <button
                                key={method}
                                onClick={() => setPaymentMethod(method)}
                                style={{
                                    padding: '1rem', borderRadius: '0.8rem',
                                    border: '1px solid ' + (paymentMethod === method ? 'var(--primary)' : 'rgba(255,255,255,0.1)'),
                                    background: paymentMethod === method ? 'rgba(212, 165, 116, 0.2)' : 'transparent',
                                    color: 'white', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem'
                                }}
                            >
                                {method === 'Cash' && <Banknote />}
                                {method === 'Card' && <CreditCard />}
                                {method === 'UPI' && <Smartphone />}
                                {method === 'Split' && <Split />}
                                {method}
                            </button>
                        ))}
                    </div>

                    {/* Split Logic */}
                    {paymentMethod === 'Split' && (
                        <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '0.8rem' }}>
                            <div style={{
                                marginBottom: '1rem', textAlign: 'center',
                                color: getSplitTotal() === grandTotal ? 'var(--success)' : '#ff6b6b'
                            }}>
                                Remaining: ${grandTotal - getSplitTotal()}
                            </div>
                            {['Cash', 'Card', 'UPI'].map(m => (
                                <div key={m} style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
                                    <span style={{ width: '60px' }}>{m}</span>
                                    <input
                                        type="number"
                                        value={splitDetails[m]}
                                        onChange={e => handleSplitChange(m, e.target.value)}
                                        style={{ flex: 1, padding: '0.5rem', borderRadius: '0.3rem', border: 'none', width: '100px' }}
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <button
                    onClick={handlePlaceOrder}
                    className="btn-primary"
                    style={{ width: '100%', padding: '1rem', fontSize: '1.1rem' }}
                >
                    Confirm & Pay ${grandTotal}
                </button>
            </div>
        </div>
    );
};

export default CheckoutModal;
