const jwt = require("jsonwebtoken");

const verifyAdmin = async (req, res, next) => {

    const token = req.header('Authorization')?.split(' ')[1];
    console.log("header",req.header);  // Log the received token to verify
    
  if (!token) {
      return res.status(403).json({ error: 'Access denied, no token provided' });
  }

  try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify the token
      console.log('Decoded admin user:', decoded.user);

      if (!decoded.user?.isAdmin) { // Check if the token includes the admin flag
          console.log('Access Denied: Not Admin');
          return res.status(403).json({ error: 'Admin access denied.' });
      }

      req.user = decoded;
      console.log("decoded", decoded)
      next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ error: 'Session expired, please log in again.' });
    }
      return res.status(400).json({ error: 'Invalid token or admin access denied.' });
  }
};

module.exports = verifyAdmin;
