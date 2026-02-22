 import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Smartphone, Building2, Wallet, ArrowLeft, CheckCircle, Lock, Shield, IndianRupee, Heart, AlertCircle } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

export default function Payment() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get donation data from location state
  const donationData = location.state || {};
  const { donationId, donationTitle, donorName } = donationData;
  
  // State for donation amount - start with empty or default
  const [donationAmount, setDonationAmount] = useState('');
  
  const [selectedMethod, setSelectedMethod] = useState('upi');
  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    name: '',
    upiId: '',
    bankName: '',
    accountNumber: '',
    ifscCode: '',
    walletType: '',
    saveCard: false
  });

  const [processing, setProcessing] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);
  const [error, setError] = useState('');
  const [transactionId, setTransactionId] = useState('');

  // Razorpay Test Key ID
  const RAZORPAY_KEY_ID = 'rzp_test_SF7PiZzi51KfQu';

  // Load Razorpay checkout script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => setRazorpayLoaded(true);
    document.body.appendChild(script);

    return () => {
      if (script.parentNode) {
        document.body.removeChild(script);
      }
    };
  }, []);

  const paymentMethods = [
    {
      id: 'upi',
      name: 'UPI',
      icon: Smartphone,
      description: 'Google Pay, PhonePe, Paytm',
      popular: true,
      color: 'bg-green-50 border-green-200'
    },
    {
      id: 'card',
      name: 'Credit/Debit Card',
      icon: CreditCard,
      description: 'Visa, Mastercard, RuPay',
      popular: true,
      color: 'bg-blue-50 border-blue-200'
    },
    {
      id: 'netbanking',
      name: 'Net Banking',
      icon: Building2,
      description: 'All major banks',
      popular: false,
      color: 'bg-purple-50 border-purple-200'
    },
    {
      id: 'wallet',
      name: 'Digital Wallets',
      icon: Wallet,
      description: 'Paytm, Mobikwik, Ola Money',
      popular: false,
      color: 'bg-orange-50 border-orange-200'
    }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPaymentData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle amount input change
  const handleAmountChange = (e) => {
    setDonationAmount(e.target.value);
  };

  // Get current amount for display
  const currentAmount = donationAmount || 0;

  // Function to create Razorpay order and process payment
  const handleRazorpayPayment = async () => {
    // Validate amount
    if (!donationAmount || parseInt(donationAmount) < 1) {
      setError('Please enter a valid donation amount');
      return;
    }

    try {
      setProcessing(true);
      setError('');

      // Get the auth token from localStorage
      const token = localStorage.getItem('token');

      // Call backend API to create Razorpay order
      const response = await axios.post(
        'http://localhost:5000/api/donations/money/order',
        { amount: parseInt(donationAmount) },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': token ? `Bearer ${token}` : ''
          }
        }
      );

      const { order } = response.data;

      // Open Razorpay checkout
      const options = {
        key: RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: 'Nourish Together',
        description: 'Donation for food cause',
        order_id: order.id,
        handler: async (response) => {
          // Payment successful
          try {
            // Save donation to backend
            await axios.post(
              'http://localhost:5000/api/donations/money',
              {
                amount: parseInt(donationAmount),
                paymentId: response.razorpay_payment_id
              },
              {
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': token ? `Bearer ${token}` : ''
                }
              }
            );

            setTransactionId(response.razorpay_payment_id);
            setProcessing(false);
            setCompleted(true);
            
            // Redirect to dashboard after 4 seconds
            // setTimeout(() => {
            //   navigate('/donor-dashboard');
            // }, 4000);
            useEffect(() => {
  if (completed) {
    const timer = setTimeout(() => {
      navigate('/donor-dashboard');
    }, 4000); // 4 seconds

    return () => clearTimeout(timer);
  }
}, [completed, navigate]);

          } catch (saveError) {
            setProcessing(false);
            setError('Payment successful but failed to save donation. Please contact support.');
          }
        },
        prefill: {
          name: donorName || localStorage.getItem('userName') || 'Guest User',
          email: localStorage.getItem('userEmail') || '',
          contact: ''
        },
        notes: {
          description: 'Donation for Nourish Together'
        },
        theme: {
          color: '#16a34a'
        }
      };

      // @ts-ignore
      if (window.Razorpay) {
        // @ts-ignore
        const rzp = new window.Razorpay(options);
        rzp.open();
        
        rzp.on('payment.failed', (response) => {
          setProcessing(false);
          setError(`Payment failed: ${response.error.description}`);
        });
      } else {
        setProcessing(false);
        setError('Razorpay failed to load. Please refresh the page.');
      }

    } catch (err) {
      setProcessing(false);
      if (err.response) {
        setError(err.response.data.message || 'Failed to create payment order');
      } else if (err.request) {
        setError('Server not responding. Please check if backend is running.');
      } else {
        setError('Failed to initiate payment. Please try again.');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate UPI ID for UPI payments
    if (selectedMethod === 'upi' && !paymentData.upiId) {
      setError('Please enter your UPI ID');
      return;
    }
    
    // Call Razorpay payment
    handleRazorpayPayment();
  };

  const renderPaymentForm = () => {
    switch (selectedMethod) {
      case 'card':
        return (
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-blue-900">Secure Card Payment</p>
                  <p className="text-sm text-blue-700">Your card details are securely processed by Razorpay.</p>
                </div>
              </div>
            </div>
            <p className="text-sm text-slate-600">
              Click "Donate Now" to proceed to secure payment page where you can enter your card details.
            </p>
          </div>
        );

      case 'upi':
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">UPI ID</label>
              <input
                type="text"
                name="upiId"
                value={paymentData.upiId}
                onChange={handleInputChange}
                placeholder="yourname@upi"
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-slate-500 focus:border-transparent"
              />
            </div>

            {/* <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-sm text-green-800 mb-3">
                <strong>Popular UPI Apps:</strong>
              </p>
              <div className="grid grid-cols-5 gap-4">
                <div className="flex flex-col items-center space-y-2">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm border">
                    <img src="https://img.icons8.com/color/48/google-pay.png" alt="Google Pay" className="w-8 h-8" />
                  </div>
                  <span className="text-xs text-green-700 font-medium">GPay</span>
                </div>
                <div className="flex flex-col items-center space-y-2">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm border">
                    <img src="https://img.icons8.com/color/48/phone-pe.png" alt="PhonePe" className="w-8 h-8" />
                  </div>
                  <span className="text-xs text-green-700 font-medium">PhonePe</span>
                </div>
                <div className="flex flex-col items-center space-y-2">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm border">
                    <img src="https://img.icons8.com/color/48/paytm.png" alt="Paytm" className="w-8 h-8" />
                  </div>
                  <span className="text-xs text-green-700 font-medium">Paytm</span>
                </div>
                <div className="flex flex-col items-center space-y-2">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm border">
                    <img src="https://img.icons8.com/color/48/bhim.png" alt="BHIM" className="w-8 h-8" />
                  </div>
                  <span className="text-xs text-green-700 font-medium">BHIM</span>
                </div>
              </div>
            </div> */}

            <p className="text-sm text-slate-600">
              Click "Donate Now" to proceed to secure payment page where you can complete payment via UPI.
            </p>
          </div>
        );

      case 'netbanking':
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Select Your Bank</label>
              <select
                name="bankName"
                value={paymentData.bankName}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-slate-500 focus:border-transparent"
              >
                <option value="">Choose your bank</option>
                <option value="sbi">State Bank of India</option>
                <option value="hdfc">HDFC Bank</option>
                <option value="icici">ICICI Bank</option>
                <option value="axis">Axis Bank</option>
                <option value="pnb">Punjab National Bank</option>
                <option value="kotak">Kotak Mahindra Bank</option>
              </select>
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <Building2 className="w-5 h-5 text-purple-600" />
                <div>
                  <p className="text-sm font-medium text-purple-900">Secure Banking</p>
                  <p className="text-sm text-purple-700">You will be redirected to your bank's secure login page.</p>
                </div>
              </div>
            </div>

            <p className="text-sm text-slate-600">
              Click "Donate Now" to proceed to secure payment page.
            </p>
          </div>
        );

      case 'wallet':
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Digital Wallet</label>
              <select
                name="walletType"
                value={paymentData.walletType}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-slate-500 focus:border-transparent"
              >
                <option value="">Choose your wallet</option>
                <option value="paytm">Paytm</option>
                <option value="mobikwik">Mobikwik</option>
                <option value="amazon">Amazon Pay</option>
              </select>
            </div>

            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <Wallet className="w-5 h-5 text-orange-600" />
                <div>
                  <p className="text-sm font-medium text-orange-900">Digital Wallet</p>
                  <p className="text-sm text-orange-700">Login to your digital wallet to complete the payment.</p>
                </div>
              </div>
            </div>

            <p className="text-sm text-slate-600">
              Click "Donate Now" to proceed to secure payment page.
            </p>
          </div>
        );

      default:
        return null;
    }
  };

  if (completed) {
    return (
      <div className="pt-24 pb-16 bg-gradient-to-br from-green-50 via-white to-orange-50 min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="bg-white rounded-xl shadow-xl p-10 text-center max-w-lg border border-green-100"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5, type: "spring", bounce: 0.4 }}
            className="flex justify-center items-center space-x-2 mb-6"
          >
            <CheckCircle className="w-16 h-16 text-green-500" />
            <Heart className="w-8 h-8 text-red-400 animate-pulse" />
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="text-3xl font-bold text-gray-900 mb-3"
          >
            Donation Successful!
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="text-gray-700 mb-6 text-lg"
          >
            Thank you for your generous contribution!
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="bg-gradient-to-r from-green-50 to-orange-50 border-2 border-green-200 rounded-xl p-6 mb-6 shadow-inner"
          >
            <p className="text-sm text-green-900 font-medium">
              <strong>Transaction ID:</strong> {transactionId || `TXN${Date.now()}`}<br/>
              <strong>Donation Amount:</strong> ₹{currentAmount ? parseInt(currentAmount).toLocaleString() : '0'}<br/>
              <strong>Payment Method:</strong> {paymentMethods.find(m => m.id === selectedMethod)?.name}
            </p>
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.0, duration: 0.5 }}
            className="text-sm text-gray-500"
          >
            Redirecting to dashboard...
          </motion.p>
          <motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
  onClick={() => navigate('/')}
  className="mt-6 bg-slate-900 text-white px-6 py-3 rounded-lg font-medium hover:bg-slate-800 transition-colors"
>
  Go to Home Page
</motion.button>

        </motion.div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-16 bg-white min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-black mb-4">Make a Donation</h1>
          <div className="decorative-line mt-4 mb-8"></div>
          <p className="text-gray-600 max-w-2xl mx-auto">Your generous contribution helps us fight hunger and reduce food waste.</p>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-green-600 to-orange-500 px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/donor-dashboard')}
                  className="bg-white/20 text-white p-2 rounded-lg hover:bg-white/30 transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                </motion.button>
                <div>
                  <h1 className="text-2xl font-bold text-white">Payment</h1>
                  <p className="text-white">Complete your secure payment</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-white" />
                <span className="text-white text-sm">100% Secure</span>
              </div>
            </div>
          </div>

          <div className="px-8 py-8">
            {/* Error Message */}
            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-red-800">{error}</p>
                </div>
              </div>
            )}

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Payment Methods */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="lg:col-span-1"
              >
                <h3 className="text-lg font-semibold text-slate-900 mb-6">Choose Payment Method</h3>
                <div className="space-y-3">
                  {paymentMethods.map((method) => {
                    const Icon = method.icon;
                    return (
                      <motion.div
                        key={method.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setSelectedMethod(method.id)}
                        className={`relative p-4 border-2 rounded-lg cursor-pointer transition-all ${
                          selectedMethod === method.id
                            ? 'border-green-600 bg-green-50 shadow-md'
                            : 'border-gray-200 hover:border-green-300'
                        }`}
                      >
                        {method.popular && (
                          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                            Popular
                          </span>
                        )}
                        <div className="flex items-center space-x-3">
                          <Icon className={`w-6 h-6 ${
                            selectedMethod === method.id ? 'text-slate-800' : 'text-slate-600'
                          }`} />
                          <div>
                            <p className={`font-medium ${
                              selectedMethod === method.id ? 'text-green-600' : 'text-slate-700'
                            }`}>
                              {method.name}
                            </p>
                            <p className="text-sm text-slate-500">{method.description}</p>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>

              {/* Payment Form */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="lg:col-span-2"
              >
                <h3 className="text-lg font-semibold text-slate-900 mb-6">
                  {paymentMethods.find(m => m.id === selectedMethod)?.name}
                </h3>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Amount Input - Now at the top */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Enter Donation Amount</label>
                    <div className="relative">
                      <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        type="number"
                        value={donationAmount}
                        onChange={handleAmountChange}
                        placeholder="Enter amount"
                        min="1"
                        className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-lg font-semibold"
                        required
                      />
                    </div>
                  </div>

                  {renderPaymentForm()}

                  {/* Donation Summary */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="bg-green-50 rounded-lg p-6 border border-green-200"
                  >
                    <h4 className="text-lg font-semibold text-green-900 mb-4">Donation Summary</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-green-700">Your Donation Amount</span>
                        <span className="text-green-900 font-semibold">₹{currentAmount ? parseInt(currentAmount).toLocaleString() : '0'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-green-700">Processing Fee</span>
                        <span className="text-green-900">₹0</span>
                      </div>
                      <hr className="border-green-300" />
                      <div className="flex justify-between text-lg font-semibold">
                        <span className="text-green-900">Total Donation</span>
                        <span className="text-green-900">₹{currentAmount ? parseInt(currentAmount).toLocaleString() : '0'}</span>
                      </div>
                    </div>
                  </motion.div>

                  {/* Terms */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="space-y-4"
                  >
                    <div className="flex items-start space-x-3">
                      <input
                        type="checkbox"
                        id="terms"
                        className="mt-1"
                        required
                      />
                      <label htmlFor="terms" className="text-sm text-slate-600">
                        I agree to the <a href="#" className="text-slate-800 underline">Terms of Service</a> and
                        <a href="#" className="text-slate-800 underline ml-1">Privacy Policy</a>
                      </label>
                    </div>
                  </motion.div>

                  {/* Pay Button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={processing || !razorpayLoaded || !donationAmount}
                    className="w-full bg-green-600 text-white py-4 px-6 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-3"
                  >
                    {processing ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        <span>Processing Donation...</span>
                      </>
                    ) : !razorpayLoaded ? (
                      <>
                        <Lock className="w-5 h-5" />
                        <span>Loading Payment...</span>
                      </>
                    ) : (
                      <>
                        <Lock className="w-5 h-5" />
                        <IndianRupee className="w-5 h-5" />
                        <span>Donate ₹{currentAmount ? parseInt(currentAmount).toLocaleString() : '0'}</span>
                      </>
                    )}
                  </motion.button>
                </form>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
