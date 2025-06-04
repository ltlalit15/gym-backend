const db = require('../config');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const multer = require('multer');
require('dotenv').config();
const path = require('path');
const nodemailer = require('nodemailer');

const addQuestion = async (req, res) => {
  const { userId, name, availableOnline, redirectUrl, pdfCompleted, emailCompleted, enableSignature } = req.body;

  try {
    // Insert the new question into the database
    const [insertResult] = await db.query(
      `INSERT INTO questions (userId, name, availableOnline, redirectUrl, pdfCompleted, emailCompleted, enableSignature) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [userId, name, availableOnline, redirectUrl, pdfCompleted, emailCompleted, enableSignature]
    );

    // Fetch the inserted question data
    const [questionRow] = await db.query(`SELECT * FROM questions WHERE id = ?`, [insertResult.insertId]);

    res.status(201).json({
      status: true,
      message: "Question added successfully",
      question: questionRow[0]
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};



const getAllQuestions = async (req, res) => {
  try {
    const [questions] = await db.query('SELECT * FROM questions');
    res.status(200).json({
      status: true,
      message: "Retrieved all questions",
      questions: questions
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};



const getQuestionById = async (req, res) => {
  const { id } = req.params;

  try {
    const [question] = await db.query('SELECT * FROM questions WHERE id = ?', [id]);

    if (question.length > 0) {
      res.status(200).json({
        status: true,
        message: "Retrieved single question",
        question: question[0]
      });
    } else {
      res.status(404).json({
        status: false,
        message: "Question not found"
      });
    }
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};


const updateQuestion = async (req, res) => {
  const { id } = req.params;
  const { userId, name, availableOnline, redirectUrl, pdfCompleted, emailCompleted, enableSignature } = req.body;

  try {
    const [updateResult] = await db.query(
      `UPDATE questions 
       SET userId = ?, name = ?, availableOnline = ?, redirectUrl = ?, pdfCompleted = ?, emailCompleted = ?, enableSignature = ?
       WHERE id = ?`,
      [userId, name, availableOnline, redirectUrl, pdfCompleted, emailCompleted, enableSignature, id]
    );

    if (updateResult.affectedRows > 0) {
      const [updatedQuestion] = await db.query('SELECT * FROM questions WHERE id = ?', [id]);
      res.status(200).json({
        status: true,
        message: "Question updated successfully",
        question: updatedQuestion[0]
      });
    } else {
      res.status(404).json({
        status: false,
        message: "Question not found"
      });
    }
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};



const deleteQuestion = async (req, res) => {
  const { id } = req.params;

  try {
    const [deleteResult] = await db.query(
      `DELETE FROM questions WHERE id = ?`,
      [id]
    );

    if (deleteResult.affectedRows > 0) {
      res.status(200).json({
        status: true,
        message: "Question deleted successfully"
      });
    } else {
      res.status(404).json({
        status: false,
        message: "Question not found"
      });
    }
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};




module.exports = { addQuestion, getAllQuestions, getQuestionById, updateQuestion, deleteQuestion };