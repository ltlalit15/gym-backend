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


const addExercise = async (req, res) => {
    const {
      name,
      categoryId,
      unitTypeId,
      ofValue,
      equipmentId,
      muscleGroupId,
      description,
      youtubeLink,
      externalLink
    } = req.body;
  
    let imageUrl = [];
  
    // Upload multiple files if image is an array
    if (req.files?.image) {
        try {
            const result = await cloudinary.uploader.upload(
                req.files.image.tempFilePath,
                { folder: "member_images" }
            );
            imageUrl = result.secure_url;
        } catch (uploadErr) {
            console.error("Image upload error:", uploadErr);
            return res.status(500).json({ status: "false", message: "Image upload failed." });
        }
    }
  
    try {
      const [result] = await db.query(
        `INSERT INTO exercises (
          name, categoryId, unitTypeId, ofValue,
          equipmentId, muscleGroupId, description,
          youtubeLink, externalLink, image
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          name,
          categoryId,
          unitTypeId,
          ofValue || null,
          equipmentId,
          muscleGroupId,
          description || null,
          youtubeLink || null,
          externalLink || null,
          JSON.stringify(imageUrl)
        ]
      );
  
      const [exercise] = await db.query(`SELECT * FROM exercises WHERE id = ?`, [result.insertId]);
  
      res.status(201).json({
        status: true,
        message: "Exercise added successfully",
        exercise: {
          ...exercise[0],
          image: [imageUrl] // parse image JSON string into array
        }
      });
    } catch (error) {
      console.error("Add Exercise Error:", error);
      res.status(500).json({ status: false, message: error.message });
    }
  };


  const getAllExercise = async (req, res) => {
    try {
      const [rows] = await db.query(`SELECT * FROM exercises`);
      res.status(200).json({ status: true, message: "retrieved all data", exercises: rows });
    } catch (error) {
      res.status(500).json({ status: false, message: error.message });
    }
  };


  const updateExercise = async (req, res) => {
    const { id } = req.params; // get ID from URL param
    const {
      name,
      categoryId,
      unitTypeId,
      ofValue,
      equipmentId,
      muscleGroupId,
      description,
      youtubeLink,
      externalLink
    } = req.body;
  
    let imageUrl = [];
  
    // Upload new image if provided
    if (req.files?.image) {
      try {
        const result = await cloudinary.uploader.upload(
          req.files.image.tempFilePath,
          { folder: "member_images" }
        );
        imageUrl = [result.secure_url]; // wrap in array
      } catch (uploadErr) {
        console.error("Image upload error:", uploadErr);
        return res.status(500).json({ status: false, message: "Image upload failed." });
      }
    }
  
    try {
      // If image was uploaded, update it; otherwise, keep existing image
      const imageUpdateQuery = imageUrl.length > 0 ? `, image = ?` : ``;
      const imageParams = imageUrl.length > 0 ? [JSON.stringify(imageUrl)] : [];
  
      await db.query(
        `UPDATE exercises SET 
          name = ?, categoryId = ?, unitTypeId = ?, ofValue = ?,
          equipmentId = ?, muscleGroupId = ?, description = ?,
          youtubeLink = ?, externalLink = ?
          ${imageUpdateQuery}
        WHERE id = ?`,
        [
          name,
          categoryId,
          unitTypeId,
          ofValue || null,
          equipmentId,
          muscleGroupId,
          description || null,
          youtubeLink || null,
          externalLink || null,
          ...imageParams,
          id
        ]
      );
  
      const [exercise] = await db.query(`SELECT * FROM exercises WHERE id = ?`, [id]);
  
      res.status(200).json({
        status: true,
        message: "Exercise updated successfully",
        exercise: {
          ...exercise[0],
          image: JSON.parse(exercise[0].image || '[]')
        }
      });
    } catch (error) {
      console.error("Update Exercise Error:", error);
      res.status(500).json({ status: false, message: error.message });
    }
  };




  const deleteExercise = async (req, res) => {
    const { id } = req.params;
  
    try {
      // Check if the exercise exists
      const [exercise] = await db.query(`SELECT * FROM exercises WHERE id = ?`, [id]);
  
      if (exercise.length === 0) {
        return res.status(404).json({ status: false, message: "Exercise not found" });
      }
  
      // Delete the exercise
      await db.query(`DELETE FROM exercises WHERE id = ?`, [id]);
  
      res.status(200).json({
        status: true,
        message: "Exercise deleted successfully"
      });
    } catch (error) {
      console.error("Delete Exercise Error:", error);
      res.status(500).json({ status: false, message: error.message });
    }
  };
  
  



module.exports = { addExercise, getAllExercise, updateExercise, deleteExercise };