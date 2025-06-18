const express = require('express');
const { addFacilityCategory, getAllFacilityCategories, getFacilityCategoryById, updateFacilityCategory, deleteFacilityCategory } = require('../controller/facilityCategory');
const authMiddleware = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');


const router = express.Router();

router.post('/addFacilityCategory', authMiddleware, addFacilityCategory);
router.get('/getAllFacilityCategories', authMiddleware, getAllFacilityCategories);
router.get('/getFacilityCategoryById/:id', authMiddleware, getFacilityCategoryById);
router.patch('/updateFacilityCategory/:id', authMiddleware, updateFacilityCategory);
router.delete('/deleteFacilityCategory/:id', authMiddleware, deleteFacilityCategory);


module.exports = router;    
