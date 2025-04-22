// getVotes.js
import Web3 from 'web3';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const web3 = new Web3('http://localhost:8545');

const abi = JSON.parse(fs.readFileSync(path.resolve(__dirname, './contracts/Voting.json'))).abi;
const { address } = JSON.parse(fs.readFileSync(path.resolve(__dirname, './contracts/contractAddress.json')));

const contract = new web3.eth.Contract(abi, address);

const fetchResults = async () => {
  const candidates = await contract.methods.getCandidates().call();
  console.log("📋 Vote Counts:");

  for (const name of candidates) {
    const votes = await contract.methods.totalVotesFor(name).call();
    console.log(`🗳️ ${name}: ${votes} vote(s)`);
  }

  process.exit();
};

fetchResults().catch(console.error);
