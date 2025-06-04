const db = require('../config');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const multer = require('multer');
require('dotenv').config();
const path = require('path');
const nodemailer = require('nodemailer');
//const cloudinary = require('cloudinary').v2;


const addWorkout = async (req, res) => {
    const {
      memberId, userId, name,
      description, useLastResultAsGoal
    } = req.body;
  
    try {
      const [insertResult] = await db.query(
        `INSERT INTO workout (
          memberId, userId, name,
          description, useLastResultAsGoal
        ) VALUES (?, ?, ?, ?, ?)`,
        [
           memberId, userId, name,
           description, useLastResultAsGoal
        ]
      );
  
      const [workoutRow] = await db.query(
        `SELECT * FROM workout WHERE id = ?`,
        [insertResult.insertId]
      );
  
      res.status(201).json({
        status: true,
        message: "Workout assigned successfully",
        workout: workoutRow[0],
      });
    } catch (error) {
      console.error("Add Membership Error:", error);
      res.status(500).json({ status: false, message: error.message });
    }
  };


  const getAllWorkouts = async (req, res) => {
    const { memberId, userId } = req.query;
  
    let query = `SELECT * FROM workout`;
    let queryParams = [];
  
    // Add filters if present
    if (memberId || userId) {
      const conditions = [];
      if (memberId) {
        conditions.push(`memberId = ?`);
        queryParams.push(memberId);
      }
      if (userId) {
        conditions.push(`userId = ?`);
        queryParams.push(userId);
      }
      query += ` WHERE ` + conditions.join(' AND ');
    }
  
    try {
      const [rows] = await db.query(query, queryParams);
      res.status(200).json({
        status: true,
        message: "workout data fetech successfully",
        workouts: rows
      });
    } catch (error) {
      console.error("Get All Workouts Error:", error);
      res.status(500).json({ status: false, message: error.message });
    }
  };


  





module.exports = { addWorkout, getAllWorkouts };
