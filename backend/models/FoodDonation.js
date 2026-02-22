import mongoose from 'mongoose';

const foodDonationSchema = new mongoose.Schema({
  donorId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  foodType: {
    type: String,
    required: [true, 'Please add food type'],
  },
  quantity: {
    type: String,
    required: [true, 'Please add quantity'],
  },
  location: {
    type: String,
    required: [true, 'Please add location'],
  },
  expiryTime: {
    type: Date,
    required: [true, 'Please add expiry time'],
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'completed'],
    default: 'pending',
  },
}, {
  timestamps: true,
});

const FoodDonation = mongoose.model('FoodDonation', foodDonationSchema);

export default FoodDonation;
