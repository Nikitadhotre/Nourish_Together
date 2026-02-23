import { useState, useEffect } from 'react';
import { donationsAPI } from '../services/api';
import DashboardLayout from '../components/DashboardLayout';
import DashboardCard from '../components/DashboardCard';
import DataTable from '../components/DataTable';
import Profile from './Profile';
import { FaClock, FaCheckCircle, FaUtensils, FaHome, FaGift, FaHandsHelping, FaUser } from 'react-icons/fa';

const NGODashboard = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadDonations();
  }, []);

  const extractArray = (data) => {
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.data)) return data.data;
    if (Array.isArray(data?.donations)) return data.donations;
    return [];
  };

  const loadDonations = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await donationsAPI.getFoodDonations();
      const donationsData = extractArray(res.data);
      setDonations(donationsData);
    } catch (error) {
      console.error('Error loading donations:', error);
      setError('Failed to load donations. Please try again.');
      setDonations([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptDonation = async (donationId) => {
    try {
      await donationsAPI.acceptFoodDonation(donationId);
      loadDonations();
    } catch (error) {
      console.error('Error accepting donation:', error);
      alert('Failed to accept donation');
    }
  };

  const handleCompleteDonation = async (donationId) => {
    try {
      await donationsAPI.completeFoodDonation(donationId);
      loadDonations();
    } catch (error) {
      console.error('Error completing donation:', error);
      alert('Failed to complete donation');
    }
  };

  const availableDonations = donations.filter(donation => donation.status === 'pending');
  const acceptedDonations = donations.filter(donation => donation.status === 'accepted');
  const completedDonations = donations.filter(donation => donation.status === 'completed');

  const pendingDonations = availableDonations.length;
  const acceptedCount = acceptedDonations.length;
  const completedCount = completedDonations.length;
  const totalMealsDistributed = completedCount * 10;

  const availableColumns = [
    { key: 'donorName', header: 'Donor Name' },
    { key: 'foodType', header: 'Food Type' },
    { key: 'quantity', header: 'Quantity' },
    { key: 'location', header: 'Location' },
    {
      key: 'expiryTime',
      header: 'Expiry Time',
      render: (value) => value ? new Date(value).toLocaleString() : '-'
    },
  ];

  const acceptedColumns = [
    { key: 'donorName', header: 'Donor Name' },
    { key: 'foodType', header: 'Food Type' },
    { key: 'quantity', header: 'Quantity' },
    { key: 'location', header: 'Location' },
    {
      key: 'expiryTime',
      header: 'Expiry Time',
      render: (value) => value ? new Date(value).toLocaleString() : '-'
    },
  ];

  const availableActions = [
    {
      label: 'Accept',
      onClick: (row) => handleAcceptDonation(row._id),
      variant: 'primary',
    },
  ];

  const acceptedActions = [
    {
      label: 'Mark Completed',
      onClick: (row) => handleCompleteDonation(row._id),
      variant: 'secondary',
    },
  ];

  // Menu items for sidebar
  const menuItems = [
    { key: 'overview', label: 'Overview', icon: FaHome },
    { key: 'profile', label: 'Profile', icon: FaUser },
    { key: 'available-donations', label: 'Available Donations', icon: FaGift },
    { key: 'accepted-donations', label: 'Accepted Donations', icon: FaHandsHelping },
  ];

  // Section components
  const sections = {
    overview: () => (
      <div className="space-y-8">
        <h1 className="text-3xl font-bold text-gray-900">NGO Dashboard</h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <DashboardCard
            title="Pending Donations"
            value={pendingDonations}
            icon={FaClock}
            color="orange"
          />
          <DashboardCard
            title="Accepted Donations"
            value={acceptedCount}
            icon={FaCheckCircle}
            color="blue"
          />
          <DashboardCard
            title="Completed Donations"
            value={completedCount}
            icon={FaUtensils}
            color="green"
          />
          <DashboardCard
            title="Total Meals Distributed"
            value={totalMealsDistributed}
            icon={FaUtensils}
            color="yellow"
          />
        </div>
      </div>
    ),

    'available-donations': () => (
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Available Food Donations</h1>
        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : (
          <DataTable
            columns={availableColumns}
            data={availableDonations}
            actions={availableActions}
          />
        )}
      </div>
    ),

    'accepted-donations': () => (
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Accepted Donations</h1>
        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : (
          <DataTable
            columns={acceptedColumns}
            data={acceptedDonations}
            actions={acceptedActions}
          />
        )}
      </div>
    ),

    profile: () => (
      <Profile />
    ),
  };

  return (
    <DashboardLayout
      menuItems={menuItems}
      sections={sections}
      defaultSection="overview"
    />
  );
};

export default NGODashboard;
