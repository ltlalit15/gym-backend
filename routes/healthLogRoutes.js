const express = require('express');
const { addHealthLog, getAllHealthLogs, getHealthLogById, updateHealthLog, deleteHealthLog } = require('../controller/healthLog');
const authMiddleware = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');


const router = express.Router();

router.post('/addHealthLog', authMiddleware, addHealthLog);
router.get('/getAllHealthLogs', authMiddleware, getAllHealthLogs);
router.get('/getHealthLogById/:id', authMiddleware, getHealthLogById);
router.patch('/updateHealthLog/:id', authMiddleware, updateHealthLog);
router.delete('/deleteHealthLog/:id', authMiddleware, deleteHealthLog);


module.exports = router;    
