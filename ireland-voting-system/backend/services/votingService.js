
import Web3 from 'web3';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Setup paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read ABI and Contract Address
const contractJson = JSON.parse(fs.readFileSync(path.join(__dirname, '../contracts/Voting.json'), 'utf8'));
const contractAddressJson = JSON.parse(fs.readFileSync(path.join(__dirname, '../contracts/contractAddress.json'), 'utf8'));

const web3 = new Web3('http://localhost:8545');
const contract = new web3.eth.Contract(contractJson.abi, contractAddressJson.address);

export default contract;
