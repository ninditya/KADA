import { Router } from 'express';
import { createNote, deleteNote, getNoteById, listNotes, updateNote} from '../controllers/notesController.js';

const router = Router();

router.get('/', listNotes);
router.get('/:id', getNoteById);
router.post('/', createNote);
router.put('/:id', updateNote);
router.delete('/:id', deleteNote);

export default router;
