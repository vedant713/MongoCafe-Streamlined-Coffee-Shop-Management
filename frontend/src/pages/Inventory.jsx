import { useState, useEffect } from 'react';
import axios from 'axios';
import { Package, Plus, AlertTriangle, RefreshCw } from 'lucide-react';
import Modal from '../components/Modal';

const Inventory = () => {
    const [inventory, setInventory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({ name: '', quantity: '', unit: '', threshold: '' });

    useEffect(() => {
        fetchInventory();
    }, []);

    const fetchInventory = async () => {
        try {
            const res = await axios.get('http://localhost:8000/api/inventory');
            setInventory(res.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    const handleUpdateStock = async (name, currentQty) => {
        const added = prompt(`Add stock for ${name} (enter amount to add):`);
        if (!added || isNaN(added)) return;

        const newQty = parseFloat(currentQty) + parseFloat(added);
        try {
            await axios.put(`http://localhost:8000/api/inventory/${name}?quantity=${newQty}`);
            fetchInventory();
        } catch (err) {
            alert('Failed to update stock');
        }
    };

    // Manual add item if needed, though mostly we just restock
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:8000/api/inventory', formData);
            fetchInventory();
            setIsModalOpen(false);
            setFormData({ name: '', quantity: '', unit: '', threshold: '' });
        } catch (err) {
            alert('Error adding item');
        }
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2 style={{ margin: 0 }}>Inventory Management</h2>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button onClick={fetchInventory} style={{ background: 'var(--surface)', color: 'white', padding: '0.75rem', borderRadius: '0.5rem' }}>
                        <RefreshCw size={20} />
                    </button>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        style={{
                            background: 'var(--primary)', color: 'white', padding: '0.75rem 1.5rem',
                            borderRadius: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'bold'
                        }}
                    >
                        <Plus size={20} /> Add Item
                    </button>
                </div>
            </div>

            <div className="glass" style={{ borderRadius: '1rem', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead style={{ background: 'rgba(0,0,0,0.2)' }}>
                        <tr style={{ textAlign: 'left' }}>
                            <th style={{ padding: '1.5rem', color: 'var(--text-secondary)' }}>Item</th>
                            <th style={{ padding: '1.5rem', color: 'var(--text-secondary)' }}>Status</th>
                            <th style={{ padding: '1.5rem', color: 'var(--text-secondary)' }}>Quantity</th>
                            <th style={{ padding: '1.5rem', color: 'var(--text-secondary)' }}>Unit</th>
                            <th style={{ padding: '1.5rem', color: 'var(--text-secondary)', textAlign: 'right' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? <tr><td colSpan="5" style={{ padding: '2rem', textAlign: 'center' }}>Loading...</td></tr> :
                            inventory.length === 0 ? <tr><td colSpan="5" style={{ padding: '2rem', textAlign: 'center' }}>No items found</td></tr> :
                                inventory.map((item) => (
                                    <tr key={item.name} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                        <td style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                            <div style={{ background: 'var(--surface)', padding: '0.5rem', borderRadius: '50%' }}>
                                                <Package size={16} />
                                            </div>
                                            {item.name}
                                        </td>
                                        <td style={{ padding: '1.5rem' }}>
                                            {item.quantity < item.threshold ? (
                                                <span style={{ color: 'var(--error)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                    <AlertTriangle size={16} /> Low Stock
                                                </span>
                                            ) : (
                                                <span style={{ color: 'var(--success)' }}>In Stock</span>
                                            )}
                                        </td>
                                        <td style={{ padding: '1.5rem', fontWeight: 'bold' }}>{item.quantity}</td>
                                        <td style={{ padding: '1.5rem', color: 'var(--text-secondary)' }}>{item.unit}</td>
                                        <td style={{ padding: '1.5rem', textAlign: 'right' }}>
                                            <button
                                                onClick={() => handleUpdateStock(item.name, item.quantity)}
                                                style={{
                                                    background: 'rgba(59, 130, 246, 0.2)', color: 'rgb(59, 130, 246)',
                                                    padding: '0.5rem 1rem', borderRadius: '0.5rem', fontWeight: 'bold'
                                                }}
                                            >
                                                Restock
                                            </button>
                                        </td>
                                    </tr>
                                ))
                        }
                    </tbody>
                </table>
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Item">
                <form onSubmit={handleSubmit} style={{ marginTop: '1rem' }}>
                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Item Name</label>
                        <input className="input" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', background: 'var(--background)', border: '1px solid var(--surface)', color: 'white' }} />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Quantity</label>
                            <input className="input" type="number" value={formData.quantity} onChange={e => setFormData({ ...formData, quantity: e.target.value })} required style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', background: 'var(--background)', border: '1px solid var(--surface)', color: 'white' }} />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Unit</label>
                            <input className="input" value={formData.unit} onChange={e => setFormData({ ...formData, unit: e.target.value })} placeholder="e.g. ml, g, pcs" required style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', background: 'var(--background)', border: '1px solid var(--surface)', color: 'white' }} />
                        </div>
                    </div>
                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Low Stock Threshold</label>
                        <input className="input" type="number" value={formData.threshold} onChange={e => setFormData({ ...formData, threshold: e.target.value })} required style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', background: 'var(--background)', border: '1px solid var(--surface)', color: 'white' }} />
                    </div>
                    <button type="submit" style={{ width: '100%', padding: '1rem', background: 'var(--primary)', color: 'white', borderRadius: '0.5rem', fontWeight: 'bold' }}>Add Item</button>
                </form>
            </Modal>
        </div>
    );
};

export default Inventory;
