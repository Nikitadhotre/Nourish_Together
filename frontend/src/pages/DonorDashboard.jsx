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
  FaUser
} from 'react-icons/fa';

const DonorDashboard = () => {
  const [donations, setDonations] = useState([]);
  const [moneyDonations, setMoneyDonations] = useState([]);
  const [formData, setFormData] = useState({
    foodType: '',
    quantity: '',
    location: '',
    expiryTime: '',
  });

  const [moneyAmount, setMoneyAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  /* ---------------- LOAD DATA ---------------- */

  const loadData = async () => {
    try {
      const [foodRes, moneyRes] = await Promise.all([
        donationsAPI.getFoodDonations(),
        donationsAPI.getMoneyDonations(),
      ]);

      setDonations(Array.isArray(foodRes.data) ? foodRes.data : []);
      setMoneyDonations(Array.isArray(moneyRes.data) ? moneyRes.data : []);
    } catch (error) {
      console.error('Error loading data:', error);
      setDonations([]);
      setMoneyDonations([]);
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

  /* ---------------- MONEY DONATION ---------------- */

  const handleMoneyDonation = async () => {
    if (!moneyAmount || moneyAmount < 1) {
      setError('Please enter a valid amount');
      return;
    }

    setLoading(true);
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
      setLoading(false);
    }
  };

  /* ---------------- FILTER USER DATA ---------------- */

  const myFoodDonations = donations.filter(
    d => d.donorId === localStorage.getItem('userId')
  );

  const myMoneyDonations = moneyDonations.filter(
    d => d.donorId === localStorage.getItem('userId')
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

        {success && <div className="text-green-600 mb-2">{success}</div>}
        {error && <div className="text-red-600 mb-2">{error}</div>}

        <input
          type="number"
          value={moneyAmount}
          onChange={(e) => setMoneyAmount(e.target.value)}
          className="border p-2"
          placeholder="Amount"
        />

        <button onClick={handleMoneyDonation} className="ml-2 bg-orange-600 text-white px-4 py-2">
          Donate
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
    moneyAmount,
    myFoodDonations,
    myMoneyDonations,
    loading
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
