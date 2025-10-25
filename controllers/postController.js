const Post = require('../models/Post');

const getPosts = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, status } = req.query;
    const skip = (page - 1) * limit;

    let query = {};

    // If authenticated, apply role-based filtering; otherwise, treat as Reader (only published posts)
    if (req.user) {
      if (req.user.role === 'Reader') {
        query.status = 'published';
      } else if (req.user.role === 'Writer') {
        query.$or = [
          { author: req.user._id },
          { status: 'published' }
        ];
      }
      // Admin can see all posts

      // Apply status filter if provided
      if (status && req.user.role !== 'Reader') {
        query.status = status;
      }
    } else {
      // Unauthenticated: only published posts
      query.status = 'published';
    }

    // Search functionality
    if (search) {
      query.$text = { $search: search };
    }

    const posts = await Post.find(query)
      .populate('author', 'username')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Post.countDocuments(query);

    res.json({
      posts,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalPosts: total,
        hasNext: page * limit < total,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Get posts error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate('author', 'username');

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // If authenticated, check permissions; otherwise, only allow published posts
    if (req.user) {
      if (post.status === 'draft' && req.user.role === 'Reader') {
        return res.status(403).json({ message: 'Access denied' });
      }

      if (post.status === 'draft' && req.user.role === 'Writer' && post.author._id.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Access denied' });
      }
    } else {
      // Unauthenticated: only published posts
      if (post.status !== 'published') {
        return res.status(403).json({ message: 'Access denied' });
      }
    }

    res.json(post);
  } catch (error) {
    console.error('Get post error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const createPost = async (req, res) => {
  try {
    const { title, content, tags, status } = req.body;

    const post = new Post({
      title,
      content,
      tags: tags || [],
      status: status || 'draft',
      author: req.user._id
    });

    await post.save();
    await post.populate('author', 'username');

    res.status(201).json(post);
  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Check permissions
    if (req.user.role !== 'Admin' && post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { title, content, tags, status } = req.body;

    post.title = title || post.title;
    post.content = content || post.content;
    post.tags = tags || post.tags;
    post.status = status || post.status;

    await post.save();
    await post.populate('author', 'username');

    res.json(post);
  } catch (error) {
    console.error('Update post error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Check permissions
    if (req.user.role !== 'Admin' && post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    await post.deleteOne();
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Delete post error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getPosts, getPostById, createPost, updatePost, deletePost };
