const express = require('express');
const { addClass, getAllClass, getClassById, updateClass, deleteClass } = require('../controller/class');
const authMiddleware = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');


const router = express.Router();

router.post('/addClass', addClass);
router.get('/getAllClass', getAllClass);
router.get('/getClassById/:id', getClassById);
router.patch('/updateClass/:id', updateClass);
router.delete('/deleteClass/:id', deleteClass);



module.exports = router;    
