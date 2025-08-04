import React from 'react';
import { 
  InformationCircleIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';

const Contact = () => {

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section with Gradient */}
      <section className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-white p-4 rounded-full shadow-lg">
                <ChatBubbleLeftRightIcon className="h-10 w-10 text-primary-600" />
              </div>
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold mb-6 font-heading">
              Contact Us
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              We're here to help you on your health journey. Get in touch with our 
              team for any questions, appointments, or support you need.
            </p>
          </div>
        </div>
      </section>

      {/* Header - Hidden */}
      <div className="bg-white shadow-sm" style={{display: 'none'}}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-primary-600 p-3 rounded-full">
                <ChatBubbleLeftRightIcon className="h-8 w-8 text-white" />
              </div>
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4 font-heading">
              Contact Us
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We're here to help you on your health journey. Get in touch with our 
              team for any questions, appointments, or support you need.
            </p>
          </div>
        </div>
      </div>



      {/* Medical Emergency Section */}
      <section className="pb-16 pt-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-8">
            <div className="flex">
              <InformationCircleIcon className="h-8 w-8 text-red-600 mt-1 flex-shrink-0" />
              <div className="ml-4">
                <h3 className="text-2xl font-semibold text-red-800 mb-4">
                  Medical Emergency?
                </h3>
                <p className="text-red-700 mb-6 leading-relaxed">
                  For immediate medical emergencies, please call emergency services 
                  or visit the nearest hospital. Our clinic provides consultation 
                  and coordination services.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white rounded-lg p-4 text-center">
                    <p className="font-semibold text-red-800">Emergency Helpline</p>
                    <p className="text-2xl font-bold text-red-600">108</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 text-center">
                    <p className="font-semibold text-red-800">Police</p>
                    <p className="text-2xl font-bold text-red-600">100</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 text-center">
                    <p className="font-semibold text-red-800">Fire</p>
                    <p className="text-2xl font-bold text-red-600">101</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


    </div>
  );
};

export default Contact;
