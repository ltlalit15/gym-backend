const express = require('express');
const { addBenefit, getAllBenefits, getBenefitById, updateBenefit, deleteBenefit } = require('../controller/membershipBenefits');
const authMiddleware = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');


const router = express.Router();

router.post('/addBenefit', addBenefit);
router.get('/getAllBenefits', getAllBenefits);
router.get('/getBenefitById/:id', getBenefitById);
router.patch('/updateBenefit/:id', updateBenefit);
router.delete('/deleteBenefit/:id', deleteBenefit);


module.exports = router;    
