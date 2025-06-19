const db = require('../config');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const multer = require('multer');
require('dotenv').config();
const path = require('path');
const fs = require('fs');

const nodemailer = require('nodemailer');

const cloudinary = require('cloudinary').v2;

// Cloudinary Configuration
cloudinary.config({
    cloud_name: 'dkqcqrrbp',
    api_key: '418838712271323',
    api_secret: 'p12EKWICdyHWx8LcihuWYqIruWQ'
});


const addTask = async (req, res) => {
    const { taskTypeId, memberId, description, assignedTo } = req.body;
  
    try {
      const [result] = await db.query(
        `INSERT INTO tasks (taskTypeId, memberId, description, assignedTo) VALUES (?, ?, ?, ?)`,
        [taskTypeId, memberId, description, assignedTo]
      );
  
      const [insertedTask] = await db.query(
        `SELECT * FROM tasks WHERE id = ?`,
        [result.insertId]
      );
  
      res.status(201).json({
        status: true,
        message: "Task added successfully",
        note: insertedTask[0]
      });
    } catch (error) {
      res.status(500).json({ status: false, message: error.message });
    }
  };

  
const getAllTask = async (req, res) => {
  try {
    const [task] = await db.query(`
      SELECT tasks.*, member.firstName, member.lastName, user.fullName
      FROM tasks
      JOIN member ON tasks.memberId = member.id
      JOIN user ON tasks.assignedTo = user.id
    `);

    res.status(200).json({
      status: true,
      task,
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};





module.exports = { addTask, getAllTask };
