// controllers/contactController.js
const ContactMessage = require('../models/ContactMessage');
const { sendContactNotification } = require('../utils/email');

const submitContact = async (req, res) => {
  try {
    const { name, email, phone, company, projectType, budgetRange, description } = req.body;

    if (!name || !email || !description) {
      req.flash('error', 'Please fill in your name, email and project description.');
      return res.redirect('/contact');
    }

    const msg = await ContactMessage.create({
      name, email, phone, company, projectType, budgetRange, description,
    });

    // Best-effort notification email — never block the user's confirmation
    // on email delivery (Render/Brevo may be unconfigured in some environments).
    sendContactNotification(msg).catch(() => {});

    req.flash('success', 'Thanks! Your project inquiry has been received — our team will get back to you soon.');
    return res.redirect('/contact');
  } catch (err) {
    console.error('Contact form error:', err.message);
    req.flash('error', 'Something went wrong sending your message. Please try again or email us directly.');
    return res.redirect('/contact');
  }
};

module.exports = { submitContact };
