const db = require('../config');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const multer = require('multer');
require('dotenv').config();
const path = require('path');
const nodemailer = require('nodemailer');

const cloudinary = require('cloudinary').v2;

// Cloudinary Configuration
cloudinary.config({
    cloud_name: 'dkqcqrrbp',
    api_key: '418838712271323',
    api_secret: 'p12EKWICdyHWx8LcihuWYqIruWQ'
});

const addAgreement = async (req, res) => {
  const { userId, name, title, highlight, expiryLength } = req.body;
  let imageUrl = [];

  try {
    // Upload image to Cloudinary if available
    if (req.files?.image) {
      const result = await cloudinary.uploader.upload(req.files.image.tempFilePath, { folder: "agreements" });
      imageUrl.push(result.secure_url);  // Push the image URL into the array
    }

    // Insert agreement into database
    const [insertResult] = await db.query(
      `INSERT INTO agreement (userId, name, title, highlight, expiryLength, image) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [userId, name, title, highlight, expiryLength, imageUrl.join(',')]  // Store imageUrl as a string in DB (or as JSON if needed)
    );

    // Fetch the inserted agreement data
    const [agreementRow] = await db.query(`SELECT * FROM agreement WHERE id = ?`, [insertResult.insertId]);

    res.status(201).json({
      status: true,
      message: "Agreement added successfully",
      agreement: {
        id: agreementRow[0].id,
        userId: agreementRow[0].userId,
        name: agreementRow[0].name,
        title: agreementRow[0].title,
        highlight: agreementRow[0].highlight,
        expiryLength: agreementRow[0].expiryLength,
        image: imageUrl,  // Return image URL as an array
        createdAt: agreementRow[0].createdAt // Ensure the createdAt field is returned
      }
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};



const getAllAgreements = async (req, res) => {
  try {
    const [agreements] = await db.query('SELECT * FROM agreement');

    // Format the response to return only imageUrl as an array
    const formattedAgreements = agreements.map(agreement => {
      return {
        ...agreement,
        image: agreement.image ? [agreement.image] : []  // Ensure only imageUrl is returned as an array
      };
    });

    res.status(200).json({
      status: true,
      message: "Retrieved all data",
      agreements: formattedAgreements
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};



const getAgreementById = async (req, res) => {
  const { id } = req.params;

  try {
    const [agreement] = await db.query('SELECT * FROM agreement WHERE id = ?', [id]);

    if (agreement.length > 0) {
      const formattedAgreement = {
        ...agreement[0],
        image: agreement[0].image ? [agreement[0].image] : []  // Ensure only imageUrl is returned as an array
      };

      res.status(200).json({
        status: true,
        message: "Retrieved single data",
        agreement: formattedAgreement
      });
    } else {
      res.status(404).json({
        status: false,
        message: "Agreement not found"
      });
    }
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};



const updateAgreement = async (req, res) => {
  const { id } = req.params;
  const { userId, name, title, highlight, expiryLength } = req.body;
  let imageUrl = [];

  try {
    // If a new image is uploaded, upload it to Cloudinary
    if (req.files?.image) {
      const result = await cloudinary.uploader.upload(req.files.image.tempFilePath, { folder: "agreements" });
      imageUrl.push(result.secure_url);  // Push the new image URL into the array
    }

    // Prepare the SQL query for updating the agreement
    const [updateResult] = await db.query(
      `UPDATE agreement
       SET userId = ?, name = ?, title = ?, highlight = ?, expiryLength = ?, image = ?
       WHERE id = ?`,
      [
        userId,
        name,
        title,
        highlight,
        expiryLength,
        imageUrl.length > 0 ? imageUrl.join(',') : null, // If there's an image URL, use it; otherwise, set it as null
        id
      ]
    );

    // If the agreement was updated, fetch and return the updated data
    if (updateResult.affectedRows > 0) {
      const [updatedAgreement] = await db.query(`SELECT id, userId, name, title, highlight, expiryLength, image, createdAt FROM agreement WHERE id = ?`, [id]);

      res.status(200).json({
        status: true,
        message: "Agreement updated successfully",
        agreement: {
          id: updatedAgreement[0].id,
          userId: updatedAgreement[0].userId,
          name: updatedAgreement[0].name,
          title: updatedAgreement[0].title,
          highlight: updatedAgreement[0].highlight,
          expiryLength: updatedAgreement[0].expiryLength,
          image: updatedAgreement[0].image ? [updatedAgreement[0].image] : [],  // Return image as an array
          createdAt: updatedAgreement[0].createdAt // Explicitly include createdAt in the response
        }
      });
    } else {
      res.status(404).json({
        status: false,
        message: "Agreement not found"
      });
    }
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};



const deleteAgreement = async (req, res) => {
  const { id } = req.params;

  try {
    const [deleteResult] = await db.query(
      `DELETE FROM agreement WHERE id = ?`,
      [id]
    );

    if (deleteResult.affectedRows > 0) {
      res.status(200).json({
        status: true,
        message: "Agreement deleted successfully"
      });
    } else {
      res.status(404).json({
        status: false,
        message: "Agreement not found"
      });
    }
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};




module.exports = { addAgreement, getAllAgreements, getAgreementById, updateAgreement, deleteAgreement };


