const db = require('../config');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const multer = require('multer');
require('dotenv').config();
const path = require('path');
const nodemailer = require('nodemailer');


const addExerciseMuscle = async (req, res) => {
    const { name } = req.body;
  
    try {
      // Insert the new category
      const [insertResult] = await db.query(
        `INSERT INTO exercisemusclegroups (name) VALUES (?)`,
        [name]
      );
  
      // Fetch the inserted category by its ID
      const [MuscleRow] = await db.query(
        `SELECT * FROM exercisemusclegroups WHERE id = ?`,
        [insertResult.insertId]
      );
  
      res.status(201).json({
        status: true,
        message: "Muscle added successfully",
        muscle: MuscleRow[0]
      });
    } catch (error) {
      res.status(500).json({ status: false, message: error.message });
    }
  };


  const getAllExerciseMuscle = async (req, res) => {
    try {
      const [categories] = await db.query(`SELECT * FROM exercisemusclegroups`);
      res.status(200).json({
        status: true,
        categories,
      });
    } catch (error) {
      res.status(500).json({ status: false, message: error.message });
    }
  };
  
  




module.exports = { addExerciseMuscle, getAllExerciseMuscle };