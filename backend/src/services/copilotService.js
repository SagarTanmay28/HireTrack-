const normalizeText = (value = "") => value.toLowerCase().replace(/[^a-z0-9.]+/g, " ").trim();

const tokenize = (value = "") => {
  const normalized = normalizeText(value);
  return normalized.split(/\s+/).filter(Boolean);
};

const stopWords = new Set([
  "a", "an", "and", "are", "as", "at", "be", "for", "from", "in", "into", "is", "it",
  "of", "on", "or", "our", "the", "their", "this", "to", "with", "your", "you", "we",
  "will", "work", "working", "experience", "experienced", "senior", "junior", "role"
]);

const calculateResumeMatch = (resumeText = "", jobDescription = "") => {
  const resumeTokens = new Set(tokenize(resumeText));
  const jobTokens = tokenize(jobDescription).filter((token) => !stopWords.has(token));

  const matchedKeywords = jobTokens.filter((token) => resumeTokens.has(token));
  const uniqueTerms = [...new Set(jobTokens.filter(Boolean))];
  const overlapRatio = matchedKeywords.length / Math.max(1, uniqueTerms.length);
  const score = Math.min(95, Math.round(overlapRatio * 100 + (matchedKeywords.length >= 3 ? 15 : 0) + (matchedKeywords.length >= 4 ? 5 : 0)));

  return {
    score: Math.max(55, score),
    matchedKeywords: [...new Set(matchedKeywords)],
    summary: matchedKeywords.length > 0
      ? `Your resume aligns well with the role, especially around ${matchedKeywords.slice(0, 4).join(", ")}.`
      : "Your resume needs stronger alignment with the target role keywords.",
  };
};

const generateInterviewPrep = (resumeText = "", jobDescription = "") => {
  const normalizedResume = normalizeText(resumeText);
  const normalizedRole = normalizeText(jobDescription);
  const questions = [];

  if (normalizedResume.includes("react") || normalizedRole.includes("react")) {
    questions.push("Describe a React feature you built and how you optimized its performance.");
  }

  if (normalizedResume.includes("postgres") || normalizedRole.includes("postgres")) {
    questions.push("How would you improve a slow PostgreSQL query in a production application?");
  }

  if (normalizedResume.includes("dashboard") || normalizedRole.includes("dashboard")) {
    questions.push("Walk through how you would design a dashboard that balances usability and performance.");
  }

  questions.push("Why do you believe your background makes you a strong fit for this role?");
  questions.push("What would you do first to understand the team’s product goals?");

  const tips = [
    "Prepare 2 or 3 concrete examples from your past work that map directly to the role.",
    "Practice explaining your impact using measurable outcomes such as speed, reliability, and user adoption.",
  ];

  return {
    questions: questions.slice(0, 5),
    tips,
  };
};

module.exports = { calculateResumeMatch, generateInterviewPrep };
