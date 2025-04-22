import express from 'express';
import contract from '../services/votingService.js';

const router = express.Router();

// GET /api/blockchain-results
router.get('/blockchain-results', async (req, res) => {
  try {
    const candidates = await contract.methods.getCandidates().call();

    const results = await Promise.all(
      candidates.map(async (candidate) => {
        const votes = await contract.methods.totalVotesFor(candidate).call();
        return { candidate, votes };
      })
    );

    res.json({ results });
  } catch (err) {
    console.error("❌ Failed to fetch blockchain results:", err);
    res.status(500).json({ msg: 'Unable to fetch results' });
  }
});

export default router;
