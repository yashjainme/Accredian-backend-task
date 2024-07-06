const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GOOGLE_MAIL_USER,
    pass: process.env.GOOGLE_MAIL_PASS,
  },
});








exports.sendReferralEmail = async (email, referee, referrerUsername, referralCode) => {
  const mailOptions = {
    from: process.env.GOOGLE_MAIL_USER,
    to: email,
    subject: 'You\'ve been referred!',
    text: `Hello ${referee},\n\nYou've been referred by ${referrerUsername}. Welcome to our platform! Click here to sign up: ${process.env.FRONTEND_URL}/signup?ref=${referralCode}`,
  };

  await transporter.sendMail(mailOptions);
};
