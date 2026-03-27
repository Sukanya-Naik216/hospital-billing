import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { patientsAPI } from '../utils/api';

const GENDERS = ['Male', 'Female', 'Other'];

function PatientModal({ patient, onClose, onSave }) {
  const isEdit = !!patient?.id;
  const [form, setForm] = useState(
    patient || { patient_id: '', name: '', age: '', gender: 'Male', phone: '', email: '', address: '', insurance_provider: '', insurance_id: '' }
  );
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!form.name || !form.patient_id) return toast.error('Name and Patient ID are required');
    try {
      setSaving(true);
      if (isEdit) await patientsAPI.update(patient.id, form);
      else await patientsAPI.create(form);
      toast.success(`Patient ${isEdit ? 'updated' : 'created'}!`);
      onSave();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to save patient');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" style={{ maxWidth: 700 }} onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">{isEdit ? '✏️ Edit Patient' : '👤 New Patient'}</div>
          <button className="btn btn-ghost btn-sm" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Patient ID *</label>
              <input className="form-control" placeholder="PAT006" value={form.patient_id}
                onChange={e => setForm({ ...form, patient_id: e.target.value })} disabled={isEdit} />
            </div>
            <div className="form-group">
              <label className="form-label">Full Name *</label>
              <input className="form-control" placeholder="Full name" value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Age</label>
              <input type="number" className="form-control" value={form.age}
                onChange={e => setForm({ ...form, age: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Gender</label>
              <select className="form-control" value={form.gender} onChange={e => setForm({ ...form, gender: e.target.value })}>
                {GENDERS.map(g => <option key={g}>{g}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Phone</label>
              <input className="form-control" placeholder="Phone number" value={form.phone}
                onChange={e => setForm({ ...form, phone: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input type="email" className="form-control" placeholder="Email address" value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Insurance Provider</label>
              <input className="form-control" placeholder="e.g. Star Health" value={form.insurance_provider}
                onChange={e => setForm({ ...form, insurance_provider: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Insurance ID</label>
              <input className="form-control" placeholder="Policy number" value={form.insurance_id}
                onChange={e => setForm({ ...form, insurance_id: e.target.value })} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Address</label>
            <textarea className="form-control" rows={2} value={form.address}
              onChange={e => setForm({ ...form, address: e.target.value })} />
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
            {saving ? '⏳ Saving...' : '💾 Save Patient'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Patients() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(null);

  const load = (s) => {
    setLoading(true);
    patientsAPI.getAll(s).then(r => setPatients(r.data)).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleSearch = (e) => {
    setSearch(e.target.value);
    load(e.target.value);
  };

  const handleSave = () => {
    setModal(null);
    load(search);
  };

  return (
    <>
      <div className="topbar">
        <div>
          <div className="topbar-title">Patients</div>
          <div className="topbar-subtitle">{patients.length} patient{patients.length !== 1 ? 's' : ''} registered</div>
        </div>
        <div className="topbar-actions">
          <button className="btn btn-primary" onClick={() => setModal('new')}>➕ New Patient</button>
        </div>
      </div>
      <div className="page-content">
        <div style={{ marginBottom: 20 }}>
          <div className="search-bar">
            🔍
            <input placeholder="Search by name, ID, phone..." value={search} onChange={handleSearch} />
          </div>
        </div>
        <div className="card" style={{ padding: 0 }}>
          {loading ? (
            <div className="loading"><div className="spinner" /></div>
          ) : patients.length === 0 ? (
            <div className="empty-state">
              <div className="icon">👥</div>
              <div>No patients found</div>
              <button className="btn btn-primary" style={{ marginTop: 12 }} onClick={() => setModal('new')}>Register Patient</button>
            </div>
          ) : (
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Patient ID</th><th>Name</th><th>Age / Gender</th>
                    <th>Phone</th><th>Insurance</th><th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {patients.map(p => (
                    <tr key={p.id}>
                      <td style={{ color: 'var(--teal)', fontWeight: 600 }}>{p.patient_id}</td>
                      <td>
                        <div style={{ fontWeight: 500 }}>{p.name}</div>
                        <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{p.email}</div>
                      </td>
                      <td style={{ color: 'var(--text-secondary)' }}>{p.age ? `${p.age} yrs` : '—'} · {p.gender}</td>
                      <td>{p.phone || '—'}</td>
                      <td>
                        {p.insurance_provider
                          ? <span style={{ color: 'var(--mint)', fontSize: 13 }}>🛡 {p.insurance_provider}</span>
                          : <span style={{ color: 'var(--text-secondary)', fontSize: 13 }}>Self Pay</span>
                        }
                      </td>
                      <td>
                        <button className="btn btn-ghost btn-sm" onClick={() => setModal(p)}>✏️ Edit</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {modal && (
        <PatientModal
          patient={modal === 'new' ? null : modal}
          onClose={() => setModal(null)}
          onSave={handleSave}
        />
      )}
    </>
  );
}