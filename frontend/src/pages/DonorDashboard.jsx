import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
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
  FaUser
} from 'react-icons/fa';

const DonorDashboard = () => {
  const navigate = useNavigate();
  const [donations, setDonations] = useState([]);
  const [moneyDonations, setMoneyDonations] = useState([]);
  const [formData, setFormData] = useState({
    foodType: '',
    quantity: '',
    location: '',
    expiryTime: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  /* ---------------- LOAD DATA ---------------- */

  const loadData = async () => {
    setLoading(true);
    try {
      const [foodRes, moneyRes] = await Promise.all([
        donationsAPI.getFoodDonations(),
        donationsAPI.getMoneyDonations(),
      ]);

      setDonations(Array.isArray(foodRes.data.data) ? foodRes.data.data : []);
      setMoneyDonations(Array.isArray(moneyRes.data.data) ? moneyRes.data.data : []);
    } catch (error) {
      console.error('Error loading data:', error);
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

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const res = await donationsAPI.createFoodDonation(formData);

      const newDonation = res.data.data;

      setDonations(prev => [...prev, newDonation]);

      setSuccess('✅ Food donated successfully!');

      /* ✅ Auto hide after 3 sec */
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
      setLoading(false);
    }
  };

  /* ---------------- FILTER USER DATA ---------------- */

  const myFoodDonations = donations.filter(
    d => d.donorId && (d.donorId._id === localStorage.getItem('userId') || d.donorId === localStorage.getItem('userId'))
  );

  const myMoneyDonations = moneyDonations.filter(
    d => d.donorId && (d.donorId._id === localStorage.getItem('userId') || d.donorId === localStorage.getItem('userId'))
  );

  const totalFoodDonations = myFoodDonations.length;
  const activeDonations = myFoodDonations.filter(
    d => d.status === 'pending' || d.status === 'accepted'
  ).length;

  const completedDonations = myFoodDonations.filter(
    d => d.status === 'completed'
  ).length;

  const totalMoneyDonated = myMoneyDonations.reduce(
    (sum, d) => sum + d.amount,
    0
  );

  /* ---------------- TABLE CONFIG ---------------- */

  const foodDonationColumns = [
    { key: 'foodType', header: 'Food Type' },
    { key: 'quantity', header: 'Quantity' },
    { key: 'location', header: 'Location' },
    {
      key: 'status',
      header: 'Status',
    },
  ];

  const moneyDonationColumns = [
    {
      key: 'amount',
      header: 'Amount',
      render: (value) => `₹${value}`
    },
    { key: 'paymentId', header: 'Payment ID' },
  ];

  /* ---------------- MENU ---------------- */

  const menuItems = [
    { key: 'overview', label: 'Overview', icon: FaHome },
    { key: 'profile', label: 'Profile', icon: FaUser },
    { key: 'donate-food', label: 'Donate Food', icon: FaGift },
    { key: 'donate-money', label: 'Donate Money', icon: FaCoins },
    { key: 'my-donations', label: 'My Donations', icon: FaUtensils },
  ];

  /* ---------------- ✅ MEMOIZED SECTIONS ---------------- */

  const sections = useMemo(() => ({
    overview: () => (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Donor Dashboard</h1>

        <div className="grid grid-cols-4 gap-4">
          <DashboardCard title="Food Donations" value={totalFoodDonations} icon={FaUtensils} />
          <DashboardCard title="Active" value={activeDonations} icon={FaClock} />
          <DashboardCard title="Completed" value={completedDonations} icon={FaCheckCircle} />
          <DashboardCard title="Money Donated" value={`₹${totalMoneyDonated}`} icon={FaMoneyBillWave} />
        </div>
      </div>
    ),

    'donate-food': () => (
      <div>
        <h1 className="text-3xl font-bold mb-6">Donate Food</h1>

        {success && <div className="text-green-600 mb-2">{success}</div>}
        {error && <div className="text-red-600 mb-2">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-3 max-w-md">
          <input name="foodType" value={formData.foodType} onChange={handleChange} placeholder="Food Type" className="w-full border p-2" />
          <input name="quantity" value={formData.quantity} onChange={handleChange} placeholder="Quantity" className="w-full border p-2" />
          <input name="location" value={formData.location} onChange={handleChange} placeholder="Location" className="w-full border p-2" />
          <input type="datetime-local" name="expiryTime" value={formData.expiryTime} onChange={handleChange} className="w-full border p-2" />

          <button className="bg-green-600 text-white px-4 py-2">
            {loading ? 'Creating...' : 'Donate Food'}
          </button>
        </form>
      </div>
    ),

    'donate-money': () => (
      <div>
        <h1 className="text-3xl font-bold mb-6">Donate Money</h1>
        <p className="text-gray-600 mb-6">Click the button below to proceed to the secure payment page.</p>
        <button 
          onClick={() => navigate('/payment')} 
          className="bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-700 transition-colors"
        >
          Proceed to Payment
        </button>
      </div>
    ),

    'my-donations': () => (
      <div className="space-y-6">
        <DataTable columns={foodDonationColumns} data={myFoodDonations} />
        <DataTable columns={moneyDonationColumns} data={myMoneyDonations} />
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
    myFoodDonations,
    myMoneyDonations,
    loading,
    navigate
  ]);

  return (
    <DashboardLayout
      menuItems={menuItems}
      sections={sections}
      defaultSection="overview"
    />
  );
};

export default DonorDashboard;
