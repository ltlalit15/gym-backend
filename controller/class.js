const db = require('../config');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const multer = require('multer');
require('dotenv').config();
const path = require('path');
const nodemailer = require('nodemailer');

const addClass = async (req, res) => {
  const {
    className,
    userId,
    membershipCategoryId,
    duration,
    maxParticipants,
    color,
    classFor,
    benefits,
    alternativePayment,
    noShowPrice,
    multipleBookings,
    waitlistLimit,
    waitlistHours,
    cancellationHours,
    bookableOnline,
    commissionType
  } = req.body;

  try {
    const [result] = await db.query(
      `INSERT INTO class
        (className, userId, membershipCategoryId, duration, maxParticipants, color, classFor, benefits, alternativePayment, noShowPrice, multipleBookings, waitlistLimit, waitlistHours, cancellationHours, bookableOnline, commissionType)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        className,
        userId,
        membershipCategoryId,
        duration,
        maxParticipants,
        color,
        classFor,
        benefits,
        alternativePayment,
        noShowPrice,
        multipleBookings,
        waitlistLimit,
        waitlistHours,
        cancellationHours,
        bookableOnline,
        commissionType
      ]
    );

    const [insertedClass] = await db.query(
      `SELECT * FROM class WHERE id = ?`,
      [result.insertId]
    );

    res.status(201).json({
      status: true,
      message: "Class added successfully",
      class: insertedClass[0]
    });

  } catch (error) {
    console.error("Add Class Error:", error);
    res.status(500).json({ status: false, message: "Failed to add class" });
  }
};



  const getAllClass = async (req, res) => {
    try {
      const [rows] = await db.query(`SELECT * FROM class`);
      res.status(200).json({ status: true, message: "retrieved all data", class: rows });
    } catch (error) {
      res.status(500).json({ status: false, message: error.message });
    }
  };


  const getClassById = async (req, res) => {
    const { id } = req.params;
  
    try {
      const [rows] = await db.query(`SELECT * FROM class WHERE id = ?`, [id]);
  
      if (rows.length === 0) {
        return res.status(404).json({ status: false, message: "Class not found" });
      }
  
      res.status(200).json({
        status: true,
        message: "Class data retrieved successfully",
        task: rows[0],
      });
    } catch (error) {
      res.status(500).json({ status: false, message: error.message });
    }
  };

  

  const updateClass = async (req, res) => {
  const {
    className,
    userId,
    membershipCategoryId,
    duration,
    maxParticipants,
    color,
    classFor,
    benefits,
    alternativePayment,
    noShowPrice,
    multipleBookings,
    waitlistLimit,
    waitlistHours,
    cancellationHours,
    bookableOnline,
    commissionType
  } = req.body;

  const { id } = req.params;

  try {
    const [result] = await db.query(
      `UPDATE class SET 
        className = ?, 
        userId = ?, 
        membershipCategoryId = ?, 
        duration = ?, 
        maxParticipants = ?, 
        color = ?, 
        classFor = ?, 
        benefits = ?, 
        alternativePayment = ?, 
        noShowPrice = ?, 
        multipleBookings = ?, 
        waitlistLimit = ?, 
        waitlistHours = ?, 
        cancellationHours = ?, 
        bookableOnline = ?, 
        commissionType = ?
      WHERE id = ?`,
      [
        className,
        userId,
        membershipCategoryId,
        duration,
        maxParticipants,
        color,
        classFor,
        benefits,
        alternativePayment,
        noShowPrice,
        multipleBookings,
        waitlistLimit,
        waitlistHours,
        cancellationHours,
        bookableOnline,
        commissionType,
        id
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ status: false, message: 'Class not found' });
    }

    const [updatedClass] = await db.query(`SELECT * FROM class WHERE id = ?`, [id]);

    res.status(200).json({
      status: true,
      message: 'Class updated successfully',
      class: updatedClass[0]
    });
  } catch (error) {
    console.error('Update Class Error:', error);
    res.status(500).json({ status: false, message: 'Failed to update class' });
  }
};



const deleteClass = async (req, res) => {
    const { id } = req.params;
  
    try {
      // Check if the exercise exists
      const [classes] = await db.query(`SELECT * FROM class WHERE id = ?`, [id]);
  
      if (classes.length === 0) {
        return res.status(404).json({ status: false, message: "Class not found" });
      }
  
      // Delete the class
      await db.query(`DELETE FROM class WHERE id = ?`, [id]);
  
      res.status(200).json({
        status: true,
        message: "Class deleted successfully"
      });
    } catch (error) {
      console.error("Delete class Error:", error);
      res.status(500).json({ status: false, message: error.message });
    }
  };
  




  


module.exports = { addClass, getAllClass, getClassById, updateClass, deleteClass };