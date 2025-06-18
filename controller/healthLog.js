const db = require('../config');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const multer = require('multer');
require('dotenv').config();
const path = require('path');
const nodemailer = require('nodemailer');


const addHealthLog = async (req, res) => {
  const { deviceId, healthStatus } = req.body;

  try {
    // Insert a new health log
    const [insertResult] = await db.query(
      `INSERT INTO healthlogs (deviceId, healthStatus) VALUES (?, ?)`,
      [deviceId, healthStatus]
    );

    // Fetch the inserted log by its ID
    const [healthLog] = await db.query(
      `SELECT * FROM healthlogs WHERE id = ?`,
      [insertResult.insertId]
    );

    res.status(201).json({
      status: true,
      message: "Health log added successfully",
      healthlog: healthLog[0]
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};



const getAllHealthLogs = async (req, res) => {
  try {
    const [healthlogs] = await db.query('SELECT * FROM healthlogs');
    res.status(200).json({
      status: true,
      message: 'Health logs fetched successfully',
      healthlogs
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};




const getHealthLogById = async (req, res) => {
  const { id } = req.params;

  try {
    const [healthlog] = await db.query('SELECT * FROM healthlogs WHERE id = ?', [id]);

    if (healthlog.length === 0) {
      return res.status(404).json({ status: false, message: 'Health log not found' });
    }

    res.status(200).json({
      status: true,
      message: 'Health log fetched successfully',
      healthlog: healthlog[0]
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};


const updateHealthLog = async (req, res) => {
  const { id } = req.params;
  const { deviceId, healthStatus } = req.body;

  try {
    // Check if health log exists
    const [healthlog] = await db.query('SELECT * FROM healthlogs WHERE id = ?', [id]);
    if (healthlog.length === 0) {
      return res.status(404).json({ status: false, message: 'Health log not found' });
    }

    // Update the health log
    await db.query(
      'UPDATE healthlogs SET deviceId = ?, healthStatus = ? WHERE id = ?',
      [deviceId, healthStatus, id]
    );

    // Fetch the updated health log
    const [updatedHealthLog] = await db.query('SELECT * FROM healthlogs WHERE id = ?', [id]);

    res.status(200).json({
      status: true,
      message: 'Health log updated successfully',
      healthlog: updatedHealthLog[0]
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};


const deleteHealthLog = async (req, res) => {
  const { id } = req.params;

  try {
    // Check if health log exists
    const [healthlog] = await db.query('SELECT * FROM healthlogs WHERE id = ?', [id]);
    if (healthlog.length === 0) {
      return res.status(404).json({ status: false, message: 'Health log not found' });
    }

    // Delete the health log
    await db.query('DELETE FROM healthlogs WHERE id = ?', [id]);

    res.status(200).json({
      status: true,
      message: 'Health log deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};


module.exports = {addHealthLog, getAllHealthLogs, getHealthLogById, updateHealthLog, deleteHealthLog}
