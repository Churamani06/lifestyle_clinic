import React from 'react';
import { Link } from 'react-router-dom';
import { HeartIcon, MapPinIcon, PhoneIcon, EnvelopeIcon } from '@heroicons/react/24/outline';
import { useLanguage } from '../contexts/LanguageContext';

const Footer = () => {
  const { t } = useLanguage();
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-primary-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="bg-gradient-to-r from-primary-500 to-primary-600 p-2 rounded-lg shadow-lg">
                <HeartIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold font-heading">
                  {t('lifestyleClinicName')}
                </span>
                <div className="text-sm text-gray-400">{t('lifestyleClinicLocation')}</div>
              </div>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed mb-4">
              Transforming lives through holistic healthcare solutions. We provide 
              guidance for stress management, healthy lifestyle adoption, and 
              comprehensive medical care across various systems.
            </p>
            <div className="space-y-2 text-sm text-gray-300">
              <div className="flex items-center space-x-2">
                <MapPinIcon className="h-4 w-4" />
                <span>Raipur, Chhattisgarh, India</span>
              </div>
              <div className="flex items-center space-x-2">
                <PhoneIcon className="h-4 w-4" />
                <span>+91 9876543210</span>
              </div>
              <div className="flex items-center space-x-2">
                <EnvelopeIcon className="h-4 w-4" />
                <span>info@lifestyleclinic.gov.in</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 font-heading">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="text-gray-300 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-300 hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-gray-300 hover:text-white transition-colors">
                  Health Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4 font-heading">Our Services</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>Stress Management</li>
              <li>Lifestyle Guidance</li>
              <li>Ayurvedic Treatment</li>
              <li>Allopathic Care</li>
              <li>Homeopathic Medicine</li>
              <li>Naturopathy</li>
              <li>Yoga Programs</li>
              <li>Health Checkups</li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-8 pt-8 space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <div className="text-sm text-gray-400">
              {t('copyright')}
            </div>
            <div className="flex space-x-6 mt-4 sm:mt-0">
              <Link to="/privacy" className="text-sm text-gray-400 hover:text-white transition-colors">
                {t('privacyPolicy')}
              </Link>
              <Link to="/terms" className="text-sm text-gray-400 hover:text-white transition-colors">
                {t('termsOfService')}
              </Link>
            </div>
          </div>
          
          {/* Powered by Section */}
          <div className="text-center border-t border-gray-800 pt-4">
            <p className="text-base text-gray-500">
              {t('poweredBy')} <span className="text-primary-400 font-bold text-lg font-serif">SSIPMT Raipur</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
