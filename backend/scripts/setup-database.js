const db = require('../config/database');
const bcrypt = require('bcryptjs');

// Function to create default admin user
const createDefaultAdmin = async () => {
  try {
    console.log('🔄 Checking for default admin user...');
    
    // Check if admin already exists
    const [existingAdmin] = await db.execute(
      'SELECT admin_id FROM admins WHERE username = ? OR admin_id = 1',
      ['admin']
    );

    if (existingAdmin.length > 0) {
      console.log('ℹ️  Default admin user already exists');
      console.log('   Admin ID:', existingAdmin[0].admin_id);
      return;
    }

    // Create default admin
    const hashedPassword = await bcrypt.hash('admin123', 12);
    
    const [result] = await db.execute(
      'INSERT INTO admins (username, password, role, is_active) VALUES (?, ?, ?, ?)',
      ['admin', hashedPassword, 'super_admin', 1]
    );

    console.log('✅ Default admin user created successfully:');
    console.log('   Admin ID:', result.insertId);
    console.log('   Username: admin');
    console.log('   Password: admin123');
    console.log('   Role: super_admin');
    console.log('   ⚠️  Please change the default password after first login!');

  } catch (error) {
    console.error('❌ Failed to create default admin:', error.message);
    throw error;
  }
};

// Function to check and fix the view for health forms
const createCompatibilityView = async () => {
  try {
    console.log('🔄 Creating compatibility view for health forms...');
    
    // Drop existing view if exists
    await db.execute('DROP VIEW IF EXISTS healthassessmentforms');
    
    // Create new view with proper column mapping
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
    
    console.log('✅ Compatibility view created successfully');
    
  } catch (error) {
    console.error('❌ Failed to create compatibility view:', error.message);
    throw error;
  }
};

// Function to check database tables
const checkTables = async () => {
  try {
    console.log('🔍 Checking database tables...');
    
    // Check if required tables exist
    const [tables] = await db.execute("SHOW TABLES");
    const tableNames = tables.map(table => Object.values(table)[0]);
    
    console.log('📊 Existing tables:', tableNames);
    
    const requiredTables = ['users', 'admins', 'health_assessment_forms'];
    const missingTables = requiredTables.filter(table => !tableNames.includes(table));
    
    if (missingTables.length > 0) {
      console.log('❌ Missing tables:', missingTables);
      console.log('ℹ️  Please run the database setup script to create missing tables');
      return false;
    }
    
    console.log('✅ All required tables exist');
    return true;
    
  } catch (error) {
    console.error('❌ Error checking tables:', error.message);
    return false;
  }
};

// Main setup function
const setupDatabase = async () => {
  try {
    console.log('🚀 Setting up Lifestyle Clinic Database...');
    console.log('');
    
    // Check tables
    const tablesExist = await checkTables();
    if (!tablesExist) {
      console.log('❌ Database setup failed - missing tables');
      return;
    }
    
    // Create compatibility view
    await createCompatibilityView();
    
    // Create default admin
    await createDefaultAdmin();
    
    console.log('');
    console.log('🎉 Database setup completed successfully!');
    console.log('');
    console.log('🎯 Your Lifestyle Clinic database is ready to use!');
    console.log('🔐 You can now log in to the admin panel with the credentials shown above.');
    console.log('');
    
  } catch (error) {
    console.error('❌ Database setup error:', error);
    process.exit(1);
  }
};

// Run if called directly
if (require.main === module) {
  setupDatabase().then(() => {
    process.exit(0);
  }).catch((error) => {
    console.error('❌ Setup failed:', error);
    process.exit(1);
  });
}

module.exports = { setupDatabase, createDefaultAdmin, createCompatibilityView, checkTables };
