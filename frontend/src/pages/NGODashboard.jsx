import { useState, useEffect } from 'react';
import { donationsAPI } from '../services/api';
import DashboardLayout from '../components/DashboardLayout';
import DashboardCard from '../components/DashboardCard';
import DataTable from '../components/DataTable';
import Profile from './Profile';
import { FaClock, FaCheckCircle, FaUtensils, FaHome, FaGift, FaHandsHelping, FaUser, FaHistory } from 'react-icons/fa';

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
    try {
      const res = await donationsAPI.getFoodDonations();
      setDonations(Array.isArray(res.data.data) ? res.data.data : []);
    } catch (error) {
      console.error('Error loading donations:', error);
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
    { 
      key: 'donorName', 
      header: 'Donor Name',
      render: (value, row) => row.donorId?.name || row.donorId?.email || 'N/A'
    },
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
    { 
      key: 'donorName', 
      header: 'Donor Name',
      render: (value, row) => row.donorId?.name || row.donorId?.email || 'N/A'
    },
    { key: 'foodType', header: 'Food Type' },
    { key: 'quantity', header: 'Quantity' },
    { key: 'location', header: 'Location' },
    {
      key: 'expiryTime',
      header: 'Expiry Time',
      render: (value) => value ? new Date(value).toLocaleString() : '-'
    },
  ];

  // History columns - shows completed donations with completion details
  const historyColumns = [
    { 
      key: 'donorName', 
      header: 'Donor Name',
      render: (value, row) => row.donorId?.name || row.donorId?.email || 'N/A'
    },
    { key: 'foodType', header: 'Food Type' },
    { key: 'quantity', header: 'Quantity' },
    { key: 'location', header: 'Location' },
    {
      key: 'completedAt',
      header: 'Completed On',
      render: (value) => value ? new Date(value).toLocaleString() : new Date().toLocaleString()
    },
    {
      key: 'mealsProvided',
      header: 'Meals Provided',
      render: (value, row) => row.quantity ? row.quantity * 10 : '-'
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
    { key: 'history', label: 'History', icon: FaHistory },
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

    history: () => (
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Donation History</h1>
        
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <DashboardCard
            title="Total Completed"
            value={completedDonations.length}
            icon={FaCheckCircle}
            color="green"
          />
          <DashboardCard
            title="Total Meals Distributed"
            value={completedDonations.reduce((total, d) => total + (d.quantity || 0) * 10, 0)}
            icon={FaUtensils}
            color="blue"
          />
          <DashboardCard
            title="Total Quantity Received"
            value={completedDonations.reduce((total, d) => total + (d.quantity || 0), 0)}
            icon={FaGift}
            color="yellow"
          />
        </div>

        {/* History Table */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Completed Donations</h2>
            <p className="text-sm text-gray-500 mt-1">A complete history of all donations that have been completed</p>
          </div>
          {loading ? (
            <div className="text-center py-8">Loading...</div>
          ) : completedDonations.length === 0 ? (
            <div className="text-center py-12">
              <FaHistory className="text-6xl text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No completed donations yet</p>
              <p className="text-gray-400">Completed donations will appear here</p>
            </div>
          ) : (
            <DataTable
              columns={historyColumns}
              data={completedDonations}
            />
          )}
        </div>
      </div>
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
