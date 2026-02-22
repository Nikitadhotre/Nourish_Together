import { useState } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const DashboardLayout = ({ menuItems, sections, defaultSection = 'overview' }) => {
  const [activeSection, setActiveSection] = useState(defaultSection);

  const ActiveComponent = sections[activeSection] || sections[defaultSection];

  return (
    <>
      <Navbar isDashboard={true} />
      <Sidebar
        menuItems={menuItems}
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        className="fixed left-0 top-16 h-[calc(100vh-4rem)]"
      />
      {/* Main content area with proper spacing for fixed navbar and sidebar */}
      <div className="ml-64 mt-16 h-[calc(100vh-4rem)] overflow-y-auto bg-gray-50 p-6">
        {/* This renders the currently selected dashboard section */}
        {/* Each page like DonorDashboard or NGODashboard passes its own section components here */}
        <ActiveComponent />
      </div>
    </>
  );
};

export default DashboardLayout;
