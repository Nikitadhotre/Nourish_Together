import { useState, useEffect } from 'react';
import { donationsAPI } from '../services/api';
import DashboardLayout from '../components/DashboardLayout';
import DashboardCard from '../components/DashboardCard';
import DataTable from '../components/DataTable';
import Profile from './Profile';
import { FaTruck, FaCheckCircle, FaClock, FaHome, FaUser, FaHistory } from 'react-icons/fa';

const VolunteerDashboard = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('assigned');
  const [actionLoading, setActionLoading] = useState(false);

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
      console.log('Loading donations...');
      const res = await donationsAPI.getFoodDonations();
      setDonations(Array.isArray(res.data.data) ? res.data.data : []);
    } catch (error) {
      console.error('Error loading donations:', error);
      setDonations([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteDonation = async (donationId) => {
    setActionLoading(true);
    try {
      console.log('Completing donation:', donationId);
      const res = await donationsAPI.completeFoodDonation(donationId);
      console.log('Complete response:', res.data);
      
      // Show success message
      alert('Donation marked as completed! Thank you for your help.');
      
      // Reload data to get updated status
      await loadDonations();
      
      // Switch to completed tab
      setActiveTab('completed');
    } catch (error) {
      console.error('Error completing donation:', error);
      const message = error.response?.data?.message || 'Failed to complete donation. Please try again.';
      alert(message);
    } finally {
      setActionLoading(false);
    }
  };

  const acceptedDonations = donations.filter(donation => donation.status === 'accepted');
  const completedDonations = donations.filter(donation => donation.status === 'completed');

  console.log('Accepted donations:', acceptedDonations);
  console.log('Completed donations:', completedDonations);

  const assignedPickups = acceptedDonations.length;
  const completedDeliveries = completedDonations.length;
  const totalVolunteerHours = completedDeliveries * 2;

  const assignedColumns = [
    { key: 'foodType', header: 'Food Type' },
    { key: 'quantity', header: 'Quantity' },
    { key: 'location', header: 'Location' },
    { 
      key: 'donorName', 
      header: 'Donor', 
      render: (value, row) => row.donorId?.name || row.donorId?.email || 'N/A' 
    },
    {
      key: 'status',
      header: 'Status',
      render: () => (
        <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          Assigned
        </span>
      )
    },
  ];

  const completedColumns = [
    { key: 'foodType', header: 'Food Type' },
    { key: 'quantity', header: 'Quantity' },
    { key: 'location', header: 'Location' },
    { 
      key: 'donorName', 
      header: 'Donor', 
      render: (value, row) => row.donorId?.name || row.donorId?.email || 'N/A' 
    },
    {
      key: 'completedAt',
      header: 'Completed At',
      render: (value, row) => row.updatedAt ? new Date(row.updatedAt).toLocaleString() : new Date().toLocaleString()
    },
    {
      key: 'status',
      header: 'Status',
      render: () => (
        <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
          Completed ✓
        </span>
      )
    },
  ];

  const assignedActions = [
    {
      label: actionLoading ? 'Processing...' : 'Mark Completed',
      onClick: (row) => handleCompleteDonation(row._id),
      variant: 'primary',
      disabled: actionLoading,
    },
  ];

  // Menu items for sidebar
  const menuItems = [
    { key: 'overview', label: 'Overview', icon: FaHome },
    { key: 'profile', label: 'Profile', icon: FaUser },
  ];

  // Section components
  const sections = {
    overview: () => (
      <div className="space-y-8">
        <h1 className="text-3xl font-bold text-gray-900">Volunteer Dashboard</h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <DashboardCard
            title="Assigned Pickups"
            value={assignedPickups}
            icon={FaTruck}
            color="orange"
          />
          <DashboardCard
            title="Completed Deliveries"
            value={completedDeliveries}
            icon={FaCheckCircle}
            color="green"
          />
          <DashboardCard
            title="Total Volunteer Hours"
            value={totalVolunteerHours}
            icon={FaClock}
            color="blue"
          />
        </div>

        {/* Tabs for Assigned and Completed Donations */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex border-b mb-4">
            <button
              onClick={() => setActiveTab('assigned')}
              className={`px-4 py-2 font-medium ${
                activeTab === 'assigned'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <FaTruck className="inline mr-2" />
              Assigned ({assignedPickups})
            </button>
            <button
              onClick={() => setActiveTab('completed')}
              className={`px-4 py-2 font-medium ${
                activeTab === 'completed'
                  ? 'border-b-2 border-green-500 text-green-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <FaHistory className="inline mr-2" />
              Completed ({completedDeliveries})
            </button>
          </div>

          {/* Assigned Donations Table */}
          {activeTab === 'assigned' && (
            <div>
              <h2 className="text-xl font-semibold mb-4 text-gray-900">Pickup Assignments</h2>
              {loading ? (
                <div className="text-center py-8">Loading...</div>
              ) : acceptedDonations.length > 0 ? (
                <DataTable
                  columns={assignedColumns}
                  data={acceptedDonations}
                  actions={assignedActions}
                />
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No assigned pickups at the moment. Check back later!
                </div>
              )}
            </div>
          )}

          {/* Completed Donations Table */}
          {activeTab === 'completed' && (
            <div>
              <h2 className="text-xl font-semibold mb-4 text-gray-900">Delivery History</h2>
              {loading ? (
                <div className="text-center py-8">Loading...</div>
              ) : completedDonations.length > 0 ? (
                <DataTable
                  columns={completedColumns}
                  data={completedDonations}
                />
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No completed deliveries yet. Complete your first pickup!
                </div>
              )}
            </div>
          )}
        </div>

        {/* Volunteer Certificate Card */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">Volunteer Certificate</h2>
          <div className="text-center">
            <div className="bg-gradient-to-r from-green-400 to-blue-500 rounded-lg p-8 text-white">
              <h3 className="text-xl font-bold mb-2">Certificate of Appreciation</h3>
              <p className="mb-4">For your dedication to fighting hunger</p>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-semibold">Total Deliveries</p>
                  <p className="text-2xl font-bold">{completedDeliveries}</p>
                </div>
                <div>
                  <p className="font-semibold">Volunteer Hours</p>
                  <p className="text-2xl font-bold">{totalVolunteerHours}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
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

export default VolunteerDashboard;
