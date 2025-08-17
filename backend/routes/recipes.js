const express = require('express');
const router = express.Router();
const Recipe = require('../models/Recipe');
const auth = require('../middleware/authMiddleware');
const User = require('../models/User');

// Create recipe (auth required)
router.post('/', auth, async (req, res) => {
  try {
    const { title, description, imageUrl } = req.body;
    if (!title || !description) return res.status(400).json({ message: 'Title and description required' });
    const recipe = new Recipe({ title, description, imageUrl });
    await recipe.save();
    res.status(201).json(recipe);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all recipes (public)
router.get('/', async (req, res) => {
  try {
    const recipes = await Recipe.find().sort({ createdAt: -1 });
    res.json(recipes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get recipe by id
router.get('/:id', async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ message: 'Not found' });
    res.json(recipe);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Toggle like/dislike (auth required)
// expects { action: 'like' } or { action: 'dislike' }
router.post('/:id/react', auth, async (req, res) => {
  try {
    const { action } = req.body;
    if (!['like', 'dislike'].includes(action)) return res.status(400).json({ message: 'Invalid action' });
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ message: 'Not found' });

    const uid = req.user._id;

    if (action === 'like') {
      // if already liked -> remove like
      if (recipe.likedBy.find(id => id.toString() === uid.toString())) {
        recipe.likedBy = recipe.likedBy.filter(id => id.toString() !== uid.toString());
      } else {
        // add like; remove dislike if present
        recipe.likedBy.push(uid);
        recipe.dislikedBy = recipe.dislikedBy.filter(id => id.toString() !== uid.toString());
      }
    } else { // dislike
      if (recipe.dislikedBy.find(id => id.toString() === uid.toString())) {
        recipe.dislikedBy = recipe.dislikedBy.filter(id => id.toString() !== uid.toString());
      } else {
        recipe.dislikedBy.push(uid);
        recipe.likedBy = recipe.likedBy.filter(id => id.toString() !== uid.toString());
      }
    }

    // update counts
    recipe.likes = recipe.likedBy.length;
    recipe.dislikes = recipe.dislikedBy.length;
    await recipe.save();
    res.json(recipe);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add comment (auth required)
router.post('/:id/comment', auth, async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ message: 'Empty comment' });
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ message: 'Not found' });

    recipe.comments.unshift({
      text,
      author: { id: req.user._id, username: req.user.username }
    });
    await recipe.save();
    res.json(recipe);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Toggle save/unsave (auth required)
router.post('/:id/save', auth, async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    const user = await User.findById(req.user._id);
    if (!recipe || !user) return res.status(404).json({ message: 'Not found' });

    const uid = req.user._id.toString();
    const savedByUser = recipe.savedBy.find(id => id.toString() === uid);

    if (savedByUser) {
      // unsave
      recipe.savedBy = recipe.savedBy.filter(id => id.toString() !== uid);
      recipe.savedCount = recipe.savedBy.length;
      user.wishlist = user.wishlist.filter(id => id.toString() !== recipe._id.toString());
    } else {
      // save
      recipe.savedBy.push(req.user._id);
      recipe.savedCount = recipe.savedBy.length;
      user.wishlist.push(recipe._id);
    }

    await recipe.save();
    await user.save();
    res.json({ recipe, wishlist: user.wishlist });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
