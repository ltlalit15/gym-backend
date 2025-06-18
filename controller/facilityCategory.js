const db = require('../config');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const multer = require('multer');
require('dotenv').config();
const path = require('path');
const nodemailer = require('nodemailer');



const addFacilityCategory = async (req, res) => {
  const { categoryName, period, cludId, categoryType } = req.body;

  try {
    const [result] = await db.query(
      `INSERT INTO facilitycategories (categoryName, period, cludId, categoryType)
       VALUES (?, ?, ?, ?)`,
      [categoryName, period, cludId, categoryType]
    );

    const [category] = await db.query(
      `SELECT * FROM facilitycategories WHERE id = ?`,
      [result.insertId]
    );

    res.status(201).json({
      status: true,
      message: "Facility category added successfully",
      data: category[0]
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};




const getAllFacilityCategories = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        fc.id,
        fc.categoryName,
        fc.period,
        fc.cludId,
        c.clubName,
        fc.categoryType
      FROM 
        facilitycategories fc
      LEFT JOIN 
        clubs c ON fc.cludId = c.id
    `);

    res.json({
      status: true,
      message: "Facility categories with club names fetched successfully",
      data: rows
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Error fetching facility categories: " + error.message
    });
  }
};




const getFacilityCategoryById = async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await db.query(`SELECT * FROM facilitycategories WHERE id = ?`, [id]);

    if (rows.length === 0) {
      return res.status(404).json({ status: false, message: "Facility category not found" });
    }

    res.json({
      status: true,
      message: "Facility category fetched successfully",
      data: rows[0]
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};



const updateFacilityCategory = async (req, res) => {
  const { id } = req.params;
  const { categoryName, period, cludId, categoryType } = req.body;

  try {
    await db.query(
      `UPDATE facilitycategories 
       SET categoryName = ?, period = ?, cludId = ?, categoryType = ?
       WHERE id = ?`,
      [categoryName, period, cludId, categoryType, id]
    );

    const [updated] = await db.query(`SELECT * FROM facilitycategories WHERE id = ?`, [id]);

    res.json({
      status: true,
      message: "Facility category updated successfully",
      data: updated[0]
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};


const deleteFacilityCategory = async (req, res) => {
  const { id } = req.params;

  try {
    await db.query(`DELETE FROM facilitycategories WHERE id = ?`, [id]);
    res.json({ status: true, message: "Facility category deleted successfully" });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};


module.exports = {addFacilityCategory, getAllFacilityCategories, getFacilityCategoryById, updateFacilityCategory, deleteFacilityCategory}
