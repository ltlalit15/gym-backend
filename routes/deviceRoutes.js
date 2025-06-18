const express = require('express');
const { addDevice, getAllDevices, getDeviceById, updateDevice, deleteDevice } = require('../controller/device');
const authMiddleware = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');


const router = express.Router();

router.post('/addDevice', authMiddleware, addDevice);
router.get('/getAllDevices', authMiddleware, getAllDevices);
router.get('/getDeviceById/:id', authMiddleware, getDeviceById);
router.patch('/updateDevice/:id', authMiddleware, updateDevice);
router.delete('/deleteDevice/:id', authMiddleware, deleteDevice);


module.exports = router;    
