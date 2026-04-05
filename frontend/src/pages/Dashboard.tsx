import React, { useEffect, useState } from 'react';
import { ArrowUpRight, ArrowDownRight, DollarSign, Activity } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts';
import api from '../utils/api';

const Dashboard = () => {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSummary = async () => {
            try {
                const res = await api.get('/dashboard/summary');
                setData(res.data.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchSummary();
    }, []);

    if (loading) {
        return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '400px', fontSize: '1.25rem', color: 'var(--text-secondary)' }}><span className="loading-pulse">Loading analytics...</span></div>;
    }

    if (!data) return null;

    const chartData = Object.keys(data.categoryTotals).map(key => ({
        name: key,
        amount: data.categoryTotals[key]
    }));

    const formatCurrency = (val: number) => `$${val.toLocaleString()}`;

    const colors = ['#818cf8', '#34d399', '#f87171', '#c084fc', '#fbbf24'];

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

            {/* Overview Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>

                <div className="glass-card" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                    <div>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.25rem' }}>Net Balance</p>
                        <h2 style={{ fontSize: '2.5rem', fontWeight: 700, color: data.netBalance >= 0 ? 'var(--income-color)' : 'var(--expense-color)' }}>
                            {formatCurrency(data.netBalance)}
                        </h2>
                    </div>
                    <div style={{ padding: '1rem', background: 'rgba(99,102,241,0.1)', borderRadius: '1rem', color: 'var(--accent-color)' }}>
                        <DollarSign size={24} />
                    </div>
                </div>

                <div className="glass-card" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                    <div>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.25rem' }}>Total Income</p>
                        <h2 style={{ fontSize: '2.5rem', fontWeight: 700 }}>{formatCurrency(data.totalIncome)}</h2>
                    </div>
                    <div style={{ padding: '1rem', background: 'rgba(52,211,153,0.1)', borderRadius: '1rem', color: 'var(--income-color)' }}>
                        <ArrowUpRight size={24} />
                    </div>
                </div>

                <div className="glass-card" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                    <div>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.25rem' }}>Total Expenses</p>
                        <h2 style={{ fontSize: '2.5rem', fontWeight: 700 }}>{formatCurrency(data.totalExpense)}</h2>
                    </div>
                    <div style={{ padding: '1rem', background: 'rgba(248,113,113,0.1)', borderRadius: '1rem', color: 'var(--expense-color)' }}>
                        <ArrowDownRight size={24} />
                    </div>
                </div>

            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
                {/* Chart Section */}
                <div className="glass-card" style={{ maxHeight: '420px', display: 'flex', flexDirection: 'column' }}>
                    <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Activity size={20} color="var(--accent-color)" /> Category Overview
                    </h3>
                    <div style={{ flex: 1, minHeight: 0 }}>
                        {chartData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                                    <XAxis dataKey="name" stroke="var(--text-secondary)" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                                    <YAxis stroke="var(--text-secondary)" tick={{ fontSize: 12 }} tickFormatter={(val) => `$${val / 1000}k`} axisLine={false} tickLine={false} />
                                    <Tooltip
                                        contentStyle={{ background: 'rgba(15, 23, 42, 0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                                        itemStyle={{ color: 'white' }}
                                    />
                                    <Bar dataKey="amount" radius={[4, 4, 0, 0]}>
                                        {chartData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>No transactions yet</div>
                        )}
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="glass-card" style={{ display: 'flex', flexDirection: 'column' }}>
                    <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Recent Activity</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', overflowY: 'auto' }}>
                        {data.recentActivity.map((record: any) => (
                            <div key={record.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '1rem', borderBottom: '1px solid var(--panel-border)' }}>
                                <div>
                                    <p style={{ fontWeight: 600 }}>{record.category}</p>
                                    <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{new Date(record.date).toLocaleDateString()}</p>
                                </div>
                                <div style={{ fontWeight: 700, color: record.type === 'INCOME' ? 'var(--income-color)' : 'var(--text-primary)' }}>
                                    {record.type === 'INCOME' ? '+' : '-'}${record.amount.toLocaleString()}
                                </div>
                            </div>
                        ))}
                        {data.recentActivity.length === 0 && (
                            <p style={{ color: 'var(--text-secondary)', textAlign: 'center', marginTop: '2rem' }}>No recent records found.</p>
                        )}
                    </div>
                </div>
            </div>

        </div>
    );
};

export default Dashboard;
