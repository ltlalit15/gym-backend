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



const addMeasurement = async (req, res) => {
    try {
      // Handle image upload to Cloudinary
      let imageUrl = '';
  
      if (req.files?.image) {
        try {
          const result = await cloudinary.uploader.upload(
            req.files.image.tempFilePath,
            { folder: 'member_measurements' }
          );
          imageUrl = result.secure_url;
        } catch (uploadErr) {
          console.error("Image upload error:", uploadErr);
          return res.status(500).json({ status: false, message: "Image upload failed." });
        }
      }
  
      // Extract fields from req.body
      const {
        memberId, userId, gender, age, measurementDate, notes,
        height_cm, weight_kg, bp_systolic, bp_diastolic, heartRate, vo2max,
        weight, shoulders, bust, arm, chest, waist, hips, gluteals,
        upperThigh, midThigh, calf, bicep, tricep, subscapular, iliacCrest,
        bodyFat, fatMass, leanMass, bmi, maxOxygenUptake,
        shoulders_mm, chest_mm, waist_mm, hips_mm, midThigh_mm,
        calf_mm, bicepFlexed_mm, bicepRelaxed_mm,
        tricep_avg, bicep_avg, subscapular_avg, chest_avg, suprailiac_avg,
        abdominal_avg, thigh_avg, calf_avg, supraspinale_avg, midAxilla_avg
      } = req.body;
  
      const [result] = await db.query(
        `INSERT INTO measurements (
          memberId, userId, image, gender, age, measurementDate, notes,
          height_cm, weight_kg, bp_systolic, bp_diastolic, heartRate, vo2max,
          weight, shoulders, bust, arm, chest, waist, hips, gluteals,
          upperThigh, midThigh, calf, bicep, tricep, subscapular, iliacCrest,
          bodyFat, fatMass, leanMass, bmi, maxOxygenUptake,
          shoulders_mm, chest_mm, waist_mm, hips_mm, midThigh_mm,
          calf_mm, bicepFlexed_mm, bicepRelaxed_mm,
          tricep_avg, bicep_avg, subscapular_avg, chest_avg, suprailiac_avg,
          abdominal_avg, thigh_avg, calf_avg, supraspinale_avg, midAxilla_avg
        ) VALUES (
          ?, ?, ?, ?, ?, ?, ?,
          ?, ?, ?, ?, ?, ?,
          ?, ?, ?, ?, ?, ?, ?, ?,
          ?, ?, ?, ?, ?, ?, ?,
          ?, ?, ?, ?, ?,
          ?, ?, ?, ?, ?,
          ?, ?, ?,
          ?, ?, ?, ?, ?,
          ?, ?, ?, ?, ?
        )`,
        [
          memberId, userId, imageUrl, gender, age, measurementDate, notes,
          height_cm, weight_kg, bp_systolic, bp_diastolic, heartRate, vo2max,
          weight, shoulders, bust, arm, chest, waist, hips, gluteals,
          upperThigh, midThigh, calf, bicep, tricep, subscapular, iliacCrest,
          bodyFat, fatMass, leanMass, bmi, maxOxygenUptake,
          shoulders_mm, chest_mm, waist_mm, hips_mm, midThigh_mm,
          calf_mm, bicepFlexed_mm, bicepRelaxed_mm,
          tricep_avg, bicep_avg, subscapular_avg, chest_avg, suprailiac_avg,
          abdominal_avg, thigh_avg, calf_avg, supraspinale_avg, midAxilla_avg
        ]
      );
  
      const [rows] = await db.query(`SELECT * FROM measurements WHERE id = ?`, [result.insertId]);
      const measurementData = rows[0];
      measurementData.image = imageUrl ? [imageUrl] : [];
  
      res.status(201).json({
        status: true,
        message: 'Measurement saved successfully',
        data: measurementData
      });
  
    } catch (err) {
      console.error("DB insert error:", err);
      res.status(500).json({ status: false, message: err.message });
    }
  };

  const getAllMeasurements = async (req, res) => {
    const { measurementDate } = req.query;
    let query = `SELECT * FROM measurements WHERE 1=1`;
    const values = [];
  
    if (measurementDate) {
      query += ` AND measurementDate = ?`;
      values.push(measurementDate);
    }
  
    try {
      const [rows] = await db.query(query, values);

      // Format the image field as an array if not already an array
      const formattedMeasurements = rows.map(measurement => {
        if (measurement.image) {
          measurement.image = [measurement.image]; // Convert to an array
        }
        return measurement;
      });

      res.status(200).json({ status: true, measurements: formattedMeasurements });
    } catch (error) {
      res.status(500).json({ status: false, message: error.message });
    }
};










module.exports = { addMeasurement, getAllMeasurements };




