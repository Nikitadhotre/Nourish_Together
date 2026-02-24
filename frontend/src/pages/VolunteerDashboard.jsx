import { useState, useEffect } from 'react';
import { donationsAPI } from '../services/api';
import DashboardLayout from '../components/DashboardLayout';
import DashboardCard from '../components/DashboardCard';
import DataTable from '../components/DataTable';
import Profile from './Profile';
import { FaTruck, FaCheckCircle, FaClock, FaHome, FaUser } from 'react-icons/fa';

const VolunteerDashboard = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadDonations();
  }, []);

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

  const acceptedDonations = donations.filter(donation => donation.status === 'accepted');
  const completedDonations = donations.filter(donation => donation.status === 'completed');

  const assignedPickups = acceptedDonations.length;
  const completedDeliveries = completedDonations.length;
  const totalVolunteerHours = completedDeliveries * 2; // Assuming 2 hours per delivery

  const assignedColumns = [
    { key: 'donorName', header: 'Donor Name' },
    { key: 'location', header: 'Pickup Location' },
    { key: 'ngoName', header: 'NGO Name' },
    { key: 'foodType', header: 'Food Type' },
    {
      key: 'status',
      header: 'Status',
      render: (value) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          value === 'accepted' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
        }`}>
          {value.charAt(0).toUpperCase() + value.slice(1)}
        </span>
      )
    },
  ];

  const assignedActions = [
    {
      label: 'Mark as Completed',
      onClick: (row) => handleCompleteDonation(row._id),
      variant: 'primary',
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

        {/* Main Section */}
        <div className="space-y-8">
          {/* Assigned Donations Table */}
          <div>
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">Assigned Donations</h2>
            <DataTable
              columns={assignedColumns}
              data={acceptedDonations}
              actions={assignedActions}
            />
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
