import { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Check, Edit2, Coffee } from 'lucide-react';

const Menu = () => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('All');
    const [loading, setLoading] = useState(true);
    const [editPrice, setEditPrice] = useState({});
    const [editingId, setEditingId] = useState(null);

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
        return n.includes('espresso') || n.includes('latte') || n.includes('cappuccino') || n.includes('mocha') || n.includes('americano') || n.includes('coffee');
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

    const getImage = (product) => {
        if (product.image_url) return product.image_url;
        const name = product.name.toLowerCase();
        if (name.includes('espresso')) return '/images/espresso.png';
        if (name.includes('latte')) return '/images/latte.png';
        if (name.includes('cappuccino') || name.includes('capuccino')) return '/images/cappuccino.png';
        if (name.includes('muffin') || name.includes('croissant') || name.includes('cake') || name.includes('cookie') || name.includes('donut') || name.includes('bagel')) return '/images/snack.png';
        return '/images/latte.png'; // Default
    };

    const categories = ['All', 'Hot Coffee', 'Cold Coffee', 'Snacks'];

    return (
        <div>
            <div style={{ marginBottom: '2rem' }}>
                <h2 style={{ margin: 0, fontSize: '2.5rem', fontWeight: 'bold', background: 'linear-gradient(90deg, #fff, #aaa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    Menu
                </h2>
                <p style={{ color: 'var(--text-secondary)' }}>Curated selection of fine coffee and snacks.</p>
            </div>

            {/* Filters */}
            <div style={{ display: 'flex', gap: '1rem', overflowX: 'auto', marginBottom: '2rem', paddingBottom: '0.5rem' }}>
                {categories.map(cat => (
                    <button
                        key={cat}
                        onClick={() => setCategory(cat)}
                        style={{
                            padding: '0.6rem 1.5rem', borderRadius: '2rem',
                            background: category === cat ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
                            color: category === cat ? 'white' : 'var(--text-secondary)',
                            fontWeight: category === cat ? 'bold' : '500',
                            border: '1px solid ' + (category === cat ? 'var(--primary)' : 'rgba(255,255,255,0.1)'),
                            whiteSpace: 'nowrap',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease'
                        }}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Search */}
            <div style={{ position: 'relative', marginBottom: '3rem', maxWidth: '600px' }}>
                <Search size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                <input
                    type="text"
                    placeholder="Search for your favorite drink..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="glass"
                    style={{
                        width: '100%', padding: '1rem 1rem 1rem 3rem', borderRadius: '1rem',
                        border: '1px solid rgba(255,255,255,0.1)', color: 'white', outline: 'none', fontSize: '1rem',
                        background: 'rgba(255,255,255,0.03)'
                    }}
                />
            </div>

            {/* Grid */}
            {loading ? <p>Loading menu...</p> : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '2rem' }}>
                    {filteredProducts.map((p) => (
                        <div key={p._id} className="glass card-hover" style={{
                            borderRadius: '1.5rem',
                            overflow: 'hidden',
                            border: '1px solid rgba(255,255,255,0.05)',
                            background: 'rgba(255, 255, 255, 0.03)',
                            boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
                        }}>
                            {/* Image Area */}
                            <div style={{ height: '200px', width: '100%', position: 'relative', overflow: 'hidden' }}>
                                <img
                                    src={getImage(p)}
                                    alt={p.name}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
                                    onMouseOver={e => e.currentTarget.style.transform = 'scale(1.1)'}
                                    onMouseOut={e => e.currentTarget.style.transform = 'scale(1.0)'}
                                />
                                <div style={{
                                    position: 'absolute', inset: 0,
                                    background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 50%)'
                                }} />
                                <div style={{ position: 'absolute', bottom: '1rem', left: '1rem' }}>
                                    <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 'bold', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>{p.name}</h3>
                                </div>
                            </div>

                            {/* Details Area */}
                            <div style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                {editingId === p._id ? (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', width: '100%' }}>
                                        <input
                                            type="number"
                                            value={editPrice[p.name] !== undefined ? editPrice[p.name] : p.price}
                                            onChange={(e) => setEditPrice({ ...editPrice, [p.name]: e.target.value })}
                                            style={{
                                                width: '100%', background: 'rgba(255,255,255,0.1)', border: 'none',
                                                borderRadius: '0.5rem', padding: '0.5rem', color: 'white',
                                                fontSize: '1.2rem', fontWeight: 'bold'
                                            }}
                                            autoFocus
                                        />
                                        <button
                                            onClick={() => handleUpdatePrice(p.name)}
                                            style={{
                                                background: 'var(--primary)', border: 'none', borderRadius: '0.5rem',
                                                padding: '0.5rem', color: 'white', cursor: 'pointer'
                                            }}
                                        >
                                            <Check size={18} />
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary)' }}>₹{p.price}</span>
                                        <button
                                            onClick={() => {
                                                setEditingId(p._id);
                                                setEditPrice({ ...editPrice, [p.name]: p.price });
                                            }}
                                            style={{
                                                background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '50%',
                                                width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                color: 'white', cursor: 'pointer', transition: 'background 0.2s'
                                            }}
                                            onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
                                            onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                                        >
                                            <Edit2 size={16} />
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Menu;
