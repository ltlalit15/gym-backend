const db = require('../config');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const multer = require('multer');
require('dotenv').config();
const path = require('path');
const nodemailer = require('nodemailer');


const addExerciseEquipment = async (req, res) => {
    const { name } = req.body;
  
    try {
      // Insert the new category
      const [insertResult] = await db.query(
        `INSERT INTO exerciseequipments (name) VALUES (?)`,
        [name]
      );
  
      // Fetch the inserted category by its ID
      const [equipmentRow] = await db.query(
        `SELECT * FROM exerciseequipments WHERE id = ?`,
        [insertResult.insertId]
      );
  
      res.status(201).json({
        status: true,
        message: "Category added successfully",
        equipment: equipmentRow[0]
      });
    } catch (error) {
      res.status(500).json({ status: false, message: error.message });
    }
  };


  const getAllExerciseEquipment = async (req, res) => {
    try {
      const [equipments] = await db.query(`SELECT * FROM exerciseequipments`);
      res.status(200).json({
        status: true,
        equipments,
      });
    } catch (error) {
      res.status(500).json({ status: false, message: error.message });
    }
  };
  
  




module.exports = { addExerciseEquipment, getAllExerciseEquipment };