const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const multer = require('multer');
const cors = require('cors');
require('dotenv').config();
const path = require('path');
const fileUpload = require('express-fileupload');
const userRoutes = require('./routes/userRoutes');
const membershipTypeRoutes = require('./routes/membershipTypeRoutes');
const workoutRoutes = require('./routes/workoutRoutes');
const taskRoutes = require('./routes/taskRoutes');
const memberRoutes = require('./routes/memberRoutes');
const membershipRoutes = require('./routes/membershipRoutes');
const measurementRoutes = require('./routes/measurementRoutes');
const callLogRoutes = require('./routes/callLogRoutes');
const noteRoutes = require('./routes/noteRoutes');
const membershipCategoryRoutes = require('./routes/memberShipCategoryRoutes');

const bookingRoutes = require('./routes/bookingRoutes');

const taskTypeRoutes= require('./routes/taskTypeRoutes');
const uploadRoutes = require('./routes/uploadRoutes');

const exerciseCategoryRoutes = require('./routes/exerciseCategoryRoutes');
const exerciseEquipmentRoutes = require('./routes/exerciseEuipmentRoutes');
const exerciseMuscleRoutes = require('./routes/exerciseMuscleRoutes');
const exerciseUnitTypeRoutes = require('./routes/exerciseUnitTypeRoutes');
const exerciseRoutes = require('./routes/exerciseRoutes');
const taskGymRoutes = require('./routes/taskGymRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const classRoutes = require('./routes/classRoutes');
const clubRoutes = require('./routes/clubRoutes');
const accountRoutes = require('./routes/accountRoutes');
const doorsRoutes = require('./routes/doorsRoutes');
const agreementRoutes = require('./routes/agreementRoutes');
const questionRoutes = require('./routes/questionRoutes');
const membershipContractRoutes = require('./routes/membershipContractRoutes');
const membershipBenefitsRoutes = require('./routes/membershipBenefitsRoutes');
const productRoutes = require('./routes/productRoutes');
const productType = require('./routes/productTypeRoutes');
const supplierRoutes = require('./routes/supplierRoutes');
const rosterRoutes = require('./routes/rosterRoutes');
const taskAutomationRoutes = require('./routes/taskAutomationRoutes');
const smsTemplateRoutes = require('./routes/smsTemplateRoutes');
const emailTemplateRoutes = require('./routes/emailTemplateRoutes');

const db = require('./config');
const app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); // Ensure correct path to views
// Middleware
//app.use(cors());

app.use(cors({
    origin: '*',  // Allow all origins
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],  // Allow all HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization']  // Allow necessary headers
}));
// ✅ Increase Payload Limit for Base64 Images
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ✅ **File Upload Middleware**
app.use(fileUpload({ useTempFiles: true, tempFileDir: "/tmp/" }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'upload')));
app.use(
    session({
        secret: 'your_secret_key', // Change this to a secure key
        resave: false,
        saveUninitialized: true,
        cookie: { maxAge: 86400000 }, // 1 day expiration
    })
);



//app.use(express.static(path.join(__dirname, 'public')));

app.get('/upload/:imageName', (req, res) => {
    const imagePath = path.join(__dirname, 'upload', req.params.imageName);
    res.sendFile(imagePath, (err) => {
        if (err) {
            console.error(`Error serving image: ${err}`);
            res.status(500).send(err);
        }
    });
});


 
// Middleware
app.use(cors());
app.use(bodyParser.json());


app.use('/api/user', userRoutes);
app.use('/api/membershipType', membershipTypeRoutes);
app.use('/api/workout', workoutRoutes);
app.use('/api/task', taskRoutes);
app.use('/api/member', memberRoutes);
app.use('/api/membership', membershipRoutes);
app.use('/api/measurement', measurementRoutes);
app.use('/api/callLog', callLogRoutes);
app.use('/api/note', noteRoutes);
app.use('/api/membershipCategory', membershipCategoryRoutes);

app.use('/api/booking', bookingRoutes);

app.use('/api/taskType', taskTypeRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/exerciseCategory', exerciseCategoryRoutes);
app.use('/api/exerciseEquipment', exerciseEquipmentRoutes);
app.use('/api/exerciseMuscle',exerciseMuscleRoutes);
app.use('/api/exerciseUnitType',exerciseUnitTypeRoutes);
app.use('/api/exercise', exerciseRoutes);
app.use('/api/taskGym', taskGymRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/class', classRoutes);
app.use('/api/club', clubRoutes);
app.use('/api/account', accountRoutes);
app.use('/api/doors', doorsRoutes);
app.use('/api/agreement', agreementRoutes);
app.use('/api/question', questionRoutes);
app.use('/api/membershipContract', membershipContractRoutes);
app.use('/api/membershipBenefits', membershipBenefitsRoutes);
app.use('/api/product', productRoutes);
app.use('/api/productType', productType);
app.use('/api/supplier', supplierRoutes);
app.use('/api/roster', rosterRoutes);
app.use('/api/taskAutomation', taskAutomationRoutes);
app.use('/api/smsTemplate', smsTemplateRoutes);
app.use('/api/emailTemplate', emailTemplateRoutes);
app.use('/api/device', deviceRoutes);



// app.use('/api/user', authRoutes);
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));



app.listen(8500, () => {
    console.log('Server connected on port 8500');
});
