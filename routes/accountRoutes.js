const express = require('express');
const { addAccount, getAllAccounts, getAccountById, updateAccount, deleteAccount } = require('../controller/account');
const authMiddleware = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');


const router = express.Router();

router.post('/addAccount', addAccount);
router.get('/getAllAccounts', getAllAccounts);
router.get('/getAccountById/:id', getAccountById);
router.patch('/updateAccount/:id', updateAccount);
router.delete('/deleteAccount/:id', deleteAccount);


module.exports = router;    
