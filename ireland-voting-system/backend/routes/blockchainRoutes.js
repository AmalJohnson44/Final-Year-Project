const express = require('express');
const router = express.Router();
const blockchain = require('../blockchain/votingLogic'); // handles contract interaction

router.post('/vote', blockchain.castVote);
router.get('/results', blockchain.getResults);

export default router;
