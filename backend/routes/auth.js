import express from 'express';
import { register, login, getMe, updateProfile, getAllUsers, deleteUser } from '../controllers/auth.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);

// Admin routes
router.get('/users', protect, getAllUsers);
router.delete('/users/:id', protect, deleteUser);

export default router;
