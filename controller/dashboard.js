const db = require('../config');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const multer = require('multer');
require('dotenv').config();
const path = require('path');
const nodemailer = require('nodemailer');
const cloudinary = require('cloudinary').v2;


const getDashboardMetrics = async (req, res) => {
    try {
      const [totalMembersResult] = await db.query(`
        SELECT COUNT(*) AS totalMembers FROM member
      `);
      
      const [newMembersResult] = await db.query(`
        SELECT COUNT(*) AS newMembers
        FROM member
        WHERE MONTH(created_at) = MONTH(CURDATE()) AND YEAR(created_at) = YEAR(CURDATE())
      `);
  
      const [totalRevenueResult] = await db.query(`
        SELECT SUM(CAST(price AS DECIMAL)) AS totalRevenue
        FROM membership
        WHERE MONTH(startDate) = MONTH(CURDATE()) AND YEAR(startDate) = YEAR(CURDATE()) AND membershiptypeId = 1
      `);
      
    //   const [failedPaymentsResult] = await db.query(`
    //     SELECT COUNT(*) AS failedPayments
    //     FROM membership
    //     WHERE payment_status = 'failed' AND MONTH(updated_at) = MONTH(CURDATE()) AND YEAR(updated_at) = YEAR(CURDATE())
    //   `);
      
      const [membershipBreakdownResult] = await db.query(`
        SELECT membershiptypeId, COUNT(*) AS count
        FROM membership
        GROUP BY membershiptypeId
      `);
      
      const [genderDistributionResult] = await db.query(`
        SELECT gender, COUNT(*) AS count
        FROM member
        GROUP BY gender
      `);
  
      res.status(200).json({
        status: true,
        data: {
          totalMembers: totalMembersResult[0].totalMembers,
          newMembers: newMembersResult[0].newMembers,
          totalRevenue: totalRevenueResult[0].totalRevenue || 0,
          //failedPayments: failedPaymentsResult[0].failedPayments,
          membershipBreakdown: membershipBreakdownResult,
          genderDistribution: genderDistributionResult
        }
      });
    } catch (error) {
      res.status(500).json({ status: false, message: error.message });
    }
  };


  module.exports = { getDashboardMetrics };

  

