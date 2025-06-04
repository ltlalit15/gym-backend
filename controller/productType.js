const db = require('../config');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const multer = require('multer');
require('dotenv').config();
const path = require('path');
const nodemailer = require('nodemailer');


const addProductType = async (req, res) => {
  const {
    userId, name, purchaseTaxRate, salesTaxRate,
    associateRevenue, backgroundColor, associateClub, sortOrder
  } = req.body;

  try {
    const [result] = await db.query(
      `INSERT INTO producttypes 
       (userId, name, purchaseTaxRate, salesTaxRate, 
        associateRevenue, backgroundColor, associateClub, sortOrder)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userId, name, purchaseTaxRate, salesTaxRate,
        associateRevenue, backgroundColor, associateClub, sortOrder
      ]
    );

    const [inserted] = await db.query(`SELECT * FROM producttypes WHERE id = ?`, [result.insertId]);

    res.status(201).json({
      status: true,
      message: "Product type added successfully",
      product_type: inserted[0]
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};


const getAllProductTypes = async (req, res) => {
  try {
    const [productstypes] = await db.query('SELECT * FROM producttypes');
    res.status(200).json({
      status: true,
      message: "Retrieved all productstypes",
      productstypes: productstypes
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};



const getProductTypesById = async (req, res) => {
  const { id } = req.params;

  try {
    const [producttypes] = await db.query('SELECT * FROM producttypes WHERE id = ?', [id]);

    if (producttypes.length > 0) {
      res.status(200).json({
        status: true,
        message: "Retrieved single question",
        producttypes: producttypes[0]
      });
    } else {
      res.status(404).json({
        status: false,
        message: "producttypes not found"
      });
    }
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};


const updateProductType = async (req, res) => {
  const { id } = req.params;
  const {
    userId, name, purchaseTaxRate, salesTaxRate,
    associateRevenue, backgroundColor, associateClub, sortOrder
  } = req.body;

  try {
    const [updateResult] = await db.query(
      `UPDATE producttypes 
       SET userId = ?, name = ?, purchaseTaxRate = ?, salesTaxRate = ?, 
           associateRevenue = ?, backgroundColor = ?, associateClub = ?, sortOrder = ?
       WHERE id = ?`,
      [
        userId, name, purchaseTaxRate, salesTaxRate,
        associateRevenue, backgroundColor, associateClub, sortOrder, id
      ]
    );

    if (updateResult.affectedRows > 0) {
      const [updatedRow] = await db.query("SELECT * FROM producttypes WHERE id = ?", [id]);
      res.status(200).json({
        status: true,
        message: "Product type updated successfully",
        product_type: updatedRow[0]
      });
    } else {
      res.status(404).json({ status: false, message: "Product type not found" });
    }
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};


const deleteProductType = async (req, res) => {
  const { id } = req.params;

  try {
    const [deleteResult] = await db.query("DELETE FROM producttypes WHERE id = ?", [id]);

    if (deleteResult.affectedRows > 0) {
      res.status(200).json({
        status: true,
        message: "Product type deleted successfully"
      });
    } else {
      res.status(404).json({ status: false, message: "Product type not found" });
    }
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};



module.exports = { addProductType, getAllProductTypes, getProductTypesById, updateProductType, deleteProductType };