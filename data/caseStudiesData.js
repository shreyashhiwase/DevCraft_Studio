// data/caseStudiesData.js
//
// Case-study detail pages for /work/:slug.
// Content here is a direct, structured version of what's already shown on
// /work — no new claims, no invented metrics, client counts, or results.
// Where a numeric outcome isn't verified, this file describes what the
// platform does rather than claiming an unverified result.

const caseStudies = [
    {
      slug: 'stackifyx-platform',
      name: 'StackifyX Platform',
      category: 'Web Application · Custom Software',
      industry: null,
      status: 'Live & In Active Development',
      tagline: 'The client project platform you\u2019re using right now.',
      problem: 'Client project work was scattered across emails and chats, with no shared view of progress, inquiries or payments — for both the client and the team.',
      solution: 'A full project-service platform where clients submit inquiries, track project status, chat with the team in real time, and manage payments — with a separate admin dashboard for the internal team to manage everything in one place.',
      features: ['Client & admin dashboards', 'Project inquiry submission & tracking', 'Real-time chat via Socket.IO', 'Payment tracking', 'Role-based authentication'],
      process: [
        'Identified that client communication and project visibility were the biggest operational gap, not a missing marketing site.',
        'Designed separate client and admin experiences around the actual inquiry-to-delivery workflow.',
        'Built authentication, real-time chat and payment tracking as core features rather than add-ons.',
        'Continues to evolve as an active, in-development product — this site is a live example of the platform.',
      ],
      technologies: ['Node.js', 'Express.js', 'MongoDB', 'EJS', 'Socket.IO', 'Passport.js'],
      liveNote: 'You\u2019re using this platform right now — the site you\u2019re on is the product.',
      liveLink: '/',
      relatedServices: ['saas-development', 'custom-software-development'],
    },
    {
      slug: 'healthcare-platform',
      name: 'Healthcare Platform',
      category: 'Web Application · Custom Software',
      industry: 'healthcare',
      status: null,
      tagline: 'Appointment scheduling, patient records and billing in one system.',
      problem: 'Clinics needed a digital way to manage appointments, patient records and billing instead of relying on paper or disconnected tools.',
      solution: 'A healthcare management platform covering appointment scheduling, patient records and digital billing for clinics and hospitals, with dashboards to see activity at a glance.',
      features: ['Appointment scheduling', 'Patient records management', 'Digital billing', 'Data visualization dashboards'],
      process: [
        'Mapped the day-to-day workflow of clinic staff — scheduling, intake, billing — before designing any screens.',
        'Built a single patient record system to replace paper-based and spreadsheet-based tracking.',
        'Added visual dashboards so clinic activity is visible at a glance instead of buried in records.',
        'Structured billing as a digital, trackable workflow instead of a manual, ad-hoc process.',
      ],
      technologies: ['Node.js', 'MongoDB', 'Chart.js'],
      liveNote: null,
      liveLink: null,
      relatedServices: ['custom-software-development', 'web-development'],
    },
    {
      slug: 'trustlex-aj',
      name: 'TRUSTLEX.AJ',
      category: 'Web Application · Custom Software',
      industry: 'legal',
      status: null,
      tagline: 'Connecting clients with certified advocates for legal consultations.',
      problem: 'People looking for legal help often struggle to find and connect with the right advocate for their specific situation.',
      solution: 'A legal consultation platform connecting clients with certified advocates and lawyers, with a structured booking flow and advocate profiles built on a SaaS-style access model.',
      features: ['Client-to-lawyer matching', 'Consultation booking flow', 'Advocate profiles', 'SaaS-style access model'],
      process: [
        'Started from the core problem: clients don\u2019t know which lawyer fits their situation, and advocates lack an organized way to be found.',
        'Designed advocate profile pages to surface specialization and relevant details clearly.',
        'Built a structured consultation booking flow to replace informal phone/email coordination.',
        'Architected the platform with SaaS-style access from the start, for ongoing multi-user use.',
      ],
      technologies: ['Node.js', 'Express.js', 'MongoDB', 'EJS'],
      liveNote: null,
      liveLink: null,
      relatedServices: ['saas-development', 'custom-software-development'],
    },
  ];
  
  const bySlug = Object.fromEntries(caseStudies.map(c => [c.slug, c]));
  
  module.exports = { caseStudies, bySlug };
  