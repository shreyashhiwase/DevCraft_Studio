// data/caseStudiesData.js
// Case-study detail pages for /work/:slug and /portfolio/:slug.
// Verified real projects developed by StackifyX.

const caseStudies = [
  {
    slug: 'open-challenge',
    name: 'Open Challenge',
    category: 'E-Commerce & Retail Platform',
    industry: 'ecommerce',
    status: 'Live & Operational',
    tagline: 'Custom e-commerce platform for sports, footwear & fashion retail.',
    problem: 'Open Challenge needed an independent online store to showcase its extensive apparel, footwear, and sports fashion collections. Relying solely on a physical showroom or third-party marketplaces meant paying high commissions and lacking direct customer relationships.',
    solution: 'StackifyX built a custom, high-speed e-commerce platform with an intuitive product catalog, mobile-first checkout, Razorpay payment processing, instant WhatsApp order inquiries, and an admin panel for stock and product management.',
    features: [
      'Comprehensive product catalog with size & variant management',
      'Mobile-first, lightning-fast shopping cart and checkout',
      'Online payments via Razorpay (UPI, Cards, NetBanking)',
      'Instant WhatsApp ordering channel for customer convenience',
      'Administrative dashboard for inventory and order management',
      'Local delivery and pin code fulfillment tracking'
    ],
    process: [
      'Analyzed customer shopping behavior and catalog requirements for footwear and fashion retail.',
      'Designed a clean, modern UI showcasing high-resolution product imagery and clear sizing charts.',
      'Engineered a scalable Node.js/MongoDB e-commerce backend with secure session-based cart management.',
      'Integrated Razorpay and WhatsApp communication webhooks for seamless checkout and customer alerts.',
      'Deployed on production infrastructure with full mobile optimization and Core Web Vitals speed tuning.'
    ],
    technologies: ['Node.js', 'Express.js', 'MongoDB', 'Razorpay Payments', 'HTML5 / Modern CSS', 'REST APIs'],
    liveNote: 'Live online store operating at openchallengeakola.in',
    liveLink: 'https://www.openchallengeakola.in/',
    relatedServices: ['ecommerce-development', 'website-development', 'api-development'],
  },
  {
    slug: 'stackifyx-platform',
    name: 'StackifyX Platform',
    category: 'Web Application · Custom Software',
    industry: null,
    status: 'Live & In Active Development',
    tagline: 'The client project platform you’re using right now.',
    problem: 'Client project work was scattered across emails and chats, with no shared view of progress, inquiries or payments — for both the client and the team.',
    solution: 'A full project-service platform where clients submit inquiries, track project status, chat with the team in real time, and manage payments — with a separate admin dashboard for the internal team to manage everything in one place.',
    features: [
      'Client & admin dashboards',
      'Project inquiry submission & tracking',
      'Real-time chat via Socket.IO',
      'Payment tracking with Razorpay integration',
      'Role-based authentication & Google OAuth'
    ],
    process: [
      'Identified that client communication and project visibility were the biggest operational gap, not a missing marketing site.',
      'Designed separate client and admin experiences around the actual inquiry-to-delivery workflow.',
      'Built authentication, real-time chat and payment tracking as core features rather than add-ons.',
      'Continues to evolve as an active, in-development product — this site is a live example of the platform.'
    ],
    technologies: ['Node.js', 'Express.js', 'MongoDB', 'EJS', 'Socket.IO', 'Passport.js', 'Razorpay'],
    liveNote: 'You’re using this platform right now — the site you’re on is the product.',
    liveLink: '/',
    relatedServices: ['web-application-development', 'custom-software-development'],
  },
  {
    slug: 'healthcare-platform',
    name: 'Healthcare Platform',
    category: 'Web Application · Custom Software',
    industry: 'healthcare',
    status: 'Verified Project Build',
    tagline: 'Appointment scheduling, patient records and billing in one system.',
    problem: 'Clinics needed a digital way to manage appointments, patient records and billing instead of relying on paper or disconnected tools.',
    solution: 'A healthcare management platform covering appointment scheduling, patient records and digital billing for clinics and hospitals, with dashboards to see activity at a glance.',
    features: [
      'Appointment scheduling & calendar',
      'Patient records management (EMR)',
      'Digital billing & diagnostic invoices',
      'Data visualization dashboards'
    ],
    process: [
      'Mapped the day-to-day workflow of clinic staff — scheduling, intake, billing — before designing any screens.',
      'Built a single patient record system to replace paper-based and spreadsheet-based tracking.',
      'Added visual dashboards so clinic activity is visible at a glance instead of buried in records.',
      'Structured billing as a digital, trackable workflow instead of a manual, ad-hoc process.'
    ],
    technologies: ['Node.js', 'Express.js', 'MongoDB', 'Chart.js', 'REST APIs'],
    liveNote: null,
    liveLink: null,
    relatedServices: ['custom-software-development', 'web-application-development'],
  },
  {
    slug: 'trustlex-aj',
    name: 'TRUSTLEX.AJ',
    category: 'Web Application · Custom Software',
    industry: 'legal',
    status: 'Verified Project Build',
    tagline: 'Connecting clients with certified advocates for legal consultations.',
    problem: 'People looking for legal help often struggle to find and connect with the right advocate for their specific situation.',
    solution: 'A legal consultation platform connecting clients with certified advocates and lawyers, with a structured booking flow and advocate profiles built on a SaaS-style access model.',
    features: [
      'Client-to-lawyer matching',
      'Consultation booking flow',
      'Advocate profiles with practice areas',
      'SaaS-style access model'
    ],
    process: [
      'Started from the core problem: clients don’t know which lawyer fits their situation, and advocates lack an organized way to be found.',
      'Designed advocate profile pages to surface specialization and relevant details clearly.',
      'Built a structured consultation booking flow to replace informal phone/email coordination.',
      'Architected the platform with SaaS-style access from the start, for ongoing multi-user use.'
    ],
    technologies: ['Node.js', 'Express.js', 'MongoDB', 'EJS', 'REST APIs'],
    liveNote: null,
    liveLink: null,
    relatedServices: ['web-application-development', 'custom-software-development'],
  },
];

const bySlug = Object.fromEntries(caseStudies.map(c => [c.slug, c]));

module.exports = { caseStudies, bySlug };
