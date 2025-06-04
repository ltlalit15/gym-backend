
const express = require('express');
const { addTaskType, getAllTaskType } = require("../controller/taskType.js");
const upload = require('../middleware/uploadMiddleware.js'); // Import the multer config
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
//const upload = multer({ storage: storage });

const router = express.Router();

router.post("/addTaskType", addTaskType);
router.get("/getAllTaskType", getAllTaskType)


module.exports = router; 



