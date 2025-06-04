const express = require('express');
const { addProductType, getAllProductTypes, getProductTypesById, updateProductType, deleteProductType  } = require('../controller/productType');
const authMiddleware = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');


const router = express.Router();

router.post('/addProductType', addProductType);
router.get('/getAllProductTypes', getAllProductTypes);
router.get('/getProductTypesById/:id', getProductTypesById);
router.patch('/updateProductType/:id', updateProductType);
router.delete('/deleteProductType/:id', deleteProductType);


module.exports = router;    
