const router = require('express').Router();
const db = require('../db/connection');

router.get('/', async (req, res) => {
  try {
    const { search } = req.query;
    let query = 'SELECT * FROM patients';
    let params = [];
    if (search) {
      query += ' WHERE name LIKE ? OR patient_id LIKE ? OR phone LIKE ?';
      params = [`%${search}%`, `%${search}%`, `%${search}%`];
    }
    query += ' ORDER BY created_at DESC';
    const [rows] = await db.execute(query, params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM patients WHERE id = ?', [req.params.id]);
    if (!rows.length) return res.status(404).json({ error: 'Patient not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { patient_id, name, age, gender, phone, email, address, insurance_provider, insurance_id } = req.body;
    const [result] = await db.execute(
      'INSERT INTO patients (patient_id, name, age, gender, phone, email, address, insurance_provider, insurance_id) VALUES (?,?,?,?,?,?,?,?,?)',
      [patient_id, name, age, gender, phone, email, address, insurance_provider, insurance_id]
    );
    res.status(201).json({ id: result.insertId, message: 'Patient created' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { name, age, gender, phone, email, address, insurance_provider, insurance_id } = req.body;
    await db.execute(
      'UPDATE patients SET name=?, age=?, gender=?, phone=?, email=?, address=?, insurance_provider=?, insurance_id=? WHERE id=?',
      [name, age, gender, phone, email, address, insurance_provider, insurance_id, req.params.id]
    );
    res.json({ message: 'Patient updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;