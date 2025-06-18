const db = require('../config');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const multer = require('multer');
require('dotenv').config();
const path = require('path');
const nodemailer = require('nodemailer');




const addCategory = async (req, res) => {
  const { categoryName, tax, clubId } = req.body;

  try {
    const [insertResult] = await db.query(
      `INSERT INTO categories (categoryName, tax, clubId) VALUES (?, ?, ?)`,
      [categoryName, tax, clubId]
    );

    const [categoryRow] = await db.query(
      `SELECT * FROM categories WHERE id = ?`,
      [insertResult.insertId]
    );

    res.status(201).json({
      status: true,
      message: "Category added successfully",
      category: categoryRow[0],
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};




const getAllCategories = async (req, res) => {
  try {
    const [rows] = await db.query(`SELECT * FROM categories`);
    res.json({
      status: true,
      message: "All categories fetched successfully",
      categories: rows
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Error fetching categories: " + error.message
    });
  }
};


const getCategoryById = async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await db.query(`SELECT * FROM categories WHERE id = ?`, [id]);

    if (rows.length === 0) {
      return res.status(404).json({
        status: false,
        message: "Category not found"
      });
    }

    res.json({
      status: true,
      message: "Category fetched successfully",
      category: rows[0]
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Error fetching category: " + error.message
    });
  }
};



const updateCategory = async (req, res) => {
  const { id } = req.params;
  const { categoryName, tax, clubId } = req.body;

  try {
    await db.query(
      `UPDATE categories SET categoryName = ?, tax = ?, clubId = ? WHERE id = ?`,
      [categoryName, tax, clubId, id]
    );

    const [updatedRow] = await db.query(`SELECT * FROM categories WHERE id = ?`, [id]);

    res.json({
      status: true,
      message: "Category updated successfully",
      category: updatedRow[0],
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};


const deleteCategory = async (req, res) => {
  const { id } = req.params;

  try {
    await db.query(`DELETE FROM categories WHERE id = ?`, [id]);
    res.json({ status: true, message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};



module.exports = {addCategory, getAllCategories, getCategoryById, updateCategory, deleteCategory}



