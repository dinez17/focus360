import express from 'express';
import { submitLead } from '../controllers/leadController.js';

const router = express.Router();

router.post('/submit', submitLead);

export default router;