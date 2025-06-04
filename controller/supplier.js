const db = require('../config');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const multer = require('multer');
require('dotenv').config();
const path = require('path');
const nodemailer = require('nodemailer');



const addSupplier = async (req, res) => {
  const { name, website, email, account, notes } = req.body;

  try {
    const [result] = await db.query(
      `INSERT INTO supplier (name, website, email, account, notes)
       VALUES (?, ?, ?, ?, ?)`,
      [name, website, email, account, notes]
    );

    const [inserted] = await db.query("SELECT * FROM supplier WHERE id = ?", [result.insertId]);

    res.status(201).json({
      status: true,
      message: "Supplier added successfully",
      supplier: inserted[0]
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};


const getAllSuppliers = async (req, res) => {
  try {
    const [supplier] = await db.query("SELECT * FROM supplier");
    res.status(200).json({ status: true, message: "All supplier data", supplier });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};


const getSupplierById = async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.query("SELECT * FROM supplier WHERE id = ?", [id]);

    if (result.length > 0) {
      res.status(200).json({ status: true, message: "single supplier data", supplier: result[0] });
    } else {
      res.status(404).json({ status: false, message: "Supplier not found" });
    }
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

const updateSupplier = async (req, res) => {
  const { id } = req.params;
  const { name, website, email, account, notes } = req.body;

  try {
    const [update] = await db.query(
      `UPDATE supplier SET 
        name = ?, website = ?, email = ?, account = ?, notes = ?
       WHERE id = ?`,
      [name, website, email, account, notes, id]
    );

    if (update.affectedRows > 0) {
      const [updated] = await db.query("SELECT * FROM supplier WHERE id = ?", [id]);
      res.status(200).json({
        status: true,
        message: "Supplier updated successfully",
        supplier: updated[0]
      });
    } else {
      res.status(404).json({ status: false, message: "Supplier not found" });
    }
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};


const deleteSupplier = async (req, res) => {
  const { id } = req.params;

  try {
    const [del] = await db.query("DELETE FROM supplier WHERE id = ?", [id]);

    if (del.affectedRows > 0) {
      res.status(200).json({ status: true, message: "Supplier deleted successfully" });
    } else {
      res.status(404).json({ status: false, message: "Supplier not found" });
    }
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};



module.exports = { addSupplier, getAllSuppliers, getSupplierById, updateSupplier, deleteSupplier };