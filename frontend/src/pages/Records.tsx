import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { Plus, Trash2, Edit2, Search } from 'lucide-react';

const Records = () => {
    const { user } = useAuth();
    const [records, setRecords] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const isAdmin = user?.role === 'ADMIN';

    // Modal / Form state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form, setForm] = useState({ id: '', amount: '', type: 'EXPENSE', category: '', date: '', notes: '' });

    const fetchRecords = async () => {
        try {
            const res = await api.get('/records');
            setRecords(res.data.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRecords();
    }, []);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        const payload = {
            amount: parseFloat(form.amount),
            type: form.type,
            category: form.category,
            date: new Date(form.date).toISOString(),
            notes: form.notes
        };

        try {
            if (form.id) {
                await api.patch(`/records/${form.id}`, payload);
            } else {
                await api.post('/records', payload);
            }
            setIsModalOpen(false);
            fetchRecords();
        } catch (error) {
            alert('Error saving record.');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this record?')) return;
        try {
            await api.delete(`/records/${id}`);
            fetchRecords();
        } catch (error) {
            alert('Error deleting record');
        }
    };

    const openForm = (record?: any) => {
        if (record) {
            setForm({
                id: record.id,
                amount: record.amount.toString(),
                type: record.type,
                category: record.category,
                date: new Date(record.date).toISOString().split('T')[0],
                notes: record.notes || ''
            });
        } else {
            setForm({ id: '', amount: '', type: 'EXPENSE', category: '', date: new Date().toISOString().split('T')[0], notes: '' });
        }
        setIsModalOpen(true);
    };

    if (loading) return <div>Loading records...</div>;

    return (
        <div>
            <div className="glass-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <div style={{ position: 'relative', width: '300px' }}>
                        <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                        <input type="text" placeholder="Filter by category..." style={{ paddingLeft: '2.5rem' }} disabled />
                    </div>
                    {isAdmin && (
                        <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }} onClick={() => openForm()}>
                            <Plus size={18} /> Add Record
                        </button>
                    )}
                </div>

                <div style={{ overflowX: 'auto' }}>
                    <table>
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Type</th>
                                <th>Category</th>
                                <th>Amount</th>
                                <th>Notes</th>
                                {isAdmin && <th style={{ textAlign: 'right' }}>Actions</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {records.map(record => (
                                <tr key={record.id}>
                                    <td>{new Date(record.date).toLocaleDateString()}</td>
                                    <td>
                                        <span className={`badge badge-${record.type.toLowerCase()}`}>
                                            {record.type}
                                        </span>
                                    </td>
                                    <td style={{ fontWeight: 500 }}>{record.category}</td>
                                    <td>${record.amount.toLocaleString()}</td>
                                    <td style={{ color: 'var(--text-secondary)' }}>{record.notes || '-'}</td>
                                    {isAdmin && (
                                        <td style={{ textAlign: 'right' }}>
                                            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                                                <button onClick={() => openForm(record)} style={{ background: 'rgba(99,102,241,0.1)', color: 'var(--accent-color)', padding: '0.5rem', borderRadius: 'var(--radius-sm)', border: 'none' }}>
                                                    <Edit2 size={16} />
                                                </button>
                                                <button onClick={() => handleDelete(record.id)} style={{ background: 'rgba(239,68,68,0.1)', color: 'var(--danger-color)', padding: '0.5rem', borderRadius: 'var(--radius-sm)', border: 'none' }}>
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    )}
                                </tr>
                            ))}
                            {records.length === 0 && (
                                <tr>
                                    <td colSpan={6} style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '2rem' }}>No records found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {isModalOpen && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div className="glass-panel" style={{ width: '400px', padding: '2rem' }}>
                        <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem', fontWeight: 600 }}>{form.id ? 'Edit Record' : 'Add Record'}</h2>
                        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <div style={{ flex: 1 }}>
                                    <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Type</label>
                                    <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
                                        <option value="INCOME">Income</option>
                                        <option value="EXPENSE">Expense</option>
                                    </select>
                                </div>
                                <div style={{ flex: 1 }}>
                                    <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Amount ($)</label>
                                    <input type="number" required min="0" step="0.01" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} placeholder="0.00" />
                                </div>
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Category</label>
                                <input type="text" required value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} placeholder="e.g. Salary, Utilities, Software" />
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Date</label>
                                <input type="date" required value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} />
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Notes (Optional)</label>
                                <input type="text" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} placeholder="Additional details..." />
                            </div>

                            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                <button type="button" className="btn-secondary" style={{ flex: 1 }} onClick={() => setIsModalOpen(false)}>Cancel</button>
                                <button type="submit" className="btn-primary" style={{ flex: 1 }}>Save Record</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Records;
