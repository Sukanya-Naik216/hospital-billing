const router = require('express').Router();
const db = require('../db/connection');

router.get('/', async (req, res) => {
  try {
    const { status, patient_id } = req.query;
    let query = `
      SELECT b.*, p.name AS patient_name, p.patient_id AS patient_code, p.phone
      FROM bills b
      JOIN patients p ON b.patient_id = p.id
    `;
    const params = [];
    const conditions = [];
    if (status) { conditions.push('b.status = ?'); params.push(status); }
    if (patient_id) { conditions.push('b.patient_id = ?'); params.push(patient_id); }
    if (conditions.length) query += ' WHERE ' + conditions.join(' AND ');
    query += ' ORDER BY b.created_at DESC';
    const [rows] = await db.execute(query, params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const [[bill]] = await db.execute(
      `SELECT b.*, p.name AS patient_name, p.patient_id AS patient_code,
              p.phone, p.email, p.insurance_provider, p.insurance_id, p.address
       FROM bills b JOIN patients p ON b.patient_id = p.id WHERE b.id = ?`,
      [req.params.id]
    );
    if (!bill) return res.status(404).json({ error: 'Bill not found' });

    const [items] = await db.execute(
      `SELECT bi.*, s.name AS service_name, s.category, s.code AS service_code
       FROM bill_items bi JOIN services s ON bi.service_id = s.id WHERE bi.bill_id = ?`,
      [req.params.id]
    );

    const [payments] = await db.execute(
      'SELECT * FROM payments WHERE bill_id = ? ORDER BY payment_date DESC',
      [req.params.id]
    );

    res.json({ ...bill, items, payments });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();
    const { patient_id, bill_date, due_date, items, discount_percent = 0, tax_percent = 0, notes } = req.body;

    const [[{ count }]] = await conn.execute('SELECT COUNT(*) AS count FROM bills');
    const bill_number = `BILL-${new Date().getFullYear()}-${String(count + 1).padStart(5, '0')}`;

    let subtotal = 0;
    for (const item of items) {
      subtotal += item.unit_price * item.quantity;
    }
    const discount = subtotal * (discount_percent / 100);
    const afterDiscount = subtotal - discount;
    const tax = afterDiscount * (tax_percent / 100);
    const total_amount = afterDiscount + tax;

    const [result] = await conn.execute(
      `INSERT INTO bills (bill_number, patient_id, bill_date, due_date, subtotal, discount_percent, tax_percent, total_amount, notes)
       VALUES (?,?,?,?,?,?,?,?,?)`,
      [bill_number, patient_id, bill_date, due_date, subtotal, discount_percent, tax_percent, total_amount, notes]
    );

    const billId = result.insertId;
    for (const item of items) {
      await conn.execute(
        'INSERT INTO bill_items (bill_id, service_id, quantity, unit_price, total) VALUES (?,?,?,?,?)',
        [billId, item.service_id, item.quantity, item.unit_price, item.unit_price * item.quantity]
      );
    }

    await conn.commit();
    res.status(201).json({ id: billId, bill_number, message: 'Bill created' });
  } catch (err) {
    await conn.rollback();
    res.status(500).json({ error: err.message });
  } finally {
    conn.release();
  }
});

router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    await db.execute('UPDATE bills SET status = ? WHERE id = ?', [status, req.params.id]);
    res.json({ message: 'Status updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await db.execute('UPDATE bills SET status = ? WHERE id = ?', ['Cancelled', req.params.id]);
    res.json({ message: 'Bill cancelled' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;