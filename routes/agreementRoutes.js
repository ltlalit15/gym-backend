const express = require('express');
const { addAgreement, getAllAgreements, getAgreementById, updateAgreement, deleteAgreement } = require('../controller/agreement');
const authMiddleware = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');


const router = express.Router();

router.post('/addAgreement', addAgreement);
router.get('/getAllAgreements', getAllAgreements);
router.get('/getAgreementById/:id', getAgreementById);
router.patch('/updateAgreement/:id', updateAgreement);
router.delete('/deleteAgreement/:id', deleteAgreement);


module.exports = router;    
