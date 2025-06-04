const db = require('../config');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const multer = require('multer');
require('dotenv').config();
const path = require('path');
const nodemailer = require('nodemailer');


const addMembershipCategory = async (req, res) => {
    const { name } = req.body;
  
    try {
      // Insert the new category
      const [insertResult] = await db.query(
        `INSERT INTO membershipcategory (name) VALUES (?)`,
        [name]
      );
  
      // Fetch the inserted category by its ID
      const [categoryRow] = await db.query(
        `SELECT * FROM membershipcategory WHERE id = ?`,
        [insertResult.insertId]
      );
  
      res.status(201).json({
        status: true,
        message: "Category added successfully",
        category: categoryRow[0]
      });
    } catch (error) {
      res.status(500).json({ status: false, message: error.message });
    }
  };


  const getAllMembershipCategories = async (req, res) => {
    try {
      const [categories] = await db.query(`SELECT * FROM membershipcategory`);
      res.status(200).json({
        status: true,
        categories,
      });
    } catch (error) {
      res.status(500).json({ status: false, message: error.message });
    }
  };
  
  




module.exports = { addMembershipCategory, getAllMembershipCategories };