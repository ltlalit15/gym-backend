const express = require('express');
const { addAlert, getAllAlerts, getAlertById, updateAlert, deleteAlert } = require('../controller/alerts');
const authMiddleware = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');


const router = express.Router();

router.post('/addAlert', authMiddleware, addAlert);
router.get('/getAllAlerts', authMiddleware, getAllAlerts);
router.get('/getAlertById/:id', authMiddleware, getAlertById);
router.patch('/updateAlert/:id', authMiddleware, updateAlert);
router.delete('/deleteAlert/:id', authMiddleware, deleteAlert);


module.exports = router;    
