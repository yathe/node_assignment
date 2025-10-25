const express = require('express');
const { body } = require('express-validator');
const { authenticateToken } = require('../middleware/auth');
const {
  getComments,
  createComment,
  deleteComment
} = require('../controllers/commentController');

const router = express.Router();

// All comment routes require authentication
router.use(authenticateToken);

// Get comments for a post
router.get('/:postId', getComments);

// Create comment on a post
router.post('/:postId', [
  body('content').notEmpty().withMessage('Comment content is required')
], createComment);

// Delete comment
router.delete('/:id', deleteComment);

module.exports = router;
