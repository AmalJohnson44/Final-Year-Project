import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';
import Web3 from 'web3';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

async function deployVotingContract() {
  try {
    console.log("🔌 Connecting to Ganache...");
    const web3 = new Web3('http://localhost:8545');
    await web3.eth.net.isListening();
    console.log(" Connected to Ganache");

    const accounts = await web3.eth.getAccounts();
    const from = accounts[0];
    const balance = await web3.eth.getBalance(from);
    console.log(" Deployer address:", from);
    console.log(" Balance:", web3.utils.fromWei(balance, 'ether'), 'ETH');

    console.log("📦 Connecting to MySQL...");
    const db = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASS || '',
      database: process.env.DB_NAME || 'voting_system'
    });
    console.log(" MySQL connected");

    console.log("📂 Reading compiled Voting.json...");
    const artifactPath = path.resolve(__dirname, './contracts/Voting.json');
    if (!fs.existsSync(artifactPath)) throw new Error(" Voting.json not found. Compile first.");
    const { abi, bytecode } = JSON.parse(fs.readFileSync(artifactPath, 'utf8'));
    if (!bytecode || bytecode.length < 10) throw new Error(" Invalid or missing bytecode");

    console.log("🗃 Fetching candidates from database...");
    const [rows] = await db.query('SELECT name FROM candidates');
    const candidateNames = rows.map(row => row.name.trim());

    console.log("🧾 Candidates:");
    const encodedCandidates = candidateNames.map((name) => {
      const hex = web3.utils.asciiToHex(name);
      const byteLength = Buffer.from(name).length;
      console.log(` - ${name} (${byteLength} bytes) → ${hex}`);
      if (byteLength > 32) throw new Error(` Candidate too long (>32 bytes): "${name}"`);
      return hex;
    });

    console.log("⚙️ Deploying contract...");
    const contract = new web3.eth.Contract(abi);
    const deployTx = contract.deploy({
      data: bytecode.startsWith('0x') ? bytecode : '0x' + bytecode,
      arguments: [encodedCandidates]
    });

    console.log("🧪 Contract constructor arguments (bytes32[]):", encodedCandidates);
    const gasEstimate = await deployTx.estimateGas({ from });
const gasWithBuffer = Math.floor(Number(gasEstimate) * 1.5);
const gasPrice = await web3.eth.getGasPrice();

console.log(`⛽ Estimated Gas: ${gasEstimate}`);
console.log(`⛽ Gas Price: ${web3.utils.fromWei(gasPrice, 'gwei')} gwei`);

const deployed = await deployTx.send({
  from,
  gas: gasWithBuffer,                 
  gasPrice: gasPrice.toString()       
});

    const address = deployed.options.address;
    const txHash = deployed.transactionHash;

    console.log(" Deployed at:", address);
    console.log(" Tx Hash:", txHash);

    const outputPath = path.resolve(__dirname, './contracts/contractAddress.json');
    fs.writeFileSync(outputPath, JSON.stringify({
      network: "ganache",
      address,
      abi,
      deployer: from,
      transactionHash: txHash,
      candidates: candidateNames,
      timestamp: new Date().toISOString()
    }, null, 2));
    console.log(`📦 Saved to: ${outputPath}`);

    await db.end();
    process.exit(0);
  } catch (err) {
    console.error(" Deployment failed:", err);
    process.exit(1);
  }
}

deployVotingContract();
