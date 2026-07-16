const test = require('node:test');
const assert = require('node:assert/strict');

const { calculateResumeMatch, generateInterviewPrep } = require('../src/services/copilotService');

test('calculateResumeMatch returns a realistic match score', () => {
  const resumeText = 'Experienced React developer with Node.js and PostgreSQL background in SaaS products.';
  const jobDescription = 'Senior React engineer with Node.js and PostgreSQL experience for a SaaS startup.';

  const result = calculateResumeMatch(resumeText, jobDescription);

  assert.ok(result.score >= 70);
  assert.equal(result.matchedKeywords.includes('react'), true);
  assert.equal(result.matchedKeywords.includes('node.js'), true);
});

test('generateInterviewPrep produces tailored questions and tips', () => {
  const resumeText = 'Built React dashboards and optimized PostgreSQL queries for analytics products.';
  const jobDescription = 'Frontend engineer focused on React, performance, and analytics dashboards.';

  const result = generateInterviewPrep(resumeText, jobDescription);

  assert.ok(result.questions.length >= 3);
  assert.ok(result.tips.length >= 2);
  assert.equal(result.questions[0].includes('React') || result.questions[0].includes('dashboard'), true);
});
