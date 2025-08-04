import React from 'react';

const AdminLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* This layout can be expanded in the future for admin-specific navigation and sidebar */}
      <div className="w-full">
        {children}
      </div>
    </div>
  );
};

export default AdminLayout;
