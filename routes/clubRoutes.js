const express = require('express');
const { addClub, getAllClubs, getClubById, updateClub, deleteClub } = require('../controller/club');
const authMiddleware = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');


const router = express.Router();

router.post('/addClub', addClub);
router.get('/getAllClubs', getAllClubs);
router.get('/getClubById/:id', getClubById);
router.patch('/updateClub/:id', updateClub);
router.delete('/deleteClub/:id', deleteClub);



module.exports = router;    
