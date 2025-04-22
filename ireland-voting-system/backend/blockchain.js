// backend/blockchain.js

import Web3 from 'web3'; // ✅ ES module style

// Create a Web3 instance
const web3 = new Web3('http://localhost:8545');

// Function to list accounts
export async function listAccounts() {
  try {
    const accounts = await web3.eth.getAccounts();
    console.log("✅ Available Ganache accounts:", accounts);
    return accounts;
  } catch (err) {
    console.error("❌ Error fetching accounts:", err);
    return [];
  }
}

// Optional: immediately invoke for standalone test run
if (import.meta.url === `file://${process.argv[1]}`) {
  listAccounts();
}
