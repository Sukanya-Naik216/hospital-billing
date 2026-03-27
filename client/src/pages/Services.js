import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { servicesAPI, formatCurrency } from '../utils/api';

const CATEGORIES = ['Consultation', 'Lab', 'Radiology', 'Surgery', 'Pharmacy', 'Room', 'Emergency', 'Other'];
const CAT_COLORS = {
  Consultation: 'var(--teal)', Lab: 'var(--mint)', Radiology: 'var(--amber)',
  Surgery: 'var(--coral)', Pharmacy: '#a78bfa', Room: '#60a5fa',
  Emergency: '#f472b6', Other: 'var(--text-secondary)',
};

function ServiceModal({ onClose, onSave }) {
  const [form, setForm] = useState({ code: '', name: '', category: 'Consultation', unit_price: '', description: '' });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!form.code || !form.name || !form.unit_price) return toast.error('Code, name and price are required');
    try {
      setSaving(true);
      await servicesAPI.create(form);
      toast.success('Service added!');
      onSave();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to add service');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">🏥 Add Service</div>
          <button className="btn btn-ghost btn-sm" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Service Code *</label>
              <input className="form-control" placeholder="e.g. LAB004" value={form.code}
                onChange={e => setForm({ ...form, code: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Category</label>
              <select className="form-control" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="form-group" style={{ gridColumn: '1/-1' }}>
              <label className="form-label">Service Name *</label>
              <input className="form-control" placeholder="Full service name" value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Unit Price (₹) *</label>
              <input type="number" className="form-control" placeholder="0.00" value={form.unit_price}
                onChange={e => setForm({ ...form, unit_price: e.target.value })} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea className="form-control" rows={2} value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })} />
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
            {saving ? '⏳ Saving...' : '💾 Add Service'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [filterCat, setFilterCat] = useState('All');

  const load = () => {
    setLoading(true);
    servicesAPI.getAll().then(r => setServices(r.data)).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const filtered = filterCat === 'All' ? services : services.filter(s => s.category === filterCat);

  const summary = CATEGORIES.map(cat => ({
    cat,
    count: services.filter(s => s.category === cat).length,
    color: CAT_COLORS[cat],
  })).filter(s => s.count > 0);

  return (
    <>
      <div className="topbar">
        <div>
          <div className="topbar-title">Services & Pricing</div>
          <div className="topbar-subtitle">{services.length} services configured</div>
        </div>
        <div className="topbar-actions">
          <button className="btn btn-primary" onClick={() => setModal(true)}>➕ Add Service</button>
        </div>
      </div>
      <div className="page-content">
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
          <button
            className={`btn btn-sm ${filterCat === 'All' ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => setFilterCat('All')}
          >
            All ({services.length})
          </button>
          {summary.map(s => (
            <button
              key={s.cat}
              className={`btn btn-sm ${filterCat === s.cat ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => setFilterCat(s.cat)}
              style={filterCat === s.cat ? {} : { borderColor: `${s.color}44`, color: s.color }}
            >
              {s.cat} ({s.count})
            </button>
          ))}
        </div>

        <div className="card" style={{ padding: 0 }}>
          {loading ? (
            <div className="loading"><div className="spinner" /></div>
          ) : filtered.length === 0 ? (
            <div className="empty-state">
              <div className="icon">🏥</div>
              <div>No services found</div>
            </div>
          ) : (
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Code</th><th>Service Name</th><th>Category</th><th>Unit Price</th><th>Description</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(s => (
                    <tr key={s.id}>
                      <td>
                        <span style={{ fontFamily: 'monospace', background: 'var(--glass)', padding: '2px 8px', borderRadius: 4, fontSize: 13, color: 'var(--teal)' }}>
                          {s.code}
                        </span>
                      </td>
                      <td style={{ fontWeight: 500 }}>{s.name}</td>
                      <td>
                        <span style={{ color: CAT_COLORS[s.category], fontSize: 13, fontWeight: 500 }}>
                          ● {s.category}
                        </span>
                      </td>
                      <td style={{ fontWeight: 700, color: 'var(--mint)', fontSize: 15 }}>
                        {formatCurrency(s.unit_price)}
                      </td>
                      <td style={{ color: 'var(--text-secondary)', fontSize: 13 }}>{s.description || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {modal && <ServiceModal onClose={() => setModal(false)} onSave={() => { setModal(false); load(); }} />}
    </>
  );
}