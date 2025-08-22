import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  UserGroupIcon, 
  DocumentTextIcon, 
  ChartBarIcon,
  ArrowRightOnRectangleIcon,
  CogIcon,
  CalendarIcon,
  HomeIcon,
  EyeIcon
} from '@heroicons/react/24/outline';
import { adminAPI } from '../config/api';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [adminUsername, setAdminUsername] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedMonth, setSelectedMonth] = useState('all');
  const [selectedYear, setSelectedYear] = useState('all');
  const [dashboardStats, setDashboardStats] = useState(null);
  const [healthRecords, setHealthRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [recordsLoading, setRecordsLoading] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [recentActivities, setRecentActivities] = useState([]);
  const [monthlyAnalytics, setMonthlyAnalytics] = useState(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);

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
    fetchRecentActivities();
    fetchMonthlyAnalytics();
  }, [navigate]);

  const fetchDashboardData = async () => {
    try {
      const data = await adminAPI.getDashboardStats();
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
      setRecordsLoading(true);
      const params = {};
      if (selectedMonth !== 'all') params.month = selectedMonth;
      if (selectedYear !== 'all') params.year = selectedYear;
      
      console.log('Fetching health records with params:', params);
      const data = await adminAPI.getHealthForms(params);
      console.log('Health records response:', data);
      
      if (data.success) {
        console.log('✅ API Success - Setting health records:', data.data.forms || []);
        setHealthRecords(data.data.forms || []);
        console.log('✅ State updated with records count:', (data.data.forms || []).length);
      } else {
        console.error('❌ API returned success=false:', data);
        setHealthRecords([]);
      }
    } catch (error) {
      console.error('Error fetching health records:', error);
      setHealthRecords([]);
    } finally {
      setRecordsLoading(false);
    }
  };

  const fetchRecentActivities = async () => {
    try {
      // Fetch recent health form submissions (last 10)
      const data = await adminAPI.getHealthForms({ limit: 10, page: 1 });
      if (data.success) {
        const activities = data.data.forms.map(form => ({
          id: form.id,
          type: 'Health Form Submission',
          description: `${form.full_name} submitted a health assessment form`,
          time: new Date(form.submitted_date),
          status: form.status,
          icon: 'DocumentTextIcon',
          details: {
            formId: form.form_id,
            medicalSystem: form.medical_system,
            primaryIssue: form.primary_issue?.substring(0, 50) + '...'
          }
        }));
        setRecentActivities(activities);
      }
    } catch (error) {
      console.error('Error fetching recent activities:', error);
      setRecentActivities([]);
    }
  };

  const fetchMonthlyAnalytics = async () => {
    try {
      setAnalyticsLoading(true);
      const currentYear = new Date().getFullYear();
      const response = await adminAPI.getMonthlyData(currentYear);
      
      if (response.success) {
        // Create complete 12-month data
        const monthNames = [
          'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
          'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
        ];
        
        const completeData = monthNames.map((monthName, index) => {
          const monthNumber = index + 1;
          const existingData = response.data.monthlyData.find(item => item.month === monthNumber);
          return {
            month: monthName,
            submissions: existingData ? existingData.submissions : 0,
            uniqueUsers: existingData ? existingData.uniqueUsers : 0
          };
        });
        
        setMonthlyAnalytics({
          year: currentYear,
          data: completeData,
          totalSubmissions: completeData.reduce((sum, month) => sum + month.submissions, 0),
          totalUsers: Math.max(...completeData.map(month => month.uniqueUsers)),
          avgPerMonth: Math.round(completeData.reduce((sum, month) => sum + month.submissions, 0) / 12)
        });
      }
    } catch (error) {
      console.error('Error fetching monthly analytics:', error);
      setMonthlyAnalytics(null);
    } finally {
      setAnalyticsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminData');
    navigate('/admin');
  };

  const handleDeleteRecord = async (recordId, formId) => {
    if (!window.confirm(`Are you sure you want to delete health record ${formId}? This action cannot be undone.`)) {
      return;
    }

    try {
      const response = await adminAPI.deleteHealthForm(recordId);
      
      if (response.success) {
        // Remove the deleted record from the local state
        setHealthRecords(prevRecords => prevRecords.filter(record => record.id !== recordId));
        
        // Close modal if the deleted record was being viewed
        if (selectedRecord && selectedRecord.id === recordId) {
          setSelectedRecord(null);
        }
        
        // Show success message
        alert('Health record deleted successfully');
        
        // Refresh dashboard stats
        fetchDashboardData();
      } else {
        alert('Failed to delete health record: ' + response.message);
      }
    } catch (error) {
      console.error('Error deleting health record:', error);
      alert('Failed to delete health record. Please try again.');
    }
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
    }
  ];

  // Update health records when filters change with debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchHealthRecords();
    }, 300); // 300ms debounce

    return () => clearTimeout(timeoutId);
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

  const years = [
    { value: 'all', label: 'All Years' },
    { value: '2025', label: '2025' },
    { value: '2024', label: '2024' },
    { value: '2023', label: '2023' },
    { value: '2022', label: '2022' }
  ];

  // Filter health records based on selected month and year - now handled by backend
  const filteredRecords = healthRecords;
  console.log('🔍 Render state - healthRecords:', healthRecords.length, 'filteredRecords:', filteredRecords.length, 'recordsLoading:', recordsLoading);

  // Modal component for viewing full record details
  const RecordModal = ({ record, onClose }) => {
    if (!record) return null;

    return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
        <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
          <div className="mt-3">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                Health Record Details - {record.form_id}
              </h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
            
            <div className="space-y-4">
              {/* Personal Information */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Personal Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div><span className="font-medium">Name:</span> {record.full_name}</div>
                  <div><span className="font-medium">Father/Mother:</span> {record.father_mother_name}</div>
                  <div><span className="font-medium">Age:</span> {record.age} years</div>
                  <div><span className="font-medium">Gender:</span> {record.gender}</div>
                  <div><span className="font-medium">Contact:</span> {record.contact}</div>
                  <div><span className="font-medium">Email:</span> {record.email || 'N/A'}</div>
                </div>
                <div className="mt-2">
                  <span className="font-medium">Address:</span> {record.complete_address}
                </div>
              </div>

              {/* Medical Information */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Medical Information</h4>
                <div className="space-y-2 text-sm">
                  <div><span className="font-medium">Preferred Medical System:</span> 
                    <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 capitalize">
                      {record.medical_system}
                    </span>
                  </div>
                  <div><span className="font-medium">Primary Health Issue:</span></div>
                  <div className="bg-white p-3 rounded border">{record.primary_issue}</div>
                  
                  {record.symptoms && (
                    <>
                      <div><span className="font-medium">Symptoms:</span></div>
                      <div className="bg-white p-3 rounded border">{record.symptoms}</div>
                    </>
                  )}
                </div>
              </div>

              {/* Status and Dates */}
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Status & Timeline</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Status:</span> 
                    <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      record.status === 'submitted' ? 'bg-blue-100 text-blue-800' :
                      record.status === 'reviewed' ? 'bg-yellow-100 text-yellow-800' :
                      record.status === 'consultation_scheduled' ? 'bg-purple-100 text-purple-800' :
                      record.status === 'completed' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {record.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                  <div><span className="font-medium">Submitted:</span> {new Date(record.submitted_date).toLocaleString()}</div>
                  {record.consultation_date && (
                    <div><span className="font-medium">Consultation:</span> {new Date(record.consultation_date).toLocaleString()}</div>
                  )}
                  {record.updated_at && (
                    <div><span className="font-medium">Last Updated:</span> {new Date(record.updated_at).toLocaleString()}</div>
                  )}
                </div>
              </div>

              {/* Admin Notes */}
              {record.admin_notes && (
                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                  <h4 className="font-medium text-gray-900 mb-2">Admin Notes</h4>
                  <div className="text-sm">{record.admin_notes}</div>
                </div>
              )}
            </div>

            <div className="flex justify-end mt-6 space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderDashboard = () => (
    <>
      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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
            <div className="flex justify-between items-center">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Recent Activities
              </h3>
              <button
                onClick={fetchRecentActivities}
                className="text-sm text-primary-600 hover:text-primary-800"
              >
                Refresh
              </button>
            </div>
          </div>
          <div className="p-6">
            {recentActivities.length === 0 ? (
              <div className="text-center py-8">
                <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2 text-sm text-gray-500">No recent activities found</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentActivities.slice(0, 5).map((activity, index) => (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <DocumentTextIcon className="w-4 h-4 text-blue-600" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-gray-900">
                        {activity.description}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        Form ID: {activity.details.formId} • {activity.details.medicalSystem}
                      </div>
                      <div className="flex items-center mt-2 space-x-2">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                          activity.status === 'submitted' ? 'bg-blue-100 text-blue-800' :
                          activity.status === 'reviewed' ? 'bg-yellow-100 text-yellow-800' :
                          activity.status === 'completed' ? 'bg-green-100 text-green-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {activity.status.replace('_', ' ').toUpperCase()}
                        </span>
                        <span className="text-xs text-gray-500">
                          {activity.time.toLocaleDateString()} at {activity.time.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
                {recentActivities.length > 5 && (
                  <div className="text-center pt-4 border-t border-gray-200">
                    <button
                      onClick={() => setActiveTab('records')}
                      className="text-sm text-primary-600 hover:text-primary-800"
                    >
                      View all activities →
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Monthly Analytics */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Monthly Analytics
              </h3>
              <button
                onClick={fetchMonthlyAnalytics}
                className="text-sm text-primary-600 hover:text-primary-800"
                disabled={analyticsLoading}
              >
                {analyticsLoading ? 'Loading...' : 'Refresh'}
              </button>
            </div>
          </div>
          <div className="p-6">
            {analyticsLoading ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                <p className="mt-2 text-sm text-gray-500">Loading analytics...</p>
              </div>
            ) : monthlyAnalytics ? (
              <div className="space-y-6">
                {/* Summary Stats */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">{monthlyAnalytics.totalSubmissions}</div>
                    <div className="text-xs text-gray-500">Total Submissions ({monthlyAnalytics.year})</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">{monthlyAnalytics.totalUsers}</div>
                    <div className="text-xs text-gray-500">Peak Monthly Users</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">{monthlyAnalytics.avgPerMonth}</div>
                    <div className="text-xs text-gray-500">Avg Per Month</div>
                  </div>
                </div>

                {/* Simple Bar Chart */}
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-gray-700">Monthly Submissions</h4>
                  <div className="space-y-2">
                    {monthlyAnalytics.data.map((month, index) => {
                      const maxSubmissions = Math.max(...monthlyAnalytics.data.map(m => m.submissions));
                      const widthPercentage = maxSubmissions > 0 ? (month.submissions / maxSubmissions) * 100 : 0;
                      
                      return (
                        <div key={index} className="flex items-center space-x-3">
                          <div className="w-8 text-xs text-gray-600 font-medium">{month.month}</div>
                          <div className="flex-1 bg-gray-200 rounded-full h-4 relative">
                            <div
                              className="bg-primary-500 h-4 rounded-full transition-all duration-500"
                              style={{ width: `${widthPercentage}%` }}
                            ></div>
                            <div className="absolute inset-0 flex items-center justify-center">
                              <span className="text-xs font-medium text-gray-700">
                                {month.submissions > 0 ? month.submissions : ''}
                              </span>
                            </div>
                          </div>
                          <div className="w-12 text-xs text-gray-500">{month.uniqueUsers}u</div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="text-xs text-gray-500 text-center">
                    Showing data for {monthlyAnalytics.year} • 'u' indicates unique users
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <ChartBarIcon className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2 text-sm text-gray-500">No analytics data available</p>
                <button
                  onClick={fetchMonthlyAnalytics}
                  className="mt-2 text-sm text-primary-600 hover:text-primary-800"
                >
                  Try loading again
                </button>
              </div>
            )}

            {/* Health Assessment Filter */}
            <div className="border-t border-gray-200 pt-6 mt-6">
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
                      <option key={year.value} value={year.value}>{year.label}</option>
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
              disabled={recordsLoading}
            >
              {months.map(month => (
                <option key={month.value} value={month.value}>{month.label}</option>
              ))}
            </select>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              disabled={recordsLoading}
            >
              {years.map(year => (
                <option key={year.value} value={year.value}>{year.label}</option>
              ))}
            </select>
            {(selectedMonth !== 'all' || selectedYear !== 'all') && (
              <button
                onClick={() => {
                  setSelectedMonth('all');
                  setSelectedYear('all');
                }}
                className="text-sm text-gray-600 hover:text-gray-800 underline"
                disabled={recordsLoading}
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>
      </div>
      <div className="p-6">
        {/* Summary Bar */}
        <div className="mb-4 bg-gray-50 p-4 rounded-lg">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                <span className="font-medium text-gray-900">{filteredRecords.length}</span> records found
                {selectedMonth !== 'all' && (
                  <span className="ml-2 text-gray-500">
                    • Filtered by {months.find(m => m.value === selectedMonth)?.label} {selectedYear}
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button className="text-sm bg-white border border-gray-300 rounded px-3 py-1 hover:bg-gray-50">
                Export CSV
              </button>
              <button className="text-sm bg-white border border-gray-300 rounded px-3 py-1 hover:bg-gray-50">
                Print
              </button>
            </div>
          </div>
        </div>

        {recordsLoading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            <p className="mt-2 text-sm text-gray-500">Loading health records...</p>
          </div>
        ) : filteredRecords.length === 0 ? (
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
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Form ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Patient Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact Info
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Medical System
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Primary Issue
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Submitted Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredRecords.map((record, index) => (
                  <tr key={record.id || index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-blue-600">
                        {record.form_id}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <div className="font-medium text-gray-900">{record.full_name}</div>
                        <div className="text-gray-500">
                          {record.age} years, {record.gender}
                        </div>
                        <div className="text-gray-500 text-xs">
                          Father/Mother: {record.father_mother_name}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <div className="text-gray-900">{record.contact}</div>
                        <div className="text-gray-500">{record.email || 'N/A'}</div>
                        <div className="text-gray-500 text-xs max-w-xs truncate" title={record.complete_address}>
                          {record.complete_address}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 capitalize">
                        {record.medical_system}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-xs">
                        <div className="truncate" title={record.primary_issue}>
                          {record.primary_issue}
                        </div>
                        {record.symptoms && (
                          <div className="text-gray-500 text-xs mt-1 truncate" title={record.symptoms}>
                            Symptoms: {record.symptoms}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        record.status === 'submitted' ? 'bg-blue-100 text-blue-800' :
                        record.status === 'reviewed' ? 'bg-yellow-100 text-yellow-800' :
                        record.status === 'consultation_scheduled' ? 'bg-purple-100 text-purple-800' :
                        record.status === 'completed' ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {record.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(record.submitted_date).toLocaleDateString()}
                      <div className="text-xs">
                        {new Date(record.submitted_date).toLocaleTimeString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => setSelectedRecord(record)}
                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                      >
                        View
                      </button>
                      <button
                        onClick={() => handleDeleteRecord(record.id, record.form_id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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

      {/* Record Details Modal */}
      {selectedRecord && (
        <RecordModal 
          record={selectedRecord} 
          onClose={() => setSelectedRecord(null)} 
        />
      )}
    </div>
  );
};

export default AdminDashboard;
