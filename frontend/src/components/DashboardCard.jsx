const DashboardCard = ({ title, value, icon: Icon, color = 'green' }) => {
  const colorClasses = {
    green: 'bg-green-500',
    orange: 'bg-orange-500',
    blue: 'bg-blue-500',
    yellow: 'bg-yellow-500',
    red: 'bg-red-500',
    purple: 'bg-purple-500',
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500 hover:shadow-lg transition-shadow duration-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`p-3 rounded-full ${colorClasses[color]} bg-opacity-10`}>
          <Icon className={`w-8 h-8 ${colorClasses[color].replace('bg-', 'text-')}`} />
        </div>
      </div>
    </div>
  );
};

export default DashboardCard;
