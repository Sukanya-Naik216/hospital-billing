import React from 'react';
import { BrowserRouter, Routes, Route, useLocation, useNavigate, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Dashboard from './pages/Dashboard';
import Patients from './pages/Patients';
import Bills from './pages/Bills';
import NewBill from './pages/NewBill';
import BillDetail from './pages/BillDetail';
import Services from './pages/Services';
import Login from './pages/Login';
import Landing from './pages/Landing';
import './index.css';

const NAV = [
  { path: '/', label: 'Dashboard', icon: '📊' },
  { path: '/bills', label: 'Bills', icon: '🧾' },
  { path: '/bills/new', label: 'New Bill', icon: '➕' },
  { path: '/patients', label: 'Patients', icon: '👥' },
  { path: '/services', label: 'Services', icon: '🏥' },
];

function PrivateRoute({ children }) {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
}

function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="logo-icon">🏥</div>
        <h1>MediCare</h1>
        <span>Billing Module</span>
      </div>
      <nav className="sidebar-nav">
        <div className="nav-section-label">Navigation</div>
        {NAV.map(n => (
          <button
            key={n.path}
            className={`nav-link ${location.pathname === n.path ? 'active' : ''}`}
            onClick={() => navigate(n.path)}
          >
            <span className="icon">{n.icon}</span>
            {n.label}
          </button>
        ))}
      </nav>
      <div style={{ padding: '16px', borderTop: '1px solid var(--border)' }}>
        <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 10 }}>
          👤 {user.name || 'Admin'}<br />
          <span style={{ fontSize: 11 }}>{user.email}</span>
        </div>
        <button
          className="btn btn-danger btn-sm"
          style={{ width: '100%', justifyContent: 'center' }}
          onClick={handleLogout}
        >
          🚪 Logout
        </button>
      </div>
    </aside>
  );
}

function Layout() {
  return (
    <div className="layout">
      <Sidebar />
      <main className="main">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/bills" element={<Bills />} />
          <Route path="/bills/new" element={<NewBill />} />
          <Route path="/bills/:id" element={<BillDetail />} />
          <Route path="/patients" element={<Patients />} />
          <Route path="/services" element={<Services />} />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/home" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/*" element={<PrivateRoute><Layout /></PrivateRoute>} />
      </Routes>
      <Toaster position="top-right" toastOptions={{
        style: { background: 'var(--navy-mid)', color: 'var(--text-primary)', border: '1px solid var(--border)' }
      }} />
    </BrowserRouter>
  );
}