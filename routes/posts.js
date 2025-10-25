const express = require('express');
const { body } = require('express-validator');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');
const {
  getPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost
} = require('../controllers/postController');

const router = express.Router();

// Get posts with pagination and search (public for published posts)
router.get('/', getPosts);

// Get single post (public for published posts)
router.get('/:id', getPostById);

// Protected routes require authentication

// Create post (Writers and Admins only)
router.post('/', authenticateToken, authorizeRoles('Writer', 'Admin'), [
  body('title').notEmpty().withMessage('Title is required'),
  body('content').notEmpty().withMessage('Content is required'),
  body('tags').optional().isArray().withMessage('Tags must be an array'),
  body('status').optional().isIn(['draft', 'published']).withMessage('Invalid status')
], createPost);

// Update post (Writers can update own posts, Admins can update all)
router.put('/:id', authenticateToken, authorizeRoles('Writer', 'Admin'), [
  body('title').optional().notEmpty().withMessage('Title cannot be empty'),
  body('content').optional().notEmpty().withMessage('Content cannot be empty'),
  body('tags').optional().isArray().withMessage('Tags must be an array'),
  body('status').optional().isIn(['draft', 'published']).withMessage('Invalid status')
], updatePost);

// Delete post (Writers can delete own posts, Admins can delete all)
router.delete('/:id', authenticateToken, authorizeRoles('Writer', 'Admin'), deletePost);

module.exports = router;
