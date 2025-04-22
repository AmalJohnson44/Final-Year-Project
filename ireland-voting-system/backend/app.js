// backend/app.js

import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

// Get __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env variables
dotenv.config({ path: path.resolve(__dirname, '../.env') });


// Initialize Express
const app = express();


app.use(express.static(path.join(__dirname, '../frontend')));
// Middleware
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
app.use(cors());

// Serve frontend
app.use(express.static(path.join(__dirname, '../frontend')));
app.use(express.urlencoded({ extended: true }));



// Import routes
import authRoutes from './routes/authRoutes.js';
import faceRoutes from './routes/faceRoutes.js';
import abiRoutes from './routes/abiRoutes.js';
import votingRoutes from './routes/votingRoutes.js';
//import authRoutes from './routes/authRoutes.js';
import candidateRoutes from './routes/candidateRoutes.js';
app.use('/api/candidates', candidateRoutes);

import presidentialRoutes from './routes/presidentialCandidates.js';
app.use('/api/presidential-candidates', presidentialRoutes);

import mayorRoutes from './routes/mayorCandidates.js';
app.use('/api', mayorRoutes);




import resultsRoute from './routes/resultsRoute.js';
app.use('/api', resultsRoute);

import privateVoteRoute from './routes/privateVoteRoute.js';
app.use('/api/vote', privateVoteRoute); // NOT just /api


// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/face', faceRoutes);
app.use('/api', abiRoutes); // e.g. /api/abi
app.use('/api/vote', votingRoutes);

// Blockchain utility
import { listAccounts } from './blockchain.js';
listAccounts();

// Optional: Root route to index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Error handler
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.stack);
  res.status(500).send('Server error');
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
