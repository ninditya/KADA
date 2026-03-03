import { Router } from 'express';
import requiredAuth from '../middlewares/requireAuth.js';
import { createNote, deleteNote, getNoteById, listNotes, updateNote} from '../controllers/notesController.js';

const router = Router();

router.get('/', listNotes); 
router.get('/:id', getNoteById);
router.post('/', requiredAuth, createNote);
router.put('/:id', requiredAuth, updateNote);
router.delete('/:id', requiredAuth, deleteNote);

export default router;
