const db = require('../config');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const multer = require('multer');
require('dotenv').config();
const path = require('path');
const nodemailer = require('nodemailer');

const addBenefit = async (req, res) => {
  const { userId, comments, accessType, useRestriction } = req.body;

  try {
    const [result] = await db.query(
      `INSERT INTO membershipbenefits (userId, comments, accessType, useRestriction)
       VALUES (?, ?, ?, ?)`,
      [userId, comments, accessType, useRestriction]
    );

    const [inserted] = await db.query(`SELECT * FROM membershipbenefits WHERE id = ?`, [result.insertId]);

    res.status(201).json({
      status: true,
      message: "Benefit added successfully",
      benefit: inserted[0]
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

const getAllBenefits = async (req, res) => {
  try {
    const [benefits] = await db.query("SELECT * FROM membershipbenefits");
    res.status(200).json({ status: true, message: "Benefits fetched", benefits });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};


const getBenefitById = async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await db.query("SELECT * FROM membershipbenefits WHERE id = ?", [id]);

    if (rows.length > 0) {
      res.status(200).json({ status: true, message: "Benefit found", benefit: rows[0] });
    } else {
      res.status(404).json({ status: false, message: "Benefit not found" });
    }
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

const updateBenefit = async (req, res) => {
  const { id } = req.params;
  const { userId, comments, accessType, useRestriction } = req.body;

  try {
    const [update] = await db.query(
      `UPDATE membershipbenefits SET userId = ?, comments = ?, accessType = ?, useRestriction = ? WHERE id = ?`,
      [userId, comments, accessType, useRestriction, id]
    );

    if (update.affectedRows > 0) {
      const [updatedRow] = await db.query("SELECT * FROM membershipbenefits WHERE id = ?", [id]);
      res.status(200).json({
        status: true,
        message: "Benefit updated successfully",
        benefit: updatedRow[0]
      });
    } else {
      res.status(404).json({ status: false, message: "Benefit not found" });
    }
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};


const deleteBenefit = async (req, res) => {
  const { id } = req.params;

  try {
    const [del] = await db.query("DELETE FROM membershipbenefits WHERE id = ?", [id]);

    if (del.affectedRows > 0) {
      res.status(200).json({ status: true, message: "Benefit deleted successfully" });
    } else {
      res.status(404).json({ status: false, message: "Benefit not found" });
    }
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};



module.exports = { addBenefit, getAllBenefits, getBenefitById, updateBenefit, deleteBenefit };


