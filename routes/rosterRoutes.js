const express = require('express');
const { addRoster, getAllRosters, getRosterById, updateRoster, deleteRoster } = require('../controller/roster');
const authMiddleware = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');


const router = express.Router();

router.post('/addRoster', addRoster);
router.get('/getAllRosters', getAllRosters);
router.get('/getRosterById/:id', getRosterById);
router.patch('/updateRoster/:id', updateRoster);
router.delete('/deleteRoster/:id', deleteRoster);


module.exports = router;    
