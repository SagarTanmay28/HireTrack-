const multer = require("multer");
const pdf = require("pdf-parse");
const mammoth = require("mammoth");
const { pool } = require("../config/db");

const upload = multer({ storage: multer.memoryStorage() });

const extractTextFromBuffer = async (file) => {
  const fileType = file.mimetype || "";
  const buffer = file.buffer || Buffer.from("");

  if (fileType.includes("pdf")) {
    const data = await pdf(buffer);
    return data.text;
  }

  if (fileType.includes("officedocument") || fileType.includes("wordprocessingml") || fileType.includes("docx")) {
    const data = await mammoth.extractRawText({ buffer });
    return data.value;
  }

  return buffer.toString("utf8");
};

const uploadResume = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "A resume file is required" });
    }

    const textContent = await extractTextFromBuffer(req.file);
    const result = await pool.query(
      "INSERT INTO user_resumes (user_id, file_name, text_content) VALUES ($1, $2, $3) RETURNING id, file_name, text_content",
      [req.userId, req.file.originalname, textContent]
    );

    res.status(201).json({ resume: result.rows[0] });
  } catch (err) {
    next(err);
  }
};

const getResume = async (req, res, next) => {
  try {
    const result = await pool.query(
      "SELECT id, file_name, text_content, created_at FROM user_resumes WHERE user_id = $1 ORDER BY created_at DESC LIMIT 1",
      [req.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "No resume found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};

module.exports = { upload, uploadResume, getResume };
