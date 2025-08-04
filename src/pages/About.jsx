import React from 'react';
import { 
  HeartIcon, 
  UserGroupIcon, 
  AcademicCapIcon, 
  ClipboardDocumentCheckIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon
} from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';

const About = () => {
  const objectives = [
    'To bring lifestyle changes in the fast-paced lives of common people',
    'To provide guidance for stress management and adopting a healthy lifestyle',
    'To spread awareness about the available services in various medical systems',
    'To guide people towards appropriate treatment and coordinate the necessary care',
    'To offer services like yoga and full-body health checkups',
    'To provide comprehensive wellness support and health education'
  ];

  const implementationPhases = [
    {
      phase: 'Initial Phase',
      title: 'Establishment & Setup',
      description: 'Establishment of the Lifestyle Clinic and arrangement of necessary facilities.'
    },
    {
      phase: 'Phase 2',
      title: 'Beneficiary Registration',
      description: 'Registering beneficiaries and assessing their individual needs.'
    },
    {
      phase: 'Phase 3',
      title: 'Guidance & Treatment',
      description: 'Providing guidance on stress management and recommending appropriate treatment.'
    },
    {
      phase: 'Phase 4',
      title: 'Health Education',
      description: 'Providing comprehensive health education and wellness guidance programs.'
    },
    {
      phase: 'Phase 5',
      title: 'Evaluation & Review',
      description: 'Measuring the outcomes of the project and reviewing progress.'
    }
  ];

  const expectedOutcomes = [
    'Positive lifestyle changes in the fast-paced lives of people',
    'Provision of guidance for stress management and adoption of a healthy lifestyle',
    'Increased awareness of the services available across various medical systems',
    'Proper treatment guidance and facilitation of healthcare services',
    'Availability of services like yoga programs and full-body health checkups'
  ];

  const medicalSystems = [
    {
      name: 'Ayurvedic Medicine',
      description: 'Ancient Indian system of medicine focusing on balance and natural healing.',
      icon: '🌿'
    },
    {
      name: 'Allopathic Medicine',
      description: 'Modern conventional medicine with evidence-based treatments.',
      icon: '🏥'
    },
    {
      name: 'Homeopathic Medicine',
      description: 'Gentle healing system using highly diluted natural substances.',
      icon: '💊'
    },
    {
      name: 'Naturopathy',
      description: 'Natural healing approach emphasizing prevention and self-healing.',
      icon: '🌱'
    }
  ];

  const services = [
    {
      icon: HeartIcon,
      title: 'Stress Management',
      description: 'Comprehensive stress assessment and management techniques'
    },
    {
      icon: UserGroupIcon,
      title: 'Expert Consultations',
      description: 'One-on-one consultations with qualified healthcare professionals'
    },
    {
      icon: AcademicCapIcon,
      title: 'Educational Workshops',
      description: 'Regular workshops and seminars on various health topics'
    },
    {
      icon: ClipboardDocumentCheckIcon,
      title: 'Health Checkups',
      description: 'Complete body health assessments and preventive care'
    }
  ];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-24">
          <div className="text-center">
            <h1 className="text-4xl lg:text-5xl font-bold font-heading mb-6">
              About Lifestyle Clinic
            </h1>
            <p className="text-xl text-primary-100 max-w-3xl mx-auto leading-relaxed">
              A Government of Chhattisgarh initiative dedicated to transforming the 
              hectic lifestyles of common people through holistic healthcare solutions.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6 font-heading">
                Our Mission
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed mb-6">
                Lifestyle Clinic, Raipur is a transformative initiative aimed at addressing 
                the health challenges of modern living. We provide comprehensive guidance 
                for stress management, healthy lifestyle adoption, and access to various 
                medical systems including Ayurvedic, Allopathic, Homeopathic, and Naturopathy.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                Our goal is to coordinate necessary care and offer specialized services 
                like yoga and full-body health checkups while providing comprehensive 
                health education and wellness guidance.
              </p>
            </div>
            <div className="bg-gradient-to-br from-primary-50 to-accent-50 rounded-2xl p-8">
              <div className="text-center">
                <div className="bg-primary-600 p-4 rounded-full inline-block mb-4">
                  <HeartIcon className="h-12 w-12 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4 font-heading">
                  Transforming Lives
                </h3>
                <p className="text-gray-600">
                  Through holistic healthcare, we aim to bring positive changes 
                  to the fast-paced lives of our community members.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Project Objectives */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4 font-heading">
              Project Objectives
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our comprehensive approach focuses on multiple aspects of healthcare 
              and lifestyle improvement to serve the community effectively.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {objectives.map((objective, index) => (
              <div key={index} className="card">
                <div className="flex items-start space-x-4">
                  <div className="bg-primary-100 p-2 rounded-full flex-shrink-0">
                    <CheckCircleIcon className="h-6 w-6 text-primary-600" />
                  </div>
                  <p className="text-gray-700 leading-relaxed">{objective}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Medical Systems */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4 font-heading">
              Medical Systems We Cover
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We provide guidance and coordination across multiple medical systems 
              to ensure comprehensive healthcare solutions.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {medicalSystems.map((system, index) => (
              <div key={index} className="card text-center group hover:shadow-xl transition-shadow duration-300">
                <div className="text-4xl mb-4">{system.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3 font-heading">
                  {system.name}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {system.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4 font-heading">
              Our Services
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive healthcare services designed to support your journey 
              towards better health and wellness.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <div key={index} className="card text-center group hover:shadow-xl transition-shadow duration-300">
                <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary-200 transition-colors duration-300">
                  <service.icon className="h-8 w-8 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3 font-heading">
                  {service.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Implementation Plan */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4 font-heading">
              Implementation Plan
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our structured approach ensures systematic implementation and 
              continuous improvement of our services.
            </p>
          </div>
          
          <div className="space-y-8">
            {implementationPhases.map((phase, index) => (
              <div key={index} className="flex items-start space-x-6">
                <div className="bg-primary-600 text-white p-3 rounded-full flex-shrink-0">
                  <span className="text-sm font-bold">{index + 1}</span>
                </div>
                <div className="card flex-1">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                    <div>
                      <div className="text-sm text-primary-600 font-medium mb-2">
                        {phase.phase}
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2 font-heading">
                        {phase.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {phase.description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Expected Outcomes */}
      <section className="py-20 bg-gradient-to-br from-accent-50 to-primary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4 font-heading">
              Expected Outcomes
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The positive impact we aim to create in our community through 
              this comprehensive healthcare initiative.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {expectedOutcomes.map((outcome, index) => (
              <div key={index} className="bg-white rounded-lg p-6 shadow-sm">
                <div className="flex items-start space-x-4">
                  <div className="bg-accent-100 p-2 rounded-full flex-shrink-0">
                    <CheckCircleIcon className="h-6 w-6 text-accent-600" />
                  </div>
                  <p className="text-gray-700 leading-relaxed">{outcome}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold mb-6 font-heading">
                Get in Touch
              </h2>
              <p className="text-gray-300 text-lg mb-8 leading-relaxed">
                Have questions about our services or want to learn more about 
                how we can help you on your health journey? We're here to help.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <MapPinIcon className="h-5 w-5 text-primary-400" />
                  <span className="text-gray-300">Raipur, Chhattisgarh, India</span>
                </div>
                <div className="flex items-center space-x-3">
                  <PhoneIcon className="h-5 w-5 text-primary-400" />
                  <span className="text-gray-300">+91 9876543210</span>
                </div>
                <div className="flex items-center space-x-3">
                  <EnvelopeIcon className="h-5 w-5 text-primary-400" />
                  <span className="text-gray-300">info@lifestyleclinic.gov.in</span>
                </div>
              </div>
            </div>
            
            <div className="text-center lg:text-right">
              <h3 className="text-2xl font-bold mb-6 font-heading">
                Ready to Start Your Journey?
              </h3>
              <p className="text-gray-300 mb-8">
                Join thousands of people who have already transformed their lives 
                through our comprehensive healthcare approach.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-end">
                <Link
                  to="/signup"
                  className="inline-flex items-center justify-center px-8 py-4 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors duration-200"
                >
                  Sign Up Now
                  <ArrowRightIcon className="ml-2 h-5 w-5" />
                </Link>
                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-gray-900 transition-colors duration-200"
                >
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
