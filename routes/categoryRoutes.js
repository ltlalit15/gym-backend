const express = require('express');
const { addCategory, getAllCategories, getCategoryById, updateCategory, deleteCategory  } = require('../controller/category');
const authMiddleware = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');


const router = express.Router();

router.post('/addCategory', authMiddleware, addCategory);
router.get('/getAllCategories', authMiddleware, getAllCategories);
router.get('/getCategoryById/:id', authMiddleware, getCategoryById);
router.patch('/updateCategory/:id', authMiddleware, updateCategory);
router.delete('/deleteCategory/:id', authMiddleware, deleteCategory);


module.exports = router;    
