const mongoose = require('mongoose');
const Issue = require('../models/Issue');

/** Returns true when str is a valid 24-char hex ObjectId. */
const isValidId = (str) => mongoose.Types.ObjectId.isValid(str);

/**
 * POST /api/issues
 * Creates a new issue. The authenticated user becomes the creator.
 */
const createIssue = async (req, res) => {
  try {
    const { title, description, priority, assignedTo } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ message: 'title is required.' });
    }

    const issue = await Issue.create({
      title,
      description,
      priority,
      assignedTo: assignedTo || null,
      createdBy: req.user._id,
    });

    return res.status(201).json({ issue });
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: err.message });
    }
    if (err.code === 11000) {
      return res.status(409).json({ message: 'Duplicate entry.' });
    }
    console.error('createIssue error:', err);
    return res.status(500).json({ message: 'An unexpected error occurred.' });
  }
};

/**
 * GET /api/issues
 * Returns all issues created by the logged-in user, newest first.
 */
const getIssues = async (req, res) => {
  try {
    const issues = await Issue.find({ createdBy: req.user._id })
      .sort({ createdAt: -1 })
      .populate('createdBy', 'name email')
      .populate('assignedTo', 'name email');

    return res.status(200).json({ issues });
  } catch (err) {
    console.error('getIssues error:', err);
    return res.status(500).json({ message: 'An unexpected error occurred.' });
  }
};

/**
 * GET /api/issues/:id
 * Returns a single issue. Only accessible by its creator.
 */
const getIssueById = async (req, res) => {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid issue ID.' });
    }

    const issue = await Issue.findById(req.params.id)
      .populate('createdBy', 'name email')
      .populate('assignedTo', 'name email');

    if (!issue) {
      return res.status(404).json({ message: 'Issue not found.' });
    }

    if (issue.createdBy._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorised to access this issue.' });
    }

    return res.status(200).json({ issue });
  } catch (err) {
    console.error('getIssueById error:', err);
    return res.status(500).json({ message: 'An unexpected error occurred.' });
  }
};

/**
 * PUT /api/issues/:id
 * Updates an issue. Only accessible by its creator.
 */
const updateIssue = async (req, res) => {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid issue ID.' });
    }

    const issue = await Issue.findById(req.params.id);

    if (!issue) {
      return res.status(404).json({ message: 'Issue not found.' });
    }

    if (issue.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorised to update this issue.' });
    }

    const { title, description, status, priority, assignedTo } = req.body;

    // Only apply fields that were explicitly provided
    if (title !== undefined) issue.title = title;
    if (description !== undefined) issue.description = description;
    if (status !== undefined) issue.status = status;
    if (priority !== undefined) issue.priority = priority;
    if (assignedTo !== undefined) issue.assignedTo = assignedTo || null;

    // Let Mongoose validate enum values and required fields before saving
    await issue.save();

    // Re-fetch with populated references for the response
    const updated = await Issue.findById(issue._id)
      .populate('createdBy', 'name email')
      .populate('assignedTo', 'name email');

    return res.status(200).json({ issue: updated });
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: err.message });
    }
    console.error('updateIssue error:', err);
    return res.status(500).json({ message: 'An unexpected error occurred.' });
  }
};

/**
 * DELETE /api/issues/:id
 * Deletes an issue. Only accessible by its creator.
 */
const deleteIssue = async (req, res) => {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid issue ID.' });
    }

    const issue = await Issue.findById(req.params.id);

    if (!issue) {
      return res.status(404).json({ message: 'Issue not found.' });
    }

    if (issue.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorised to delete this issue.' });
    }

    await issue.deleteOne();

    return res.status(200).json({ message: 'Issue deleted successfully.' });
  } catch (err) {
    console.error('deleteIssue error:', err);
    return res.status(500).json({ message: 'An unexpected error occurred.' });
  }
};

module.exports = { createIssue, getIssues, getIssueById, updateIssue, deleteIssue };
