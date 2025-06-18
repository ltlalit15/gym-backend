const express = require('express');
const { addCheckInLog, getAllCheckInLogs, getCheckInLogById, updateCheckInLog, deleteCheckInLog } = require('../controller/checkInLog');
const authMiddleware = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');


const router = express.Router();

router.post('/addCheckInLog', authMiddleware, addCheckInLog);
router.get('/getAllCheckInLogs', authMiddleware, getAllCheckInLogs);
router.get('/getCheckInLogById/:id', authMiddleware, getCheckInLogById);
router.patch('/updateCheckInLog/:id', authMiddleware, updateCheckInLog);
router.delete('/deleteCheckInLog/:id', authMiddleware, deleteCheckInLog);


module.exports = router;    
