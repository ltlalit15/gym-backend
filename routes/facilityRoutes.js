const express = require('express');
const { addFacility, getAllFacilities, getFacilityById, updateFacility, deleteFacility } = require('../controller/facility');
const authMiddleware = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');


const router = express.Router();

router.post('/addFacility', authMiddleware, addFacility);
router.get('/getAllFacilities', authMiddleware, getAllFacilities);
router.get('/getFacilityById/:id', authMiddleware, getFacilityById);
router.patch('/updateFacility/:id', authMiddleware, updateFacility);
router.delete('/deleteFacility/:id', authMiddleware, deleteFacility);


module.exports = router;    
