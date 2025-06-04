const express = require('express');
const { addDoor, getDoors, getDoorById, updateDoor, deleteDoor } = require('../controller/doors');
const authMiddleware = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');


const router = express.Router();

router.post('/addDoor', addDoor);
router.get('/getDoors', getDoors);
router.get('/getDoorById/:id', getDoorById);
router.patch('/updateDoor/:id', updateDoor);
router.delete('/deleteDoor/:id', deleteDoor);


module.exports = router;    
