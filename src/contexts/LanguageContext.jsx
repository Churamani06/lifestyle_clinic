import React, { createContext, useContext, useState } from 'react';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

// Language translations
const translations = {
  en: {
    // Navbar
    home: 'Home',
    about: 'About',
    contact: 'Contact',
    dashboard: 'Dashboard',
    login: 'Login',
    signup: 'Sign Up',
    administration: 'Administration',
    
    // Home Page
    welcomeTitle: 'Welcome to Lifestyle Clinic',
    welcomeSubtitle: 'Raipur, Chhattisgarh',
    welcomeDescription: 'Transforming the hectic lifestyles of common people through holistic healthcare guidance, stress management, and comprehensive medical care.',
    getStarted: 'Get Started',
    govInitiative: 'Government of Chhattisgarh Initiative',
    lifestyleClinicName: 'Lifestyle Clinic',
    lifestyleClinicLocation: 'Raipur, Chhattisgarh',
    
    // Dashboard
    healthAssessmentForm: 'Health Assessment Form',
    healthAssessmentSubtitle: 'Please fill in your details for personalized healthcare guidance',
    personalInformation: 'Personal Information',
    fullName: 'Full Name',
    fatherMotherName: "Father's/Mother's Name",
    age: 'Age',
    gender: 'Gender',
    contactNumber: 'Contact Number',
    completeAddress: 'Complete Address',
    medicalPreferences: 'Medical Preferences',
    preferredMedicalSystem: 'Preferred Medical System',
    healthInformation: 'Health Information',
    primaryHealthConcern: 'Primary Health Concern or Issue',
    currentSymptoms: 'Current Symptoms',
    submitHealthForm: 'Submit Health Form',
    
    // Form placeholders
    enterFullName: 'Enter your full name',
    enterFatherMotherName: "Enter father's or mother's name",
    enterAge: 'Enter your age',
    selectGender: 'Select gender',
    enterContact: 'Enter your contact number',
    enterAddress: 'Enter your complete address (House No., Street, Area, City, District, State, PIN Code)',
    selectMedicalSystem: 'Select a medical system',
    describeHealthConcern: 'Please describe your main health concern or the reason for your visit...',
    describeSymptoms: 'Describe any symptoms you are experiencing...',
    
    // Gender options
    male: 'Male',
    female: 'Female',
    other: 'Other',
    preferNotToSay: 'Prefer not to say',
    
    // Medical systems
    ayurvedicMedicine: 'Ayurvedic Medicine',
    allopathicMedicine: 'Allopathic Medicine',
    homeopathicMedicine: 'Homeopathic Medicine',
    naturopathy: 'Naturopathy',
    anyRecommend: 'Any - Let us recommend',
    
    // Success message
    formSubmittedSuccess: 'Form Submitted Successfully!',
    thankYouMessage: 'Thank you for submitting your health assessment form. Our medical team will review your information and contact you soon.',
    whatsNext: "What's next?",
    reviewWithin24: '• Our team will review your form within 24 hours',
    receiveCall: '• You will receive a call to schedule your appointment',
    prepareMedicalRecords: '• Prepare any previous medical records if available',
    
    // Sidebar
    quickInformation: 'Quick Information',
    formReview24: 'Form review within 24 hours',
    freeConsultation: 'Free initial consultation',
    multipleMedicalSystems: 'Multiple medical systems available',
    expertProfessionals: 'Expert healthcare professionals',
    importantNotice: 'Important Notice',
    emergencyNotice: 'For medical emergencies, please call emergency services immediately. This form is for general consultations and non-emergency cases.',
    needHelp: 'Need Help?',
    assistanceMessage: 'If you need assistance filling out this form, contact our support team.',
    phone: 'Phone',
    email: 'Email',
    hours: 'Hours',
    
    // Footer
    quickLinks: 'Quick Links',
    ourServices: 'Our Services',
    stressManagement: 'Stress Management',
    lifestyleGuidance: 'Lifestyle Guidance',
    ayurvedicTreatment: 'Ayurvedic Treatment',
    allopathicCare: 'Allopathic Care',
    homeopathicMedicine: 'Homeopathic Medicine',
    yogaPrograms: 'Yoga Programs',
    healthCheckups: 'Health Checkups',
    privacyPolicy: 'Privacy Policy',
    termsOfService: 'Terms of Service',
    copyright: '© 2025 Lifestyle Clinic, Raipur. A Government of Chhattisgarh Initiative.',
    poweredBy: 'Powered by',
    
    // Home Page Features
    holisticHealthcare: 'Holistic Healthcare',
    holisticHealthcareDesc: 'Comprehensive care across Ayurvedic, Allopathic, Homeopathic, and Naturopathy systems.',
    expertGuidance: 'Expert Guidance',
    expertGuidanceDesc: 'Professional consultation for stress management and healthy lifestyle adoption.',
    healthEducation: 'Health Education',
    healthEducationDesc: 'Educational resources and guidance about various medical systems and wellness practices.',
    personalizedCare: 'Personalized Care',
    personalizedCareDesc: 'Tailored treatment plans based on individual health needs and medical history.'
  },
  
  hi: {
    // Navbar
    home: 'होम',
    about: 'हमारे बारे में',
    contact: 'संपर्क',
    dashboard: 'डैशबोर्ड',
    login: 'लॉगिन',
    signup: 'साइन अप',
    administration: 'प्रशासन',
    
    // Home Page
    welcomeTitle: 'लाइफस्टाइल क्लिनिक में आपका स्वागत है',
    welcomeSubtitle: 'रायपुर, छत्तीसगढ़',
    welcomeDescription: 'समग्र स्वास्थ्य देखभाल मार्गदर्शन, तनाव प्रबंधन और व्यापक चिकित्सा देखभाल के माध्यम से आम लोगों की व्यस्त जीवनशैली को बदलना।',
    getStarted: 'शुरू करें',
    govInitiative: 'छत्तीसगढ़ सरकार की पहल',
    lifestyleClinicName: 'लाइफस्टाइल क्लिनिक',
    lifestyleClinicLocation: 'रायपुर, छत्तीसगढ़',
    
    // Dashboard
    healthAssessmentForm: 'स्वास्थ्य मूल्यांकन फॉर्म',
    healthAssessmentSubtitle: 'व्यक्तिगत स्वास्थ्य देखभाल मार्गदर्शन के लिए कृपया अपना विवरण भरें',
    personalInformation: 'व्यक्तिगत जानकारी',
    fullName: 'पूरा नाम',
    fatherMotherName: 'पिता/माता का नाम',
    age: 'आयु',
    gender: 'लिंग',
    contactNumber: 'संपर्क नंबर',
    completeAddress: 'पूरा पता',
    medicalPreferences: 'चिकित्सा प्राथमिकताएं',
    preferredMedicalSystem: 'पसंदीदा चिकित्सा प्रणाली',
    healthInformation: 'स्वास्थ्य जानकारी',
    primaryHealthConcern: 'प्राथमिक स्वास्थ्य चिंता या समस्या',
    currentSymptoms: 'वर्तमान लक्षण',
    submitHealthForm: 'स्वास्थ्य फॉर्म जमा करें',
    
    // Form placeholders
    enterFullName: 'अपना पूरा नाम दर्ज करें',
    enterFatherMotherName: 'पिता या माता का नाम दर्ज करें',
    enterAge: 'अपनी आयु दर्ज करें',
    selectGender: 'लिंग चुनें',
    enterContact: 'अपना संपर्क नंबर दर्ज करें',
    enterAddress: 'अपना पूरा पता दर्ज करें (मकान नं., गली, क्षेत्र, शहर, जिला, राज्य, पिन कोड)',
    selectMedicalSystem: 'चिकित्सा प्रणाली चुनें',
    describeHealthConcern: 'कृपया अपनी मुख्य स्वास्थ्य चिंता या यात्रा का कारण बताएं...',
    describeSymptoms: 'आप जो लक्षण महसूस कर रहे हैं उनका वर्णन करें...',
    
    // Gender options
    male: 'पुरुष',
    female: 'महिला',
    other: 'अन्य',
    preferNotToSay: 'कहना पसंद नहीं',
    
    // Medical systems
    ayurvedicMedicine: 'आयुर्वेदिक चिकित्सा',
    allopathicMedicine: 'एलोपैथिक चिकित्सा',
    homeopathicMedicine: 'होम्योपैथिक चिकित्सा',
    naturopathy: 'प्राकृतिक चिकित्सा',
    anyRecommend: 'कोई भी - हमें सुझाव दें',
    
    // Success message
    formSubmittedSuccess: 'फॉर्म सफलतापूर्वक जमा किया गया!',
    thankYouMessage: 'आपके स्वास्थ्य मूल्यांकन फॉर्म जमा करने के लिए धन्यवाद। हमारी चिकित्सा टीम आपकी जानकारी की समीक्षा करेगी और जल्द ही आपसे संपर्क करेगी।',
    whatsNext: 'आगे क्या होगा?',
    reviewWithin24: '• हमारी टीम 24 घंटों के भीतर आपके फॉर्म की समीक्षा करेगी',
    receiveCall: '• आपको अपॉइंटमेंट शेड्यूल करने के लिए कॉल आएगी',
    prepareMedicalRecords: '• यदि उपलब्ध हो तो पिछले मेडिकल रिकॉर्ड तैयार रखें',
    
    // Sidebar
    quickInformation: 'त्वरित जानकारी',
    formReview24: '24 घंटों के भीतर फॉर्म समीक्षा',
    freeConsultation: 'निःशुल्क प्रारंभिक परामर्श',
    multipleMedicalSystems: 'कई चिकित्सा प्रणालियां उपलब्ध',
    expertProfessionals: 'विशेषज्ञ स्वास्थ्य पेशेवर',
    importantNotice: 'महत्वपूर्ण सूचना',
    emergencyNotice: 'चिकित्सा आपातकाल के लिए, कृपया तुरंत आपातकालीन सेवाओं को कॉल करें। यह फॉर्म सामान्य परामर्श और गैर-आपातकालीन मामलों के लिए है।',
    needHelp: 'सहायता चाहिए?',
    assistanceMessage: 'यदि आपको इस फॉर्म को भरने में सहायता चाहिए, तो हमारी सहायता टीम से संपर्क करें।',
    phone: 'फोन',
    email: 'ईमेल',
    hours: 'समय',
    
    // Footer
    quickLinks: 'त्वरित लिंक',
    ourServices: 'हमारी सेवाएं',
    stressManagement: 'तनाव प्रबंधन',
    lifestyleGuidance: 'जीवनशैली मार्गदर्शन',
    ayurvedicTreatment: 'आयुर्वेदिक उपचार',
    allopathicCare: 'एलोपैथिक देखभाल',
    homeopathicMedicine: 'होम्योपैथिक चिकित्सा',
    yogaPrograms: 'योग कार्यक्रम',
    healthCheckups: 'स्वास्थ्य जांच',
    privacyPolicy: 'गोपनीयता नीति',
    termsOfService: 'सेवा की शर्तें',
    copyright: '© 2025 लाइफस्टाइल क्लिनिक, रायपुर। छत्तीसगढ़ सरकार की एक पहल।',
    poweredBy: 'द्वारा संचालित',
    
    // Home Page Features
    holisticHealthcare: 'समग्र स्वास्थ्य देखभाल',
    holisticHealthcareDesc: 'आयुर्वेदिक, एलोपैथिक, होम्योपैथिक और प्राकृतिक चिकित्सा प्रणालियों में व्यापक देखभाल।',
    expertGuidance: 'विशेषज्ञ मार्गदर्शन',
    expertGuidanceDesc: 'तनाव प्रबंधन और स्वस्थ जीवनशैली अपनाने के लिए पेशेवर परामर्श।',
    healthEducation: 'स्वास्थ्य शिक्षा',
    healthEducationDesc: 'विभिन्न चिकित्सा प्रणालियों और कल्याण प्रथाओं के बारे में शैक्षिक संसाधन और मार्गदर्शन।',
    personalizedCare: 'व्यक्तिगत देखभाल',
    personalizedCareDesc: 'व्यक्तिगत स्वास्थ्य आवश्यकताओं और चिकित्सा इतिहास के आधार पर अनुकूलित उपचार योजनाएं।'
  }
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('en');

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'hi' : 'en');
  };

  const t = (key) => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
