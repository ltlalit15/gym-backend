const db = require('../config');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const multer = require('multer');
require('dotenv').config();
const path = require('path');
const nodemailer = require('nodemailer');


const addRoster = async (req, res) => {
  const { rosterName, rosterType } = req.body;

  try {
    const [result] = await db.query(
      `INSERT INTO roaster (rosterName, rosterType) VALUES (?, ?)`,
      [rosterName, rosterType]
    );

    const [inserted] = await db.query("SELECT * FROM roaster WHERE id = ?", [result.insertId]);

    res.status(201).json({
      status: true,
      message: "Roster added successfully",
      roster: inserted[0]
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

const getAllRosters = async (req, res) => {
  try { 
    const [rows] = await db.query("SELECT * FROM roaster");
    res.status(200).json({ status: true, message: "All roster data fetched", roaster: rows });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

const getRosterById = async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await db.query("SELECT * FROM roaster WHERE id = ?", [id]);
    
    if (rows.length > 0) {
      res.status(200).json({ status: true, message: "Single roaster data", roaster: rows[0] });
    } else {
      res.status(404).json({ status: false, message: "Roster not found" });
    }
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};


const updateRoster = async (req, res) => {
  const { id } = req.params;
  const { rosterName, rosterType } = req.body;

  try {
    const [update] = await db.query(
      `UPDATE roaster SET rosterName = ?, rosterType = ? WHERE id = ?`,
      [rosterName, rosterType, id]
    );

    if (update.affectedRows > 0) {
      const [updated] = await db.query("SELECT * FROM roaster WHERE id = ?", [id]);
      res.status(200).json({
        status: true,
        message: "Roster updated successfully",
        roster: updated[0]
      });
    } else {
      res.status(404).json({ status: false, message: "Roster not found" });
    }
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};


const deleteRoster = async (req, res) => {
  const { id } = req.params;

  try {
    const [del] = await db.query("DELETE FROM roaster WHERE id = ?", [id]);

    if (del.affectedRows > 0) {
      res.status(200).json({ status: true, message: "Roster deleted successfully" });
    } else {
      res.status(404).json({ status: false, message: "Roster not found" });
    }
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};



module.exports = { addRoster, getAllRosters, getRosterById, updateRoster, deleteRoster };