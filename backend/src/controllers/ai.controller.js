const asyncHandler = require('express-async-handler');
const { routeSymptoms, summarizeConsultation } = require('../services/ai.service');
const { ApiError } = require('../utils');

// @desc    Triage patient symptoms and suggest specialty and urgency
// @route   POST /api/v1/ai/triage
// @access  Protected (any authenticated user)
exports.triageAI = asyncHandler(async (req, res, next) => {
  const { symptoms } = req.body;
  if (!symptoms) {
    console.error('[AI Controller Error]: Missing symptoms in triage request body');
    return next(new ApiError('Missing "symptoms" in request body', 400));
  }
  try {
    const result = await routeSymptoms(symptoms);
    res.status(200).json({ status: 'success', data: result });
  } catch (err) {
    console.error('[AI Controller Triage Exception]:', err);
    return next(err);
  }
});

// @desc    Summarize clinical notes into SOAP format and extract prescriptions
// @route   POST /api/v1/ai/summarize
// @access  Protected (any authenticated user)
exports.summarizeAI = asyncHandler(async (req, res, next) => {
  const { notes } = req.body;
  if (!notes) {
    console.error('[AI Controller Error]: Missing notes in summarize request body');
    return next(new ApiError('Missing "notes" in request body', 400));
  }
  try {
    const result = await summarizeConsultation(notes);
    res.status(200).json({ status: 'success', data: result });
  } catch (err) {
    console.error('[AI Controller Summarize Exception]:', err);
    return next(err);
  }
});
