const express = require('express');
const { addMembershipCategory, getAllMembershipCategories } = require('../controller/membershipCategory');
//const authMiddleware = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './upload');  // Specify the folder where images will be stored
    },
    filename: (req, file, cb) => {
        const fileExtension = path.extname(file.originalname);  // Get file extension
        const fileName = Date.now() + fileExtension;  // Use a unique name
        cb(null, fileName);
    }
});

const upload = multer({ storage: storage });
const router = express.Router();


router.post('/addMembershipCategory', addMembershipCategory);
router.get('/getAllMembershipCategories', getAllMembershipCategories)


module.exports = router;    


