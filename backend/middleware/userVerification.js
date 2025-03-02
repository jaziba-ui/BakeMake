const jwt = require("jsonwebtoken");

const verifyToken = async (req, res, next) => {
    const authHeader = req.header('Authorization');
    const token = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : authHeader;

    // console.log("Request Headers:", req.headers); // Log headers for debugging
    // console.log("Extracted Token:", token);       // Log token for debugging

    if (!token) {
        return res.status(403).json({ error: 'User access denied, no token provided.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Decoded Admin User:', decoded.user);

        req.user = decoded.user;
        next();
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Session expired, please log in again.' });
        }
        return res.status(400).json({ error: 'Invalid token or admin access denied.' });
    }
};

module.exports = verifyToken;
