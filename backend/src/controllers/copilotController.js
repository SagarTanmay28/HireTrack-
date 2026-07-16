const { calculateResumeMatch, generateInterviewPrep } = require("../services/copilotService");

const analyzeResume = async (req, res, next) => {
  try {
    const { resumeText, jobDescription } = req.body;

    if (!resumeText || !jobDescription) {
      return res.status(400).json({ message: "Resume text and job description are required" });
    }

    const result = calculateResumeMatch(resumeText, jobDescription);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

const prepareInterview = async (req, res, next) => {
  try {
    const { resumeText, jobDescription } = req.body;

    if (!resumeText || !jobDescription) {
      return res.status(400).json({ message: "Resume text and job description are required" });
    }

    const result = generateInterviewPrep(resumeText, jobDescription);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

module.exports = { analyzeResume, prepareInterview };
