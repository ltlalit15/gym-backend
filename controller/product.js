const db = require('../config');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const multer = require('multer');
require('dotenv').config();
const path = require('path');
const nodemailer = require('nodemailer');
const cloudinary = require('cloudinary').v2;

// Cloudinary Configuration
cloudinary.config({
    cloud_name: 'dkqcqrrbp',
    api_key: '418838712271323',
    api_secret: 'p12EKWICdyHWx8LcihuWYqIruWQ'
});


const addProduct = async (req, res) => {
  const {
    userId, productType, salesPrice, includeTax,
    color, trackStock,
    supplier, purchasePrice, includingTax,
    subGroup, barcode, sortOrder
  } = req.body;

  let imageUrl = "";

  if (req.files?.image) {
    try {
      const result = await cloudinary.uploader.upload(
        req.files.image.tempFilePath,
        { folder: "product_images" }
      );
      imageUrl = result.secure_url;
    } catch (err) {
      return res.status(500).json({ status: false, message: "Image upload failed." });
    }
  }

  try {
    const [insertResult] = await db.query(
      `INSERT INTO products 
       (userId, productType, salesPrice, includeTax, color, trackStock, supplier,
        purchasePrice, includingTax, subGroup, barcode, sortOrder, image)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userId, productType, salesPrice, includeTax,
        color, trackStock, supplier,
        purchasePrice, includingTax,
        subGroup, barcode, sortOrder, imageUrl
      ]
    );

    const [inserted] = await db.query(`SELECT * FROM products WHERE id = ?`, [insertResult.insertId]);

    const product = {
      ...inserted[0],
      image: inserted[0].image ? [inserted[0].image] : []
    };

    res.status(201).json({
      status: true,
      message: "Product added successfully",
      product
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

const getAllProducts = async (req, res) => {
  try {
    const [products] = await db.query("SELECT * FROM products");

    const updatedProducts = products.map(product => ({
      ...product,
      image: product.image ? [product.image] : []
    }));

    res.status(200).json({
      status: true,
      message: "All products fetched successfully",
      products: updatedProducts
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

const getProductById = async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.query("SELECT * FROM products WHERE id = ?", [id]);

    if (result.length > 0) {
      const product = {
        ...result[0],
        image: result[0].image ? [result[0].image] : []
      };

      res.status(200).json({
        status: true,
        message: "Product found",
        product
      });
    } else {
      res.status(404).json({ status: false, message: "Product not found" });
    }
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};


const updateProduct = async (req, res) => {
  const { id } = req.params;
  const {
    userId, productType, salesPrice, includeTax,
    color, trackStock,
    supplier, purchasePrice, includingTax,
    subGroup, barcode, sortOrder
  } = req.body;

  let imageUrl = null;

  if (req.files?.image) {
    try {
      const result = await cloudinary.uploader.upload(
        req.files.image.tempFilePath,
        { folder: "product_images" }
      );
      imageUrl = result.secure_url;
    } catch (err) {
      return res.status(500).json({ status: false, message: "Image upload failed." });
    }
  }

  try {
    const updateQuery = `
      UPDATE products SET 
        userId = ?, productType = ?, salesPrice = ?, includeTax = ?, 
        color = ?, trackStock = ?, supplier = ?, purchasePrice = ?, 
        includingTax = ?, subGroup = ?, barcode = ?, sortOrder = ?, 
        image = COALESCE(?, image)
      WHERE id = ?
    `;

    const [updateResult] = await db.query(updateQuery, [
      userId, productType, salesPrice, includeTax,
      color, trackStock, supplier, purchasePrice,
      includingTax, subGroup, barcode, sortOrder,
      imageUrl, id
    ]);

    if (updateResult.affectedRows > 0) {
      const [updated] = await db.query("SELECT * FROM products WHERE id = ?", [id]);

      const product = {
        ...updated[0],
        image: updated[0].image ? [updated[0].image] : []
      };

      res.status(200).json({
        status: true,
        message: "Product updated successfully",
        product
      });
    } else {
      res.status(404).json({ status: false, message: "Product not found" });
    }
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};


const deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const [delResult] = await db.query("DELETE FROM products WHERE id = ?", [id]);

    if (delResult.affectedRows > 0) {
      res.status(200).json({ status: true, message: "Product deleted successfully" });
    } else {
      res.status(404).json({ status: false, message: "Product not found" });
    }
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};



module.exports = { addProduct, getAllProducts, getProductById, updateProduct, deleteProduct };
