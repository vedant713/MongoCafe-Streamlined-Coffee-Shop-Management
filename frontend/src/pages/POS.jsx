import { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, ShoppingCart, Plus, Minus, Trash2, CreditCard, Banknote, Coffee, User } from 'lucide-react';
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
        <div style={{ display: 'flex', height: '85vh', gap: '1.5rem', overflow: 'hidden' }}>
            {/* LEFT: Product Selection */}
            <div className="glass" style={{ flex: 2, padding: '1.5rem', borderRadius: '1.5rem', display: 'flex', flexDirection: 'column' }}>
                {/* Header & Filter */}
                <div style={{ marginBottom: '1.5rem' }}>
                    <div style={{ display: 'flex', gap: '1rem', overflowX: 'auto', marginBottom: '1rem', paddingBottom: '0.5rem' }}>
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setCategory(cat)}
                                style={{
                                    padding: '0.6rem 1.2rem', borderRadius: '2rem',
                                    background: category === cat ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
                                    color: category === cat ? 'white' : 'var(--text-secondary)',
                                    border: '1px solid ' + (category === cat ? 'var(--primary)' : 'rgba(255,255,255,0.1)'),
                                    cursor: 'pointer'
                                }}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                    <div style={{ position: 'relative' }}>
                        <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                        <input
                            type="text"
                            placeholder="Search menu..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            style={{
                                width: '100%', padding: '0.8rem 1rem 0.8rem 2.8rem', borderRadius: '0.8rem',
                                border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.2)', color: 'white', outline: 'none'
                            }}
                        />
                    </div>
                </div>

                {/* Grid */}
                <div style={{ flex: 1, overflowY: 'auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '1rem', paddingRight: '0.5rem' }}>
                    {filteredProducts.map(p => (
                        <div
                            key={p._id}
                            onClick={() => addToCart(p)}
                            style={{
                                background: 'rgba(255,255,255,0.05)', borderRadius: '1rem', overflow: 'hidden', cursor: 'pointer',
                                transition: 'transform 0.2s', border: '1px solid rgba(255,255,255,0.05)'
                            }}
                            onMouseOver={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                            onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
                        >
                            <div style={{ height: '120px', width: '100%' }}>
                                <img src={getImage(p)} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            </div>
                            <div style={{ padding: '0.8rem', textAlign: 'center' }}>
                                <div style={{ fontSize: '1rem', fontWeight: 'bold', marginBottom: '0.2rem' }}>{p.name}</div>
                                <div style={{ color: 'var(--primary)', fontWeight: 'bold' }}>₹{p.price}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* RIGHT: Cart / Ticket */}
            <div className="glass" style={{ flex: 1, padding: '1.5rem', borderRadius: '1.5rem', display: 'flex', flexDirection: 'column' }}>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <ShoppingCart size={24} /> Current Order
                </h2>

                {/* Customer Info */}
                <div style={{ marginBottom: '1rem', position: 'relative' }}>
                    <User size={16} style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                    <input
                        type="text"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        style={{
                            width: '100%', padding: '0.8rem 1rem 0.8rem 2.5rem', background: 'rgba(255,255,255,0.05)',
                            border: 'none', borderRadius: '0.5rem', color: 'white'
                        }}
                    />
                </div>

                {/* Cart Items */}
                <div style={{ flex: 1, overflowY: 'auto', marginBottom: '1rem' }}>
                    {cart.length === 0 ? (
                        <div style={{ textAlign: 'center', color: 'var(--text-secondary)', marginTop: '2rem' }}>
                            <Coffee size={40} style={{ opacity: 0.5, marginBottom: '1rem' }} />
                            <p>No items added yet</p>
                        </div>
                    ) : cart.map((item, idx) => (
                        <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', background: 'rgba(255,255,255,0.02)', padding: '0.8rem', borderRadius: '0.8rem' }}>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontWeight: 'bold' }}>{item.name}</div>
                                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>₹{item.price} x {item.quantity}</div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <button onClick={() => updateQuantity(item.name, -1)} style={{ padding: '0.2rem', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', color: 'white', border: 'none', cursor: 'pointer' }}><Minus size={14} /></button>
                                <span>{item.quantity}</span>
                                <button onClick={() => updateQuantity(item.name, 1)} style={{ padding: '0.2rem', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', color: 'white', border: 'none', cursor: 'pointer' }}><Plus size={14} /></button>
                                <button onClick={() => removeFromCart(item.name)} style={{ padding: '0.4rem', borderRadius: '0.5rem', background: 'rgba(255,50,50,0.1)', color: '#ff6b6b', border: 'none', cursor: 'pointer', marginLeft: '0.5rem' }}><Trash2 size={16} /></button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Total & Checkout */}
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', fontSize: '1.2rem', fontWeight: 'bold' }}>
                        <span>Subtotal</span>
                        <span>₹{calculateTotal()}</span>
                    </div>

                    <button
                        onClick={handleCheckoutClick}
                        style={{
                            width: '100%', padding: '1rem', borderRadius: '1rem', background: 'var(--primary)',
                            color: 'white', border: 'none', fontSize: '1.2rem', fontWeight: 'bold', cursor: 'pointer',
                            boxShadow: '0 4px 15px rgba(212, 165, 116, 0.4)'
                        }}
                    >
                        Checkout
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
