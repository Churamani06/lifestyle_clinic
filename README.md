# Lifestyle Clinic - Frontend Website

A comprehensive React.js frontend application for the **Lifestyle Clinic**, a Government of Chhattisgarh health initiative project aimed at transforming the hectic lifestyles of people in Raipur through holistic healthcare solutions.

## 🎯 Project Overview

**Lifestyle Clinic, Raipur** is a government initiative focused on:
- Bringing lifestyle changes in fast-paced lives
- Providing stress management guidance
- Spreading awareness about various medical systems
- Coordinating appropriate healthcare treatment
- Offering yoga and health checkup services
- Organizing expert sessions and workshops

## ✨ Features

### 🏠 **Home Page**
- Hero section with project mission and objectives
- Feature highlights and medical systems overview
- Call-to-action for user registration
- Responsive design with smooth animations

### 🔐 **Authentication Pages**
- **Login Page**: Secure user authentication with form validation
- **Sign Up Page**: Comprehensive registration with password requirements
- Password visibility toggle and strength indicators

### 📋 **Dashboard (Health Session Form)**
- Comprehensive health assessment form
- Personal information collection
- Medical system preferences (Ayurvedic, Allopathic, Homeopathic, Naturopathy)
- Health concern descriptions and symptoms tracking
- Urgency level selection
- Success confirmation with reference ID

### 🎓 **Sessions Page**
- Expert-led workshops and sessions
- Filter by medical system and session status
- Online and offline session support
- Registration functionality with participant limits
- Expert profiles and session descriptions

### ℹ️ **About Page**
- Detailed project information and objectives
- Implementation plan and expected outcomes
- Medical systems coverage
- Service offerings and features

### 📞 **Contact Page**
- Multiple contact methods (phone, email, address)
- Contact form with categorization
- FAQ section
- Emergency information
- Interactive location details

## 🛠️ Technology Stack

- **Frontend Framework**: React.js 18+ with Vite
- **Routing**: React Router DOM
- **Styling**: Tailwind CSS with custom design system
- **Icons**: Heroicons
- **Fonts**: Inter (body text) + Poppins (headings)
- **Build Tool**: Vite
- **Package Manager**: npm

## 🎨 Design System

### Color Palette
- **Primary**: Blue theme (professional government look)
- **Secondary**: Gray theme (neutral elements)
- **Accent**: Green theme (health and wellness)

### Custom Components
- `btn-primary`: Primary action buttons
- `btn-secondary`: Secondary action buttons
- `btn-outline`: Outline style buttons
- `card`: Container component with shadow
- `input-field`: Styled form inputs
- `label`: Form labels

### Typography
- **Headings**: Poppins font family
- **Body Text**: Inter font family
- **Responsive**: Mobile-first design approach

## 📁 Project Structure

```
src/
├── components/          # Reusable components
│   ├── Navbar.jsx      # Navigation header
│   └── Footer.jsx      # Site footer
├── pages/              # Page components
│   ├── Home.jsx        # Landing page
│   ├── Login.jsx       # Authentication
│   ├── SignUp.jsx      # Registration
│   ├── Dashboard.jsx   # Health form
│   ├── Sessions.jsx    # Expert sessions
│   ├── About.jsx       # Project info
│   └── Contact.jsx     # Contact page
├── assets/             # Static assets
├── App.jsx            # Main application
├── main.jsx           # Application entry
└── index.css          # Global styles + Tailwind
```

## 🚀 Getting Started

### Prerequisites
- Node.js (16+ recommended)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd livestyle-clinic
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   Navigate to `http://localhost:5173`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🎯 Key Pages & Routes

| Route | Component | Description |
|-------|-----------|-------------|
| `/` | Home | Landing page with project overview |
| `/login` | Login | User authentication |
| `/signup` | SignUp | User registration |
| `/dashboard` | Dashboard | Health session form |
| `/sessions` | Sessions | Expert workshops and sessions |
| `/about` | About | Project information |
| `/contact` | Contact | Contact form and information |

## 🏥 Medical Systems Covered

The platform provides information and coordination for:

1. **Ayurvedic Medicine** - Traditional Indian healing system
2. **Allopathic Medicine** - Modern conventional medicine
3. **Homeopathic Medicine** - Gentle healing with natural substances
4. **Naturopathy** - Natural healing and prevention

## 📱 Responsive Design

- **Mobile First**: Optimized for mobile devices
- **Tablet Friendly**: Great experience on tablets
- **Desktop Ready**: Full desktop functionality
- **Touch Friendly**: Optimized for touch interactions

## 🎨 UI/UX Features

- **Smooth Animations**: CSS transitions and hover effects
- **Interactive Elements**: Buttons, forms, and navigation
- **Professional Design**: Government-appropriate styling
- **Accessibility**: Semantic HTML and ARIA labels
- **Loading States**: Form submission feedback
- **Error Handling**: User-friendly error messages

## 🌟 Demo Features

- **Frontend Only**: No backend integration required
- **Demo Data**: Sample sessions and expert information
- **Form Validation**: Client-side validation
- **Local Storage**: Form data persistence (optional)
- **Responsive Images**: Optimized for all screen sizes

## 🔧 Customization

### Tailwind Configuration
The project uses a custom Tailwind configuration with:
- Extended color palette
- Custom font families
- Additional component classes
- Responsive breakpoints

### Adding New Pages
1. Create component in `/src/pages/`
2. Add route in `App.jsx`
3. Update navigation in `Navbar.jsx`

### Styling Guidelines
- Use Tailwind utility classes
- Follow the established color scheme
- Maintain consistent spacing
- Use custom component classes for reusability

## 🤝 Contributing

This is a demo project for the Lifestyle Clinic initiative. For contributions:

1. Fork the repository
2. Create feature branch
3. Make your changes
4. Test responsive design
5. Submit pull request

## 📞 Support

For questions about this project:
- **Demo Email**: info@lifestyleclinic.gov.in
- **Demo Phone**: +91 9876543210
- **Location**: Raipur, Chhattisgarh, India

## 📄 License

This project is created for the Government of Chhattisgarh's Lifestyle Clinic initiative.

---

**Built with ❤️ for the people of Chhattisgarh**+ Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
