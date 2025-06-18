const db = require('../config');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const multer = require('multer');
require('dotenv').config();
const path = require('path');
const nodemailer = require('nodemailer');



const addDevice = async (req, res) => {
  const { deviceName, deviceType } = req.body;

  try {
    // Insert a new device
    const [insertResult] = await db.query(
      `INSERT INTO devices (deviceName, deviceType) VALUES (?, ?)`,
      [deviceName, deviceType]
    );

    // Fetch the inserted device by its ID
    const [deviceRow] = await db.query(
      `SELECT * FROM devices WHERE id = ?`,
      [insertResult.insertId]
    );

    res.status(201).json({
      status: true,
      message: "Device added successfully",
      device: deviceRow[0]
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};



const getAllDevices = async (req, res) => {
  try {
    const [devices] = await db.query('SELECT * FROM devices');
    res.status(200).json({
      status: true,
      message: 'Devices fetched successfully',
      devices
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};



const getDeviceById = async (req, res) => {
  const { id } = req.params;

  try {
    const [device] = await db.query('SELECT * FROM devices WHERE id = ?', [id]);

    if (device.length === 0) {
      return res.status(404).json({ status: false, message: 'Device not found' });
    }

    res.status(200).json({
      status: true,
      message: 'Device fetched successfully',
      device: device[0]
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};


const updateDevice = async (req, res) => {
  const { id } = req.params;
  const { deviceName, deviceType } = req.body;

  try {
    // Check if device exists
    const [device] = await db.query('SELECT * FROM devices WHERE id = ?', [id]);
    if (device.length === 0) {
      return res.status(404).json({ status: false, message: 'Device not found' });
    }

    // Update device details
    await db.query(
      'UPDATE devices SET deviceName = ?, deviceType = ? WHERE id = ?',
      [deviceName, deviceType, id]
    );

    // Fetch the updated device
    const [updatedDevice] = await db.query('SELECT * FROM devices WHERE id = ?', [id]);

    res.status(200).json({
      status: true,
      message: 'Device updated successfully',
      device: updatedDevice[0]
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};



const deleteDevice = async (req, res) => {
  const { id } = req.params;

  try {
    // Check if device exists
    const [device] = await db.query('SELECT * FROM devices WHERE id = ?', [id]);
    if (device.length === 0) {
      return res.status(404).json({ status: false, message: 'Device not found' });
    }

    // Delete the device
    await db.query('DELETE FROM devices WHERE id = ?', [id]);

    res.status(200).json({
      status: true,
      message: 'Device deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};


module.exports = { addDevice, getAllDevices, getDeviceById, updateDevice, deleteDevice };



