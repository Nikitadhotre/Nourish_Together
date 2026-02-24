import { useState, useEffect } from 'react';
import { donationsAPI, authAPI } from '../services/api';
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

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [foodRes, moneyRes, usersRes] = await Promise.all([
        donationsAPI.getFoodDonations(),
        donationsAPI.getMoneyDonations(),
        authAPI.getUsers(),
      ]);

      console.log("Food Response:", foodRes.data);
      console.log("Money Response:", moneyRes.data);
      console.log("Users Response:", usersRes.data);

      setFoodDonations(
        Array.isArray(foodRes.data.data) ? foodRes.data.data : []
      );

      setMoneyDonations(
        Array.isArray(moneyRes.data.data) ? moneyRes.data.data : []
      );

      setUsers(
        Array.isArray(usersRes.data.data) ? usersRes.data.data : []
      );
    } catch (error) {
      console.error('Error loading data:', error);
      setFoodDonations([]);
      setMoneyDonations([]);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleUserAction = async (userId, action) => {
    if (action === 'delete') {
      if (!window.confirm('Are you sure you want to delete this user?')) {
        return;
      }
    }
    setLoading(true);
    try {
      await authAPI.deleteUser(userId);
      alert('User deleted successfully');
      loadData();
    } catch (error) {
      console.error(`Error ${action}ing user:`, error);
      alert('Failed to delete user');
    } finally {
      setLoading(false);
    }
  };

  const totalUsers = users.length;
  const totalNGOs = users.filter(u => u.role === 'ngo').length;
  const totalVolunteers = users.filter(u => u.role === 'volunteer').length;
  const totalDonors = users.filter(u => u.role === 'donor').length;

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
            : value === 'volunteer'
            ? 'bg-purple-100 text-purple-800'
            : 'bg-gray-100 text-gray-800'
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
      render: (value) => new Date(value).toLocaleDateString(),
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <DashboardCard title="Total Users" value={totalUsers} icon={FaUsers} />
          <DashboardCard title="Total NGOs" value={totalNGOs} icon={FaBuilding} />
          <DashboardCard title="Total Volunteers" value={totalVolunteers} icon={FaUser} />
          <DashboardCard title="Total Food Donated" value={totalFoodDonated} icon={FaUtensils} />
          <DashboardCard title="Total Money Donated" value={`₹${totalMoneyDonated}`} icon={FaMoneyBillWave} />
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
