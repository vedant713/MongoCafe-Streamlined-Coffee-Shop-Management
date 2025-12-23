import { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Search, Trash2, UserCog, Briefcase } from 'lucide-react';
import Modal from '../components/Modal';

const Employees = () => {
    const [employees, setEmployees] = useState([]);
    const [filteredEmployees, setFilteredEmployees] = useState([]);
    const [search, setSearch] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({ name: '', age: '', phoneno: '', salary: '', email: '', category: 'Barista' });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchEmployees();
    }, []);

    useEffect(() => {
        const lowerSearch = search.toLowerCase();
        const filtered = employees.filter(e =>
            e.name.toLowerCase().includes(lowerSearch) ||
            e.category.toLowerCase().includes(lowerSearch)
        );
        setFilteredEmployees(filtered);
    }, [search, employees]);

    const fetchEmployees = async () => {
        try {
            const res = await axios.get('http://localhost:8000/api/employees');
            setEmployees(res.data);
            setFilteredEmployees(res.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:8000/api/employees', formData);
            fetchEmployees();
            setFormData({ name: '', age: '', phoneno: '', salary: '', email: '', category: 'Barista' });
            setIsModalOpen(false);
        } catch (err) {
            alert('Error adding employee');
        }
    };

    const handleDelete = async (phoneno) => {
        if (!confirm('Are you sure?')) return;
        try {
            await axios.delete(`http://localhost:8000/api/employees/${phoneno}`);
            fetchEmployees();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2 style={{ margin: 0 }}>Employee Management</h2>
                <button
                    onClick={() => setIsModalOpen(true)}
                    style={{
                        background: 'var(--primary)', color: 'white', padding: '0.75rem 1.5rem',
                        borderRadius: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'bold'
                    }}
                >
                    <Plus size={20} /> Add Employee
                </button>
            </div>

            {/* Search Bar */}
            <div style={{ position: 'relative', marginBottom: '2rem' }}>
                <Search size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                <input
                    type="text"
                    placeholder="Search by name or category..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="glass"
                    style={{
                        width: '100%', padding: '1rem 1rem 1rem 3rem', borderRadius: '1rem',
                        border: 'none', color: 'white', outline: 'none', fontSize: '1rem'
                    }}
                />
            </div>

            {/* Employee List */}
            <div className="glass" style={{ borderRadius: '1rem', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead style={{ background: 'rgba(0,0,0,0.2)' }}>
                        <tr style={{ textAlign: 'left' }}>
                            <th style={{ padding: '1.5rem', color: 'var(--text-secondary)' }}>Name</th>
                            <th style={{ padding: '1.5rem', color: 'var(--text-secondary)' }}>Role</th>
                            <th style={{ padding: '1.5rem', color: 'var(--text-secondary)' }}>Phone</th>
                            <th style={{ padding: '1.5rem', color: 'var(--text-secondary)' }}>Salary</th>
                            <th style={{ padding: '1.5rem', color: 'var(--text-secondary)', textAlign: 'right' }}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? <tr><td colSpan="5" style={{ padding: '2rem', textAlign: 'center' }}>Loading...</td></tr> :
                            filteredEmployees.length === 0 ? <tr><td colSpan="5" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>No employees found</td></tr> :
                                filteredEmployees.map((e) => (
                                    <tr key={e._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', transition: 'background 0.2s' }}>
                                        <td style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                            <div style={{ background: 'var(--surface)', padding: '0.5rem', borderRadius: '50%' }}><UserCog size={16} /></div>
                                            {e.name}
                                        </td>
                                        <td style={{ padding: '1.5rem' }}>
                                            <span style={{
                                                padding: '0.25rem 0.75rem', borderRadius: '1rem', fontSize: '0.85rem',
                                                background: e.category === 'Manager' ? 'rgba(236, 72, 153, 0.2)' : 'rgba(59, 130, 246, 0.2)',
                                                color: e.category === 'Manager' ? 'rgb(236, 72, 153)' : 'rgb(59, 130, 246)'
                                            }}>
                                                {e.category}
                                            </span>
                                        </td>
                                        <td style={{ padding: '1.5rem' }}>{e.phoneno}</td>
                                        <td style={{ padding: '1.5rem' }}>${e.salary}</td>
                                        <td style={{ padding: '1.5rem', textAlign: 'right' }}>
                                            <button onClick={() => handleDelete(e.phoneno)} style={{ color: 'var(--error)', padding: '0.5rem', borderRadius: '0.5rem', background: 'rgba(239, 68, 68, 0.1)' }}>
                                                <Trash2 size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                    </tbody>
                </table>
            </div>

            {/* Add Modal */}
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Employee">
                <form onSubmit={handleSubmit} style={{ marginTop: '1rem' }}>
                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Full Name</label>
                        <input className="input" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', background: 'var(--background)', border: '1px solid var(--surface)', color: 'white' }} />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Role</label>
                            <select value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', background: 'var(--background)', border: '1px solid var(--surface)', color: 'white' }}>
                                <option value="Barista">Barista</option>
                                <option value="Manager">Manager</option>
                                <option value="Accountant">Accountant</option>
                                <option value="Chef">Chef</option>
                                <option value="Cleaner">Cleaner</option>
                            </select>
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Salary</label>
                            <input className="input" type="number" value={formData.salary} onChange={e => setFormData({ ...formData, salary: e.target.value })} required style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', background: 'var(--background)', border: '1px solid var(--surface)', color: 'white' }} />
                        </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Phone</label>
                            <input className="input" value={formData.phoneno} onChange={e => setFormData({ ...formData, phoneno: e.target.value })} required style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', background: 'var(--background)', border: '1px solid var(--surface)', color: 'white' }} />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Age</label>
                            <input className="input" type="number" value={formData.age} onChange={e => setFormData({ ...formData, age: e.target.value })} required style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', background: 'var(--background)', border: '1px solid var(--surface)', color: 'white' }} />
                        </div>
                    </div>
                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Email</label>
                        <input className="input" type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} required style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', background: 'var(--background)', border: '1px solid var(--surface)', color: 'white' }} />
                    </div>
                    <button type="submit" style={{ width: '100%', padding: '1rem', background: 'var(--primary)', color: 'white', borderRadius: '0.5rem', fontWeight: 'bold', marginTop: '1rem' }}>Save Employee</button>
                </form>
            </Modal>
        </div>
    );
};

export default Employees;
