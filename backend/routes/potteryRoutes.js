const express = require('express');
const upload = require('../middleware/multer'); // Import the multer configuration
const { getAllPottery, createPottery, updatePottery } = require('../controllers/potteryController');

const router = express.Router();

router.get('/allpottery', getAllPottery);
router.post('/upload', upload.single('photo'), createPottery);
router.put('/:id', upload.single('photo'), updatePottery);

module.exports = router;
