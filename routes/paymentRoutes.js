const express = require('express');
const { addPayment, getAllPayments, getPaymentById, updatePayment, deletePayment } = require('../controller/payment');
const authMiddleware = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');


const router = express.Router();

router.post('/addPayment', authMiddleware, addPayment);
router.get('/getAllPayments', authMiddleware, getAllPayments);
router.get('/getPaymentById/:id', authMiddleware, getPaymentById);
router.patch('/updatePayment/:id', authMiddleware, updatePayment);
router.delete('/deletePayment/:id', authMiddleware, deletePayment);


module.exports = router;    
