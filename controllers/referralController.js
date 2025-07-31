


const {nanoid} = require('nanoid')
const prisma = require('../config/db');
const emailService = require('../utils/emailService');


exports.createReferral = async (req, res) => {
  try {
    const { referee, email } = req.body;
    const referrerId = req.user.id;

    // Check if a referral already exists for this email by the current user
    const existingReferral = await prisma.referral.findFirst({
      where: { email, referrerId }
    });

    if (existingReferral) {
      return res.status(400).json({ error: 'You have already referred to this email' });
    }

    const referralCode = nanoid(10);

    const referral = await prisma.referral.create({
      data: {
        referrerId,
        referee,
        email,
        status: 'PENDING',
        referralCode
      },
    });

    const referrer = await prisma.user.findUnique({ where: { id: referrerId } });
    await emailService.sendReferralEmail(email, referee, referrer.username, referralCode);

    res.status(201).json(referral);
  } catch (error) {
    console.error('Error processing referral:', error);
    res.status(500).json({ error: 'An error occurred while processing the referral' });
  }
};





exports.getUserReferrals = async (req, res) => {
  try {
    const referrals = await prisma.referral.findMany({
      where: { referrerId: req.user.id },
      orderBy: { createdAt: 'desc' }
    });
    res.json(referrals);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching user referrals' });
  }
};












exports.completeReferral = async (referralCode, newUserId) => {
  try {
    const referral = await prisma.referral.findUnique({ 
      where: { referralCode },
      include: { referrer: true }
    });

    if (referral && referral.status === 'PENDING') {
      // Update referral status
      await prisma.referral.update({
        where: { referralCode },
        data: { status: 'COMPLETED' }
      });

      // Award points to the referrer
      await prisma.user.update({
        where: { id: referral.referrerId },
        data: { referralPoints: { increment: 100 } }
      });

      // Award points to the new user (referee)
      await prisma.user.update({
        where: { id: newUserId },
        data: { referralPoints: { increment: 50 } }
      });

      console.log(`Referral completed. Referrer (${referral.referrerId}) +100 points, Referee (${newUserId}) +50 points`);
      return true;
    } else {
      console.log('Referral not found or already completed');
      return false;
    }
  } catch (error) {
    console.error('Error completing referral:', error);
    throw error;
  }
};



