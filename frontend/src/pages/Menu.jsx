import { useState, useEffect } from 'react';
import axios from 'axios';
import { Coffee, Search, Check } from 'lucide-react';

const Menu = () => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('All');
    const [loading, setLoading] = useState(true);
    const [editPrice, setEditPrice] = useState({});

    useEffect(() => {
        fetchProducts();
    }, []);

    useEffect(() => {
        let result = products;

        if (category !== 'All') {
            // Simple keyword matching for demo categories since DB might not have category field
            // Or assume some items belong to certain categories based on name
            // For now, let's just use searching as the primary filter if no category field exists
            if (category === 'Hot Coffee') result = result.filter(p => p.name.includes('Espresso') || p.name.includes('Latte') || p.name.includes('Cappuccino'));
            if (category === 'Cold Coffee') result = result.filter(p => p.name.includes('Ice') || p.name.includes('Frappe'));
            if (category === 'Snacks') result = result.filter(p => !p.name.includes('Coffee') && !p.name.includes('Latte'));
        }

        if (search) {
            result = result.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
        }

        setFilteredProducts(result);
    }, [search, category, products]);

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
        } catch (err) {
            alert('Error updating price');
        }
    };

    const categories = ['All', 'Hot Coffee', 'Cold Coffee', 'Snacks'];

    return (
        <div>
            <div style={{ marginBottom: '2rem' }}>
                <h2 style={{ margin: 0 }}>Menu Management</h2>
                <p style={{ color: 'var(--text-secondary)' }}>Manage your coffee shop offerings and pricing.</p>
            </div>

            {/* Filters */}
            <div style={{ display: 'flex', gap: '1rem', overflowX: 'auto', marginBottom: '2rem', paddingBottom: '0.5rem' }}>
                {categories.map(cat => (
                    <button
                        key={cat}
                        onClick={() => setCategory(cat)}
                        style={{
                            padding: '0.5rem 1.5rem', borderRadius: '2rem',
                            background: category === cat ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
                            color: category === cat ? 'white' : 'var(--text-secondary)',
                            fontWeight: category === cat ? 'bold' : 'normal',
                            border: '1px solid ' + (category === cat ? 'var(--primary)' : 'rgba(255,255,255,0.1)'),
                            whiteSpace: 'nowrap'
                        }}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Search */}
            <div style={{ position: 'relative', marginBottom: '2rem' }}>
                <Search size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                <input
                    type="text"
                    placeholder="Search menu items..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="glass"
                    style={{
                        width: '100%', padding: '1rem 1rem 1rem 3rem', borderRadius: '1rem',
                        border: 'none', color: 'white', outline: 'none', fontSize: '1rem'
                    }}
                />
            </div>

            {/* Grid */}
            {loading ? <p>Loading...</p> : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1.5rem' }}>
                    {filteredProducts.map((p) => (
                        <div key={p._id} className="glass" style={{ padding: '1.5rem', borderRadius: '1rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
                            <div style={{
                                width: '80px', height: '80px', margin: '0 auto 1rem',
                                background: 'linear-gradient(135deg, var(--surface), rgba(0,0,0,0.5))',
                                borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                boxShadow: '0 4px 10px rgba(0,0,0,0.3)'
                            }}>
                                <Coffee size={32} color="var(--accent)" />
                            </div>
                            <h3 style={{ marginBottom: '0.5rem', fontSize: '1.1rem' }}>{p.name}</h3>
                            <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary)', marginBottom: '1.5rem' }}>${p.price}</p>

                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <input
                                    type="number"
                                    placeholder="Update"
                                    value={editPrice[p.name] || ''}
                                    onChange={(e) => setEditPrice({ ...editPrice, [p.name]: e.target.value })}
                                    style={{ width: '100%', padding: '0.5rem', borderRadius: '0.5rem', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.2)', color: 'white', fontSize: '0.9rem' }}
                                />
                                <button
                                    onClick={() => handleUpdatePrice(p.name)}
                                    style={{ background: 'var(--primary)', color: 'white', padding: '0.5rem', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                >
                                    <Check size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Menu;
