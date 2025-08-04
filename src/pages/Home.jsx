import React from 'react';
import { Link } from 'react-router-dom';
import { 
  HeartIcon, 
  UserGroupIcon, 
  AcademicCapIcon, 
  ClipboardDocumentCheckIcon,
  ArrowRightIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import { useLanguage } from '../contexts/LanguageContext';

const Home = () => {
  const { t } = useLanguage();
  const features = [
    {
      icon: HeartIcon,
      title: 'Holistic Healthcare',
      description: 'Comprehensive care across Ayurvedic, Allopathic, Homeopathic, and Naturopathy systems.'
    },
    {
      icon: UserGroupIcon,
      title: 'Expert Guidance',
      description: 'Professional consultation for stress management and healthy lifestyle adoption.'
    },
    {
      icon: AcademicCapIcon,
      title: 'Health Education',
      description: 'Educational resources and guidance about various medical systems and wellness practices.'
    },
    {
      icon: ClipboardDocumentCheckIcon,
      title: 'Health Checkups',
      description: 'Complete body health assessments and wellness evaluations.'
    }
  ];

  const objectives = [
    'Bring lifestyle changes in fast-paced lives',
    'Provide stress management guidance',
    'Spread awareness about medical systems',
    'Guide appropriate treatment coordination',
    'Offer yoga and health checkup services',
    'Provide comprehensive wellness support'
  ];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="text-primary-200 text-sm font-medium mb-4 uppercase tracking-wide">
                {t('govInitiative')}
              </div>
              <h1 className="text-4xl lg:text-6xl font-bold font-heading mb-6">
                {t('lifestyleClinicName')}
                <span className="block text-2xl lg:text-3xl text-primary-200 mt-2">
                  {t('lifestyleClinicLocation')}
                </span>
              </h1>
              <p className="text-xl text-primary-100 mb-8 leading-relaxed">
                {t('welcomeDescription')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/signup"
                  className="inline-flex items-center justify-center px-8 py-4 bg-white text-primary-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors duration-200 shadow-lg"
                >
                  {t('getStarted')}
                  <ArrowRightIcon className="ml-2 h-5 w-5" />
                </Link>
                <Link
                  to="/about"
                  className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-primary-600 transition-colors duration-200"
                >
                  Learn More
                </Link>
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-2xl p-8">
                <h3 className="text-2xl font-bold mb-6 font-heading">Our Mission</h3>
                <p className="text-primary-100 leading-relaxed">
                  To provide guidance for stress management and adopting a healthy lifestyle 
                  while spreading awareness about various medical systems and coordinating 
                  appropriate treatment for better health outcomes.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4 font-heading">
              Why Choose Lifestyle Clinic?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We offer comprehensive healthcare solutions designed to transform your lifestyle 
              and improve your overall well-being.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="card text-center group hover:shadow-xl transition-shadow duration-300">
                <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary-200 transition-colors duration-300">
                  <feature.icon className="h-8 w-8 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3 font-heading">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Objectives Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6 font-heading">
                Project Objectives
              </h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Our comprehensive approach focuses on multiple aspects of healthcare 
                and lifestyle improvement to serve the community effectively.
              </p>
              
              <div className="space-y-4">
                {objectives.map((objective, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <CheckCircleIcon className="h-6 w-6 text-accent-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{objective}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-primary-50 to-accent-50 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 font-heading">
                Medical Systems We Cover
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {['Ayurvedic', 'Allopathic', 'Homeopathic', 'Naturopathy'].map((system, index) => (
                  <div key={index} className="bg-white rounded-lg p-4 text-center shadow-sm">
                    <span className="font-medium text-gray-800">{system}</span>
                  </div>
                ))}
              </div>
              <div className="mt-6 p-4 bg-white rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-2">Additional Services:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Yoga Programs</li>
                  <li>• Full Body Health Checkups</li>
                  <li>• Stress Management Programs</li>
                  <li>• Expert Consultations</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6 font-heading">
            Ready to Transform Your Lifestyle?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Join thousands of people who have already started their journey 
            towards a healthier and more balanced life.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/signup"
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-primary-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors duration-200 shadow-lg"
            >
              Sign Up Now
              <ArrowRightIcon className="ml-2 h-5 w-5" />
            </Link>
            <Link
              to="/about"
              className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-primary-600 transition-colors duration-200"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
