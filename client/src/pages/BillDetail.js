import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useReactToPrint } from 'react-to-print';
import toast from 'react-hot-toast';
import { billsAPI, paymentsAPI, formatCurrency, formatDate } from '../utils/api';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const BADGE_MAP = {
  Paid: 'badge-paid',
  Pending: 'badge-pending',
  Partial: 'badge-partial',
  Overdue: 'badge-overdue',
  Cancelled: 'badge-cancelled',
  Draft: 'badge-draft'
};

export default function BillDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const printRef = useRef();

  const [bill, setBill] = useState(null);
  const [loading, setLoading] = useState(true);
  const [payModal, setPayModal] = useState(false);
  const [payForm, setPayForm] = useState({
    amount: '',
    payment_date: new Date().toISOString().split('T')[0],
    method: 'Cash',
    reference_no: '',
    notes: ''
  });
  const [paying, setPaying] = useState(false);

  // ✅ FIXED: useCallback added
  const load = useCallback(() => {
    setLoading(true);
    billsAPI.getById(id)
      .then(r => setBill(r.data))
      .catch(() => toast.error('Bill not found'))
      .finally(() => setLoading(false));
  }, [id]);

  // ✅ FIXED: dependency issue resolved
  useEffect(() => {
    load();
  }, [load]);

  const handlePrint = useReactToPrint({
    content: () => printRef.current
  });

  const handleDownloadPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(20);
    doc.setTextColor(0, 180, 216);
    doc.text('MediCare Hospital', 14, 20);

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text('123 Health Avenue, Medical District', 14, 28);
    doc.text('billing@medicare.hospital | +91 1234567890', 14, 34);

    doc.setFontSize(16);
    doc.setTextColor(0);
    doc.text(bill.bill_number, 150, 20);

    autoTable(doc, {
      startY: 50,
      head: [['#', 'Service', 'Qty', 'Price', 'Total']],
      body: bill.items?.map((item, i) => [
        i + 1,
        item.service_name,
        item.quantity,
        formatCurrency(item.unit_price),
        formatCurrency(item.total)
      ]) || []
    });

    doc.save(`${bill.bill_number}.pdf`);
    toast.success('PDF downloaded!');
  };

  const handlePayment = async () => {
    if (!payForm.amount || parseFloat(payForm.amount) <= 0) {
      return toast.error('Enter a valid amount');
    }

    try {
      setPaying(true);
      await paymentsAPI.create({
        bill_id: parseInt(id),
        ...payForm,
        amount: parseFloat(payForm.amount)
      });

      toast.success('Payment recorded!');
      setPayModal(false);
      load();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to record payment');
    } finally {
      setPaying(false);
    }
  };

  const handleCancel = async () => {
    if (!window.confirm('Cancel this bill?')) return;

    await billsAPI.cancel(id);
    toast.success('Bill cancelled');
    load();
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!bill) return null;

  const balance =
    parseFloat(bill.total_amount) - parseFloat(bill.paid_amount);

  return (
    <>
      <div className="topbar">
        <h2>{bill.bill_number}</h2>

        <button onClick={() => navigate('/bills')}>Back</button>
        <button onClick={handlePrint}>Print</button>
        <button onClick={handleDownloadPDF}>Download PDF</button>

        {balance > 0 && (
          <button onClick={() => setPayModal(true)}>
            Record Payment
          </button>
        )}

        <button onClick={handleCancel}>Cancel</button>
      </div>

      <div ref={printRef}>
        <h3>{bill.patient_name}</h3>
        <p>Status: {bill.status}</p>

        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Service</th>
              <th>Qty</th>
              <th>Price</th>
              <th>Total</th>
            </tr>
          </thead>

          <tbody>
            {bill.items?.map((item, i) => (
              <tr key={item.id}>
                <td>{i + 1}</td>
                <td>{item.service_name}</td>
                <td>{item.quantity}</td>
                <td>{formatCurrency(item.unit_price)}</td>
                <td>{formatCurrency(item.total)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <h4>Total: {formatCurrency(bill.total_amount)}</h4>
        <h4>Paid: {formatCurrency(bill.paid_amount)}</h4>
        <h4>Balance: {formatCurrency(balance)}</h4>
      </div>

      {payModal && (
        <div className="modal">
          <h3>Record Payment</h3>

          <input
            type="number"
            placeholder="Amount"
            value={payForm.amount}
            onChange={(e) =>
              setPayForm({ ...payForm, amount: e.target.value })
            }
          />

          <button onClick={handlePayment}>
            {paying ? 'Processing...' : 'Pay'}
          </button>

          <button onClick={() => setPayModal(false)}>
            Cancel
          </button>
        </div>
      )}
    </>
  );
}