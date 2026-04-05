import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { Shield, Lock, Mail, ArrowRight } from 'lucide-react';

const Login = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (isLogin) {
                const { data } = await api.post('/auth/login', { email, password });
                if (data.success) {
                    login(data.data.user, data.data.token);
                    navigate('/dashboard');
                }
            } else {
                const { data } = await api.post('/auth/register', { email, password, role: 'VIEWER' });
                if (data.success) {
                    setIsLogin(true);
                    setError('Registration successful! Please login.');
                }
            }
        } catch (err: any) {
            setError(err.response?.data?.error || 'Authentication failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>

            {/* Decorative Orbs */}
            <div style={{ position: 'absolute', top: '-10%', left: '-10%', width: '40%', height: '40%', background: 'radial-gradient(circle, rgba(99,102,241,0.2) 0%, transparent 70%)', filter: 'blur(40px)', zIndex: 0 }} />
            <div style={{ position: 'absolute', bottom: '-10%', right: '-10%', width: '50%', height: '50%', background: 'radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 70%)', filter: 'blur(60px)', zIndex: 0 }} />

            <div className="glass-panel" style={{ width: '100%', maxWidth: '420px', padding: '2.5rem', position: 'relative', zIndex: 1 }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '64px', height: '64px', borderRadius: '16px', background: 'linear-gradient(135deg, var(--accent-color), #c084fc)', marginBottom: '1rem', boxShadow: '0 8px 16px rgba(99,102,241,0.3)' }}>
                        <Shield color="white" size={32} />
                    </div>
                    <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.5rem' }}>Welcome to Zorvyn</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>
                        {isLogin ? 'Sign in to access your dashboard' : 'Create an account to get started'}
                    </p>
                </div>

                {error && (
                    <div style={{ padding: '0.75rem', borderRadius: 'var(--radius-sm)', background: isLogin && error === 'Registration successful! Please login.' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)', color: isLogin && error === 'Registration successful! Please login.' ? 'var(--success-color)' : 'var(--danger-color)', marginBottom: '1.5rem', fontSize: '0.875rem', textAlign: 'center' }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div>
                        <label style={{ display: 'block', fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Email Address</label>
                        <div style={{ position: 'relative' }}>
                            <div style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }}>
                                <Mail size={18} />
                            </div>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                placeholder="name@company.com"
                                style={{ paddingLeft: '2.75rem' }}
                            />
                        </div>
                    </div>

                    <div>
                        <label style={{ display: 'block', fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Password</label>
                        <div style={{ position: 'relative' }}>
                            <div style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }}>
                                <Lock size={18} />
                            </div>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                placeholder="••••••••"
                                style={{ paddingLeft: '2.75rem' }}
                            />
                        </div>
                    </div>

                    <button type="submit" className="btn-primary" disabled={loading} style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                        {loading ? <span className="loading-pulse">Processing...</span> : (
                            <>
                                {isLogin ? 'Sign In' : 'Create Account'}
                                <ArrowRight size={18} />
                            </>
                        )}
                    </button>
                </form>

                <div style={{ marginTop: '2rem', textAlign: 'center' }}>
                    <button
                        type="button"
                        onClick={() => { setIsLogin(!isLogin); setError(''); }}
                        style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', fontSize: '0.875rem' }}
                    >
                        {isLogin ? "Don't have an account? " : "Already have an account? "}
                        <span style={{ color: 'var(--accent-color)', fontWeight: 600 }}>
                            {isLogin ? 'Sign up' : 'Sign in'}
                        </span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Login;
