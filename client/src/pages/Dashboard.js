import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { dashboardAPI, formatCurrency, formatDate } from '../utils/api';

const BADGE_MAP = { Paid:'badge-paid', Pending:'badge-pending', Partial:'badge-partial', Overdue:'badge-overdue', Cancelled:'badge-cancelled', Draft:'badge-draft' };

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dashboardAPI.getStats()
      .then(r => setData(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading"><div className="spinner" /></div>;

  const t = data?.totals || {};
  const pieData = data?.categoryRevenue?.map(c => ({ name: c.category, value: parseFloat(c.total) })) || [];
  const PIE_COLORS = ['#00b4d8','#06d6a0','#ffd166','#ff6b6b','#a78bfa','#f472b6','#60a5fa'];

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
      <div style={{ background: 'var(--navy-mid)', border: '1px solid var(--border)', borderRadius: 8, padding: '10px 14px' }}>
        <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 4 }}>{label}</p>
        {payload.map(p => (
          <p key={p.name} style={{ color: p.color, fontSize: 14, fontWeight: 600 }}>
            {p.name}: {formatCurrency(p.value)}
          </p>
        ))}
      </div>
    );
  };

  return (
    <>
      <div className="topbar">
        <div>
          <div className="topbar-title">Dashboard</div>
          <div className="topbar-subtitle">Overview of billing operations</div>
        </div>
        <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
          📅 {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
      </div>
      <div className="page-content">
        <div className="stats-grid">
          {[
            { label: 'Total Revenue', value: formatCurrency(t.total_revenue), icon: '💰', color: 'teal' },
            { label: 'Collected', value: formatCurrency(t.total_collected), icon: '✅', color: 'mint' },
            { label: 'Outstanding', value: formatCurrency(t.total_outstanding), icon: '⏳', color: 'amber' },
            { label: 'Total Bills', value: t.total_bills || 0, icon: '🧾', color: 'coral' },
          ].map(s => (
            <div key={s.label} className={`stat-card ${s.color}`}>
              <div className="stat-icon">{s.icon}</div>
              <div className="stat-label">{s.label}</div>
              <div className={`stat-value ${s.color}`}>{s.value}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16, marginBottom: 24 }}>
          {[
            { label: 'Paid Bills', value: t.paid_count || 0, color: 'var(--mint)' },
            { label: 'Pending Bills', value: t.pending_count || 0, color: 'var(--amber)' },
            { label: 'Overdue Bills', value: t.overdue_count || 0, color: 'var(--coral)' },
          ].map(s => (
            <div key={s.label} className="card" style={{ padding: 18, display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ fontSize: 32, fontWeight: 700, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{s.label}</div>
            </div>
          ))}
        </div>

        <div className="chart-section">
          <div className="chart-card">
            <div className="chart-title">Monthly Revenue</div>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={data?.monthlyRevenue || []}>
                <XAxis dataKey="month" tick={{ fill: '#8da2bb', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#8da2bb', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="revenue" name="Revenue" fill="var(--teal)" radius={[4,4,0,0]} />
                <Bar dataKey="collected" name="Collected" fill="var(--mint)" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="chart-card">
            <div className="chart-title">Revenue by Category</div>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={90} dataKey="value" paddingAngle={3}>
                  {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                </Pie>
                <Tooltip formatter={(v) => formatCurrency(v)} contentStyle={{ background: 'var(--navy-mid)', border: '1px solid var(--border)', borderRadius: 8 }} />
                <Legend iconSize={10} wrapperStyle={{ fontSize: 12, color: 'var(--text-secondary)' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card" style={{ marginTop: 24, padding: 0 }}>
          <div style={{ padding: '20px 24px 16px', borderBottom: '1px solid var(--border)' }}>
            <h3 style={{ fontSize: 15, fontWeight: 600 }}>Recent Bills</h3>
          </div>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Bill #</th><th>Patient</th><th>Amount</th><th>Date</th><th>Status</th>
                </tr>
              </thead>
              <tbody>
                {(data?.recentBills || []).map(b => (
                  <tr key={b.bill_number}>
                    <td style={{ color: 'var(--teal)', fontWeight: 500 }}>{b.bill_number}</td>
                    <td>{b.patient_name}</td>
                    <td style={{ fontWeight: 600 }}>{formatCurrency(b.total_amount)}</td>
                    <td style={{ color: 'var(--text-secondary)' }}>{formatDate(b.bill_date)}</td>
                    <td><span className={`badge ${BADGE_MAP[b.status]}`}>{b.status}</span></td>
                  </tr>
                ))}
                {!data?.recentBills?.length && (
                  <tr><td colSpan={5} style={{ textAlign: 'center', padding: 32, color: 'var(--text-secondary)' }}>No bills yet</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}