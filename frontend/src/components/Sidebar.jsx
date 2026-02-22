import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FaHome, FaGift, FaHandsHelping, FaUsers, FaCog, FaSignOutAlt, FaUser, FaBuilding, FaTruck, FaChartLine, FaMoneyBillWave, FaCertificate } from 'react-icons/fa';

const Sidebar = ({ menuItems, activeSection, onSectionChange, className = '' }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    toast.success('Logged out successfully!');
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    logout();
    navigate('/');
  };

  return (
    <div className={`w-64 bg-white shadow-lg h-screen flex flex-col ${className}`}>
      <div className="p-6 border-b border-gray-200 flex-shrink-0">
        <h2 className="text-xl font-bold text-green-600">Nourish Together</h2>
        <p className="text-sm text-gray-600 mt-1">Welcome, {user?.name}</p>
      </div>

      <nav className="flex-1 px-4 py-6 overflow-y-auto">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.key;
            return (
              <li key={item.key}>
                <button
                  onClick={() => onSectionChange(item.key)}
                  className={`flex items-center w-full px-4 py-3 rounded-lg transition-colors duration-200 text-left ${
                    isActive
                      ? 'bg-green-100 text-green-700 border-r-4 border-green-500'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-green-600'
                  }`}
                >
                  <Icon className="w-5 h-5 mr-3 flex-shrink-0" />
                  <span className="truncate">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-gray-200 flex-shrink-0">
        <button
          onClick={handleLogout}
          className="flex items-center w-full px-4 py-3 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors duration-200"
        >
          <FaSignOutAlt className="w-5 h-5 mr-3 flex-shrink-0" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
