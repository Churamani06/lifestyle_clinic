const db = require('../config/database');

const checkDatabaseData = async () => {
  try {
    console.log('🔍 Checking database data...');
    
    // Check users count
    const [users] = await db.execute('SELECT COUNT(*) as count FROM users');
    console.log('👥 Total users:', users[0].count);
    
    // Check health forms count
    const [forms] = await db.execute('SELECT COUNT(*) as count FROM health_assessment_forms');
    console.log('📋 Total health forms:', forms[0].count);
    
    // Check admins count
    const [admins] = await db.execute('SELECT COUNT(*) as count FROM admins');
    console.log('👨‍💼 Total admins:', admins[0].count);
    
    // List admin users
    const [adminList] = await db.execute('SELECT admin_id, username, role, is_active FROM admins');
    console.log('\n📋 Admin users:');
    adminList.forEach(admin => {
      console.log(`  - ID: ${admin.admin_id}, Username: ${admin.username}, Role: ${admin.role}, Active: ${admin.is_active}`);
    });
    
    // Sample health forms if any
    const [sampleForms] = await db.execute('SELECT * FROM health_assessment_forms LIMIT 3');
    console.log('\n📄 Sample health forms:');
    if (sampleForms.length === 0) {
      console.log('  - No health forms found');
    } else {
      sampleForms.forEach(form => {
        console.log(`  - ID: ${form.id}, Form ID: ${form.form_id}, User ID: ${form.user_id}, Name: ${form.full_name}`);
      });
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error checking database:', error.message);
    process.exit(1);
  }
};

checkDatabaseData();
