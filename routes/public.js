// routes/public.js
// Public marketing pages that extend the existing StackifyX site:
// Services, Work, Why Choose Us, About, Contact.
// These sit alongside the existing landing page and do not touch it.
const express = require('express');
const router = express.Router();
const { submitContact } = require('../controllers/contactController');

router.get('/services', (req, res) => {
  res.render('services', {
    title: 'StackifyX Services — Web, Mobile & Custom Software Development',
    metaDescription: 'Websites, web applications, mobile apps, custom software, e-commerce and AI automation — explore the digital product services StackifyX provides.',
    navActive: 'services',
  });
});

router.get('/work', (req, res) => {
  res.render('work', {
    title: 'StackifyX Work — Projects, Websites & Software Applications',
    metaDescription: 'Explore real projects, platforms and software built by StackifyX — including the StackifyX Platform, a healthcare management system and a legal consultation portal.',
    navActive: 'work',
  });
});

router.get('/why-us', (req, res) => {
  res.render('why-us', {
    title: 'Why Choose StackifyX — Digital Product Development Partner',
    metaDescription: 'See why businesses choose StackifyX: custom-built solutions, transparent development, scalable architecture and post-launch support.',
    navActive: 'why-us',
  });
});

router.get('/about', (req, res) => {
  res.render('about', {
    title: 'About StackifyX — Digital Product Development Company',
    metaDescription: 'StackifyX is a digital product development company helping businesses turn ideas into websites, applications and custom software.',
    navActive: 'about',
  });
});

router.get('/contact', (req, res) => {
  res.render('contact', {
    title: 'Contact StackifyX — Start Your Digital Project',
    metaDescription: 'Tell us what you\'re trying to build. Reach out to StackifyX to start a website, app or custom software project.',
    navActive: 'contact',
  });
});

router.post('/contact', submitContact);

module.exports = router;
