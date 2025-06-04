const express = require('express');
const { addQuestion, getAllQuestions, getQuestionById, updateQuestion, deleteQuestion } = require('../controller/question');
const authMiddleware = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');


const router = express.Router();

router.post('/addQuestion', addQuestion);
router.get('/getAllQuestions', getAllQuestions);
router.get('/getQuestionById/:id', getQuestionById);
router.patch('/updateQuestion/:id', updateQuestion);
router.delete('/deleteQuestion/:id', deleteQuestion);


module.exports = router;    
