const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../config/db');
const referralController = require('./referralController');

exports.register = async (req, res) => {
  try {
    const { username, email, password, referralCode } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create the user
    const user = await prisma.user.create({
      data: { 
        username, 
        email, 
        password: hashedPassword,
        referralPoints: 0 // Initialize referral points
      }
    });

    // Generate a token for the new user
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // If there's a referral code, complete the referral
    if (referralCode) {
      try {
        await referralController.completeReferral(referralCode, user.id);
      } catch (referralError) {
        console.error('Error completing referral:', referralError);
        // Note: We're not returning here, as the user registration was successful
      }
    }

    res.status(201).json({ 
      message: 'User registered successfully', 
      userId: user.id,
      token
    });
  } catch (error) {
    console.error('Error registering new user:', error);
    res.status(500).json({ error: 'Error registering new user' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (user && (await bcrypt.compare(password, user.password))) {
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );
      res.json({ token, userId: user.id });
    } else {
      res.status(401).json({ message: 'Authentication failed' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Login error' });
  }
};

exports.getUserPoints = async (req, res) => {
  try {
    console.log('User from request:', req.user);
    if (!req.user || !req.user.userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: { referralPoints: true }
    });

    if (!user) {
      console.log('User not found for ID:', req.user.userId);
      return res.status(404).json({ error: 'User not found' });
    }

    console.log('User points:', user.referralPoints);
    res.json({ points: user.referralPoints });
  } catch (error) {
    console.error('Error in getUserPoints:', error);
    res.status(500).json({ error: 'Error fetching user points', details: error.message });
  }
};





