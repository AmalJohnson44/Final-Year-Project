import express from 'express';
import contract from '../services/votingService.js';
import Web3 from 'web3';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const router = express.Router();
const web3 = new Web3('http://localhost:8545');

const PRIVATE_KEY = process.env.GANACHE_PRIVATE_KEY;
if (!PRIVATE_KEY) {
  console.error("❌ Missing GANACHE_PRIVATE_KEY in .env");
  process.exit(1);
}

const account = web3.eth.accounts.privateKeyToAccount(PRIVATE_KEY);
web3.eth.accounts.wallet.add(account);
web3.eth.defaultAccount = account.address;

// Fetch candidate list from smart contract
router.get('/candidates', async (req, res) => {
  try {
    const candidates = await contract.methods.getCandidates().call();
    res.json(candidates);
  } catch (err) {
    console.error('Error fetching candidates:', err);
    res.status(500).json({ msg: 'Failed to fetch candidates' });
  }
});

// Vote endpoint using private key
router.post('/vote/private', async (req, res) => {
  const { candidate } = req.body;
  if (!candidate) return res.status(400).json({ msg: 'Candidate name required' });

  try {
    console.log(`🗳️ Voting via private key for: ${candidate}`);

    const tx = await contract.methods.vote(candidate).send({ from: account.address, gas: 300000 });
    console.log("✅ Vote cast successfully:", tx.transactionHash);

    res.status(200).json({ msg: 'Vote submitted successfully', txHash: tx.transactionHash });
  } catch (err) {
    console.error('❌ Voting error:', err);
    res.status(500).json({ msg: 'Failed to submit vote', error: err.message });
  }
});

export default router;
