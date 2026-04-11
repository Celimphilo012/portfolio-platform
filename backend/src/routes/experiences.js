import express from 'express';
import {
  getAllExperiences,
  createExperience,
  updateExperience,
  deleteExperience,
} from '../controllers/experienceController.js';
import { authenticate } from '../middleware/auth.js';
import { validateExperience } from '../middleware/validate.js';

const router = express.Router();

router.get('/', authenticate, getAllExperiences);
router.post('/', authenticate, validateExperience, createExperience);
router.put('/:id', authenticate, validateExperience, updateExperience);
router.delete('/:id', authenticate, deleteExperience);

export default router;
