import { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, ShoppingCart, Plus, Minus, Trash2, CreditCard, Banknote, Coffee, User, ArrowRight } from 'lucide-react';
import CheckoutModal from '../components/CheckoutModal';

const POS = () => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('All');
    const [cart, setCart] = useState([]);
    const [customerName, setCustomerName] = useState('Walk-in');
    const [showCheckout, setShowCheckout] = useState(false);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const res = await axios.get('http://localhost:8000/api/products');
            setProducts(res.data);
            setFilteredProducts(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        let result = products;
        if (category !== 'All') {
            const lowerCat = category.toLowerCase();
            if (category === 'Hot Coffee') result = result.filter(p => !p.name.toLowerCase().includes('ice') && !p.name.toLowerCase().includes('croissant') && !p.name.toLowerCase().includes('muffin'));
            if (category === 'Cold Coffee') result = result.filter(p => p.name.toLowerCase().includes('ice'));
            if (category === 'Snacks') result = result.filter(p => p.name.toLowerCase().includes('croissant') || p.name.toLowerCase().includes('muffin'));
        }
        if (search) {
            result = result.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
        }
        setFilteredProducts(result);
    }, [search, category, products]);

    const addToCart = (product) => {
        const existing = cart.find(item => item.name === product.name);
        if (existing) {
            setCart(cart.map(item => item.name === product.name ? { ...item, quantity: item.quantity + 1 } : item));
        } else {
            setCart([...cart, { ...product, quantity: 1 }]);
        }
    };

    const removeFromCart = (name) => {
        setCart(cart.filter(item => item.name !== name));
    };

    const updateQuantity = (name, delta) => {
        setCart(cart.map(item => {
            if (item.name === name) {
                const newQty = item.quantity + delta;
                return newQty > 0 ? { ...item, quantity: newQty } : item;
            }
            return item;
        }));
    };

    const calculateTotal = () => {
        return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    };

    const handleCheckoutClick = () => {
        if (cart.length === 0) return alert("Cart is empty!");
        setShowCheckout(true);
    };

    const getImage = (product) => {
        if (product.image_url) return product.image_url;
        return '/images/latte.png';
    };

    const categories = ['All', 'Hot Coffee', 'Cold Coffee', 'Snacks'];

    return (
        <div style={{ display: 'flex', height: 'calc(100vh - 4rem)', gap: '1.5rem', overflow: 'hidden', fontFamily: 'var(--font-family)' }}>
            {/* LEFT: Product Selection */}
            <div className="glass" style={{
                flex: 2, padding: '1.5rem', borderRadius: '1.5rem', display: 'flex', flexDirection: 'column',
                border: '1px solid var(--glass-border)', boxShadow: 'var(--glass-shadow)',
                background: 'rgba(15, 23, 42, 0.6)'
            }}>
                {/* Header & Filter */}
                <div style={{ marginBottom: '1.5rem' }}>
                    <div style={{ display: 'flex', gap: '0.75rem', overflowX: 'auto', marginBottom: '1.25rem', paddingBottom: '0.5rem', scrollbarWidth: 'none' }}>
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setCategory(cat)}
                                style={{
                                    padding: '0.6rem 1.25rem', borderRadius: '1rem',
                                    background: category === cat ? 'var(--primary-gradient)' : 'rgba(255,255,255,0.05)',
                                    color: category === cat ? 'white' : 'var(--text-secondary)',
                                    border: '1px solid ' + (category === cat ? 'transparent' : 'rgba(255,255,255,0.1)'),
                                    cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 0.2s',
                                    fontWeight: category === cat ? 600 : 500, fontSize: '0.95rem',
                                    boxShadow: category === cat ? '0 4px 12px rgba(139, 92, 246, 0.3)' : 'none'
                                }}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                    <div style={{ position: 'relative' }}>
                        <Search size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                        <input
                            type="text"
                            placeholder="Search menu..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            style={{
                                width: '100%', padding: '1rem 1rem 1rem 3rem', borderRadius: '1rem',
                                border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.2)',
                                color: 'white', outline: 'none', fontSize: '1rem', transition: 'all 0.2s'
                            }}
                            onFocus={e => e.target.style.borderColor = 'var(--primary)'}
                            onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                        />
                    </div>
                </div>

                {/* Grid */}
                <div style={{
                    flex: 1, overflowY: 'auto', display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
                    gap: '1.25rem', paddingRight: '0.5rem', alignContent: 'start'
                }}>
                    {filteredProducts.map(p => (
                        <div
                            key={p._id}
                            onClick={() => addToCart(p)}
                            style={{
                                background: 'rgba(255,255,255,0.03)', borderRadius: '1.25rem', overflow: 'hidden', cursor: 'pointer',
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', border: '1px solid rgba(255,255,255,0.05)',
                                position: 'relative', display: 'flex', flexDirection: 'column'
                            }}
                            onMouseEnter={e => {
                                e.currentTarget.style.transform = 'translateY(-4px)';
                                e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
                                e.currentTarget.style.boxShadow = '0 10px 20px -5px rgba(0,0,0,0.3)';
                                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                                e.currentTarget.style.boxShadow = 'none';
                                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)';
                            }}
                        >
                            <div style={{ height: '140px', width: '100%', position: 'relative' }}>
                                <img src={getImage(p)} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                <div style={{
                                    position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.6), transparent)',
                                    display: 'flex', alignItems: 'flex-end', padding: '0.75rem'
                                }}>
                                    <div style={{
                                        background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(4px)', padding: '0.25rem 0.6rem',
                                        borderRadius: '0.5rem', fontSize: '0.85rem', fontWeight: 600, color: 'white',
                                        border: '1px solid rgba(255,255,255,0.2)'
                                    }}>
                                        ₹{p.price}
                                    </div>
                                </div>
                            </div>
                            <div style={{ padding: '1rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                <div style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text)', marginBottom: '0.25rem', lineHeight: 1.3 }}>{p.name}</div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{p.category || 'Item'}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* RIGHT: Cart / Ticket */}
            <div className="glass" style={{
                flex: 1, maxWidth: '400px', padding: '1.5rem', borderRadius: '1.5rem', display: 'flex', flexDirection: 'column',
                border: '1px solid var(--glass-border)', boxShadow: 'var(--glass-shadow)',
                background: 'rgba(15, 23, 42, 0.8)'
            }}>
                <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: 700, color: 'white' }}>
                    <div style={{ background: 'var(--primary)', padding: '0.5rem', borderRadius: '0.5rem', display: 'flex' }}><ShoppingCart size={20} color="white" /></div>
                    Current Order
                </h2>

                {/* Customer Info */}
                <div style={{ marginBottom: '1.25rem', position: 'relative' }}>
                    <User size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                    <input
                        type="text"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="Customer Name"
                        style={{
                            width: '100%', padding: '0.9rem 1rem 0.9rem 3rem', background: 'rgba(0,0,0,0.2)',
                            border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.75rem', color: 'white', fontSize: '0.95rem'
                        }}
                    />
                </div>

                {/* Cart Items */}
                <div style={{ flex: 1, overflowY: 'auto', marginBottom: '1rem', paddingRight: '0.5rem' }}>
                    {cart.length === 0 ? (
                        <div style={{
                            textAlign: 'center', color: 'var(--text-secondary)', marginTop: '4rem', display: 'flex',
                            flexDirection: 'column', alignItems: 'center', gap: '1rem', opacity: 0.6
                        }}>
                            <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Coffee size={32} />
                            </div>
                            <p style={{ fontSize: '1rem' }}>No items added yet</p>
                        </div>
                    ) : cart.map((item, idx) => (
                        <div key={idx} style={{
                            display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem',
                            background: 'rgba(255,255,255,0.03)', padding: '0.75rem 1rem', borderRadius: '0.75rem',
                            border: '1px solid rgba(255,255,255,0.05)'
                        }}>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontWeight: 600, fontSize: '0.95rem', marginBottom: '0.2rem' }}>{item.name}</div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>₹{item.price} x {item.quantity}</div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'rgba(0,0,0,0.2)', padding: '0.25rem', borderRadius: '0.5rem' }}>
                                <button onClick={() => updateQuantity(item.name, -1)} style={{ padding: '0.25rem', borderRadius: '0.25rem', background: 'transparent', color: 'white', border: 'none', cursor: 'pointer', display: 'flex' }}><Minus size={14} /></button>
                                <span style={{ fontSize: '0.9rem', fontWeight: 600, minWidth: '1.2rem', textAlign: 'center' }}>{item.quantity}</span>
                                <button onClick={() => updateQuantity(item.name, 1)} style={{ padding: '0.25rem', borderRadius: '0.25rem', background: 'transparent', color: 'white', border: 'none', cursor: 'pointer', display: 'flex' }}><Plus size={14} /></button>
                            </div>
                            <button onClick={() => removeFromCart(item.name)} style={{ padding: '0.4rem', borderRadius: '0.5rem', color: '#ff6b6b', border: 'none', cursor: 'pointer', marginLeft: '0.75rem', background: 'rgba(255,50,50,0.1)', display: 'flex' }}><Trash2 size={16} /></button>
                        </div>
                    ))}
                </div>

                {/* Total & Checkout */}
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1.25rem', background: 'rgba(0,0,0,0.2)', margin: '-1.5rem', marginTop: 0, padding: '1.5rem', borderRadius: '0 0 1.5rem 1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
                        <span>Subtotal</span>
                        <span>₹{calculateTotal()}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.25rem', fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary)' }}>
                        <span>Total</span>
                        <span>₹{calculateTotal()}</span>
                    </div>

                    <button
                        onClick={handleCheckoutClick}
                        style={{
                            width: '100%', padding: '1rem', borderRadius: '1rem', background: 'var(--primary-gradient)',
                            color: 'white', border: 'none', fontSize: '1.1rem', fontWeight: 600, cursor: 'pointer',
                            boxShadow: '0 4px 15px rgba(139, 92, 246, 0.3)', transition: 'all 0.2s',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem'
                        }}
                        onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                        onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                    >
                        Proceed to Checkout <ArrowRight size={18} />
                    </button>
                </div>
            </div>

            {showCheckout && (
                <CheckoutModal
                    cart={cart}
                    total={calculateTotal()}
                    onClose={() => setShowCheckout(false)}
                    onOrderComplete={() => {
                        setCart([]);
                        setShowCheckout(false);
                    }}
                />
            )}
        </div>
    );
};

export default POS;
