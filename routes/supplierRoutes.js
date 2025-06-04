const express = require('express');
const { addSupplier, getAllSuppliers, getSupplierById, updateSupplier, deleteSupplier } = require('../controller/supplier');
const authMiddleware = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');


const router = express.Router();

router.post('/addSupplier', addSupplier);
router.get('/getAllSuppliers', getAllSuppliers);
router.get('/getSupplierById/:id', getSupplierById);
router.patch('/updateSupplier/:id', updateSupplier);
router.delete('/deleteSupplier/:id', deleteSupplier);


module.exports = router;    
