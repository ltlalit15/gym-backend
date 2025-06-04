const db = require('../config');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const multer = require('multer');
require('dotenv').config();
const path = require('path');
const nodemailer = require('nodemailer');

const addAccount = async (req, res) => {
  const { clubId, userId, accountName, accountBank, accountNumber, taxNumber } = req.body;

  try {
    // Insert a new account
    const [insertResult] = await db.query(
      `INSERT INTO accounts (clubId, userId, accountName, accountBank, accountNumber, taxNumber) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [clubId, userId, accountName, accountBank, accountNumber, taxNumber]
    );

    // Fetch the inserted account by its ID
    const [accountRow] = await db.query(
      `SELECT * FROM accounts WHERE clubId = ? AND userId = ?`,
      [clubId, userId]
    );

    res.status(201).json({
      status: true,
      message: "Account added successfully",
      account: accountRow[0]
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

const getAllAccounts = async (req, res) => {
  try {
    const [accounts] = await db.query(`SELECT * FROM accounts`);
    res.status(200).json({
      status: true,
      message: "Reterived all accounts data",
      accounts: accounts
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};


const getAccountById = async (req, res) => {
  const { id } = req.params;

  try {
    const [account] = await db.query(
      `SELECT * FROM accounts WHERE id = ?`,
      [id]
    );

    if (account.length > 0) {
      res.status(200).json({
        status: true,
        message: "Reterived Single accounts data",
        account: account[0]
      });
    } else {
      res.status(404).json({
        status: false,
        message: "Account not found"
      });
    }
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};



const updateAccount = async (req, res) => {
  const { id } = req.params; // This will get the ID of the account you're trying to update
  const { clubId, userId, accountName, accountBank, accountNumber, taxNumber } = req.body;

  try {
    // Ensure the query is correct by checking the syntax
    const [updateResult] = await db.query(
      `UPDATE accounts 
       SET clubId = ?, userId = ?, accountName = ?, accountBank = ?, accountNumber = ?, taxNumber = ? 
       WHERE id = ?`, 
      [clubId, userId, accountName, accountBank, accountNumber, taxNumber, id] // Pass 'id' as the last parameter
    );

    // Check if any rows were affected (meaning the account was found and updated)
    if (updateResult.affectedRows > 0) {
      const [accountRow] = await db.query(`SELECT * FROM accounts WHERE id = ?`, [id]);
      res.status(200).json({
        status: true,
        message: "Account updated successfully",
        account: accountRow[0] // Return the updated account data
      });
    } else {
      // If no rows were affected, it means the account with that ID was not found
      res.status(404).json({
        status: false,
        message: "Account not found"
      });
    }
  } catch (error) {
    // Handle any other errors such as SQL syntax errors
    res.status(500).json({ status: false, message: error.message });
  }
};



const deleteAccount = async (req, res) => {
  const { id } = req.params;

  try {
    const [deleteResult] = await db.query(
      `DELETE FROM accounts WHERE id = ?`,
      [id]
    );

    if (deleteResult.affectedRows > 0) {
      res.status(200).json({
        status: true,
        message: "Account deleted successfully"
      });
    } else {
      res.status(404).json({
        status: false,
        message: "Account not found"
      });
    }
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};




module.exports = { addAccount, getAllAccounts, getAccountById, updateAccount, deleteAccount };