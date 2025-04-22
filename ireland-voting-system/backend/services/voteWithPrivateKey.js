// backend/services/voteWithPrivateKey.js
import Web3 from 'web3';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const web3 = new Web3('http://localhost:8545');

const contractData = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../contracts/Voting.json')));
const contractAddress = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../contracts/contractAddress.json'))).address;

const abi = contractData.abi;
const address = contractAddress;

const PRIVATE_KEY = process.env.GANACHE_PRIVATE_KEY;

if (!PRIVATE_KEY || !PRIVATE_KEY.startsWith('0x')) {
  throw new Error("❌ Invalid or missing GANACHE_PRIVATE_KEY in .env");
}

const account = web3.eth.accounts.privateKeyToAccount(PRIVATE_KEY);
web3.eth.accounts.wallet.add(account);
web3.eth.defaultAccount = account.address;

const contract = new web3.eth.Contract(abi, address);

export const voteForCandidate = async (candidateName) => {
  try {
    console.log(`🗳️ Voting for ${candidateName} from ${account.address}`);
    const tx = await contract.methods.vote(candidateName).send({
      from: account.address,
      gas: 200000,
    });
    console.log("✅ Vote cast successfully:", tx.transactionHash);
    return tx.transactionHash;
  } catch (err) {
    console.error("❌ Vote failed:", err.message);
    throw err;
  }
};
