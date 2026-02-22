import mongoose from 'mongoose';

const moneyDonationSchema = new mongoose.Schema({
  donorId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  amount: {
    type: Number,
    required: [true, 'Please add amount'],
  },
  paymentId: {
    type: String,
    required: [true, 'Please add payment ID'],
  },
  date: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

const MoneyDonation = mongoose.model('MoneyDonation', moneyDonationSchema);

export default MoneyDonation;
