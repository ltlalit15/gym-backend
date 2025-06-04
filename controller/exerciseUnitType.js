const db = require('../config');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const multer = require('multer');
require('dotenv').config();
const path = require('path');
const nodemailer = require('nodemailer');


const addExerciseUnitType = async (req, res) => {
    const { name } = req.body;
  
    try {
      // Insert the new category
      const [insertResult] = await db.query(
        `INSERT INTO exerciseunittypes (name) VALUES (?)`,
        [name]
      );
  
      // Fetch the inserted category by its ID
      const [unitRow] = await db.query(
        `SELECT * FROM exerciseunittypes WHERE id = ?`,
        [insertResult.insertId]
      );
  
      res.status(201).json({
        status: true,
        message: "Unittype added successfully",
        unit: unitRow[0]
      });
    } catch (error) {
      res.status(500).json({ status: false, message: error.message });
    }
  };


  const getAllExerciseUnitType = async (req, res) => {
    try {
      const [unit] = await db.query(`SELECT * FROM exerciseunittypes`);
      res.status(200).json({
        status: true,
        unit,
      });
    } catch (error) {
      res.status(500).json({ status: false, message: error.message });
    }
  };
    


module.exports = { addExerciseUnitType, getAllExerciseUnitType };