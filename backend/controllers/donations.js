import FoodDonation from '../models/FoodDonation.js';
import MoneyDonation from '../models/MoneyDonation.js';
import Razorpay from 'razorpay';

// @desc    Create food donation
// @route   POST /api/donations/food
// @access  Private (Donor)
export const createFoodDonation = async (req, res, next) => {
  try {
    const { foodType, quantity, location, expiryTime } = req.body;

    const donation = await FoodDonation.create({
      donorId: req.user.id,
      foodType,
      quantity,
      location,
      expiryTime,
    });

    res.status(201).json({
      success: true,
      data: donation,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get food donations
// @route   GET /api/donations/food
// @access  Private
export const getFoodDonations = async (req, res, next) => {
  try {
    let query = {};

    if (req.user.role === 'donor') {
      query.donorId = req.user.id;
    } else if (req.user.role === 'ngo') {
      query.status = 'pending';
    } else if (req.user.role === 'volunteer') {
      query.status = 'accepted';
    }
    // Admin can see all

    const donations = await FoodDonation.find(query)
      .populate('donorId', 'name email')
      .populate('ngoId', 'name email')
      .populate('volunteerId', 'name email');

    res.status(200).json({
      success: true,
      count: donations.length,
      data: donations,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Accept food donation
// @route   PUT /api/donations/food/:id/accept
// @access  Private (NGO)
export const acceptFoodDonation = async (req, res, next) => {
  try {
    const donation = await FoodDonation.findById(req.params.id);

    if (!donation) {
      return res.status(404).json({
        success: false,
        message: 'Donation not found',
      });
    }

    if (donation.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Donation already processed',
      });
    }

    donation.status = 'accepted';
    donation.ngoId = req.user.id;
    await donation.save();

    res.status(200).json({
      success: true,
      data: donation,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Complete food donation
// @route   PUT /api/donations/food/:id/complete
// @access  Private (Volunteer)
export const completeFoodDonation = async (req, res, next) => {
  try {
    const donation = await FoodDonation.findById(req.params.id);

    if (!donation) {
      return res.status(404).json({
        success: false,
        message: 'Donation not found',
      });
    }

    if (donation.status !== 'accepted') {
      return res.status(400).json({
        success: false,
        message: 'Donation not accepted yet',
      });
    }

    donation.status = 'completed';
    donation.volunteerId = req.user.id;
    await donation.save();

    res.status(200).json({
      success: true,
      data: donation,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create Razorpay order for money donation
// @route   POST /api/donations/money/order
// @access  Private (Donor)
export const createMoneyDonationOrder = async (req, res, next) => {
  try {
    const { amount } = req.body;

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const options = {
      amount: amount * 100, // amount in paisa
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Save money donation
// @route   POST /api/donations/money
// @access  Private (Donor)
export const saveMoneyDonation = async (req, res, next) => {
  try {
    const { amount, paymentId } = req.body;

    const donation = await MoneyDonation.create({
      donorId: req.user.id,
      amount,
      paymentId,
    });

    res.status(201).json({
      success: true,
      data: donation,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get money donations
// @route   GET /api/donations/money
// @access  Private (Admin)
export const getMoneyDonations = async (req, res, next) => {
  try {
    const donations = await MoneyDonation.find().populate('donorId', 'name email');

    res.status(200).json({
      success: true,
      count: donations.length,
      data: donations,
    });
  } catch (error) {
    next(error);
  }
};
