import React, { useState, useEffect } from 'react';
import { 
  UserIcon, 
  ClipboardDocumentListIcon, 
  HeartIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XMarkIcon,
  EyeIcon
} from '@heroicons/react/24/outline';
import { useLanguage } from '../contexts/LanguageContext';

const Dashboard = () => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    fullName: '',
    fatherMotherName: '',
    age: '',
    gender: '',
    contact: '',
    completeAddress: '',
    medicalSystem: '',
    issue: '',
    symptoms: ''
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [selectedForm, setSelectedForm] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [submittedForms, setSubmittedForms] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch user's submitted forms on component mount
  useEffect(() => {
    fetchUserForms();
  }, []);

  const fetchUserForms = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) return;

      const response = await fetch('http://localhost:5000/api/health-forms', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      if (data.success) {
        setSubmittedForms(data.data.forms);
      }
    } catch (error) {
      console.error('Error fetching forms:', error);
    }
  };

  // Generate new form ID
  const generateFormId = () => {
    const formNumber = submittedForms.length + 1;
    return `FORM-${formNumber.toString().padStart(3, '0')}`;
  };

  // Get current date in format
  const getCurrentDate = () => {
    const now = new Date();
    return now.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const handleViewForm = (form) => {
    setSelectedForm(form);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedForm(null);
  };

  const getMedicalSystemLabel = (system) => {
    const systems = {
      ayurvedic: 'Ayurvedic Medicine',
      allopathic: 'Allopathic Medicine',
      homeopathic: 'Homeopathic Medicine',
      naturopathy: 'Naturopathy',
      any: 'Any Recommended'
    };
    return systems[system] || system;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('http://localhost:5000/api/health-forms', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          fullName: formData.fullName,
          fatherMotherName: formData.fatherMotherName,
          age: parseInt(formData.age),
          gender: formData.gender,
          contact: formData.contact,
          completeAddress: formData.completeAddress,
          medicalSystem: formData.medicalSystem,
          primaryIssue: formData.issue,
          symptoms: formData.symptoms
        })
      });

      const data = await response.json();
      
      if (data.success) {
        console.log('Health assessment form submitted:', data);
        setIsSubmitted(true);
        
        // Refresh the forms list
        await fetchUserForms();
        
        // Reset form
        setFormData({
          fullName: '',
          fatherMotherName: '',
          age: '',
          gender: '',
          contact: '',
          completeAddress: '',
          medicalSystem: '',
          issue: '',
          symptoms: ''
        });
        
        // Hide success message after 3 seconds
        setTimeout(() => {
          setIsSubmitted(false);
        }, 3000);
      } else {
        alert(data.message || 'Failed to submit form');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      alert('Network error. Please check if the backend server is running.');
    } finally {
      setLoading(false);
    }
  };

  const medicalSystems = [
    { value: 'ayurvedic', label: t('ayurvedicMedicine') },
    { value: 'allopathic', label: t('allopathicMedicine') },
    { value: 'homeopathic', label: t('homeopathicMedicine') },
    { value: 'naturopathy', label: t('naturopathy') },
    { value: 'any', label: t('anyRecommend') }
  ];

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-primary-50 flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full">
          <div className="card text-center">
            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircleIcon className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 font-heading">
              {t('formSubmittedSuccess')}
            </h2>
            <p className="text-gray-600 mb-6">
              {t('thankYouMessage')}
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <p className="text-sm text-blue-700">
                <strong>{t('whatsNext')}</strong><br />
                {t('reviewWithin24')}<br />
                {t('receiveCall')}<br />
                {t('prepareMedicalRecords')}
              </p>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <p className="text-sm text-green-700">
                <strong>Multiple Sessions:</strong> You can submit additional health assessment forms for different health concerns anytime.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center space-x-3">
            <div className="bg-primary-600 p-2 rounded-lg">
              <ClipboardDocumentListIcon className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 font-heading">
                {t('healthAssessmentForm')}
              </h1>
              <p className="text-gray-600">
                {t('healthAssessmentSubtitle')}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-2">
            <div className="card">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 font-heading flex items-center">
                    <UserIcon className="h-5 w-5 mr-2 text-primary-600" />
                    {t('personalInformation')}
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="fullName" className="label">
                        {t('fullName')} *
                      </label>
                      <input
                        id="fullName"
                        name="fullName"
                        type="text"
                        required
                        className="input-field"
                        placeholder={t('enterFullName')}
                        value={formData.fullName}
                        onChange={handleChange}
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="fatherMotherName" className="label">
                        {t('fatherMotherName')} *
                      </label>
                      <input
                        id="fatherMotherName"
                        name="fatherMotherName"
                        type="text"
                        required
                        className="input-field"
                        placeholder={t('enterFatherMotherName')}
                        value={formData.fatherMotherName}
                        onChange={handleChange}
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="age" className="label">
                        {t('age')} *
                      </label>
                      <input
                        id="age"
                        name="age"
                        type="number"
                        min="1"
                        max="120"
                        required
                        className="input-field"
                        placeholder={t('enterAge')}
                        value={formData.age}
                        onChange={handleChange}
                      />
                    </div>

                    <div>
                      <label htmlFor="gender" className="label">
                        {t('gender')} *
                      </label>
                      <select
                        id="gender"
                        name="gender"
                        required
                        className="input-field"
                        value={formData.gender}
                        onChange={handleChange}
                      >
                        <option value="">{t('selectGender')}</option>
                        <option value="male">{t('male')}</option>
                        <option value="female">{t('female')}</option>
                        <option value="other">{t('other')}</option>
                        <option value="prefer-not-to-say">{t('preferNotToSay')}</option>
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="contact" className="label">
                      {t('contactNumber')} *
                    </label>
                    <input
                      id="contact"
                      name="contact"
                      type="tel"
                      required
                      className="input-field"
                      placeholder={t('enterContact')}
                      value={formData.contact}
                      onChange={handleChange}
                    />
                  </div>

                  <div>
                    <label htmlFor="completeAddress" className="label">
                      {t('completeAddress')} *
                    </label>
                    <textarea
                      id="completeAddress"
                      name="completeAddress"
                      rows={3}
                      required
                      className="input-field"
                      placeholder={t('enterAddress')}
                      value={formData.completeAddress}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                {/* Medical Preferences */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 font-heading flex items-center">
                    <HeartIcon className="h-5 w-5 mr-2 text-primary-600" />
                    {t('medicalPreferences')}
                  </h3>
                  
                  <div>
                    <label htmlFor="medicalSystem" className="label">
                      {t('preferredMedicalSystem')} *
                    </label>
                    <select
                      id="medicalSystem"
                      name="medicalSystem"
                      required
                      className="input-field"
                      value={formData.medicalSystem}
                      onChange={handleChange}
                    >
                      <option value="">{t('selectMedicalSystem')}</option>
                      {medicalSystems.map((system) => (
                        <option key={system.value} value={system.value}>
                          {system.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Health Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 font-heading">
                    {t('healthInformation')}
                  </h3>
                  
                  <div>
                    <label htmlFor="issue" className="label">
                      {t('primaryHealthConcern')} *
                    </label>
                    <textarea
                      id="issue"
                      name="issue"
                      rows={4}
                      required
                      className="input-field"
                      placeholder={t('describeHealthConcern')}
                      value={formData.issue}
                      onChange={handleChange}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="symptoms" className="label">
                      {t('currentSymptoms')}
                    </label>
                    <textarea
                      id="symptoms"
                      name="symptoms"
                      rows={3}
                      className="input-field"
                      placeholder={t('describeSymptoms')}
                      value={formData.symptoms}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="btn-primary px-8 py-3"
                  >
                    {t('submitHealthForm')}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Info */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 font-heading">
                {t('quickInformation')}
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-start space-x-2">
                  <CheckCircleIcon className="h-4 w-4 text-green-500 mt-0.5" />
                  <span className="text-gray-600">
                    {t('formReview24')}
                  </span>
                </div>
                <div className="flex items-start space-x-2">
                  <CheckCircleIcon className="h-4 w-4 text-green-500 mt-0.5" />
                  <span className="text-gray-600">
                    {t('freeConsultation')}
                  </span>
                </div>
                <div className="flex items-start space-x-2">
                  <CheckCircleIcon className="h-4 w-4 text-green-500 mt-0.5" />
                  <span className="text-gray-600">
                    {t('multipleMedicalSystems')}
                  </span>
                </div>
                <div className="flex items-start space-x-2">
                  <CheckCircleIcon className="h-4 w-4 text-green-500 mt-0.5" />
                  <span className="text-gray-600">
                    {t('expertProfessionals')}
                  </span>
                </div>
              </div>
            </div>

            {/* Important Notice */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex">
                <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div className="ml-3">
                  <h3 className="text-sm font-semibold text-yellow-800">
                    {t('importantNotice')}
                  </h3>
                  <p className="text-xs text-yellow-700 mt-1">
                    {t('emergencyNotice')}
                  </p>
                </div>
              </div>
            </div>

            {/* Contact Support */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-3 font-heading">
                {t('needHelp')}
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                {t('assistanceMessage')}
              </p>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-medium text-gray-800">{t('phone')}:</span>
                  <span className="text-gray-600 ml-2">+91 9876543210</span>
                </div>
                <div>
                  <span className="font-medium text-gray-800">{t('email')}:</span>
                  <span className="text-gray-600 ml-2">help@lifestyleclinic.gov.in</span>
                </div>
                <div>
                  <span className="font-medium text-gray-800">{t('hours')}:</span>
                  <span className="text-gray-600 ml-2">9 AM - 6 PM, Mon-Sat</span>
                </div>
              </div>
            </div>

            {/* Add New Assessment */}
            <div className="bg-gradient-to-r from-primary-50 to-blue-50 border border-primary-200 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-primary-900 mb-1">
                    Need Another Assessment?
                  </h4>
                  <p className="text-xs text-primary-700">
                    Submit multiple forms for different health concerns or follow-up sessions.
                  </p>
                </div>
                <button
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center space-x-2"
                >
                  <ClipboardDocumentListIcon className="h-4 w-4" />
                  <span>Add New</span>
                </button>
              </div>
            </div>

            {/* User Submitted Details */}
            <div className="card">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-gray-900 font-heading flex items-center">
                  <ClipboardDocumentListIcon className="h-5 w-5 mr-2 text-primary-600" />
                  Submitted Forms ({submittedForms.length})
                </h3>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                View your previously submitted health assessment forms. Each form represents a separate health session.
              </p>
              
              {/* Dynamic submitted forms */}
              <div className="space-y-3">
                {submittedForms.length === 0 ? (
                  <div className="text-center py-8">
                    <ClipboardDocumentListIcon className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-sm text-gray-500 mb-2">No forms submitted yet</p>
                    <p className="text-xs text-gray-400">Your submitted health assessment forms will appear here</p>
                  </div>
                ) : (
                  submittedForms.map((form, index) => (
                    <div key={form.form_id} className="bg-gray-50 border border-gray-200 rounded-lg p-3 hover:bg-gray-100 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="text-sm font-medium text-gray-900 truncate">{form.form_id}</span>
                            {index === submittedForms.length - 1 && (
                              <span className="text-xs bg-green-100 text-green-600 px-2 py-0.5 rounded-full">
                                Latest
                              </span>
                            )}
                          </div>
                          <div className="space-y-1">
                            <p className="text-xs text-gray-600">
                              <span className="font-medium">Submitted:</span> {new Date(form.submitted_date).toLocaleDateString()}
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                              <span className="font-medium">Type:</span> {getMedicalSystemLabel(form.medical_system)}
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                              <span className="font-medium">Status:</span> {form.form_status}
                            </p>
                          </div>
                        </div>
                        <div className="flex-shrink-0 ml-3">
                          <button 
                            onClick={() => handleViewForm(form)}
                            className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center space-x-1 hover:bg-primary-50 px-3 py-2 rounded-md transition-colors border border-transparent hover:border-primary-200"
                          >
                            <EyeIcon className="h-4 w-4" />
                            <span>View</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-gray-200">
                <button className="w-full text-center text-primary-600 hover:text-primary-700 text-sm font-medium py-2 px-4 rounded-md hover:bg-primary-50 transition-colors">
                  View All Submissions →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal for viewing form details */}
      {showModal && selectedForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-gray-200">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 font-heading">
                  Form Details - {selectedForm.id}
                </h3>
                <div className="flex items-center space-x-2 mt-1">
                  <span className="text-sm text-gray-500">Submitted: {selectedForm.submittedDate}</span>
                </div>
              </div>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="py-4 max-h-96 overflow-y-auto">
              <div className="space-y-6">
                {/* Personal Information */}
                <div>
                  <h4 className="text-md font-semibold text-gray-900 mb-3 flex items-center">
                    <UserIcon className="h-5 w-5 mr-2 text-primary-600" />
                    Personal Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Full Name</label>
                      <p className="text-sm text-gray-900">{selectedForm.full_name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Father/Mother Name</label>
                      <p className="text-sm text-gray-900">{selectedForm.father_mother_name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Age</label>
                      <p className="text-sm text-gray-900">{selectedForm.age} years</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Gender</label>
                      <p className="text-sm text-gray-900">{selectedForm.gender}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Contact Number</label>
                      <p className="text-sm text-gray-900">{selectedForm.contact}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Medical System Preference</label>
                      <p className="text-sm text-gray-900">{getMedicalSystemLabel(selectedForm.medical_system)}</p>
                    </div>
                  </div>
                </div>

                {/* Address */}
                <div>
                  <h4 className="text-md font-semibold text-gray-900 mb-3">Complete Address</h4>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-900">{selectedForm.complete_address}</p>
                  </div>
                </div>

                {/* Health Information */}
                <div>
                  <h4 className="text-md font-semibold text-gray-900 mb-3 flex items-center">
                    <HeartIcon className="h-5 w-5 mr-2 text-red-500" />
                    Health Information
                  </h4>
                  <div className="space-y-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <label className="text-sm font-medium text-gray-700">Main Health Issue</label>
                      <p className="text-sm text-gray-900 mt-1">{selectedForm.primary_issue}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <label className="text-sm font-medium text-gray-700">Symptoms Description</label>
                      <p className="text-sm text-gray-900 mt-1">{selectedForm.symptoms}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end pt-4 border-t border-gray-200 space-x-3">
              <button
                onClick={closeModal}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
              >
                Close
              </button>
              <button className="px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-md transition-colors">
                Download PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
