const db = require('../config');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const multer = require('multer');
require('dotenv').config();
const path = require('path');
const nodemailer = require('nodemailer');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: "dkqcqrrbp",
  api_key: "418838712271323",
  api_secret: "p12EKWICdyHWx8LcihuWYqIruWQ",
});


const addMembershipContract = async (req, res) => {
  const { userId, templateName, contractName, insertField, message } = req.body;

  let imageUrl = "";

  if (req.files?.image) {
    try {
      const result = await cloudinary.uploader.upload(
        req.files.image.tempFilePath,
        { folder: "member_images" }
      );
      imageUrl = result.secure_url;
    } catch (uploadErr) {
      console.error("Image upload error:", uploadErr);
      return res.status(500).json({ status: false, message: "Image upload failed." });
    }
  }

  try {
    const [insertResult] = await db.query(
      `INSERT INTO membershipcontract (userId, templateName, contractName, insertField, message, image)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [userId, templateName, contractName, insertField, message, imageUrl]
    );

    const [insertedRow] = await db.query(`SELECT * FROM membershipcontract WHERE id = ?`, [insertResult.insertId]);

    // Wrap image URL in array format before sending response
    const contractWithImageArray = {
      ...insertedRow[0],
      image: insertedRow[0].image ? [insertedRow[0].image] : [],
    };

    res.status(201).json({
      status: true,
      message: "Membership contract added successfully",
      contract: contractWithImageArray,
    });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};



const getAllMembershipContracts = async (req, res) => {
  try {
    const [contracts] = await db.query("SELECT * FROM membershipcontract");

    const updatedContracts = contracts.map(contract => ({
      ...contract,
      image: contract.image ? [contract.image] : []
    }));

    res.status(200).json({
      status: true,
      message: "All contracts retrieved successfully",
      contracts: updatedContracts
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};



const getMembershipContractById = async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.query("SELECT * FROM membershipcontract WHERE id = ?", [id]);

    if (result.length > 0) {
      const contract = {
        ...result[0],
        image: result[0].image ? [result[0].image] : []
      };

      res.status(200).json({
        status: true,
        message: "Contract retrieved successfully",
        contract
      });
    } else {
      res.status(404).json({
        status: false,
        message: "Contract not found"
      });
    }
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};


const updateMembershipContract = async (req, res) => {
  const { id } = req.params;
  const { userId, templateName, contractName, insertField, message } = req.body;

  let imageUrl = '';

  if (req.files?.image) {
    try {
      const result = await cloudinary.uploader.upload(
        req.files.image.tempFilePath,
        { folder: "member_images" }
      );
      imageUrl = result.secure_url;
    } catch (uploadErr) {
      console.error("Image upload error:", uploadErr);
      return res.status(500).json({ status: false, message: "Image upload failed." });
    }
  }

  try {
    const updateQuery = `
      UPDATE membershipcontract
      SET userId = ?, templateName = ?, contractName = ?, insertField = ?, 
          image = COALESCE(?, image), message = ?
      WHERE id = ?
    `;

    const [updateResult] = await db.query(updateQuery, [
      userId, templateName, contractName, insertField, imageUrl, message, id
    ]);

    if (updateResult.affectedRows > 0) {
      const [updatedRow] = await db.query("SELECT * FROM membershipcontract WHERE id = ?", [id]);

      const contract = {
        ...updatedRow[0],
        image: updatedRow[0].image ? [updatedRow[0].image] : []
      };

      res.status(200).json({
        status: true,
        message: "Contract updated successfully",
        contract
      });
    } else {
      res.status(404).json({ status: false, message: "Contract not found" });
    }
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
    
  }
};


const deleteMembershipContract = async (req, res) => {
  const { id } = req.params;

  try {
    const [deleteResult] = await db.query("DELETE FROM membershipcontract WHERE id = ?", [id]);

    if (deleteResult.affectedRows > 0) {
      res.status(200).json({
        status: true,
        message: "Contract deleted successfully"
      });
    } else {
      res.status(404).json({
        status: false,
        message: "Contract not found"
      });
    }
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};









module.exports = { addMembershipContract, getAllMembershipContracts, getMembershipContractById, updateMembershipContract, deleteMembershipContract };