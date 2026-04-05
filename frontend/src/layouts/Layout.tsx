import React from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Receipt, Users, LogOut, Wallet } from 'lucide-react';

const Layout = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navItems = [
        { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} />, roles: ['ANALYST', 'ADMIN'] },
        { name: 'Records', path: '/records', icon: <Receipt size={20} />, roles: ['VIEWER', 'ANALYST', 'ADMIN'] },
        { name: 'Users', path: '/users', icon: <Users size={20} />, roles: ['ADMIN'] },
    ];

    const visibleNavItems = navItems.filter(item => user && item.roles.includes(user.role));

    const getPageTitle = () => {
        const path = location.pathname.substring(1);
        return path.charAt(0).toUpperCase() + path.slice(1);
    };

    return (
        <div className="page-container">
            {/* Sidebar */}
            <aside className="sidebar" style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '3rem' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'linear-gradient(135deg, var(--accent-color), #c084fc)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Wallet color="white" size={24} />
                    </div>
                    <span style={{ fontSize: '1.25rem', fontWeight: 700, letterSpacing: '0.5px' }} className="text-gradient">Zorvyn</span>
                </div>

                <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
                    {visibleNavItems.map(item => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                            style={({ isActive }) => ({
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem',
                                padding: '0.75rem 1rem',
                                borderRadius: 'var(--radius-sm)',
                                textDecoration: 'none',
                                color: isActive ? 'white' : 'var(--text-secondary)',
                                background: isActive ? 'rgba(99,102,241,0.15)' : 'transparent',
                                fontWeight: isActive ? 600 : 500,
                                borderLeft: isActive ? '3px solid var(--accent-color)' : '3px solid transparent',
                                transition: 'var(--transition)'
                            })}
                        >
                            <div style={{ color: isActive ? 'var(--accent-color)' : 'inherit' }}>
                                {item.icon}
                            </div>
                            {item.name}
                        </NavLink>
                    ))}
                </nav>

                <div style={{ marginTop: 'auto', paddingTop: '2rem', borderTop: '1px solid var(--panel-border)' }}>
                    <div style={{ marginBottom: '1rem' }}>
                        <p style={{ fontSize: '0.875rem', fontWeight: 600 }}>{user?.email}</p>
                        <span className={`badge badge-${user?.role.toLowerCase()}`} style={{ marginTop: '0.25rem', display: 'inline-block' }}>{user?.role}</span>
                    </div>
                    <button
                        onClick={handleLogout}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', width: '100%', padding: '0.75rem', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger-color)', border: 'none', borderRadius: 'var(--radius-sm)', fontWeight: 500 }}
                    >
                        <LogOut size={18} />
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="main-content">
                <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <div>
                        <h1 style={{ fontSize: '1.75rem', fontWeight: 700 }}>{getPageTitle() || 'Dashboard'}</h1>
                        <p style={{ color: 'var(--text-secondary)' }}>Welcome back to your financial control center.</p>
                    </div>
                </header>

                <Outlet />
            </main>
        </div>
    );
};

export default Layout;
