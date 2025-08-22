const db = require('../config/database');

const addSampleData = async () => {
  try {
    console.log('🔄 Adding sample data to database...');
    
    // Add sample users if none exist
    const [existingUsers] = await db.execute('SELECT COUNT(*) as count FROM users');
    if (existingUsers[0].count === 0) {
      console.log('📝 Adding sample users...');
      
      await db.execute(`
        INSERT INTO users (first_name, last_name, email, phone, password, agree_to_terms, registration_time) 
        VALUES 
        ('John', 'Doe', 'john.doe@example.com', '9876543210', '$2a$12$hashedpassword1', 1, NOW()),
        ('Jane', 'Smith', 'jane.smith@example.com', '9876543211', '$2a$12$hashedpassword2', 1, NOW()),
        ('Rahul', 'Kumar', 'rahul.kumar@example.com', '9876543212', '$2a$12$hashedpassword3', 1, NOW())
      `);
      
      console.log('✅ Sample users added');
    } else {
      console.log('ℹ️  Users already exist, skipping user creation');
    }
    
    // Add sample health forms if none exist
    const [existingForms] = await db.execute('SELECT COUNT(*) as count FROM health_assessment_forms');
    if (existingForms[0].count === 0) {
      console.log('📝 Adding sample health assessment forms...');
      
      // Get user IDs
      const [users] = await db.execute('SELECT user_id FROM users LIMIT 3');
      
      if (users.length > 0) {
        await db.execute(`
          INSERT INTO health_assessment_forms 
          (form_id, user_id, full_name, father_mother_name, age, gender, contact, complete_address, medical_system, primary_issue, symptoms, status, submitted_date) 
          VALUES 
          ('F241213001001', ?, 'John Doe', 'Robert Doe', 30, 'male', '9876543210', '123 Main St, Raipur, Chhattisgarh', 'allopathic', 'High blood pressure and stress management', 'Headaches, fatigue, sleep issues', 'submitted', DATE_SUB(NOW(), INTERVAL 5 DAY)),
          ('F241213001002', ?, 'Jane Smith', 'Michael Smith', 28, 'female', '9876543211', '456 Oak Ave, Raipur, Chhattisgarh', 'ayurvedic', 'Digestive issues and anxiety', 'Stomach pain, nervousness, irregular appetite', 'reviewed', DATE_SUB(NOW(), INTERVAL 3 DAY)),
          ('F241213001003', ?, 'Rahul Kumar', 'Suresh Kumar', 35, 'male', '9876543212', '789 Pine Rd, Raipur, Chhattisgarh', 'homeopathic', 'Joint pain and lifestyle counseling', 'Knee pain, back ache, sedentary lifestyle', 'consultation_scheduled', DATE_SUB(NOW(), INTERVAL 1 DAY))
        `, [users[0].user_id, users[1]?.user_id || users[0].user_id, users[2]?.user_id || users[0].user_id]);
        
        console.log('✅ Sample health assessment forms added');
      }
    } else {
      console.log('ℹ️  Health forms already exist, skipping form creation');
    }
    
    // Show final counts
    const [userCount] = await db.execute('SELECT COUNT(*) as count FROM users');
    const [formCount] = await db.execute('SELECT COUNT(*) as count FROM health_assessment_forms');
    const [adminCount] = await db.execute('SELECT COUNT(*) as count FROM admins');
    
    console.log('\n📊 Final database statistics:');
    console.log(`👥 Total users: ${userCount[0].count}`);
    console.log(`📋 Total health forms: ${formCount[0].count}`);
    console.log(`👨‍💼 Total admins: ${adminCount[0].count}`);
    
    console.log('\n🎉 Sample data setup completed successfully!');
    console.log('🔐 Admin login credentials:');
    console.log('   Username: admin');
    console.log('   Password: admin123');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error adding sample data:', error.message);
    process.exit(1);
  }
};

addSampleData();
