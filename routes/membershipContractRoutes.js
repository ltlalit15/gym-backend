const express = require('express');
const { addMembershipContract, getAllMembershipContracts, getMembershipContractById, updateMembershipContract, deleteMembershipContract } = require('../controller/membershipContract');
const authMiddleware = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');


const router = express.Router();

router.post('/addMembershipContract', addMembershipContract);
router.get('/getAllMembershipContracts', getAllMembershipContracts);
router.get('/getMembershipContractById/:id', getMembershipContractById);
router.patch('/updateMembershipContract/:id', updateMembershipContract);
router.delete('/deleteMembershipContract/:id', deleteMembershipContract);


module.exports = router;    
