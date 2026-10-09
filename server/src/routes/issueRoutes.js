const express = require('express');
const {
  createIssue,
  getIssues,
  getIssueById,
  updateIssue,
  deleteIssue,
} = require('../controllers/issueController');
const protect = require('../middleware/authMiddleware');

const router = express.Router();

// All issue routes require a valid JWT
router.use(protect);

router.route('/')
  .get(getIssues)
  .post(createIssue);

router.route('/:id')
  .get(getIssueById)
  .put(updateIssue)
  .delete(deleteIssue);

module.exports = router;
