const db = require('../config');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const multer = require('multer');
require('dotenv').config();
const path = require('path');
const nodemailer = require('nodemailer');


const addMembershipType = async (req, res) => {
    const { categoryId, name } = req.body;
  
    try {
      const [insertResult] = await db.query(
        `INSERT INTO membershiptype (categoryId, name) VALUES (?, ?)`,
        [categoryId, name]
      );
  
      const [membershipRow] = await db.query(
        `SELECT * FROM membershiptype WHERE id = ?`,
        [insertResult.insertId]
      );
  
      res.status(201).json({
        status: true,
        message: "Membership type added successfully",
        membershipType: membershipRow[0],
      });
    } catch (error) {
      res.status(500).json({ status: false, message: error.message });
    }
  };

  

  const getAllMembershipType = async (req, res) => {
    try {
      const [types] = await db.query(`SELECT * FROM membershiptype`);
      res.status(200).json({
        status: true,
        types,
      });
    } catch (error) {
      res.status(500).json({ status: false, message: error.message });
    }
  };
  
  


module.exports = { addMembershipType, getAllMembershipType };
