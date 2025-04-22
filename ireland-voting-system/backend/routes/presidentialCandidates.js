import express from 'express';
import db from '../config/db.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM presidential_candidates');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch presidential_candidates' });
  }
});

export default router;