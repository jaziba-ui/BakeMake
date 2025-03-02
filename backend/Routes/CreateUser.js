const express = require("express");
const router = express.Router();
const User = require("../models/User");
const errorHandler = require('../middleware/errorHandler')
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken") 
const secret = process.env.JWT_SECRET;



// Create User Route
router.post(
  "/createuser",
  [
    body("email").isEmail(),
    body("password", "Password must be at least 5 characters").isLength({ min: 5 }),
    body("name").isLength({ min: 5 }),
    body("location").notEmpty().withMessage("Location is required"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      await User.init();
      const salt = await bcrypt.genSalt(15);
      const secPassword = await bcrypt.hash(req.body.password, salt);

      const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: secPassword,
        location: req.body.location,
      });

      const data = { user: { id: newUser.id } };
      const authToken = jwt.sign(data, secret);

      return res.json({
        success: true,
        authToken,
        user: newUser,
      });
    }catch (err) {
      console.error("error" , err.message); // Log the error for debugging
      const errorResponse = errorHandler(err);
      return res.status(400).json({ errors: errorResponse });
    }
    
  }
);


// User Login Route
router.post(
  "/loginuser",
  [
    body("email").isEmail(),
    body("password", "Password must be at least 5 characters").isLength({ min: 5 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });

      const domain = user.email.substring(user.email.indexOf("@"));

      if (!user) {
        throw new Error('incorrect email');
      }

      const pwdCheck = await bcrypt.compare(password, user.password);
      if (!pwdCheck) {
        throw new Error('incorrect password');
      }

      const data = { user: { id: user.id } };
      const authToken = jwt.sign(data, secret, { expiresIn: '1h' });

      return res.json({
        success: true,
        // user : user.id,
        authToken,
        isAdmin: false
      });
    } catch (err) {
      console.error("error" , err.message); // Log the error for debugging
      const errorResponse = errorHandler(err);
      return res.status(400).json({ errors: errorResponse });
    }    
  }
);

router.post(
  "/createadmin",
  [
    body("email").isEmail(),
    body("password", "Password must be at least 5 characters").isLength({ min: 5 }),
    body("name").optional().isLength({ min: 1 }),  // Relaxed validation
    body("location").notEmpty().withMessage("Location is required"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    console.log("Request Body: ", req.body);  // Log request body for debugging

    try {
      const salt = await bcrypt.genSalt(15);
      const secPassword = await bcrypt.hash(req.body.password, salt);

      // Custom admin validation check
      if (!req.body.name || req.body.name !== "admin") {
        throw new Error("no access");
      }

      const newAdmin = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: secPassword,
        location: req.body.location,
        isAdmin: true, // Mark as admin
      });

      const data = { user: { id: newAdmin.id } };
      const authToken = jwt.sign(data, secret, { expiresIn: "1h" });

      return res.json({
        success: true,
        authToken: authToken,
      });
    } catch (err) {
      console.error("error", err.message); // Log the error for debugging
      const errorResponse = errorHandler(err);
      return res.status(400).json({ errors: errorResponse });
    }
  }
);


// Admin Login Route
router.post(
  "/loginadmin",
  [
    body("email").isEmail(),
    body("password", "Password must be at least 5 characters").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { email, password } = req.body;

      // Look for an admin user
      const adminUser = await User.findOne({ email, isAdmin: true });

      console.log(adminUser)
      // Check for the special "admin" email
      const domain = adminUser.email.substring(adminUser.email.indexOf("@"));
      if (!adminUser || adminUser.email !== `admin${domain}`) {
        throw new Error("no access");
      }


      // Password comparison
      const pwdCheck = await bcrypt.compare(password, adminUser.password);
      if (!pwdCheck) {
        throw new Error("incorrect password");
      }

      const data = { user: { id: adminUser.id, isAdmin: true } };
      const authToken = jwt.sign(data, secret, { expiresIn: "1h" });

      return res.json({
        success: true,
        authToken: authToken,
        isAdmin: true
      });
    } catch (err) {
      console.error(err); // Log the error for debugging
      const errorResponse = errorHandler(err);
      return res.status(400).json({ errors: errorResponse });
    }    
  }
);


module.exports = router;
