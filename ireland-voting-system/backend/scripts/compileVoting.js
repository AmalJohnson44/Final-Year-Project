// compileVoting.js
import fs from 'fs';
import path from 'path';
import solc from 'solc';

// Resolve path to Voting.sol
const contractPath = path.resolve('./backend/contracts/Voting.sol');
const contractSource = fs.readFileSync(contractPath, 'utf8');

// Solidity compiler input format
const input = {
  language: 'Solidity',
  sources: {
    'Voting.sol': {
      content: contractSource,
    },
  },
  settings: {
    outputSelection: {
      '*': {
        '*': ['abi', 'evm.bytecode.object'],
      },
    },
  },
};

// Compile the contract
const compiled = JSON.parse(solc.compile(JSON.stringify(input)));

// Extract compiled Voting contract
const contract = compiled.contracts['Voting.sol']?.Voting;

if (!contract) {
  console.error("❌ Voting contract not found in compilation output");
  process.exit(1);
}

const abi = contract.abi;
const bytecode = contract.evm.bytecode.object;

// Validate ABI and bytecode
if (!abi || !Array.isArray(abi) || abi.length === 0) {
  console.error("❌ ABI is invalid or empty");
  process.exit(1);
}

if (!bytecode || bytecode === '0x' || bytecode.length < 10) {
  console.error("❌ Bytecode is invalid or empty");
  process.exit(1);
}

// Output path
const outputPath = path.resolve('./backend/contracts/Voting.json');
fs.writeFileSync(outputPath, JSON.stringify({ abi, bytecode }, null, 2));

console.log("✅ Voting.sol compiled successfully");
console.log(`📦 ABI length: ${abi.length}`);
console.log(`📦 Bytecode size: ${bytecode.length}`);
console.log(`📝 Output written to: ${outputPath}`);
