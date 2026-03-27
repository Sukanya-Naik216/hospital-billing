import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { billsAPI, formatCurrency, formatDate } from '../utils/api';

const BADGE_MAP = {
  Paid: 'badge-paid',
  Pending: 'badge-pending',
  Partial: 'badge-partial',
  Overdue: 'badge-overdue',
  Cancelled: 'badge-cancelled',
  Draft: 'badge-draft'
};

const STATUSES = ['All', 'Pending', 'Paid', 'Partial', 'Overdue', 'Cancelled'];

export default function Bills() {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const navigate = useNavigate();

  // ✅ FIXED: useCallback added
  const load = useCallback(() => {
    setLoading(true);

    billsAPI
      .getAll(statusFilter !== 'All' ? { status: statusFilter } : {})
      .then((r) => setBills(r.data))
      .finally(() => setLoading(false));
  }, [statusFilter]);

  // ✅ FIXED: dependency issue resolved
  useEffect(() => {
    load();
  }, [load]);

  const filtered = bills.filter(
    (b) =>
      !search ||
      b.bill_number?.toLowerCase().includes(search.toLowerCase()) ||
      b.patient_name?.toLowerCase().includes(search.toLowerCase()) ||
      b.patient_code?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <div className="topbar">
        <div>
          <div className="topbar-title">Bills</div>
          <div className="topbar-subtitle">
            {bills.length} bill{bills.length !== 1 ? 's' : ''} found
          </div>
        </div>

        <div className="topbar-actions">
          <button
            className="btn btn-primary"
            onClick={() => navigate('/bills/new')}
          >
            ➕ New Bill
          </button>
        </div>
      </div>

      <div className="page-content">
        <div
          style={{
            display: 'flex',
            gap: 12,
            alignItems: 'center',
            marginBottom: 20,
            flexWrap: 'wrap'
          }}
        >
          <div className="search-bar">
            🔍
            <input
              placeholder="Search bill #, patient..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', gap: 6 }}>
            {STATUSES.map((s) => (
              <button
                key={s}
                className={`btn btn-sm ${
                  statusFilter === s ? 'btn-primary' : 'btn-ghost'
                }`}
                onClick={() => setStatusFilter(s)}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="card" style={{ padding: 0 }}>
          {loading ? (
            <div className="loading">
              <div className="spinner" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="empty-state">
              <div className="icon">🧾</div>
              <div>No bills found</div>

              <button
                className="btn btn-primary"
                style={{ marginTop: 12 }}
                onClick={() => navigate('/bills/new')}
              >
                Create First Bill
              </button>
            </div>
          ) : (
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Bill #</th>
                    <th>Patient</th>
                    <th>Bill Date</th>
                    <th>Due Date</th>
                    <th>Total</th>
                    <th>Paid</th>
                    <th>Due</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filtered.map((b) => {
                    const due =
                      parseFloat(b.total_amount) -
                      parseFloat(b.paid_amount);

                    return (
                      <tr key={b.id}>
                        <td
                          style={{
                            color: 'var(--teal)',
                            fontWeight: 600,
                            cursor: 'pointer'
                          }}
                          onClick={() => navigate(`/bills/${b.id}`)}
                        >
                          {b.bill_number}
                        </td>

                        <td>
                          <div style={{ fontWeight: 500 }}>
                            {b.patient_name}
                          </div>
                          <div
                            style={{
                              fontSize: 12,
                              color: 'var(--text-secondary)'
                            }}
                          >
                            {b.patient_code} · {b.phone}
                          </div>
                        </td>

                        <td style={{ color: 'var(--text-secondary)' }}>
                          {formatDate(b.bill_date)}
                        </td>

                        <td
                          style={{
                            color:
                              new Date(b.due_date) < new Date() &&
                              b.status !== 'Paid'
                                ? 'var(--coral)'
                                : 'var(--text-secondary)'
                          }}
                        >
                          {formatDate(b.due_date)}
                        </td>

                        <td style={{ fontWeight: 600 }}>
                          {formatCurrency(b.total_amount)}
                        </td>

                        <td style={{ color: 'var(--mint)' }}>
                          {formatCurrency(b.paid_amount)}
                        </td>

                        <td
                          style={{
                            color: due > 0 ? 'var(--coral)' : 'var(--mint)'
                          }}
                        >
                          {formatCurrency(due)}
                        </td>

                        <td>
                          <span
                            className={`badge ${BADGE_MAP[b.status]}`}
                          >
                            {b.status}
                          </span>
                        </td>

                        <td>
                          <button
                            className="btn btn-ghost btn-sm"
                            onClick={() =>
                              navigate(`/bills/${b.id}`)
                            }
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
}