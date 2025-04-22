import express from 'express';
import contract from '../services/votingService.js';
import Web3 from 'web3';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Setup path for .env
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const router = express.Router();
const web3 = new Web3('http://localhost:8545');
const PRIVATE_KEY = process.env.GANACHE_PRIVATE_KEY;

if (!PRIVATE_KEY) {
  throw new Error("❌ GANACHE_PRIVATE_KEY missing in .env");
}

const account = web3.eth.accounts.privateKeyToAccount(PRIVATE_KEY);
web3.eth.accounts.wallet.add(account);
web3.eth.defaultAccount = account.address;

router.post('/private-vote', async (req, res) => {
  const { votes } = req.body;

  console.log("📥 Incoming vote request:", req.body);

  if (!votes || !Array.isArray(votes) || votes.length === 0) {
    return res.status(400).json({ msg: "Votes must be a non-empty array" });
  }

  // Normalize input (trim and ensure it's a string)
  const candidates = votes.map(v => v.candidate.trim());
  const priorities = votes.map(v => parseInt(v.priority));

  console.log("🧾 Submitted Candidates:", candidates);
  console.log("🔢 Priorities:", priorities);

  try {
    // 🧠 Load blockchain candidates for comparison
    const onChainCandidates = await contract.methods.getCandidates().call();
    console.log("📦 On-chain candidates:", onChainCandidates);


    router.post('/private', async (req, res) => {
        const { votes } = req.body;
      
        if (!votes || votes.length === 0) {
          return res.status(400).json({ msg: 'No vote data submitted' });
        }
      
        try {
          const candidateName = votes[0].candidate;
          const result = await voteWithPrivateKey(candidateName);
          res.json({ msg: "Vote cast", tx: result.transactionHash });
        } catch (err) {
          console.error("Private vote error:", err);
          res.status(500).json({ msg: err.message || 'Vote failed' });
        }
      });
      



    // Optional debug: ensure all submitted candidates exist on-chain
    for (const c of candidates) {
      if (!onChainCandidates.includes(c)) {
        return res.status(400).json({
          msg: `❌ Candidate '${c}' not found on blockchain.`,
          expected: onChainCandidates
        });
      }
    }

    // 🧾 Call the smart contract
    const receipt = await contract.methods.voteWithPriority(candidates, priorities).send({
      from: account.address,
      gas: 600000
    });

    res.json({
      msg: '✅ Vote submitted to blockchain',
      tx: receipt.transactionHash
    });

  } catch (err) {
    console.error('❌ Blockchain vote failed:', err.message);
    res.status(500).json({
      msg: 'Blockchain vote failed',
      error: err.message,
    });
  }
});

export default router;
