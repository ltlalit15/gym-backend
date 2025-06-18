const db = require('../config');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const multer = require('multer');
require('dotenv').config();
const path = require('path');
const nodemailer = require('nodemailer');


const addFacility = async (req, res) => {
  const {
    name,
    facilityType,
    roster,
    allowedCategories,
    informationLink,
    parentFacility,
    allowClassBooking
  } = req.body;

  try {
    const [insertResult] = await db.query(
      `INSERT INTO facilities (
        name, facilityType, roster, allowedCategories,
        informationLink, parentFacility, allowClassBooking
      ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        name,
        facilityType,
        roster,
        allowedCategories,
        informationLink,
        parentFacility,
        allowClassBooking
      ]
    );

    const [facility] = await db.query(`SELECT * FROM facilities WHERE id = ?`, [insertResult.insertId]);

    res.status(201).json({
      status: true,
      message: "Facility added successfully",
      facility: facility[0]
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};


const getAllFacilities = async (req, res) => {
  try {
    const [rows] = await db.query(`SELECT * FROM facilities`);
    res.json({
      status: true,
      message: "Facilities fetched successfully",
      facilities: rows
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};


const getFacilityById = async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await db.query(`SELECT * FROM facilities WHERE id = ?`, [id]);

    if (rows.length === 0) {
      return res.status(404).json({ status: false, message: "Facility not found" });
    }

    res.json({
      status: true,
      message: "Facility fetched successfully",
      facility: rows[0]
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};



const updateFacility = async (req, res) => {
  const { id } = req.params;
  const {
    name,
    facilityType,
    roster,
    allowedCategories,
    informationLink,
    parentFacility,
    allowClassBooking
  } = req.body;

  try {
    await db.query(
      `UPDATE facilities SET 
        name = ?, 
        facilityType = ?, 
        roster = ?, 
        allowedCategories = ?, 
        informationLink = ?, 
        parentFacility = ?, 
        allowClassBooking = ?
      WHERE id = ?`,
      [
        name,
        facilityType,
        roster,
        allowedCategories,
        informationLink,
        parentFacility,
        allowClassBooking,
        id
      ]
    );

    const [updated] = await db.query(`SELECT * FROM facilities WHERE id = ?`, [id]);

    res.json({
      status: true,
      message: "Facility updated successfully",
      facility: updated[0]
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};



const deleteFacility = async (req, res) => {
  const { id } = req.params;

  try {
    await db.query(`DELETE FROM facilities WHERE id = ?`, [id]);
    res.json({ status: true, message: "Facility deleted successfully" });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};


module.exports = {addFacility, getAllFacilities, getFacilityById, updateFacility, deleteFacility}
