const db = require('../config');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const multer = require('multer');
require('dotenv').config();
const path = require('path');
const nodemailer = require('nodemailer');


const addMembership = async (req, res) => {
    const {
      userId, categoryId, membershiptypeId, memberId,
      startDate, firstPaymentDate, minTerm,
      referralCode, price, upFrontFee, signUpFree
    } = req.body;
  
    try {
      const [insertResult] = await db.query(
        `INSERT INTO membership (
          userId, categoryId, membershiptypeId, memberId, 
          startDate, firstPaymentDate, minTerm,
          referralCode, price, upFrontFee, signUpFree
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          userId, categoryId, membershiptypeId, memberId,
          startDate, firstPaymentDate, minTerm,
          referralCode, price, upFrontFee, signUpFree
        ]
      );
  
      const [membershipRow] = await db.query(
        `SELECT * FROM membership WHERE id = ?`,
        [insertResult.insertId]
      );
  
      res.status(201).json({
        status: true,
        message: "Membership assigned successfully",
        membership: membershipRow[0],
      });
    } catch (error) {
      console.error("Add Membership Error:", error);
      res.status(500).json({ status: false, message: error.message });
    }
  };


  const getAllMemberships = async (req, res) => {
    try {
      const [rows] = await db.query(`SELECT * FROM membership`);
      res.status(200).json({ status: true, memberships: rows });
    } catch (error) {
      res.status(500).json({ status: false, message: error.message });
    }
  };
  
  

module.exports = { addMembership, getAllMemberships };
