import express from 'express';
import db from '../config/db.js';
const router = express.Router();

router.get('/mayor-candidates', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM mayor_candidates');
    res.json(rows);
  } catch (err) {
    console.error("❌ Error fetching mayor candidates:", err);
    res.status(500).json({ error: 'Failed to fetch mayor candidates' });
  }
});

export default router;
