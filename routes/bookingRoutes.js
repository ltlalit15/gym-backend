const express = require('express');
const { addBooking, getAllBookings, getBookingsByDate, getBookingsByName } = require('../controller/booking');
const authMiddleware = require('../middleware/authMiddleware');
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

router.post('/addBooking', addBooking);
router.get('/getAllBookings', getAllBookings);
router.get('/getBookingsByDate', getBookingsByDate);
router.get('/getBookingsByName', getBookingsByName);


module.exports = router;    
