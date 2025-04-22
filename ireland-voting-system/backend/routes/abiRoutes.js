import express from 'express';
import fs from 'fs';
import path from 'path';

const router = express.Router();

router.get('/abi', (req, res) => {
  try {
    const abi = JSON.parse(fs.readFileSync(path.join('backend/contracts/Voting.json'), 'utf-8')).abi;
    const address = JSON.parse(fs.readFileSync(path.join('backend/contracts/contractAddress.json'), 'utf-8')).address;

    res.json({ abi, address });
  } catch (err) {
    console.error("❌ Failed to load contract data:", err);
    res.status(500).json({ error: 'Unable to fetch contract ABI or address' });
  }
});

export default router;
