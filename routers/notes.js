import { Router } from 'express';
import { Post } from '../models/index.js';
// import * as Note from '../models/note.js';

const router = Router();

router.get('/', async (req, res, next) => {
  try {
    const notes = await Post.find();
    res.json(notes);
  } catch (e) {
    next(e);
  } 
});

router.get('/:id', async (req, res, next) => {
  try {
    const note = await Post.findById(req.params.id);
    if (!note) {
      return res.status(404).json({ result: 'fail', error: 'Note not found' });
    }
    res.json(note);
  } catch (e) {
    next(e);
  }
});

// Create
router.post('/', async (req, res, next) => {
    const { title, content } = req.body;
    if (!title || !content) {
      return res.status(400).json({ result: 'fail', error: 'Title and content are required' });
    }

    try {
      const note = await Post.create({ title, content });
      res.status(201).json(note);
    } catch (e) {
      next(e);
    }
});

// Update
router.put('/:id', async (req, res, next) => {
  try {
    const note = await Post.findByIdAndUpdate(
      req.params.id,
      { title: req.body.title, content: req.body.content },
      { new: true }
    );

    if (!note) {
      return res.status(404).json({ result: 'fail', error: 'Note not found' });
    }

    res.json(note);
  } catch (e) {
    next(e);
  }
});

// Delete 
router.delete('/:id', async (req, res, next) => {
  try {
    const note = await Post.findByIdAndDelete(req.params.id);
    if (!note) {
      return res.status(404).json({ result: 'fail', error: 'Note not found' });
    }
    res.json({ result: 'success' });
  } catch (e) {
    next(e);
  }
});


export default router;