const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const db = require('../database');

const JWT_SECRET = process.env.JWT_SECRET || 'secretkey';

// Mock Email Transporter
// You can replace this with SendGrid, Mailgun, etc.
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT) || 465,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

// Register User
router.post('/register', async (req, res) => {
  const { name, username, password } = req.body;
  if (!username || !password || !name) {
    return res.status(400).json({ error: 'Name, username, and password are required' });
  }

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const verificationToken = crypto.randomBytes(32).toString('hex');

    const sql = `INSERT INTO users (name, username, password, verification_token, is_verified) VALUES (?, ?, ?, ?, 0)`;
    db.run(sql, [name, username, hashedPassword, verificationToken], function (err) {
      if (err) {
        if (err.message.includes('UNIQUE')) {
          return res.status(400).json({ error: 'Username already exists' });
        }
        return res.status(500).json({ error: err.message });
      }

      const hostUrl = req.get('host') === 'localhost:5000' ? 'http://localhost:5000' : `https://${req.get('host')}`;
      const verifyUrl = `${hostUrl}/api/auth/verify/${verificationToken}`;
      
      // Simulate Email Sending
      console.log('===================================================');
      console.log(`📧 NEW USER REGISTRATION: ${username}`);
      console.log(`🔗 VERIFICATION LINK: ${verifyUrl}`);
      console.log('===================================================');

      // Try sending email
      transporter.sendMail({
        from: `"Task Management" <${process.env.SMTP_USER || 'no-reply@taskapp.com'}>`,
        to: username, // assuming username is an email
        subject: 'Verify your Task Management account',
        text: `Welcome to Task Management! Please verify your account by clicking the following link: ${verifyUrl}`,
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
            <h2>Welcome to Task Management!</h2>
            <p>Please verify your account to start organizing your tasks.</p>
            <a href="${verifyUrl}" style="display: inline-block; padding: 12px 24px; background-color: #4f46e5; color: white; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 10px 0;">Verify Account</a>
            <p style="margin-top: 20px; font-size: 14px; color: #666;">
              If the button above doesn't work, copy and paste this link into your browser: <br/>
              <a href="${verifyUrl}" style="color: #4f46e5;">${verifyUrl}</a>
            </p>
          </div>
        `
      }).catch(console.error);

      res.status(201).json({ message: 'Registration successful! Please check your terminal/email for the verification link.' });
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Verify Email
router.get('/verify/:token', (req, res) => {
  const { token } = req.params;
  
  db.run(`UPDATE users SET is_verified = 1, verification_token = NULL WHERE verification_token = ?`, [token], function(err) {
    if (err) return res.status(500).send('Error verifying account.');
    if (this.changes === 0) return res.status(400).send('Invalid or expired verification token.');
    
    res.send(`
      <div style="text-align:center; margin-top:50px; font-family:sans-serif;">
        <h1 style="color:green;">Account Verified Successfully!</h1>
        <p>You can now return to the app and login.</p>
        <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}" style="padding:10px 20px; background:#4f46e5; color:white; text-decoration:none; border-radius:8px; font-weight:bold; display:inline-block; margin-top:10px;">Go to Login</a>
      </div>
    `);
  });
});

// Login User
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  const sql = 'SELECT * FROM users WHERE username = ?';
  db.get(sql, [username], async (err, user) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!user) return res.status(400).json({ error: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

    if (!user.is_verified) {
      return res.status(403).json({ error: 'Please verify your email before logging in. Check your terminal output for the link.' });
    }

    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, user: { id: user.id, name: user.name, username: user.username } });
  });
});

module.exports = router;
