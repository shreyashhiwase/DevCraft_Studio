// models/ContactMessage.js
// Stores public "Contact Us" project-inquiry leads submitted from the
// marketing site (/contact) by visitors who are not logged in.
// This is intentionally separate from the existing `Inquiry` model, which
// requires an authenticated user and a different field set — keeping the
// two apart avoids touching the existing authenticated inquiry workflow.
const mongoose = require('mongoose');

const ContactMessageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: 150,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
    maxlength: 150,
  },
  phone: {
    type: String,
    trim: true,
    maxlength: 30,
  },
  company: {
    type: String,
    trim: true,
    maxlength: 150,
  },
  projectType: {
    type: String,
    enum: ['website', 'web-application', 'mobile-app', 'custom-software', 'ecommerce', 'ai-automation', 'api-integration', 'other'],
    default: 'other',
  },
  budgetRange: {
    type: String,
    enum: ['below-25k', '25k-50k', '50k-1l', '1l-5l', '5l-plus', 'not-sure'],
    default: 'not-sure',
  },
  description: {
    type: String,
    required: [true, 'Project description is required'],
    trim: true,
    maxlength: 3000,
  },
  status: {
    type: String,
    enum: ['new', 'contacted', 'closed'],
    default: 'new',
  },
}, { timestamps: true });

module.exports = mongoose.model('ContactMessage', ContactMessageSchema);
