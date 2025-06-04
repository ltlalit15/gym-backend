const db = require('../config');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const multer = require('multer');
require('dotenv').config();
const path = require('path');
const nodemailer = require('nodemailer');



const addDoor = async (req, res) => {
  const {
    userId,
    clubId,
    doorNumber,
    doorName,
    installationDate,
    openStatus,
    concessionHandling,
    autoBookClass,
    associatedResources,
    waiverRestrictions,
    restrictedAccess,
    exitCheckoutDoor,
    notes
  } = req.body;

  try {
    // Insert a new door
    const [insertResult] = await db.query(
      `INSERT INTO doors 
        (userId, clubId, doorNumber, doorName, installationDate, openStatus, concessionHandling, 
         autoBookClass, associatedResources, waiverRestrictions, restrictedAccess, exitCheckoutDoor, notes) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userId, clubId, doorNumber, doorName, installationDate, openStatus, concessionHandling, 
        autoBookClass, associatedResources, waiverRestrictions, restrictedAccess, exitCheckoutDoor, notes
      ]
    );

    // Fetch the inserted door by its ID
    const [doorRow] = await db.query(
      `SELECT * FROM doors WHERE id = ?`,
      [insertResult.insertId]
    );

    res.status(201).json({
      status: true,
      message: "Door added successfully",
      door: doorRow[0]
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};


const getDoors = async (req, res) => {
  try {
    const [doors] = await db.query(`SELECT * FROM doors`);
    res.status(200).json({
      status: true,
      message: "Reterived all doors data",
      doors: doors
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};


const getDoorById = async (req, res) => {
  const { id } = req.params;

  try {
    const [door] = await db.query(`SELECT * FROM doors WHERE id = ?`, [id]);

    if (door.length > 0) {
      res.status(200).json({
        status: true,
        message: "Reterived Single doors data",
        door: door[0]
      });
    } else {
      res.status(404).json({
        status: false,
        message: "Door not found"
      });
    }
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

const updateDoor = async (req, res) => {
  const { id } = req.params;
  const {
    userId,
    clubId,
    doorNumber,
    doorName,
    installationDate,
    openStatus,
    concessionHandling,
    autoBookClass,
    associatedResources,
    waiverRestrictions,
    restrictedAccess,
    exitCheckoutDoor,
    notes
  } = req.body;

  try {
    const [updateResult] = await db.query(
      `UPDATE doors 
       SET userId = ?, clubId = ?, doorNumber = ?, doorName = ?, installationDate = ?, openStatus = ?, 
           concessionHandling = ?, autoBookClass = ?, associatedResources = ?, waiverRestrictions = ?, 
           restrictedAccess = ?, exitCheckoutDoor = ?, notes = ? 
       WHERE id = ?`,
      [
        userId, clubId, doorNumber, doorName, installationDate, openStatus, concessionHandling, 
        autoBookClass, associatedResources, waiverRestrictions, restrictedAccess, exitCheckoutDoor, notes, id
      ]
    );

    if (updateResult.affectedRows > 0) {
      const [doorRow] = await db.query(`SELECT * FROM doors WHERE id = ?`, [id]);
      res.status(200).json({
        status: true,
        message: "Door updated successfully",
        door: doorRow[0]
      });
    } else {
      res.status(404).json({
        status: false,
        message: "Door not found"
      });
    }
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};



const deleteDoor = async (req, res) => {
  const { id } = req.params;

  try {
    const [deleteResult] = await db.query(`DELETE FROM doors WHERE id = ?`, [id]);

    if (deleteResult.affectedRows > 0) {
      res.status(200).json({
        status: true,
        message: "Door deleted successfully"
      });
    } else {
      res.status(404).json({
        status: false,
        message: "Door not found"
      });
    }
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};





module.exports = { addDoor, getDoors, getDoorById, updateDoor, deleteDoor };