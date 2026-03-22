const router = require('express').Router();
const db = require('../db/connection');

router.post('/', async (req, res) => {
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();
    const { bill_id, amount, payment_date, method, reference_no, notes } = req.body;

    await conn.execute(
      'INSERT INTO payments (bill_id, amount, payment_date, method, reference_no, notes) VALUES (?,?,?,?,?,?)',
      [bill_id, amount, payment_date, method, reference_no, notes]
    );

    const [[bill]] = await conn.execute('SELECT total_amount, paid_amount FROM bills WHERE id = ?', [bill_id]);
    const newPaid = parseFloat(bill.paid_amount) + parseFloat(amount);
    let status = 'Partial';
    if (newPaid >= parseFloat(bill.total_amount)) status = 'Paid';

    await conn.execute(
      'UPDATE bills SET paid_amount = ?, status = ? WHERE id = ?',
      [newPaid, status, bill_id]
    );

    await conn.commit();
    res.status(201).json({ message: 'Payment recorded', status });
  } catch (err) {
    await conn.rollback();
    res.status(500).json({ error: err.message });
  } finally {
    conn.release();
  }
});

router.get('/bill/:bill_id', async (req, res) => {
  try {
    const [rows] = await db.execute(
      'SELECT * FROM payments WHERE bill_id = ? ORDER BY payment_date DESC',
      [req.params.bill_id]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;