const db = require('../config');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const multer = require('multer');
require('dotenv').config();
const path = require('path');
const nodemailer = require('nodemailer');


const addBooking = async (req, res) => {
    const { userId, memberName, facility, bookingDate, timeSlot, status, membershipUsed, price, notes, isPaid, isCheckedIn } = req.body;
  
    try {
      const [insertResult] = await db.query(
        `INSERT INTO booking (
          userId, memberName, facility, bookingDate, timeSlot, status, membershipUsed, price, notes, isPaid, isCheckedIn
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [userId, memberName, facility, bookingDate, timeSlot, status, membershipUsed, price, notes, isPaid, isCheckedIn ]
      );
  
      const [bookingRow] = await db.query(
        `SELECT * FROM booking WHERE id = ?`,
        [insertResult.insertId]
      );
  
      res.status(201).json({
        status: true,
        message: "Booking created successfully",
        booking: bookingRow[0],
      });
    } catch (error) {
      console.error("Add Booking Error:", error);
      res.status(500).json({ status: false, message: error.message });
    }
  };

    
  const getAllBookings = async (req, res) => {
    const { bookingDate, membershipUsed } = req.query;
    let query = `SELECT * FROM booking WHERE 1=1`;
    const values = [];
  
    if (bookingDate) {
      query += ` AND bookingDate = ?`;
      values.push(bookingDate);
    }
  
    if (membershipUsed) {
      query += ` AND membershipUsed = ?`;
      values.push(membershipUsed);
    }
  
    try {
      const [rows] = await db.query(query, values);
      res.status(200).json({ status: true, bookings: rows });
    } catch (error) {
      res.status(500).json({ status: false, message: error.message });
    }
  };
  

  const getBookingsByDate = async (req, res) => {
    const { date } = req.query;
  
    try {
      const [rows] = await db.query(
        `SELECT * FROM booking WHERE bookingDate = ? ORDER BY timeSlot`,
        [date]
      );
  
      res.status(200).json({
        status: true,
        message: "Bookings for selected date fetched successfully",
        bookings: rows,
      });
    } catch (error) {
      console.error("Get Bookings By Date Error:", error);
      res.status(500).json({ status: false, message: error.message });
    }
  };


  const getBookingsByName = async (req, res) => {
    const { memberName } = req.query;
  
    try {
      const [rows] = await db.query(
        `SELECT * FROM booking WHERE memberName = ? ORDER BY timeSlot`,
        [memberName]
      );
  
      res.status(200).json({
        status: true,
        message: "Bookings for selected name fetched successfully",
        bookings: rows,
      });
    } catch (error) {
      console.error("Get Bookings By name Error:", error);
      res.status(500).json({ status: false, message: error.message });
    }
  };



module.exports = { addBooking, getAllBookings, getBookingsByDate, getBookingsByName };
