const db = require('../config');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const multer = require('multer');
require('dotenv').config();
const path = require('path');
const nodemailer = require('nodemailer');



const addClub = async (req, res) => {
  const { userId, clubName, legalName, address, suburb, city, postCode, country, email, phoneNumber, websiteUrl, additionalDetails } = req.body;

  try {
    // Insert the new club
    const [insertResult] = await db.query(
      `INSERT INTO clubs (userId, clubName, legalName, address, suburb, city, postCode, country, email, phoneNumber, websiteUrl, additionalDetails) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [userId, clubName, legalName, address, suburb, city, postCode, country, email, phoneNumber, websiteUrl, additionalDetails]
    );

    // Fetch the inserted club by its ID
    const [clubRow] = await db.query(
      `SELECT * FROM clubs WHERE id = ?`,
      [insertResult.insertId]
    );

    res.status(201).json({
      status: true,
      message: "Club added successfully",
      club: clubRow[0]
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};


const getAllClubs = async (req, res) => {
  try {
    const [clubs] = await db.query(`SELECT * FROM clubs`);
    res.status(200).json({
      status: true,
      message: "Reterived All Club data",
      clubs: clubs
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};


const getClubById = async (req, res) => {
  const { id } = req.params;

  try {
    const [club] = await db.query(`SELECT * FROM clubs WHERE id = ?`, [id]);

    if (club.length > 0) {
      res.status(200).json({
        status: true,
          message: "Reterived Single Club data",
        club: club[0]
      });
    } else {
      res.status(404).json({
        status: false,
        message: "Club not found"
      });
    }
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};


const updateClub = async (req, res) => {
  const { id } = req.params;
  const { userId, clubName, legalName, address, suburb, city, postCode, country, email, phoneNumber, websiteUrl, additionalDetails } = req.body;

  try {
    const [updateResult] = await db.query(
      `UPDATE clubs 
       SET userId = ?, clubName = ?, legalName = ?, address = ?, suburb = ?, city = ?, postCode = ?, country = ?, email = ?, phoneNumber = ?, websiteUrl = ?, additionalDetails = ? 
       WHERE id = ?`,
      [userId, clubName, legalName, address, suburb, city, postCode, country, email, phoneNumber, websiteUrl, additionalDetails, id]
    );

    if (updateResult.affectedRows > 0) {
      const [clubRow] = await db.query(`SELECT * FROM clubs WHERE id = ?`, [id]);
      res.status(200).json({
        status: true,
        message: "Club updated successfully",
        club: clubRow[0]
      });
    } else {
      res.status(404).json({
        status: false,
        message: "Club not found"
      });
    }
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};


const deleteClub = async (req, res) => {
  const { id } = req.params;

  try {
    const [deleteResult] = await db.query(`DELETE FROM clubs WHERE id = ?`, [id]);

    if (deleteResult.affectedRows > 0) {
      res.status(200).json({
        status: true,
        message: "Club deleted successfully"
      });
    } else {
      res.status(404).json({
        status: false,
        message: "Club not found"
      });
    }
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};




module.exports = { addClub, getAllClubs, getClubById, updateClub, deleteClub };