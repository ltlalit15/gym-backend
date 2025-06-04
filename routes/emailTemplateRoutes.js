const express = require('express');
const { addEmailTemplate, getAllEmailTemplates, getEmailTemplateById, updateEmailTemplate, deleteEmailTemplate } = require('../controller/emailTemplate');
const authMiddleware = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');


const router = express.Router();

router.post('/addEmailTemplate', addEmailTemplate);
router.get('/getAllEmailTemplates', getAllEmailTemplates);
router.get('/getEmailTemplateById/:id', getEmailTemplateById);
router.patch('/updateEmailTemplate/:id', updateEmailTemplate);
router.delete('/deleteEmailTemplate/:id', deleteEmailTemplate);



module.exports = router;    
