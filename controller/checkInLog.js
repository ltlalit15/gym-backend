const db = require('../config');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const multer = require('multer');
require('dotenv').config();
const path = require('path');
const nodemailer = require('nodemailer');

const addCheckInLog = async (req, res) => {
  const { deviceId, userId } = req.body;

  try {
    // Insert a new check-in log
    const [insertResult] = await db.query(
      `INSERT INTO checkinlogs (deviceId, userId) VALUES (?, ?)`,
      [deviceId, userId]
    );

    // Fetch the inserted log by its ID
    const [checkInLog] = await db.query(
      `SELECT * FROM checkinlogs WHERE id = ?`,
      [insertResult.insertId]
    );

    res.status(201).json({
      status: true,
      message: "Check-in log created successfully",
      checkinlog: checkInLog[0]
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};



const getAllCheckInLogs = async (req, res) => {
  try {
    const [checkinlogs] = await db.query('SELECT * FROM checkinlogs');
    res.status(200).json({
      status: true,
      message: 'Check-in logs fetched successfully',
      checkinlogs
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};


const getCheckInLogById = async (req, res) => {
  const { id } = req.params;

  try {
    const [checkinlog] = await db.query('SELECT * FROM checkinlogs WHERE id = ?', [id]);

    if (checkinlog.length === 0) {
      return res.status(404).json({ status: false, message: 'Check-in log not found' });
    }

    res.status(200).json({
      status: true,
      message: 'Check-in log fetched successfully',
      checkinlog: checkinlog[0]
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};


const updateCheckInLog = async (req, res) => {
  const { id } = req.params;
  const { deviceId, userId } = req.body;

  try {
    // Check if check-in log exists
    const [checkinlog] = await db.query('SELECT * FROM checkinlogs WHERE id = ?', [id]);
    if (checkinlog.length === 0) {
      return res.status(404).json({ status: false, message: 'Check-in log not found' });
    }

    // Update the check-in log
    await db.query(
      'UPDATE checkinlogs SET deviceId = ?, userId = ? WHERE id = ?',
      [deviceId, userId, id]
    );

    // Fetch the updated check-in log
    const [updatedCheckInLog] = await db.query('SELECT * FROM checkinlogs WHERE id = ?', [id]);

    res.status(200).json({
      status: true,
      message: 'Check-in log updated successfully',
      checkinlog: updatedCheckInLog[0]
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};



const deleteCheckInLog = async (req, res) => {
  const { id } = req.params;

  try {
    // Check if check-in log exists
    const [checkinlog] = await db.query('SELECT * FROM checkinlogs WHERE id = ?', [id]);
    if (checkinlog.length === 0) {
      return res.status(404).json({ status: false, message: 'Check-in log not found' });
    }

    // Delete the check-in log
    await db.query('DELETE FROM checkinlogs WHERE id = ?', [id]);

    res.status(200).json({
      status: true,
      message: 'Check-in log deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};



module.exports = {addCheckInLog, getAllCheckInLogs, getCheckInLogById, updateCheckInLog, deleteCheckInLog}
