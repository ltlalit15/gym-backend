const db = require('../config');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const multer = require('multer');
require('dotenv').config();
const path = require('path');
const nodemailer = require('nodemailer');



const addPayment = async (req, res) => {
  const { userId, stripeSubscriptionId, amount, paymentStatus } = req.body;

  try {
    // Insert a new payment
    const [insertResult] = await db.query(
      `INSERT INTO payments (userId, stripeSubscriptionId, amount, paymentStatus) 
       VALUES (?, ?, ?, ?)`,
      [userId, stripeSubscriptionId, amount, paymentStatus]
    );

    // Fetch the inserted payment by its ID
    const [paymentRow] = await db.query(
      `SELECT * FROM payments WHERE id = ?`,
      [insertResult.insertId]
    );

    res.status(201).json({
      status: true,
      message: "Payment added successfully",
      payment: paymentRow[0]
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};



const getAllPayments = async (req, res) => {
  try {
    const [payments] = await db.query('SELECT * FROM payments');
    res.status(200).json({
      status: true,
      message: 'Payments fetched successfully',
      payments
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};



const getPaymentById = async (req, res) => {
  const { id } = req.params;

  try {
    const [payment] = await db.query('SELECT * FROM payments WHERE id = ?', [id]);

    if (payment.length === 0) {
      return res.status(404).json({ status: false, message: 'Payment not found' });
    }

    res.status(200).json({
      status: true,
      message: 'Payment fetched successfully',
      payment: payment[0]
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};


const updatePayment = async (req, res) => {
  const { id } = req.params;
  const { userId, stripeSubscriptionId, amount, paymentStatus } = req.body;

  try {
    // Check if payment exists
    const [payment] = await db.query('SELECT * FROM payments WHERE id = ?', [id]);
    if (payment.length === 0) {
      return res.status(404).json({ status: false, message: 'Payment not found' });
    }

    // Update the payment
    await db.query(
      'UPDATE payments SET userId = ?, stripeSubscriptionId = ?, amount = ?, paymentStatus = ? WHERE id = ?',
      [userId, stripeSubscriptionId, amount, paymentStatus, id]
    );

    // Fetch the updated payment
    const [updatedPayment] = await db.query('SELECT * FROM payments WHERE id = ?', [id]);

    res.status(200).json({
      status: true,
      message: 'Payment updated successfully',
      payment: updatedPayment[0]
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};


const deletePayment = async (req, res) => {
  const { id } = req.params;

  try {
    // Check if payment exists
    const [payment] = await db.query('SELECT * FROM payments WHERE id = ?', [id]);
    if (payment.length === 0) {
      return res.status(404).json({ status: false, message: 'Payment not found' });
    }

    // Delete the payment
    await db.query('DELETE FROM payments WHERE id = ?', [id]);

    res.status(200).json({
      status: true,
      message: 'Payment deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};



module.exports = {addPayment, getAllPayments, getPaymentById, updatePayment, deletePayment}



