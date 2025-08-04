import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LockClosedIcon, UserIcon, ExclamationTriangleIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

const Admin = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [loginStatus, setLoginStatus] = useState(null); // null, 'success', 'error'
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear any previous login status when user starts typing
    if (loginStatus) {
      setLoginStatus(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setLoginStatus(null);

    try {
      const response = await fetch('http://localhost:5000/api/admin-auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password
        })
      });

      const data = await response.json();

      if (data.success) {
        setLoginStatus('success');
        
        // Store admin token and data
        localStorage.setItem('adminToken', data.data.token);
        localStorage.setItem('adminData', JSON.stringify(data.data.admin));
        
        // Redirect to admin dashboard after a brief success display
        setTimeout(() => {
          navigate('/admin/dashboard');
        }, 1500);
      } else {
        setLoginStatus('error');
      }
    } catch (error) {
      console.error('Admin login error:', error);
      setLoginStatus('error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="absolute inset-0 bg-black opacity-10"></div>
      <div className="relative max-w-md w-full space-y-8">
        <div>
          <div className="mx-auto h-12 w-12 bg-white rounded-full flex items-center justify-center shadow-lg">
            <LockClosedIcon className="h-6 w-6 text-primary-600" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-bold text-white font-heading">
            Administrative Login
          </h2>
          <p className="mt-2 text-center text-sm text-blue-100">
            Lifestyle Clinic - Raipur, Chhattisgarh
          </p>
          <p className="text-center text-xs text-blue-200">
            Government of Chhattisgarh Health Initiative
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {/* Login Status Messages */}
          {loginStatus === 'error' && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg flex items-center">
              <ExclamationTriangleIcon className="h-5 w-5 mr-2" />
              <span className="text-sm">Invalid username or password. Please try again.</span>
            </div>
          )}
          
          {loginStatus === 'success' && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg flex items-center">
              <CheckCircleIcon className="h-5 w-5 mr-2" />
              <span className="text-sm">Login successful! Redirecting to dashboard...</span>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-white mb-1">
                Administrator Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <UserIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  className="input-field pl-10"
                  placeholder="Enter admin username"
                  value={formData.username}
                  onChange={handleChange}
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-white mb-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LockClosedIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="input-field pl-10"
                  placeholder="Enter password"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white transition-all duration-200 ${
                isLoading 
                  ? 'bg-blue-400 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
              }`}
            >
              {isLoading ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </div>
              ) : (
                'Sign in to Administration Panel'
              )}
            </button>
          </div>

          <div className="text-center">
            <a href="#" className="text-sm text-blue-600 hover:text-blue-800">
              Forgot your password?
            </a>
          </div>
        </form>

        <div className="mt-6 text-center">
          <div className="text-xs text-white space-y-1">
            <p>For technical support, contact:</p>
            <p>IT Department - Government of Chhattisgarh</p>
            <p>Email: support@cghealth.gov.in</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
