import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  UserGroupIcon, 
  DocumentTextIcon, 
  ChartBarIcon,
  ArrowRightOnRectangleIcon,
  CogIcon,
  CalendarIcon,
  ExclamationCircleIcon,
  HomeIcon,
  EyeIcon
} from '@heroicons/react/24/outline';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [adminUsername, setAdminUsername] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedMonth, setSelectedMonth] = useState('all');
  const [selectedYear, setSelectedYear] = useState('2024');
  const [dashboardStats, setDashboardStats] = useState(null);
  const [healthRecords, setHealthRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if admin is logged in
    const adminToken = localStorage.getItem('adminToken');
    const adminData = localStorage.getItem('adminData');
    
    if (!adminToken || !adminData) {
      navigate('/admin');
      return;
    }
    
    const admin = JSON.parse(adminData);
    setAdminUsername(admin.username || 'Admin');
    
    // Fetch dashboard data
    fetchDashboardData();
    fetchHealthRecords();
  }, [navigate]);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('http://localhost:5000/api/admin/dashboard/statistics', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      if (data.success) {
        setDashboardStats(data.data);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchHealthRecords = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`http://localhost:5000/api/admin/health-forms?month=${selectedMonth}&year=${selectedYear}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      if (data.success) {
        setHealthRecords(data.data.forms);
      }
    } catch (error) {
      console.error('Error fetching health records:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminData');
    navigate('/admin');
  };

  const tabs = [
    {
      id: 'dashboard',
      name: 'Dashboard',
      icon: HomeIcon,
      current: activeTab === 'dashboard'
    },
    {
      id: 'records',
      name: 'View Records',
      icon: EyeIcon,
      current: activeTab === 'records'
    }
  ];

  const dashboardCards = [
    {
      title: 'Total Users',
      value: dashboardStats?.totalUsers || '0',
      icon: UserGroupIcon,
      bgColor: 'bg-blue-500',
      textColor: 'text-blue-600',
      bgLight: 'bg-blue-50'
    },
    {
      title: 'Total Health Form Submitted',
      value: dashboardStats?.totalHealthForms || '0',
      icon: DocumentTextIcon,
      bgColor: 'bg-green-500',
      textColor: 'text-green-600',
      bgLight: 'bg-green-50'
    },
    {
      title: 'Recent Submissions',
      value: dashboardStats?.recentSubmissions || '0',
      icon: CalendarIcon,
      bgColor: 'bg-purple-500',
      textColor: 'text-purple-600',
      bgLight: 'bg-purple-50'
    },
    {
      title: 'Active Users',
      value: dashboardStats?.activeUsers || '0',
      icon: ChartBarIcon,
      bgColor: 'bg-orange-500',
      textColor: 'text-orange-600',
      bgLight: 'bg-orange-50'
    }
  ];

  // Update health records when filters change
  useEffect(() => {
    fetchHealthRecords();
  }, [selectedMonth, selectedYear]);

  const months = [
    { value: 'all', label: 'All Months' },
    { value: '01', label: 'January' },
    { value: '02', label: 'February' },
    { value: '03', label: 'March' },
    { value: '04', label: 'April' },
    { value: '05', label: 'May' },
    { value: '06', label: 'June' },
    { value: '07', label: 'July' },
    { value: '08', label: 'August' },
    { value: '09', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' }
  ];

  const years = ['2024', '2023', '2022'];

  // Filter health records based on selected month and year
  const getFilteredRecords = () => {
    if (selectedMonth === 'all') return healthRecords;
    
    return healthRecords.filter(record => {
      const recordDate = new Date(record.submittedAt);
      const recordMonth = String(recordDate.getMonth() + 1).padStart(2, '0');
      const recordYear = String(recordDate.getFullYear());
      
      return recordMonth === selectedMonth && recordYear === selectedYear;
    });
  };

  const filteredRecords = getFilteredRecords();

  const renderDashboard = () => (
    <>
      {/* Demo Notice */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8">
        <div className="flex items-center">
          <ExclamationCircleIcon className="h-5 w-5 text-yellow-400 mr-2" />
          <span className="text-sm text-yellow-800">
            <strong>Demo Mode:</strong> This is a demonstration of the admin dashboard. All data shown is simulated for testing purposes.
          </span>
        </div>
      </div>

      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {dashboardCards.map((card, index) => (
          <div key={index} className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-6">
              <div className="flex items-center">
                <div className={`flex-shrink-0 ${card.bgLight} rounded-md p-3`}>
                  <card.icon className={`h-6 w-6 ${card.textColor}`} />
                </div>
                <div className="ml-4 w-0 flex-1">
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    {card.title}
                  </dt>
                  <dd className="text-2xl font-bold text-gray-900">
                    {card.value}
                  </dd>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activities */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Recent Activities
            </h3>
          </div>
          <div className="p-6">
            <p className="text-sm text-gray-500 text-center py-8">
              Activity tracking feature will be available soon.
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Monthly Analytics
            </h3>
          </div>
          <div className="p-6">
            <p className="text-sm text-gray-500 text-center py-8">
              Analytics charts will be available soon with real-time data.
            </p>

            {/* Health Assessment Filter */}
            <div className="border-t border-gray-200 pt-6">
              <h4 className="text-sm font-medium text-gray-700 mb-4">Health Assessment Filter</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Month</label>
                  <select
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    {months.map(month => (
                      <option key={month.value} value={month.value}>{month.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
                  <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    {years.map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              {/* Filter Results */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Filtered Results</p>
                    <p className="text-2xl font-bold text-gray-900">{filteredRecords.length}</p>
                    <p className="text-xs text-gray-500">
                      {selectedMonth === 'all' ? 'All months' : months.find(m => m.value === selectedMonth)?.label} {selectedYear}
                    </p>
                  </div>
                  <button 
                    onClick={() => setActiveTab('records')}
                    className="btn-primary px-4 py-2 text-sm rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    <EyeIcon className="h-4 w-4 inline mr-1" />
                    View Details
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );

  const renderRecords = () => (
    <div className="bg-white shadow rounded-lg">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Health Records ({filteredRecords.length})
          </h3>
          <div className="flex items-center space-x-4">
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              {months.map(month => (
                <option key={month.value} value={month.value}>{month.label}</option>
              ))}
            </select>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              {years.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
      <div className="p-6">
        {filteredRecords.length === 0 ? (
          <div className="text-center py-8">
            <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No health records</h3>
            <p className="mt-1 text-sm text-gray-500">
              {selectedMonth === 'all' 
                ? 'No health assessment forms have been submitted yet.' 
                : `No health assessment forms submitted in ${months.find(m => m.value === selectedMonth)?.label} ${selectedYear}.`
              }
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredRecords.map((record, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="text-lg font-medium text-gray-900">
                      {record.details.fullName}
                    </h4>
                    <p className="text-sm text-gray-600">
                      Age: {record.details.age} | Gender: {record.details.gender}
                    </p>
                    <p className="text-sm text-gray-600">
                      Email: {record.details.email}
                    </p>
                    <p className="text-sm text-gray-600">
                      Phone: {record.details.phone}
                    </p>
                    <p className="text-sm text-gray-500">
                      Submitted: {new Date(record.submittedAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="ml-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Submitted
                    </span>
                  </div>
                </div>
                
                {/* Health Information */}
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Height:</span> {record.details.height} cm
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Weight:</span> {record.details.weight} kg
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Blood Group:</span> {record.details.bloodGroup}
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Medical History:</span> {record.details.medicalHistory || 'None'}
                  </div>
                </div>

                {/* Current Health Issues */}
                {record.details.currentIssues && (
                  <div className="mt-3">
                    <span className="font-medium text-gray-700">Current Health Issues:</span>
                    <p className="text-sm text-gray-600 mt-1">{record.details.currentIssues}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 font-heading">
                Admin Dashboard
              </h1>
              <p className="text-sm text-gray-600">
                Lifestyle Clinic - Government of Chhattisgarh
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">
                Welcome, <span className="font-medium">{adminUsername}</span>
              </span>
              <button
                onClick={handleLogout}
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <ArrowRightOnRectangleIcon className="h-4 w-4 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Tab Navigation Bar */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors duration-200 ${
                  tab.current
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className={`h-5 w-5 ${tab.current ? 'text-primary-600' : 'text-gray-400'}`} />
                <span>{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'dashboard' && renderDashboard()}
        {activeTab === 'records' && renderRecords()}
      </main>
    </div>
  );
};

export default AdminDashboard;
