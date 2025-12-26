import { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Check, Edit2, ShoppingCart, Plus, Minus, X, Upload } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import CheckoutModal from '../components/CheckoutModal';

const Menu = () => {
    const { user } = useAuth();
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('All');
    const [loading, setLoading] = useState(true);
    const [editPrice, setEditPrice] = useState({});
    const [editingId, setEditingId] = useState(null);

    // Cart State
    const [cart, setCart] = useState([]);
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

    // Order History State
    const [showHistory, setShowHistory] = useState(false);
    const [orderHistory, setOrderHistory] = useState([]);
    const [historyLoading, setHistoryLoading] = useState(false);

    // Add Item State
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [newItem, setNewItem] = useState({ name: '', price: '', category: 'Snacks', image: null });
    const [uploading, setUploading] = useState(false);

    const fetchHistory = async () => {
        setHistoryLoading(true);
        try {
            const res = await axios.get('http://localhost:8000/api/orders');
            setOrderHistory(res.data);
        } catch (err) {
            console.error("Failed to fetch history", err);
        } finally {
            setHistoryLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    useEffect(() => {
        let result = products;

        if (category !== 'All') {
            if (category === 'Hot Coffee') result = result.filter(p => isHotCoffee(p.name));
            if (category === 'Cold Coffee') result = result.filter(p => isColdCoffee(p.name));
            if (category === 'Snacks') result = result.filter(p => isSnack(p.name));
        }

        if (search) {
            result = result.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
        }

        setFilteredProducts(result);
    }, [search, category, products]);

    const isHotCoffee = (name) => {
        const n = name.toLowerCase();
        return n.includes('espresso') || n.includes('latte') || n.includes('cappuccino') || n.includes('mocha') || n.includes('americano') || n.includes('chai') || n.includes('coffee');
    };

    const isColdCoffee = (name) => {
        const n = name.toLowerCase();
        return n.includes('ice') || n.includes('frappe') || n.includes('cold') || n.includes('cool');
    };

    const isSnack = (name) => {
        return !isHotCoffee(name) && !isColdCoffee(name);
    }

    const fetchProducts = async () => {
        try {
            const res = await axios.get('http://localhost:8000/api/products');
            setProducts(res.data);
            setFilteredProducts(res.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    const handleUpdatePrice = async (name) => {
        const newPrice = editPrice[name];
        if (!newPrice) return;

        try {
            await axios.put(`http://localhost:8000/api/products/${name}`, { name, price: parseInt(newPrice) });
            fetchProducts();
            setEditPrice({ ...editPrice, [name]: '' });
            setEditingId(null);
        } catch (err) {
            alert('Error updating price');
        }
    };

    const addToCart = (product) => {
        setCart(prev => {
            const existing = prev.find(item => item._id === product._id);
            if (existing) {
                return prev.map(item => item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item);
            }
            return [...prev, { ...product, quantity: 1 }];
        });
    };

    const removeFromCart = (productId) => {
        setCart(prev => prev.filter(item => item._id !== productId));
    };

    const getCartTotal = () => {
        return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    const handleOrderComplete = () => {
        setCart([]);
        // Keep modal open on success step or close it? 
        // usually CheckoutModal handles showing success. 
        // We'll reset cart when fully closed or rely on modal's internal state.
        // Actually CheckoutModal calls onOrderComplete when order is placed.
    };

    const getImage = (product) => {
        if (product.image_url) return product.image_url;
        const name = product.name.toLowerCase();
        if (name.includes('espresso')) return '/images/espresso.png';
        if (name.includes('latte')) return '/images/latte.png';
        if (name.includes('cappuccino') || name.includes('capuccino')) return '/images/cappuccino.png';
        if (name.includes('muffin') || name.includes('croissant') || name.includes('cake') || name.includes('cookie') || name.includes('donut') || name.includes('bagel')) return '/images/snack.png';
        return '/images/latte.png'; // Default
    };

    const handleAddItem = async (e) => {
        e.preventDefault();
        setUploading(true);

        const formData = new FormData();
        formData.append('name', newItem.name);
        formData.append('price', newItem.price);
        formData.append('category', newItem.category);
        if (newItem.image) {
            formData.append('image', newItem.image);
        }

        try {
            await axios.post('http://localhost:8000/api/products', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setIsAddModalOpen(false);
            setNewItem({ name: '', price: '', category: 'Snacks', image: null });
            fetchProducts();
        } catch (err) {
            console.error(err);
            alert('Failed to add product');
        } finally {
            setUploading(false);
        }
    };

    const categories = ['All', 'Hot Coffee', 'Cold Coffee', 'Snacks'];
    const isAdmin = user && (user.role === 'owner' || user.role === 'manager');

    return (
        <div style={{ paddingBottom: '100px', maxWidth: '1200px', margin: '0 auto' }}>
            {/* Header Area */}
            <div style={{ marginBottom: '3rem', textAlign: 'center', position: 'relative' }}>
                <div style={{ position: 'absolute', top: '-50px', left: '50%', transform: 'translateX(-50%)', width: '200px', height: '200px', background: 'var(--primary)', filter: 'blur(100px)', opacity: 0.15, zIndex: -1 }} />
                <h2 style={{
                    margin: '0 0 1rem', fontSize: '3rem', fontWeight: 800,
                    background: 'linear-gradient(to right, #fff, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                    letterSpacing: '-0.02em'
                }}>
                    Our Menu
                </h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', maxWidth: '500px', margin: '0 auto' }}>
                    Curated selection of fine coffee, artisanal snacks, and refreshing beverages.
                </p>
            </div>

            {/* Controls Container */}
            <div className="glass" style={{
                borderRadius: '1.5rem', padding: '1rem', marginBottom: '3rem',
                display: 'flex', flexDirection: 'column', gap: '1.5rem',
                border: '1px solid rgba(255,255,255,0.05)'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
                    {/* Filters */}
                    <div style={{ display: 'flex', gap: '0.75rem', overflowX: 'auto', paddingBottom: '0.2rem', scrollbarWidth: 'none' }}>
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setCategory(cat)}
                                style={{
                                    padding: '0.75rem 1.5rem', borderRadius: '1rem',
                                    background: category === cat ? 'var(--primary-gradient)' : 'rgba(255,255,255,0.03)',
                                    color: category === cat ? 'white' : 'var(--text-secondary)',
                                    fontWeight: category === cat ? 600 : 500,
                                    border: '1px solid ' + (category === cat ? 'transparent' : 'rgba(255,255,255,0.05)'),
                                    whiteSpace: 'nowrap', cursor: 'pointer', transition: 'all 0.3s ease',
                                    boxShadow: category === cat ? '0 4px 10px rgba(139, 92, 246, 0.3)' : 'none'
                                }}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    {isAdmin && (
                        <button
                            onClick={() => setIsAddModalOpen(true)}
                            style={{
                                padding: '0.75rem 1.5rem', borderRadius: '1rem',
                                background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.1)',
                                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem',
                                fontWeight: 600, transition: 'all 0.2s', marginLeft: 'auto'
                            }}
                            className="hover:bg-white/20"
                        >
                            <Plus size={18} /> Add Item
                        </button>
                    )}

                    {/* Search */}
                    <div style={{ position: 'relative', flex: 1, minWidth: '280px', maxWidth: '400px' }}>
                        <Search size={20} style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                        <input
                            type="text"
                            placeholder="Search menu..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            style={{
                                width: '100%', padding: '1rem 1rem 1rem 3.5rem', borderRadius: '1rem',
                                border: '1px solid rgba(255,255,255,0.08)', color: 'white', outline: 'none', fontSize: '1rem',
                                background: 'rgba(0,0,0,0.2)', transition: 'all 0.2s'
                            }}
                            onFocus={e => e.target.style.borderColor = 'var(--primary)'}
                            onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
                        />
                    </div>
                </div>
            </div>

            {/* Grid */}
            {loading ? (
                <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-secondary)' }}>
                    <div className="animate-spin" style={{ width: '40px', height: '40px', border: '3px solid rgba(255,255,255,0.1)', borderTopColor: 'var(--primary)', borderRadius: '50%', margin: '0 auto 1rem' }} />
                    <p>Loading your favorites...</p>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2rem' }}>
                    {filteredProducts.map((p) => (
                        <div key={p._id} className="glass card" style={{
                            padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column', height: '100%',
                            border: '1px solid rgba(255,255,255,0.05)', background: 'rgba(30, 41, 59, 0.4)'
                        }}>
                            {/* Image Area */}
                            <div style={{ height: '220px', width: '100%', position: 'relative', overflow: 'hidden' }}>
                                <img
                                    src={getImage(p)}
                                    alt={p.name}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)' }}
                                    onMouseOver={e => e.currentTarget.style.transform = 'scale(1.1)'}
                                    onMouseOut={e => e.currentTarget.style.transform = 'scale(1.0)'}
                                />
                                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(15, 23, 42, 0.9) 0%, transparent 60%)' }} />
                                <div style={{ position: 'absolute', bottom: '1.25rem', left: '1.25rem', right: '1.25rem' }}>
                                    <h3 style={{ margin: 0, fontSize: '1.35rem', fontWeight: 700, color: 'white', textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>{p.name}</h3>
                                    <p style={{ margin: '0.25rem 0 0', color: '#94a3b8', fontSize: '0.9rem' }}>{p.category}</p>
                                </div>
                            </div>

                            {/* Details Area */}
                            <div style={{ padding: '1.5rem', marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                                {editingId === p._id && isAdmin ? (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', width: '100%' }}>
                                        <input
                                            type="number"
                                            value={editPrice[p.name] !== undefined ? editPrice[p.name] : p.price}
                                            onChange={(e) => setEditPrice({ ...editPrice, [p.name]: e.target.value })}
                                            style={{
                                                width: '100%', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--primary)',
                                                borderRadius: '0.5rem', padding: '0.5rem', color: 'white',
                                                fontSize: '1.1rem', fontWeight: 'bold'
                                            }}
                                            autoFocus
                                        />
                                        <button
                                            onClick={() => handleUpdatePrice(p.name)}
                                            style={{
                                                background: 'var(--success)', border: 'none', borderRadius: '0.5rem',
                                                padding: '0.5rem', color: 'white', cursor: 'pointer'
                                            }}
                                        >
                                            <Check size={18} />
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                                            <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Price</span>
                                            <span style={{ fontSize: '1.5rem', fontWeight: 700, color: 'white' }}>₹{p.price}</span>
                                        </div>

                                        {/* Admin Actions */}
                                        {isAdmin && (
                                            <button
                                                onClick={() => {
                                                    setEditingId(p._id);
                                                    setEditPrice({ ...editPrice, [p.name]: p.price });
                                                }}
                                                style={{
                                                    background: 'rgba(255,255,255,0.05)', border: 'none', borderRadius: '50%',
                                                    width: '44px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    color: 'var(--text-secondary)', cursor: 'pointer', transition: 'all 0.2s'
                                                }}
                                                className="hover:bg-white/10 hover:text-white"
                                            >
                                                <Edit2 size={18} />
                                            </button>
                                        )}

                                        {/* Customer Actions (Add to Cart) */}
                                        {!isAdmin && (
                                            <button
                                                onClick={() => addToCart(p)}
                                                className="btn-primary" // Use global class
                                                style={{
                                                    borderRadius: '2rem', padding: '0.6rem 1.25rem',
                                                    display: 'flex', alignItems: 'center', gap: '0.5rem',
                                                    fontSize: '0.95rem'
                                                }}
                                            >
                                                <Plus size={18} /> Add
                                            </button>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Floating Cart & History Buttons (Customer Only) */}
            {!isAdmin && (
                <div style={{ position: 'fixed', bottom: '2rem', right: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'end', zIndex: 100 }}>
                    <button
                        onClick={() => { setShowHistory(true); fetchHistory(); }}
                        style={{
                            background: 'rgba(255,255,255,0.1)', color: 'white',
                            border: '1px solid rgba(255,255,255,0.2)', borderRadius: '3rem',
                            padding: '0.8rem 1.5rem', fontSize: '1rem', fontWeight: 'bold',
                            backdropFilter: 'blur(10px)', cursor: 'pointer',
                            display: 'flex', alignItems: 'center', gap: '0.5rem',
                            boxShadow: '0 5px 15px rgba(0,0,0,0.2)'
                        }}
                    >
                        History
                    </button>

                    {cart.length > 0 && (
                        <button
                            onClick={() => setIsCheckoutOpen(true)}
                            style={{
                                background: 'var(--primary)', color: 'white',
                                border: 'none', borderRadius: '3rem',
                                padding: '1rem 2rem', fontSize: '1.2rem', fontWeight: 'bold',
                                boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
                                display: 'flex', alignItems: 'center', gap: '1rem',
                                cursor: 'pointer',
                                animation: 'fadeIn 0.3s ease-out'
                            }}
                        >
                            <ShoppingCart />
                            <span>View Cart ({cart.reduce((a, b) => a + b.quantity, 0)})</span>
                            <span style={{ background: 'rgba(255,255,255,0.2)', padding: '0.2rem 0.6rem', borderRadius: '1rem', fontSize: '1rem' }}>
                                ₹{getCartTotal()}
                            </span>
                        </button>
                    )}
                </div>
            )}

            {/* Checkout Modal */}
            {isCheckoutOpen && (
                <CheckoutModal
                    cart={cart}
                    total={getCartTotal()}
                    onClose={() => setIsCheckoutOpen(false)}
                    onOrderComplete={handleOrderComplete}
                />
            )}

            {/* Order History Modal */}
            {showHistory && (
                <div className="modal-overlay">
                    <div className="glass" style={{ padding: '2rem', borderRadius: '1.5rem', width: '600px', maxHeight: '80vh', overflowY: 'auto' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h2>My Orders</h2>
                            <button onClick={() => setShowHistory(false)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}><X /></button>
                        </div>
                        {historyLoading ? <p>Loading history...</p> : (
                            orderHistory.length === 0 ? <p>No past orders found.</p> : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    {orderHistory.map(order => (
                                        <div key={order.order_id} style={{ background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '1rem' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                                <span style={{ fontWeight: 'bold' }}>#{order.order_id}</span>
                                                <span style={{
                                                    padding: '0.2rem 0.6rem', borderRadius: '0.5rem', fontSize: '0.8rem',
                                                    background: order.status === 'Completed' ? 'var(--success)' : 'rgba(255,255,255,0.1)'
                                                }}>
                                                    {order.status}
                                                </span>
                                            </div>
                                            <p style={{ fontSize: '0.9rem', color: '#aaa', margin: '0 0 0.5rem' }}>
                                                {new Date(order.timestamp).toLocaleString()}
                                            </p>
                                            <div style={{ fontSize: '0.9rem' }}>
                                                {order.items.map((item, idx) => (
                                                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                        <span>{item.quantity}x {item.name}</span>
                                                        <span>₹{item.price * item.quantity}</span>
                                                    </div>
                                                ))}
                                            </div>
                                            <hr style={{ borderColor: 'rgba(255,255,255,0.1)', margin: '0.5rem 0' }} />
                                            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
                                                <span>Total</span>
                                                <span>₹{order.grand_total}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )
                        )}
                    </div>
                </div>
            )}

            {/* Add Item Modal */}
            {isAddModalOpen && (
                <div className="modal-overlay" style={{
                    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
                }}>
                    <div className="glass" style={{
                        padding: '2rem', borderRadius: '1.5rem', width: '500px', maxWidth: '95%',
                        border: '1px solid var(--glass-border)', boxShadow: 'var(--glass-shadow)',
                        background: 'rgba(15, 23, 42, 0.8)'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Add New Item</h2>
                            <button onClick={() => setIsAddModalOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}><X /></button>
                        </div>

                        <form onSubmit={handleAddItem} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Name</label>
                                <input
                                    type="text"
                                    required
                                    value={newItem.name}
                                    onChange={e => setNewItem({ ...newItem, name: e.target.value })}
                                    style={{
                                        width: '100%', padding: '0.8rem', borderRadius: '0.8rem',
                                        background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                                        color: 'white', outline: 'none'
                                    }}
                                    placeholder="e.g. Mocha Frappe"
                                />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Price (₹)</label>
                                    <input
                                        type="number"
                                        required
                                        value={newItem.price}
                                        onChange={e => setNewItem({ ...newItem, price: e.target.value })}
                                        style={{
                                            width: '100%', padding: '0.8rem', borderRadius: '0.8rem',
                                            background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                                            color: 'white', outline: 'none'
                                        }}
                                        placeholder="0"
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Category</label>
                                    <select
                                        value={newItem.category}
                                        onChange={e => setNewItem({ ...newItem, category: e.target.value })}
                                        style={{
                                            width: '100%', padding: '0.8rem', borderRadius: '0.8rem',
                                            background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                                            color: 'white', outline: 'none'
                                        }}
                                    >
                                        <option value="Hot Coffee">Hot Coffee</option>
                                        <option value="Cold Coffee">Cold Coffee</option>
                                        <option value="Snacks">Snacks</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Image</label>
                                <div style={{
                                    border: '2px dashed rgba(255,255,255,0.1)', borderRadius: '0.8rem', padding: '1.5rem',
                                    textAlign: 'center', cursor: 'pointer', transition: 'all 0.2s',
                                    background: newItem.image ? 'rgba(34, 197, 94, 0.1)' : 'transparent',
                                    borderColor: newItem.image ? 'var(--success)' : 'rgba(255,255,255,0.1)'
                                }}
                                    onClick={() => document.getElementById('file-upload').click()}
                                >
                                    <input
                                        id="file-upload"
                                        type="file"
                                        accept="image/*"
                                        onChange={e => setNewItem({ ...newItem, image: e.target.files[0] })}
                                        style={{ display: 'none' }}
                                    />
                                    <Upload size={24} style={{ marginBottom: '0.5rem', color: newItem.image ? 'var(--success)' : 'var(--text-secondary)' }} />
                                    <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                                        {newItem.image ? newItem.image.name : 'Click to upload image'}
                                    </p>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={uploading}
                                className="btn-primary"
                                style={{
                                    width: '100%', padding: '1rem', borderRadius: '1rem',
                                    fontSize: '1rem', fontWeight: 600, marginTop: '1rem'
                                }}
                            >
                                {uploading ? 'Adding...' : 'Add Product'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Menu;
