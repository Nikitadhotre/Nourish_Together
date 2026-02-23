import { useState, useEffect, useMemo } from 'react';
import { donationsAPI } from '../services/api';
import DashboardLayout from '../components/DashboardLayout';
import DashboardCard from '../components/DashboardCard';
import DataTable from '../components/DataTable';
import Profile from './Profile';
import {
  FaUtensils,
  FaMoneyBillWave,
  FaClock,
  FaCheckCircle,
  FaHome,
  FaGift,
  FaCoins,
  FaUser,
  FaTimes,
  FaEye
} from 'react-icons/fa';

const DonorDashboard = () => {
  const [donations, setDonations] = useState([]);
  const [moneyDonations, setMoneyDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    foodType: '',
    quantity: '',
    location: '',
    expiryTime: '',
  });

  const [moneyAmount, setMoneyAmount] = useState('');
  const [submitting, setSubmitting] = useState(false);
  
  // Modal state for viewing donation details
  const [selectedDonation, setSelectedDonation] = useState(null);
  const [donationType, setDonationType] = useState(null); // 'food' or 'money'

  useEffect(() => {
    loadData();
  }, []);

  /* ---------------- HELPER FUNCTION ---------------- */

  const extractArray = (data) => {
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.data)) return data.data;
    if (Array.isArray(data?.donations)) return data.donations;
    return [];
  };

  /* ---------------- LOAD DATA ---------------- */

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [foodRes, moneyRes] = await Promise.all([
        donationsAPI.getFoodDonations(),
        donationsAPI.getMoneyDonations(),
      ]);

      const foodData = extractArray(foodRes.data);
      const moneyData = extractArray(moneyRes.data);
      
      setDonations(foodData);
      setMoneyDonations(moneyData);
      
      console.log('Food Donations:', foodData);
      console.log('Money Donations:', moneyData);
    } catch (error) {
      console.error('Error loading data:', error);
      setError('Failed to load donations. Please try again.');
      setDonations([]);
      setMoneyDonations([]);
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- FORM HANDLING ---------------- */

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const res = await donationsAPI.createFoodDonation(formData);
      const newDonation = res.data.data || res.data;

      setDonations(prev => [...prev, newDonation]);
      setSuccess('✅ Food donated successfully!');

      setTimeout(() => {
        setSuccess('');
      }, 3000);

      setFormData({
        foodType: '',
        quantity: '',
        location: '',
        expiryTime: '',
      });

    } catch (error) {
      setError(error.response?.data?.message || 'Failed to create donation');
    } finally {
      setSubmitting(false);
    }
  };

  /* ---------------- MONEY DONATION ---------------- */

  const handleMoneyDonation = async () => {
    if (!moneyAmount || moneyAmount < 1) {
      setError('Please enter a valid amount');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const orderRes = await donationsAPI.createMoneyDonationOrder(parseInt(moneyAmount));
      const order = orderRes.data.order;

      const options = {
        key: 'rzp_test_YOUR_TEST_KEY_ID',
        amount: order.amount,
        currency: order.currency,
        name: 'Nourish Together',
        description: 'Food Relief Donation',
        order_id: order.id,

        handler: async function (response) {
          try {
            await donationsAPI.saveMoneyDonation({
              amount: parseInt(moneyAmount),
              paymentId: response.razorpay_payment_id,
            });

            setSuccess('✅ Payment successful. Thank you!');
            setMoneyAmount('');

            setTimeout(() => {
              setSuccess('');
            }, 3000);

            loadData();

          } catch (error) {
            alert('Payment succeeded but saving failed.');
          }
        },

        prefill: {
          name: localStorage.getItem('userName') || '',
          email: localStorage.getItem('userEmail') || '',
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (error) {
      setError('Failed to initiate payment');
    } finally {
      setSubmitting(false);
    }
  };

  /* ---------------- CALCULATE STATS ---------------- */

  const myFoodDonations = donations;
  const myMoneyDonations = moneyDonations;

  const totalFoodDonations = myFoodDonations.length;
  const activeDonations = myFoodDonations.filter(
    d => d.status === 'pending' || d.status === 'accepted'
  ).length;

  const completedDonations = myFoodDonations.filter(
    d => d.status === 'completed'
  ).length;

  const totalMoneyDonated = myMoneyDonations.reduce(
    (sum, d) => sum + (d.amount || 0),
    0
  );

  /* ---------------- MENU ---------------- */

  const menuItems = [
    { key: 'overview', label: 'Overview', icon: FaHome },
    { key: 'profile', label: 'Profile', icon: FaUser },
    { key: 'donate-food', label: 'Donate Food', icon: FaGift },
    { key: 'donate-money', label: 'Donate Money', icon: FaCoins },
    { key: 'my-donations', label: 'My Donations', icon: FaUtensils },
  ];

  /* ---------------- VIEW DONATION DETAILS ---------------- */

  const viewFoodDonationDetails = (donation) => {
    setSelectedDonation(donation);
    setDonationType('food');
  };

  const viewMoneyDonationDetails = (donation) => {
    setSelectedDonation(donation);
    setDonationType('money');
  };

  const closeModal = () => {
    setSelectedDonation(null);
    setDonationType(null);
  };

  /* ---------------- STATUS BADGE ---------------- */

  const getStatusBadge = (status) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800',
      accepted: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status] || 'bg-gray-100 text-gray-800'}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  /* ---------------- ENHANCED TABLE COLUMNS ---------------- */

  const enhancedFoodColumns = [
    { key: 'foodType', header: 'Food Type' },
    { key: 'quantity', header: 'Quantity' },
    { key: 'location', header: 'Location' },
    {
      key: 'status',
      header: 'Status',
      render: (value) => getStatusBadge(value),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (_, row) => (
        <button
          onClick={() => viewFoodDonationDetails(row)}
          className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
        >
          <FaEye /> View
        </button>
      ),
    },
  ];

  const enhancedMoneyColumns = [
    {
      key: 'amount',
      header: 'Amount',
      render: (value) => `₹${value}`
    },
    { key: 'paymentId', header: 'Payment ID' },
    {
      key: 'date',
      header: 'Date',
      render: (value, row) => row.createdAt ? new Date(row.createdAt).toLocaleDateString() : '-',
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (_, row) => (
        <button
          onClick={() => viewMoneyDonationDetails(row)}
          className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
        >
          <FaEye /> View
        </button>
      ),
    },
  ];

  /* ---------------- MEMOIZED SECTIONS ---------------- */

  const sections = useMemo(() => ({
    overview: () => (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Donor Dashboard</h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {/* Food Donation Summary */}
        <div>
          <h2 className="text-xl font-semibold mb-3 text-green-700">🍎 Food Donations</h2>
          <div className="grid grid-cols-3 gap-4">
            <DashboardCard title="Total Food Donations" value={totalFoodDonations} icon={FaUtensils} color="green" />
            <DashboardCard title="Active Donations" value={activeDonations} icon={FaClock} color="yellow" />
            <DashboardCard title="Completed Donations" value={completedDonations} icon={FaCheckCircle} color="blue" />
          </div>
        </div>

        {/* Money Donation Summary */}
        <div>
          <h2 className="text-xl font-semibold mb-3 text-orange-700">💰 Money Donations</h2>
          <div className="grid grid-cols-1 gap-4">
            <DashboardCard title="Total Money Donated" value={`₹${totalMoneyDonated}`} icon={FaMoneyBillWave} color="orange" />
          </div>
        </div>
      </div>
    ),

    'donate-food': () => (
      <div>
        <h1 className="text-3xl font-bold mb-6">Donate Food</h1>

        {success && <div className="text-green-600 mb-2">{success}</div>}
        {error && <div className="text-red-600 mb-2">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-3 max-w-md">
          <input name="foodType" value={formData.foodType} onChange={handleChange} placeholder="Food Type" className="w-full border p-2" required />
          <input name="quantity" value={formData.quantity} onChange={handleChange} placeholder="Quantity" className="w-full border p-2" required />
          <input name="location" value={formData.location} onChange={handleChange} placeholder="Location" className="w-full border p-2" required />
          <input type="datetime-local" name="expiryTime" value={formData.expiryTime} onChange={handleChange} className="w-full border p-2" required />

          <button className="bg-green-600 text-white px-4 py-2" disabled={submitting}>
            {submitting ? 'Creating...' : 'Donate Food'}
          </button>
        </form>
      </div>
    ),

    'donate-money': () => (
      <div>
        <h1 className="text-3xl font-bold mb-6">Donate Money</h1>

        {success && <div className="text-green-600 mb-2">{success}</div>}
        {error && <div className="text-red-600 mb-2">{error}</div>}

        <input
          type="number"
          value={moneyAmount}
          onChange={(e) => setMoneyAmount(e.target.value)}
          className="border p-2"
          placeholder="Amount"
        />

        <button onClick={handleMoneyDonation} className="ml-2 bg-orange-600 text-white px-4 py-2" disabled={submitting}>
          {submitting ? 'Processing...' : 'Donate'}
        </button>
      </div>
    ),

    'my-donations': () => (
      <div className="space-y-8">
        {/* Food Donations Table */}
        <div>
          <h2 className="text-2xl font-bold mb-4 text-green-700">🍎 My Food Donations</h2>
          {loading ? (
            <div className="text-center py-8">Loading...</div>
          ) : myFoodDonations.length > 0 ? (
            <DataTable columns={enhancedFoodColumns} data={myFoodDonations} />
          ) : (
            <p className="text-gray-500">No food donations yet.</p>
          )}
        </div>

        {/* Money Donations Table */}
        <div>
          <h2 className="text-2xl font-bold mb-4 text-orange-700">💰 My Money Donations</h2>
          {loading ? (
            <div className="text-center py-8">Loading...</div>
          ) : myMoneyDonations.length > 0 ? (
            <DataTable columns={enhancedMoneyColumns} data={myMoneyDonations} />
          ) : (
            <p className="text-gray-500">No money donations yet.</p>
          )}
        </div>
      </div>
    ),

    profile: () => (
      <Profile />
    ),

  }), [
    totalFoodDonations,
    activeDonations,
    completedDonations,
    totalMoneyDonated,
    success,
    error,
    formData,
    moneyAmount,
    myFoodDonations,
    myMoneyDonations,
    loading,
    submitting
  ]);

  return (
    <>
      <DashboardLayout
        menuItems={menuItems}
        sections={sections}
        defaultSection="overview"
      />
      
      {/* Donation Details Modal */}
      {selectedDonation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">
                {donationType === 'food' ? '🍎 Food Donation Details' : '💰 Money Donation Details'}
              </h2>
              <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
                <FaTimes className="w-6 h-6" />
              </button>
            </div>
            
            {donationType === 'food' ? (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <span className="font-semibold text-gray-600">Food Type:</span>
                  <span>{selectedDonation.foodType}</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <span className="font-semibold text-gray-600">Quantity:</span>
                  <span>{selectedDonation.quantity}</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <span className="font-semibold text-gray-600">Location:</span>
                  <span>{selectedDonation.location}</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <span className="font-semibold text-gray-600">Expiry Time:</span>
                  <span>{selectedDonation.expiryTime ? new Date(selectedDonation.expiryTime).toLocaleString() : '-'}</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <span className="font-semibold text-gray-600">Status:</span>
                  <span>{getStatusBadge(selectedDonation.status)}</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <span className="font-semibold text-gray-600">Created At:</span>
                  <span>{selectedDonation.createdAt ? new Date(selectedDonation.createdAt).toLocaleString() : '-'}</span>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <span className="font-semibold text-gray-600">Amount:</span>
                  <span className="text-green-600 font-bold">₹{selectedDonation.amount}</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <span className="font-semibold text-gray-600">Payment ID:</span>
                  <span className="text-sm">{selectedDonation.paymentId}</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <span className="font-semibold text-gray-600">Date:</span>
                  <span>{selectedDonation.createdAt ? new Date(selectedDonation.createdAt).toLocaleString() : '-'}</span>
                </div>
              </div>
            )}
            
            <button 
              onClick={closeModal}
              className="mt-6 w-full bg-gray-600 text-white py-2 rounded hover:bg-gray-700"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default DonorDashboard;
