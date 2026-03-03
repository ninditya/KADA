import { getModels } from '../models/index.js';

// Mengambil semua note dari MongoDB.
export async function listNotes(_req, res, next) {
  try {
    const { Post } = getModels();
    const notes = await Post.find().sort({ createdAt: -1 });
    res.json(notes);
  } catch (error) {
    next(error);
  }
}

// Mengambil satu note berdasarkan id.
export async function getNoteById(req, res, next) {
  try {
    const { Post } = getModels();
    const note = await Post.findById(req.params.id);

    if (!note) {
      return res.status(404).json({ result: 'fail', error: 'Note not found' });
    }

    res.json(note);
  } catch (error) {
    next(error);
  }
}

// Membuat note baru setelah validasi input.
export async function createNote(req, res, next) {
  try {
    const { author, title, content } = req.body;

    if (!author || !title || !content) {
      return res.status(400).json({ result: 'fail', error: 'Author, title, and content are required' });
    }

    const { Post } = getModels();
    const note = await Post.create({ author, title, content });
    res.status(201).json(note);
  } catch (error) {
    next(error);
  }
}

// Memperbarui note berdasarkan id.
export async function updateNote(req, res, next) {
  try {
    const { author, title, content } = req.body;

    if (!author || !title || !content) {
      return res.status(400).json({ result: 'fail', error: 'Author, title, and content are required' });
    }

    const { Post } = getModels();
    const note = await Post.findByIdAndUpdate(
      req.params.id,
      { author, title, content },
      { new: true, runValidators: true }
    );

    if (!note) {
      return res.status(404).json({ result: 'fail', error: 'Note not found' });
    }

    res.json(note);
  } catch (error) {
    next(error);
  }
}

// Menghapus note berdasarkan id.
export async function deleteNote(req, res, next) {
  try {
    const { Post } = getModels();
    const note = await Post.findByIdAndDelete(req.params.id);

    if (!note) {
      return res.status(404).json({ result: 'fail', error: 'Note not found' });
    }

    res.json({ result: 'success' });
  } catch (error) {
    next(error);
  }
}
