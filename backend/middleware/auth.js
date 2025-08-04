const jwt = require('jsonwebtoken');
const { pool } = require('../config/database');

// Middleware to verify JWT token
const verifyToken = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided, authorization denied'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }
};

// Middleware to verify admin token
const verifyAdminToken = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided, authorization denied'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check if user is admin
    if (!decoded.isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Admin access required'
      });
    }

    // Verify admin exists in database
    const [admin] = await pool.execute(
      'SELECT admin_id, username, role, is_active FROM admins WHERE admin_id = ? AND is_active = TRUE',
      [decoded.adminId]
    );

    if (admin.length === 0) {
      return res.status(403).json({
        success: false,
        message: 'Admin not found or inactive'
      });
    }

    req.admin = {
      ...decoded,
      adminData: admin[0]
    };
    
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid admin token'
    });
  }
};

// Middleware to check admin roles
const checkAdminRole = (allowedRoles) => {
  return (req, res, next) => {
    const userRole = req.admin.adminData.role;
    
    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions for this action'
      });
    }
    
    next();
  };
};

module.exports = {
  verifyToken,
  verifyAdminToken,
  checkAdminRole
};
