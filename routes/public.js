// routes/public.js
// Public marketing & SEO pages for StackifyX:
// Services, Industries, City Landing Pages, Locations Directory,
// Work/Case Studies, Blog, Why Choose Us, About, Contact & Legal.
const express = require('express');
const router = express.Router();
const { submitContact } = require('../controllers/contactController');
const { services, bySlug, commonProcess } = require('../data/servicesData');
const { industries, bySlug: industryBySlug } = require('../data/industriesData');
const { posts, bySlug: postBySlug } = require('../data/blogData');
const { caseStudies, bySlug: caseStudyBySlug } = require('../data/caseStudiesData');
const { cities, cityBySlug, stateGroups } = require('../data/cityData');

const TERMS_LAST_UPDATED = 'August 2026';
const PRIVACY_LAST_UPDATED = 'August 2026';

// ─── 301 PERMANENT REDIRECTS FOR LEGACY URLS ──────────────────────────────────
router.get('/services/web-development', (req, res) => res.redirect(301, '/services/website-development'));
router.get('/services/ai-automation', (req, res) => res.redirect(301, '/services/ai-business-automation'));

// ─── SERVICES ─────────────────────────────────────────────────────────────────
router.get('/services', (req, res) => {
  res.render('services', {
    title: 'Software & Website Development Services in India — StackifyX',
    metaDescription: 'Websites, web applications, mobile apps, custom software, e-commerce stores & AI automation — explore the software development services StackifyX provides across India.',
    navActive: 'services',
    canonicalPath: '/services',
  });
});

router.get('/services/:slug', (req, res, next) => {
  const service = bySlug[req.params.slug];
  if (!service) return next();

  const relatedServices = (service.related || [])
    .map(slug => bySlug[slug])
    .filter(Boolean);

  res.render('service-detail', {
    title: `${service.title} — StackifyX`,
    metaDescription: service.metaDescription,
    navActive: 'services',
    canonicalPath: `/services/${service.slug}`,
    service,
    relatedServices,
    commonProcess,
  });
});

// ─── LOCATIONS DIRECTORY & CITY LANDING PAGES ──────────────────────────────────
router.get('/locations', (req, res) => {
  res.render('locations', {
    title: 'Locations We Serve Across India — StackifyX Software Development',
    metaDescription: 'StackifyX provides professional website development, custom software, and digital solutions to businesses across major cities in India via remote collaboration.',
    navActive: 'locations',
    canonicalPath: '/locations',
    cities,
    stateGroups,
  });
});

router.get('/website-development-company-in-:city', (req, res, next) => {
  const fullSlug = `website-development-company-in-${req.params.city.toLowerCase()}`;
  const city = cityBySlug[fullSlug];
  if (!city) return next();

  // Find other cities in the same state group or popular cities for internal linking
  const nearbyCities = cities
    .filter(c => c.slug !== city.slug)
    .slice(0, 6);

  // Top services for city interlinking
  const featuredServices = services.slice(0, 6);

  res.render('city-detail', {
    title: city.metaTitle,
    metaDescription: city.metaDescription,
    navActive: 'locations',
    canonicalPath: `/${city.slug}`,
    city,
    nearbyCities,
    featuredServices,
    commonProcess,
  });
});

// ─── INDUSTRIES ───────────────────────────────────────────────────────────────
router.get('/industries', (req, res) => {
  res.render('industries', {
    title: 'Industries We Build For — StackifyX Digital Solutions',
    metaDescription: 'StackifyX builds digital solutions across industries — healthcare, coaching, e-commerce, manufacturing, legal, real estate, and growing startups.',
    navActive: 'industries',
    canonicalPath: '/industries',
    industries,
  });
});

router.get('/industries/:slug', (req, res, next) => {
  const industry = industryBySlug[req.params.slug];
  if (!industry) return next();

  const relatedServices = (industry.relatedServices || [])
    .map(slug => bySlug[slug])
    .filter(Boolean);

  res.render('industry-detail', {
    title: `Digital Solutions for ${industry.name} — StackifyX`,
    metaDescription: industry.metaDescription,
    navActive: 'industries',
    canonicalPath: `/industries/${industry.slug}`,
    industry,
    relatedServices,
  });
});

// ─── BLOG ─────────────────────────────────────────────────────────────────────
router.get('/blog', (req, res) => {
  const sorted = [...posts].sort((a, b) => new Date(b.publishDate) - new Date(a.publishDate));
  res.render('blog', {
    title: 'Blog & Engineering Insights — StackifyX',
    metaDescription: 'Practical guides on website development costs, SEO in India, coaching websites, e-commerce architecture, and business automation from the StackifyX team.',
    navActive: 'blog',
    canonicalPath: '/blog',
    posts: sorted,
  });
});

router.get('/blog/:slug', (req, res, next) => {
  const post = postBySlug[req.params.slug];
  if (!post) return next();

  const relatedService = post.relatedService ? bySlug[post.relatedService] : null;
  const recentPosts = posts.filter(p => p.slug !== post.slug).slice(0, 3);

  res.render('blog-post', {
    title: `${post.title} — StackifyX Blog`,
    metaDescription: post.metaDescription,
    navActive: 'blog',
    canonicalPath: `/blog/${post.slug}`,
    post,
    relatedService,
    recentPosts,
  });
});

// ─── PORTFOLIO / WORK ─────────────────────────────────────────────────────────
router.get('/work', (req, res) => {
  res.render('work', {
    title: 'Our Work & Case Studies — StackifyX Software Development',
    metaDescription: 'Explore real platforms, websites and custom software engineered by StackifyX — including the StackifyX Platform, Healthcare Platform, and TRUSTLEX.AJ.',
    navActive: 'work',
    canonicalPath: '/work',
    caseStudies,
  });
});

router.get('/work/:slug', (req, res, next) => {
  const study = caseStudyBySlug[req.params.slug];
  if (!study) return next();

  const relatedServices = (study.relatedServices || [])
    .map(slug => bySlug[slug])
    .filter(Boolean);
  const relatedIndustry = study.industry ? industryBySlug[study.industry] : null;

  res.render('case-study-detail', {
    title: `${study.name} — StackifyX Case Study`,
    metaDescription: `${study.tagline} A case study on ${study.name}, engineered by StackifyX.`,
    navActive: 'work',
    canonicalPath: `/work/${study.slug}`,
    study,
    relatedServices,
    relatedIndustry,
  });
});

// ─── WHY US ───────────────────────────────────────────────────────────────────
router.get('/why-us', (req, res) => {
  res.render('why-us', {
    title: 'Why Choose StackifyX — India-Wide Digital Engineering Partner',
    metaDescription: 'Discover why Indian businesses choose StackifyX: custom-built solutions, direct engineer communication, scalable architecture, and dedicated post-launch support.',
    navActive: 'why-us',
    canonicalPath: '/why-us',
  });
});

// ─── ABOUT ────────────────────────────────────────────────────────────────────
router.get('/about', (req, res) => {
  res.render('about', {
    title: 'About StackifyX — Software Development & Digital Solutions Company',
    metaDescription: 'StackifyX is a software development and digital solutions company partnering remotely with founders, startups, and businesses across India.',
    navActive: 'about',
    canonicalPath: '/about',
  });
});

// ─── CONTACT & WEBSITE AUDIT REQUEST ──────────────────────────────────────────
router.get('/contact', (req, res) => {
  res.render('contact', {
    title: 'Contact StackifyX — Start Your Digital Project in India',
    metaDescription: 'Get a free consultation or project quotation. Connect with the StackifyX engineering team via contact form or direct WhatsApp.',
    navActive: 'contact',
    canonicalPath: '/contact',
  });
});

router.post('/contact', submitContact);
router.post('/website-audit', submitContact); // Support website audit form submissions

// ─── LEGAL ────────────────────────────────────────────────────────────────────
router.get('/terms', (req, res) => {
  res.render('terms', {
    title: 'Terms of Service — StackifyX',
    metaDescription: 'Read the Terms of Service governing the use of StackifyX services and software development platform.',
    navActive: '',
    canonicalPath: '/terms',
    lastUpdated: TERMS_LAST_UPDATED,
  });
});

router.get('/privacy-policy', (req, res) => {
  res.render('privacy-policy', {
    title: 'Privacy Policy — StackifyX',
    metaDescription: 'Learn how StackifyX collects, uses, protects and manages client and visitor data.',
    navActive: '',
    canonicalPath: '/privacy-policy',
    lastUpdated: PRIVACY_LAST_UPDATED,
  });
});

module.exports = router;
