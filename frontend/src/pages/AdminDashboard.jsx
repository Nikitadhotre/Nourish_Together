import { useState, useEffect } from 'react';
import { donationsAPI } from '../services/api';
import DashboardLayout from '../components/DashboardLayout';
import DashboardCard from '../components/DashboardCard';
import DataTable from '../components/DataTable';
import Profile from './Profile';
import {
  FaUsers,
  FaBuilding,
  FaUser,
  FaUtensils,
  FaMoneyBillWave,
  FaHome,
  FaUserCog,
  FaUser as FaUserIcon,
} from 'react-icons/fa';

const AdminDashboard = () => {
  const [foodDonations, setFoodDonations] = useState([]);
  const [moneyDonations, setMoneyDonations] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [foodRes, moneyRes] = await Promise.all([
        donationsAPI.getFoodDonations(),
        donationsAPI.getMoneyDonations(),
      ]);

      // Handle both response structures: res.data or res.data.data
      const foodData = foodRes.data?.data || foodRes.data || [];
      const moneyData = moneyRes.data?.data || moneyRes.data || [];

      setFoodDonations(Array.isArray(foodData) ? foodData : []);
      setMoneyDonations(Array.isArray(moneyData) ? moneyData : []);

      // Mock users
      setUsers([
        { _id: '1', name: 'John Donor', email: 'john@example.com', role: 'donor' },
        { _id: '2', name: 'NGO Helper', email: 'ngo@example.com', role: 'ngo' },
        { _id: '3', name: 'Volunteer Joe', email: 'volunteer@example.com', role: 'volunteer' },
      ]);
    } catch (error) {
      console.error('Error loading data:', error);
      setError('Failed to load data. Please try again.');
      setFoodDonations([]);
      setMoneyDonations([]);
    } finally {
      setLoading(false);
    }
  };

  const handleUserAction = async (userId, action) => {
    setLoading(true);
    try {
      console.log(`${action} user ${userId}`);
      loadData();
    } catch (error) {
      console.error(`Error ${action}ing user:`, error);
    } finally {
      setLoading(false);
    }
  };

  const totalUsers = users.length;
  const totalNGOs = users.filter(u => u.role === 'ngo').length;
  const totalVolunteers = users.filter(u => u.role === 'volunteer').length;

  const totalFoodDonated = Array.isArray(foodDonations)
    ? foodDonations.reduce(
        (sum, donation) => sum + Number(donation.quantity || 0),
        0
      )
    : 0;

  const totalMoneyDonated = Array.isArray(moneyDonations)
    ? moneyDonations.reduce(
        (sum, donation) => sum + Number(donation.amount || 0),
        0
      )
    : 0;

  const userColumns = [
    { key: 'name', header: 'Name' },
    { key: 'email', header: 'Email' },
    {
      key: 'role',
      header: 'Role',
      render: (value) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          value === 'donor'
            ? 'bg-green-100 text-green-800'
            : value === 'ngo'
            ? 'bg-blue-100 text-blue-800'
            : 'bg-purple-100 text-purple-800'
        }`}>
          {value}
        </span>
      ),
    },
  ];

  const foodDonationColumns = [
    { key: 'foodType', header: 'Food Type' },
    { key: 'quantity', header: 'Quantity' },
    { key: 'location', header: 'Location' },
    { key: 'status', header: 'Status' },
  ];

  const moneyDonationColumns = [
    {
      key: 'amount',
      header: 'Amount',
      render: (value) => `₹${value}`,
    },
    {
      key: 'createdAt',
      header: 'Date',
      render: (value) => value ? new Date(value).toLocaleDateString() : '-',
    },
  ];

  const userActions = [
    {
      label: 'Delete',
      onClick: (row) => handleUserAction(row._id, 'delete'),
      variant: 'danger',
    },
  ];

  const menuItems = [
    { key: 'overview', label: 'Overview', icon: FaHome },
    { key: 'profile', label: 'Profile', icon: FaUserIcon },
    { key: 'user-management', label: 'User Management', icon: FaUserCog },
    { key: 'all-food-donations', label: 'All Food Donations', icon: FaUtensils },
    { key: 'all-money-donations', label: 'All Money Donations', icon: FaMoneyBillWave },
  ];

  const sections = {
    overview: () => (
      <div className="space-y-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <DashboardCard title="Total Users" value={totalUsers} icon={FaUsers} color="blue" />
          <DashboardCard title="Total NGOs" value={totalNGOs} icon={FaBuilding} color="green" />
          <DashboardCard title="Total Volunteers" value={totalVolunteers} icon={FaUser} color="purple" />
          <DashboardCard title="Total Food Donated" value={totalFoodDonated} icon={FaUtensils} color="orange" />
          <DashboardCard title="Total Money Donated" value={`₹${totalMoneyDonated}`} icon={FaMoneyBillWave} color="yellow" />
        </div>
      </div>
    ),

    'user-management': () => (
      <DataTable columns={userColumns} data={users} actions={userActions} />
    ),

    'all-food-donations': () => (
      <DataTable columns={foodDonationColumns} data={foodDonations} />
    ),

    'all-money-donations': () => (
      <DataTable columns={moneyDonationColumns} data={moneyDonations} />
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

export default AdminDashboard;
