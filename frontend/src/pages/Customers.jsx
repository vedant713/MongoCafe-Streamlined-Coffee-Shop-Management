import { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Search, Trash2, User } from 'lucide-react';
import Modal from '../components/Modal';

const Customers = () => {
    const [customers, setCustomers] = useState([]);
    const [filteredCustomers, setFilteredCustomers] = useState([]);
    const [search, setSearch] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({ name: '', phoneno: '', age: '', email: '' });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCustomers();
    }, []);

    useEffect(() => {
        const lowerSearch = search.toLowerCase();
        const filtered = customers.filter(c =>
            c.name.toLowerCase().includes(lowerSearch) ||
            c.phoneno.includes(lowerSearch)
        );
        setFilteredCustomers(filtered);
    }, [search, customers]);

    const fetchCustomers = async () => {
        try {
            const res = await axios.get('http://localhost:8000/api/customers');
            setCustomers(res.data);
            setFilteredCustomers(res.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:8000/api/customers', formData);
            fetchCustomers();
            setFormData({ name: '', phoneno: '', age: '', email: '' });
            setIsModalOpen(false);
        } catch (err) {
            alert('Error adding customer (maybe exists?)');
        }
    };

    const handleDelete = async (phoneno) => {
        if (!confirm('Are you sure?')) return;
        try {
            await axios.delete(`http://localhost:8000/api/customers/${phoneno}`);
            fetchCustomers();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2 style={{ margin: 0 }}>Customer Management</h2>
                <button
                    onClick={() => setIsModalOpen(true)}
                    style={{
                        background: 'var(--primary)', color: 'white', padding: '0.75rem 1.5rem',
                        borderRadius: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'bold'
                    }}
                >
                    <Plus size={20} /> Add Customer
                </button>
            </div>

            {/* Search Bar */}
            <div style={{ position: 'relative', marginBottom: '2rem' }}>
                <Search size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                <input
                    type="text"
                    placeholder="Search by name or phone..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="glass"
                    style={{
                        width: '100%', padding: '1rem 1rem 1rem 3rem', borderRadius: '1rem',
                        border: 'none', color: 'white', outline: 'none', fontSize: '1rem'
                    }}
                />
            </div>

            {/* Customer List */}
            <div className="glass" style={{ borderRadius: '1rem', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead style={{ background: 'rgba(0,0,0,0.2)' }}>
                        <tr style={{ textAlign: 'left' }}>
                            <th style={{ padding: '1.5rem', color: 'var(--text-secondary)' }}>Name</th>
                            <th style={{ padding: '1.5rem', color: 'var(--text-secondary)' }}>Phone</th>
                            <th style={{ padding: '1.5rem', color: 'var(--text-secondary)' }}>Age</th>
                            <th style={{ padding: '1.5rem', color: 'var(--text-secondary)' }}>Email</th>
                            <th style={{ padding: '1.5rem', color: 'var(--text-secondary)', textAlign: 'right' }}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? <tr><td colSpan="5" style={{ padding: '2rem', textAlign: 'center' }}>Loading...</td></tr> :
                            filteredCustomers.length === 0 ? <tr><td colSpan="5" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>No customers found</td></tr> :
                                filteredCustomers.map((c) => (
                                    <tr key={c._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', transition: 'background 0.2s' }}>
                                        <td style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                            <div style={{ background: 'var(--surface)', padding: '0.5rem', borderRadius: '50%' }}><User size={16} /></div>
                                            {c.name}
                                        </td>
                                        <td style={{ padding: '1.5rem' }}>{c.phoneno}</td>
                                        <td style={{ padding: '1.5rem' }}>{c.age}</td>
                                        <td style={{ padding: '1.5rem', color: 'var(--text-secondary)' }}>{c.email}</td>
                                        <td style={{ padding: '1.5rem', textAlign: 'right' }}>
                                            <button onClick={() => handleDelete(c.phoneno)} style={{ color: 'var(--error)', padding: '0.5rem', borderRadius: '0.5rem', background: 'rgba(239, 68, 68, 0.1)' }}>
                                                <Trash2 size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                    </tbody>
                </table>
            </div>

            {/* Add Modal */}
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Customer">
                <form onSubmit={handleSubmit} style={{ marginTop: '1rem' }}>
                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Full Name</label>
                        <input className="input" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', background: 'var(--background)', border: '1px solid var(--surface)', color: 'white' }} />
                    </div>
                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Phone Number</label>
                        <input className="input" value={formData.phoneno} onChange={e => setFormData({ ...formData, phoneno: e.target.value })} required style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', background: 'var(--background)', border: '1px solid var(--surface)', color: 'white' }} />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Age</label>
                            <input className="input" value={formData.age} onChange={e => setFormData({ ...formData, age: e.target.value })} required style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', background: 'var(--background)', border: '1px solid var(--surface)', color: 'white' }} />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Email (Optional)</label>
                            <input className="input" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', background: 'var(--background)', border: '1px solid var(--surface)', color: 'white' }} />
                        </div>
                    </div>
                    <button type="submit" style={{ width: '100%', padding: '1rem', background: 'var(--primary)', color: 'white', borderRadius: '0.5rem', fontWeight: 'bold', marginTop: '1rem' }}>Save Customer</button>
                </form>
            </Modal>
        </div>
    );
};

export default Customers;
