const db = require('../config');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const multer = require('multer');
require('dotenv').config();
const path = require('path');
const nodemailer = require('nodemailer');
const fileUpload = require('express-fileupload');
//const cloudinary = require('cloudinary').v2;


const addCallLog = async (req, res) => {
    const { memberId, date, subject, description, caller, answered } = req.body;
  
      
    try {
      const [result] = await db.query(
        `INSERT INTO calllog (memberId, date, subject, description, caller, answered)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [memberId, date, subject, description, caller, answered]
      );
  
      const [newLog] = await db.query(
        `SELECT * FROM calllog WHERE id = ?`,
        [result.insertId]
      );
  
      res.status(201).json({
        status: true,
        message: "Call log added successfully",
        callLog: newLog[0]
      });
    } catch (error) {
      res.status(500).json({ status: false, message: error.message });
    }
  };



 const getAllCallLogs = async (req, res) => {
  try {
    const [logs] = await db.query(`
      SELECT calllog.*, member.firstName, member.lastName, user.fullName
      FROM calllog
      JOIN member ON calllog.memberId = member.id
      JOIN user ON calllog.caller = user.id
    `);

    res.status(200).json({ status: true, callLogs: logs });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

  
  

module.exports = { addCallLog, getAllCallLogs  };
