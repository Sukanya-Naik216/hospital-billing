const router = require('express').Router();
const db = require('../db/connection');

router.get('/stats', async (req, res) => {
  try {
    const [[totals]] = await db.execute(`
      SELECT
        COUNT(*) AS total_bills,
        SUM(total_amount) AS total_revenue,
        SUM(paid_amount) AS total_collected,
        SUM(total_amount - paid_amount) AS total_outstanding,
        SUM(CASE WHEN status='Paid' THEN 1 ELSE 0 END) AS paid_count,
        SUM(CASE WHEN status='Pending' THEN 1 ELSE 0 END) AS pending_count,
        SUM(CASE WHEN status='Overdue' THEN 1 ELSE 0 END) AS overdue_count
      FROM bills WHERE status != 'Cancelled'
    `);

    const [monthlyRevenue] = await db.execute(`
      SELECT DATE_FORMAT(bill_date, '%b %Y') AS month,
             SUM(total_amount) AS revenue,
             SUM(paid_amount) AS collected
      FROM bills
      WHERE bill_date >= DATE_SUB(NOW(), INTERVAL 6 MONTH) AND status != 'Cancelled'
      GROUP BY DATE_FORMAT(bill_date, '%Y-%m')
      ORDER BY bill_date ASC
    `);

    const [categoryRevenue] = await db.execute(`
      SELECT s.category, SUM(bi.total) AS total
      FROM bill_items bi
      JOIN services s ON bi.service_id = s.id
      JOIN bills b ON bi.bill_id = b.id
      WHERE b.status != 'Cancelled'
      GROUP BY s.category
      ORDER BY total DESC
    `);

    const [recentBills] = await db.execute(`
      SELECT b.bill_number, p.name AS patient_name, b.total_amount, b.status, b.bill_date
      FROM bills b JOIN patients p ON b.patient_id = p.id
      ORDER BY b.created_at DESC LIMIT 5
    `);

    res.json({ totals, monthlyRevenue, categoryRevenue, recentBills });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;