import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { patientsAPI, servicesAPI, billsAPI, formatCurrency } from '../utils/api';

export default function NewBill() {
  const navigate = useNavigate();

  const [patients, setPatients] = useState([]);
  const [services, setServices] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const today = new Date().toISOString().split('T')[0];
  const due = new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0];

  const [form, setForm] = useState({
    patient_id: '',
    bill_date: today,
    due_date: due,
    discount_percent: 0,
    tax_percent: 5,
    notes: '',
  });

  const [items, setItems] = useState([
    { service_id: '', quantity: 1, unit_price: 0 }
  ]);

  useEffect(() => {
    patientsAPI.getAll().then(r => setPatients(r.data));
    servicesAPI.getAll().then(r => setServices(r.data));
  }, []);

  const handleServiceChange = (idx, service_id) => {
    const svc = services.find(s => s.id === parseInt(service_id));

    setItems(prev =>
      prev.map((item, i) =>
        i === idx
          ? {
              ...item,
              service_id,
              unit_price: svc ? svc.unit_price : 0
            }
          : item
      )
    );
  };

  const addItem = () =>
    setItems(prev => [
      ...prev,
      { service_id: '', quantity: 1, unit_price: 0 }
    ]);

  const removeItem = (idx) =>
    setItems(prev => prev.filter((_, i) => i !== idx));

  const subtotal = items.reduce(
    (s, it) => s + (it.unit_price * it.quantity),
    0
  );

  const discount = subtotal * (form.discount_percent / 100);
  const afterDiscount = subtotal - discount;
  const tax = afterDiscount * (form.tax_percent / 100);
  const total = afterDiscount + tax;

  const handleSubmit = async () => {
    if (!form.patient_id) {
      return toast.error('Please select a patient');
    }

    if (!items.some(it => it.service_id)) {
      return toast.error('Add at least one service');
    }

    try {
      setSubmitting(true);

      const res = await billsAPI.create({
        ...form,
        patient_id: parseInt(form.patient_id),
        items: items
          .filter(it => it.service_id)
          .map(it => ({
            service_id: parseInt(it.service_id),
            quantity: parseInt(it.quantity),
            unit_price: parseFloat(it.unit_price),
          })),
      });

      toast.success(`Bill ${res.data.bill_number} created!`);
      navigate(`/bills/${res.data.id}`);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to create bill');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div className="topbar">
        <div>
          <div className="topbar-title">New Bill</div>
          <div className="topbar-subtitle">Create a new patient bill</div>
        </div>

        <div className="topbar-actions">
          <button className="btn btn-ghost" onClick={() => navigate('/bills')}>
            Cancel
          </button>

          <button
            className="btn btn-primary"
            onClick={handleSubmit}
            disabled={submitting}
          >
            {submitting ? '⏳ Saving...' : '💾 Save Bill'}
          </button>
        </div>
      </div>

      <div
        className="page-content"
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 320px',
          gap: 24,
          alignItems: 'start'
        }}
      >
        {/* LEFT SIDE */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div className="card" style={{ padding: 24 }}>
            <h3 style={{ marginBottom: 18 }}>Bill Information</h3>

            <div className="grid-2">
              <div className="form-group">
                <label>Patient *</label>
                <select
                  className="form-control"
                  value={form.patient_id}
                  onChange={e =>
                    setForm({ ...form, patient_id: e.target.value })
                  }
                >
                  <option value="">Select Patient</option>
                  {patients.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.patient_id} — {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Bill Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={form.bill_date}
                  onChange={e =>
                    setForm({ ...form, bill_date: e.target.value })
                  }
                />
              </div>

              <div className="form-group">
                <label>Due Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={form.due_date}
                  onChange={e =>
                    setForm({ ...form, due_date: e.target.value })
                  }
                />
              </div>
            </div>
          </div>

          {/* SERVICES */}
          <div className="card" style={{ padding: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <h3>Services</h3>
              <button className="btn btn-ghost btn-sm" onClick={addItem}>
                + Add Service
              </button>
            </div>

            {items.map((item, idx) => {
              const svc = services.find(
                s => s.id === parseInt(item.service_id)
              );

              return (
                <div key={idx} style={{ marginTop: 12 }}>
                  <select
                    className="form-control"
                    value={item.service_id}
                    onChange={e =>
                      handleServiceChange(idx, e.target.value)
                    }
                  >
                    <option value="">Select service</option>
                    {services.map(s => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>

                  <input
                    type="number"
                    value={item.quantity}
                    onChange={e =>
                      setItems(prev =>
                        prev.map((it, i) =>
                          i === idx
                            ? {
                                ...it,
                                quantity:
                                  parseInt(e.target.value) || 1
                              }
                            : it
                        )
                      )
                    }
                  />

                  <div>
                    {formatCurrency(item.unit_price * item.quantity)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* SUMMARY */}
        <div className="card" style={{ padding: 24 }}>
          <h3>Summary</h3>

          <p>Subtotal: {formatCurrency(subtotal)}</p>
          <p>Discount: -{formatCurrency(discount)}</p>
          <p>Tax: +{formatCurrency(tax)}</p>

          <h2>Total: {formatCurrency(total)}</h2>

          <button
            className="btn btn-primary"
            onClick={handleSubmit}
            disabled={submitting}
          >
            {submitting ? '⏳ Creating...' : 'Create Bill'}
          </button>
        </div>
      </div>
    </>
  );
}