import { X, ShoppingCart, Trash2, Plus, Minus } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

const CartDrawer = () => {
    const {
        cart, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity, getCartTotal
    } = useCart();

    const navigate = useNavigate();

    // Helper to get image (shared logic)
    const getImage = (item) => {
        if (item.image_url) return item.image_url;
        return '/images/latte.png';
    };

    if (!isCartOpen) return null;

    return (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', justifyContent: 'flex-end' }}>
            {/* Backdrop */}
            <div
                onClick={() => setIsCartOpen(false)}
                style={{
                    position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
                    animation: 'fadeIn 0.2s ease-out'
                }}
            />

            {/* Drawer */}
            <div className="glass" style={{
                width: '400px', maxWidth: '85vw', height: '100%', position: 'relative',
                borderLeft: '1px solid var(--glass-border)',
                display: 'flex', flexDirection: 'column',
                animation: 'slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                background: 'rgba(15, 23, 42, 0.95)'
            }}>
                <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <ShoppingCart size={24} color="var(--primary)" />
                        <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 700 }}>Your Cart</h2>
                    </div>
                    <button
                        onClick={() => setIsCartOpen(false)}
                        style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: '0.5rem' }}
                    >
                        <X size={24} />
                    </button>
                </div>

                <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem' }}>
                    {cart.length === 0 ? (
                        <div style={{ textAlign: 'center', marginTop: '4rem', color: 'var(--text-secondary)' }}>
                            <ShoppingCart size={48} style={{ opacity: 0.3, marginBottom: '1rem' }} />
                            <p>Your cart is empty.</p>
                            <button
                                onClick={() => setIsCartOpen(false)}
                                className="btn-secondary"
                                style={{ marginTop: '1rem', padding: '0.8rem 1.5rem' }}
                            >
                                Start Shopping
                            </button>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {cart.map((item) => (
                                <div key={item._id} style={{
                                    display: 'flex', gap: '1rem', padding: '1rem', borderRadius: '1rem',
                                    background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)'
                                }}>
                                    <div style={{ width: '70px', height: '70px', borderRadius: '0.8rem', overflow: 'hidden', flexShrink: 0 }}>
                                        <img src={getImage(item)} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                                            <h4 style={{ margin: 0, fontWeight: 600 }}>{item.name}</h4>
                                            <button
                                                onClick={() => removeFromCart(item._id)}
                                                style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', opacity: 0.7 }}
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                        <p style={{ margin: '0 0 0.5rem', color: 'var(--primary)', fontWeight: 700 }}>₹{item.price}</p>

                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'rgba(0,0,0,0.3)', width: 'fit-content', padding: '0.2rem 0.6rem', borderRadius: '0.6rem' }}>
                                            <button
                                                onClick={() => updateQuantity(item._id, -1)}
                                                style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', display: 'flex' }}
                                            >
                                                <Minus size={14} />
                                            </button>
                                            <span style={{ fontSize: '0.9rem', fontWeight: 600, minWidth: '1.2rem', textAlign: 'center' }}>{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item._id, 1)}
                                                style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', display: 'flex' }}
                                            >
                                                <Plus size={14} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {cart.length > 0 && (
                    <div style={{ padding: '1.5rem', borderTop: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.2)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', fontSize: '1.2rem', fontWeight: 700 }}>
                            <span>Subtotal</span>
                            <span>₹{getCartTotal()}</span>
                        </div>
                        <button
                            onClick={() => {
                                setIsCartOpen(false);
                                navigate('/checkout');
                            }}
                            className="btn-primary"
                            style={{
                                width: '100%', padding: '1rem', fontSize: '1.1rem',
                                background: 'var(--primary-gradient)', fontWeight: 700,
                                boxShadow: '0 4px 15px rgba(139, 92, 246, 0.4)'
                            }}
                        >
                            Proceed to Checkout
                        </button>
                    </div>
                )}
            </div>
            <style>{`
                @keyframes slideInRight {
                    from { transform: translateX(100%); }
                    to { transform: translateX(0); }
                }
            `}</style>
        </div>
    );
};

export default CartDrawer;
