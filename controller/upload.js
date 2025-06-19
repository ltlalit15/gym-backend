const db = require('../config');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const multer = require('multer');
require('dotenv').config();
const path = require('path');
const nodemailer = require('nodemailer');
const fileUpload = require('express-fileupload');
const cloudinary = require('cloudinary').v2;

// Cloudinary Configuration
cloudinary.config({
    cloud_name: 'dkqcqrrbp',
    api_key: '418838712271323',
    api_secret: 'p12EKWICdyHWx8LcihuWYqIruWQ'
});



const addFileUpload = async (req, res) => {
    const { userId, memberId } = req.body;
    let imageUrl = [];
  
    if (req.files?.image) {
      try {
        // Upload image to Cloudinary
        const result = await cloudinary.uploader.upload(req.files.image.tempFilePath, {
          folder: "member_images"  // Save under 'member_images' folder in Cloudinary
        });
  
        // Add the image URL to the imageUrl array
        imageUrl.push(result.secure_url);
      } catch (uploadErr) {
        console.error("Image upload error:", uploadErr);
        return res.status(500).json({ status: "false", message: "Image upload failed." });
      }
    } else {
      return res.status(400).json({ status: "false", message: "No image uploaded" });
    }
  
    // Save the image URL in the database (without description)
    try {
      const query = `INSERT INTO upload (userId, memberId, image) VALUES (?, ?, ?)`;
  
      const [result] = await db.query(query, [userId, memberId, imageUrl[0]]);  // Storing the first image URL in DB
  
      // Retrieve the uploaded file's data from the database
      const [file] = await db.query('SELECT * FROM upload WHERE id = ?', [result.insertId]);
  
      // Send the response with the uploaded file data
      res.status(201).json({
        status: true,
        message: "File uploaded successfully",
        file: {
          id: file[0].id,         // File ID
          userId: file[0].userId, // Associated user ID
          memberId: file[0].userId,
          image: [file[0].image]  // Image URL is returned as an array
        }
      });
    } catch (error) {
      res.status(500).json({ status: false, message: error.message });
    }
  };


  
 const getAllFileUpload = async (req, res) => {
  try {
    const [fileUpload] = await db.query(`
      SELECT upload.*, member.firstName, member.lastName, user.fullName
      FROM upload
      JOIN member ON upload.memberId = member.id
      JOIN user ON upload.userId = user.id
    `);

    res.status(200).json({
      status: true,
      message: "All files retrieved successfully",
      fileUpload,
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};


  



module.exports = { addFileUpload, getAllFileUpload };
