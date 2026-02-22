import { useState, useEffect } from 'react';
import { donationsAPI } from '../services/api';
import DashboardLayout from '../components/DashboardLayout';
import DashboardCard from '../components/DashboardCard';
import DataTable from '../components/DataTable';
import Profile from './Profile';
import { FaClock, FaCheckCircle, FaUtensils, FaHome, FaGift, FaHandsHelping, FaUser } from 'react-icons/fa';

const NGODashboard = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadDonations();
  }, []);

  const loadDonations = async () => {
    try {
      const res = await donationsAPI.getFoodDonations();
      setDonations(res.data);
    } catch (error) {
      console.error('Error loading donations:', error);
    }
  };

  const handleAcceptDonation = async (donationId) => {
    setLoading(true);
    try {
      await donationsAPI.acceptFoodDonation(donationId);
      loadDonations();
    } catch (error) {
      console.error('Error accepting donation:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteDonation = async (donationId) => {
    setLoading(true);
    try {
      await donationsAPI.completeFoodDonation(donationId);
      loadDonations();
    } catch (error) {
      console.error('Error completing donation:', error);
    } finally {
      setLoading(false);
    }
  };

  const availableDonations = donations.filter(donation => donation.status === 'pending');
  const acceptedDonations = donations.filter(donation => donation.status === 'accepted');
  const completedDonations = donations.filter(donation => donation.status === 'completed');

  const pendingDonations = availableDonations.length;
  const acceptedCount = acceptedDonations.length;
  const completedCount = completedDonations.length;
  const totalMealsDistributed = completedCount * 10; // Assuming 10 meals per donation

  const availableColumns = [
    { key: 'donorName', header: 'Donor Name' },
    { key: 'foodType', header: 'Food Type' },
    { key: 'quantity', header: 'Quantity' },
    { key: 'location', header: 'Location' },
    {
      key: 'expiryTime',
      header: 'Expiry Time',
      render: (value) => new Date(value).toLocaleString()
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
      render: (value) => new Date(value).toLocaleString()
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
        <DataTable
          columns={availableColumns}
          data={availableDonations}
          actions={availableActions}
        />
      </div>
    ),

    'accepted-donations': () => (
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Accepted Donations</h1>
        <DataTable
          columns={acceptedColumns}
          data={acceptedDonations}
          actions={acceptedActions}
        />
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
