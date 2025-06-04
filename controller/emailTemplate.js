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


const addEmailTemplate = async (req, res) => {
  const {
    userId, name, categoryId, subscriptionType, clubId,
    toEmailText, ccEmail, bccEmail,
    fieldCategory, insertField, subject, emailBody
  } = req.body;

  let imageUrl = "";

  // Cloudinary image upload
  if (req.files?.image) {
    try {
      const result = await cloudinary.uploader.upload(
        req.files.image.tempFilePath,
        { folder: "emailtemplate_images" }
      );
      imageUrl = result.secure_url;
    } catch (uploadErr) {
      console.error("Image upload error:", uploadErr);
      return res.status(500).json({ status: false, message: "Image upload failed." });
    }
  }

  try {
    const [result] = await db.query(
      `INSERT INTO emailtemplate (
        userId, name, categoryId, subscriptionType, clubId,
        toEmailText, ccEmail, bccEmail,
        fieldCategory, insertField, subject, emailBody, image
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
       userId, name, categoryId, subscriptionType, clubId,
        toEmailText, ccEmail, bccEmail,
        fieldCategory, insertField, subject, emailBody, imageUrl
      ]
    );

    const [inserted] = await db.query(`SELECT * FROM emailtemplate WHERE id = ?`, [result.insertId]);

    res.status(201).json({
      status: true,
      message: "Email template added successfully",
      email_template: {
        ...inserted[0],
        image: inserted[0].image ? [inserted[0].image] : []
      }
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};



const getAllEmailTemplates = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM emailtemplate");
    const templates = rows.map(row => ({
      ...row,
      image: row.image ? [row.image] : []
    }));

    res.status(200).json({ status: true, message: "All email templates data", emailtemplate: templates });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};


const getEmailTemplateById = async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await db.query("SELECT * FROM emailtemplate WHERE id = ?", [id]);

    if (rows.length > 0) {
      const template = {
        ...rows[0],
        image: rows[0].image ? [rows[0].image] : []
      };

      res.status(200).json({ status: true,  message: "Single email templates data", emailtemplate: template });
    } else {
      res.status(404).json({ status: false, message: "Email template not found" });
    }
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};


const updateEmailTemplate = async (req, res) => {
  const { id } = req.params;
  const {
    userId, name, categoryId, subscriptionType, clubId,
    toEmailText, ccEmail, bccEmail,
    fieldCategory, insertField, subject, emailBody
  } = req.body;

  let imageUrl = "";

  // Optional image upload
  if (req.files?.image) {
    try {
      const result = await cloudinary.uploader.upload(
        req.files.image.tempFilePath,
        { folder: "email_template_images" }
      );
      imageUrl = result.secure_url;
    } catch (err) {
      console.error("Cloudinary upload error:", err);
      return res.status(500).json({ status: false, message: "Image upload failed" });
    }
  }

  try {
    const updateQuery = `
      UPDATE emailtemplate SET 
        userId = ?, name = ?, categoryId = ?, subscriptionType = ?, clubId = ?,
        toEmailText = ?, ccEmail = ?, bccEmail = ?,
        fieldCategory = ?, insertField = ?, subject = ?, emailBody = ?,
        image = COALESCE(?, image)
      WHERE id = ?
    `;

    const [result] = await db.query(updateQuery, [
      userId, name, categoryId, subscriptionType, clubId,
      toEmailText, ccEmail, bccEmail,
      fieldCategory, insertField, subject, emailBody,
      imageUrl, id
    ]);

    if (result.affectedRows > 0) {
      const [updated] = await db.query("SELECT * FROM emailtemplate WHERE id = ?", [id]);
      res.status(200).json({
        status: true,
        message: "Email template updated successfully",
        email_template: {
          ...updated[0],
          image: updated[0].image ? [updated[0].image] : []
        }
      });
    } else {
      res.status(404).json({ status: false, message: "Email template not found" });
    }
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};


const deleteEmailTemplate = async (req, res) => {
  const { id } = req.params;

  try {
    const [deleted] = await db.query("DELETE FROM emailtemplate WHERE id = ?", [id]);

    if (deleted.affectedRows > 0) {
      res.status(200).json({ status: true, message: "Email template deleted successfully" });
    } else {
      res.status(404).json({ status: false, message: "Email template not found" });
    }
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};



module.exports = { addEmailTemplate, getAllEmailTemplates, getEmailTemplateById, updateEmailTemplate, deleteEmailTemplate };
