const db = require('../config/database');

// SQL commands to create tables
const createTables = async () => {
  try {
    console.log('🔄 Initializing database tables...');

    // Create users table
    await db.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        isActive BOOLEAN DEFAULT TRUE,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Users table created/verified');

    // Create admins table
    await db.execute(`
      CREATE TABLE IF NOT EXISTS admins (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role ENUM('admin', 'super_admin') DEFAULT 'admin',
        isActive BOOLEAN DEFAULT TRUE,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Admins table created/verified');

    // Create health_assessment_forms table (with underscores for consistency)
    await db.execute(`
      CREATE TABLE IF NOT EXISTS health_assessment_forms (
        id INT AUTO_INCREMENT PRIMARY KEY,
        form_id VARCHAR(20) UNIQUE NOT NULL,
        user_id INT NOT NULL,
        full_name VARCHAR(100) NOT NULL,
        father_mother_name VARCHAR(100) NOT NULL,
        age INT NOT NULL,
        gender ENUM('male', 'female', 'other', 'prefer-not-to-say') NOT NULL,
        contact VARCHAR(15) NOT NULL,
        complete_address TEXT NOT NULL,
        medical_system ENUM('ayurvedic', 'allopathic', 'homeopathic', 'naturopathy', 'any') NOT NULL,
        primary_issue TEXT NOT NULL,
        symptoms TEXT,
        status ENUM('submitted', 'reviewed', 'consultation_scheduled', 'completed') DEFAULT 'submitted',
        admin_notes TEXT,
        assigned_doctor_id INT,
        consultation_date DATETIME,
        submitted_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_user_id (user_id),
        INDEX idx_form_id (form_id),
        INDEX idx_status (status),
        INDEX idx_submitted_date (submitted_date)
      )
    `);
    console.log('✅ Health assessment forms table created/verified');

    // Create a view or alias table for backward compatibility (admin routes expect 'healthassessmentforms')
    await db.execute(`DROP VIEW IF EXISTS healthassessmentforms`);
    await db.execute(`
      CREATE VIEW healthassessmentforms AS 
      SELECT 
        id,
        form_id as formId,
        user_id as userId,
        full_name as fullName,
        father_mother_name as fatherMotherName,
        age,
        gender,
        contact,
        complete_address as completeAddress,
        medical_system as medicalSystemPreference,
        primary_issue as primaryIssue,
        symptoms,
        status,
        admin_notes as adminNotes,
        assigned_doctor_id as assignedDoctorId,
        consultation_date as consultationDate,
        submitted_date as submittedAt,
        updated_at as updatedAt
      FROM health_assessment_forms
    `);
    console.log('✅ Health assessment forms view created for backward compatibility');

    console.log('');
    console.log('🎉 Database initialization completed successfully!');
    console.log('📊 Tables created:');
    console.log('   - users');
    console.log('   - admins');
    console.log('   - health_assessment_forms');
    console.log('   - healthassessmentforms (view)');
    console.log('');

  } catch (error) {
    console.error('❌ Database initialization failed:', error.message);
    throw error;
  }
};

// Function to create default admin user
const createDefaultAdmin = async () => {
  try {
    const bcrypt = require('bcryptjs');
    
    // Check if admin already exists
    const [existingAdmin] = await db.execute(
      'SELECT id FROM admins WHERE username = ? OR email = ?',
      ['admin', 'admin@lifestyleclinic.com']
    );

    if (existingAdmin.length > 0) {
      console.log('ℹ️  Default admin user already exists');
      return;
    }

    // Create default admin
    const hashedPassword = await bcrypt.hash('admin123', 12);
    
    await db.execute(
      'INSERT INTO admins (username, email, password, role) VALUES (?, ?, ?, ?)',
      ['admin', 'admin@lifestyleclinic.com', hashedPassword, 'super_admin']
    );

    console.log('✅ Default admin user created:');
    console.log('   Username: admin');
    console.log('   Email: admin@lifestyleclinic.com');
    console.log('   Password: admin123');
    console.log('   ⚠️  Please change the default password after first login!');

  } catch (error) {
    console.error('❌ Failed to create default admin:', error.message);
    throw error;
  }
};

// Main initialization function
const initializeDatabase = async () => {
  try {
    await createTables();
    await createDefaultAdmin();
    
    console.log('');
    console.log('🎯 Database is ready for use!');
    console.log('🔐 You can now log in with the admin credentials shown above.');
    
  } catch (error) {
    console.error('❌ Database initialization error:', error);
    process.exit(1);
  }
};

// Run if called directly
if (require.main === module) {
  initializeDatabase().then(() => {
    process.exit(0);
  }).catch((error) => {
    console.error('❌ Initialization failed:', error);
    process.exit(1);
  });
}

module.exports = { initializeDatabase, createTables, createDefaultAdmin };
