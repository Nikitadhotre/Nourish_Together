import express from 'express';
import {
  createFoodDonation,
  getFoodDonations,
  acceptFoodDonation,
  completeFoodDonation,
  createMoneyDonationOrder,
  saveMoneyDonation,
  getMoneyDonations,
} from '../controllers/donations.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Food donation routes
router.route('/food').post(protect, createFoodDonation).get(protect, getFoodDonations);
router.put('/food/:id/accept', protect, acceptFoodDonation);
router.put('/food/:id/complete', protect, completeFoodDonation);

// Money donation routes
router.post('/money/order', protect, createMoneyDonationOrder);
router.route('/money').post(protect, saveMoneyDonation).get(protect, getMoneyDonations);

export default router;
