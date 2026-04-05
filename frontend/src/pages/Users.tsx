import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import { UserPlus, Trash2 } from 'lucide-react';

const Users = () => {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form, setForm] = useState({ email: '', password: '', role: 'VIEWER' });

    const fetchUsers = async () => {
        try {
            const res = await api.get('/users');
            setUsers(res.data.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/users', form);
            setIsModalOpen(false);
            fetchUsers();
        } catch (error) {
            alert('Error creating user.');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this user?')) return;
        try {
            await api.delete(`/users/${id}`);
            fetchUsers();
        } catch (error) {
            alert('Error deleting user');
        }
    };

    if (loading) return <div>Loading users...</div>;

    return (
        <div>
            <div className="glass-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>System Users</h2>
                    <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }} onClick={() => { setForm({ email: '', password: '', role: 'VIEWER' }); setIsModalOpen(true); }}>
                        <UserPlus size={18} /> Add User
                    </button>
                </div>

                <div style={{ overflowX: 'auto' }}>
                    <table>
                        <thead>
                            <tr>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Joined</th>
                                <th style={{ textAlign: 'right' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => (
                                <tr key={user.id}>
                                    <td style={{ fontWeight: 500 }}>{user.email}</td>
                                    <td>
                                        <span className={`badge badge-${user.role.toLowerCase()}`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td style={{ color: 'var(--text-secondary)' }}>{new Date(user.createdAt).toLocaleDateString()}</td>
                                    <td style={{ textAlign: 'right' }}>
                                        <button onClick={() => handleDelete(user.id)} style={{ background: 'rgba(239,68,68,0.1)', color: 'var(--danger-color)', padding: '0.5rem', borderRadius: 'var(--radius-sm)', border: 'none' }}>
                                            <Trash2 size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {isModalOpen && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div className="glass-panel" style={{ width: '400px', padding: '2rem' }}>
                        <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem', fontWeight: 600 }}>Create New User</h2>
                        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

                            <div>
                                <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Email</label>
                                <input type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="name@company.com" />
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Password</label>
                                <input type="password" required value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} placeholder="••••••••" />
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Role</label>
                                <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}>
                                    <option value="VIEWER">Viewer</option>
                                    <option value="ANALYST">Analyst</option>
                                    <option value="ADMIN">Admin</option>
                                </select>
                            </div>

                            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                <button type="button" className="btn-secondary" style={{ flex: 1 }} onClick={() => setIsModalOpen(false)}>Cancel</button>
                                <button type="submit" className="btn-primary" style={{ flex: 1 }}>Create User</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Users;
