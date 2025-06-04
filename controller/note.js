const db = require('../config');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const multer = require('multer');
require('dotenv').config();
const path = require('path');
const nodemailer = require('nodemailer');



const addNote = async (req, res) => {
    const { userId, memberId, subject, note } = req.body;
  
    try {
      const [result] = await db.query(
        `INSERT INTO notes (userId, memberId, subject, note) VALUES (?, ?, ?, ?)`,
        [userId, memberId, subject, note]
      );
  
      const [insertedNote] = await db.query(
        `SELECT * FROM notes WHERE id = ?`,
        [result.insertId]
      );
  
      res.status(201).json({
        status: true,
        message: "Note added successfully",
        note: insertedNote[0]
      });
    } catch (error) {
      res.status(500).json({ status: false, message: error.message });
    }
  };

  
 const getAllNotes = async (req, res) => {
  try {
    const [notes] = await db.query(`
      SELECT notes.*, member.firstName, member.lastName
      FROM notes
      JOIN member ON notes.memberId = member.id
    `);

    res.status(200).json({
      status: true,
      notes,
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};



  const getNotes = async (req, res) => {
    const { id } = req.params;
  
    try {
      const [notes] = await db.query(
        `SELECT * FROM notes WHERE id = ? ORDER BY createdAt DESC`,
        [id]
      );
  
      res.status(200).json({
        status: true,
        notes
      });
    } catch (error) {
      res.status(500).json({ status: false, message: error.message });
    }
  };
  
  

module.exports = { addNote, getAllNotes, getNotes };