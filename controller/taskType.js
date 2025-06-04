// veni 
const fs = require("fs");
const db = require('../config');
const multer = require("multer");
const path = require('path');
//const { CloudinaryStorage } = require('multer-storage-cloudinary');

const addTaskType = async (req, res) => {
    const { name } = req.body;
  
    try {
      const [result] = await db.query(
        `INSERT INTO tasktype (name) VALUES (?)`,
        [name]
      );
  
      const [insertedTaskType] = await db.query(
        `SELECT * FROM tasktype WHERE id = ?`,
        [result.insertId]
      );
  
      res.status(201).json({
        status: true,
        message: "Tasktype added successfully",
        note: insertedTaskType[0]
      });
    } catch (error) {
      res.status(500).json({ status: false, message: error.message });
    }
  };

  
  const getAllTaskType = async (req, res) => {
    try {
      const [taskType] = await db.query(`SELECT * FROM tasktype`);
      res.status(200).json({
        status: true,
        taskType,
      });
    } catch (error) {
      res.status(500).json({ status: false, message: error.message });
    }
  };


module.exports ={ addTaskType, getAllTaskType }