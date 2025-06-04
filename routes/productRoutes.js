const express = require('express');
const { addProduct, getAllProducts, getProductById, updateProduct, deleteProduct } = require('../controller/product');
const authMiddleware = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');


const router = express.Router();

router.post('/addProduct', addProduct);
router.get('/getAllProducts', getAllProducts);
router.get('/getProductById/:id', getProductById);
router.patch('/updateProduct/:id', updateProduct);
router.delete('/deleteProduct/:id', deleteProduct);


module.exports = router;    
