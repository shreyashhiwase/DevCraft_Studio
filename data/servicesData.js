// data/servicesData.js
// Content source for the individual /services/:slug pages.
// Kept as a single data file so the page structure stays consistent,
// fast to maintain, and rich in SEO metadata.

const commonProcess = [
  { n: '01', title: 'Discover', desc: 'We start by understanding your business, users and commercial goals — not just a feature checklist.' },
  { n: '02', title: 'Plan & Scope', desc: 'We define the technical architecture, choose battle-tested technologies and set clear, visible milestones.' },
  { n: '03', title: 'UI/UX Design', desc: 'We craft intuitive, responsive interfaces and user journeys before writing production code.' },
  { n: '04', title: 'Develop', desc: 'We engineer your product in structured sprint cycles with live staging previews.' },
  { n: '05', title: 'Test & Secure', desc: 'We rigorously audit functionality, cross-device responsiveness, security and performance.' },
  { n: '06', title: 'Launch & Support', desc: 'We deploy to production, verify search indexing and provide post-launch warranty support.' },
];

const services = [
  {
    slug: 'website-development',
    title: 'Website Development',
    navLabel: 'Website Development',
    heroTag: 'High-Performance Websites',
    h1: 'Website Development Company in India',
    metaDescription: 'StackifyX is a premier website development company in India. We build fast, mobile-optimized, conversion-focused websites and web apps for businesses across India.',
    intro: 'Your website is the digital front door to your business. We build modern, high-speed websites and web applications engineered to rank on search engines, engage visitors on mobile devices, and convert casual traffic into qualified inquiries and paying customers.',
    seoKeywords: [
      'Website Development Company in India',
      'Professional Website Development Services',
      'Business Website Development',
      'Web Design Company India',
      'Custom Web Development Services'
    ],
    problems: [
      'An outdated, sluggish website that loses potential clients within the first 3 seconds',
      'Poor mobile experience that breaks across modern phone and tablet screen sizes',
      'Low search engine visibility with zero organic customer inquiries from Google',
      'Generic cookie-cutter templates that look identical to your competitors',
      'Lack of clear conversion funnels or direct WhatsApp & lead capture mechanisms'
    ],
    features: [
      'Modern, custom business & corporate websites',
      'High-conversion landing pages for marketing campaigns',
      'Multi-page interactive marketing platforms',
      'Direct WhatsApp and appointment booking integrations',
      'Full technical SEO and Schema.org structured markup',
      'Lightweight, responsive codebase with fast Core Web Vitals',
      'Admin dashboard for easy content and lead management'
    ],
    technologies: ['Node.js', 'Express.js', 'MongoDB', 'HTML5 / Modern CSS', 'REST APIs', 'Cloudflare / Cloud Hosting'],
    benefits: [
      'Full source code ownership — no vendor lock-in or recurring page-builder fees',
      'Designed mobile-first for the 80%+ of Indian traffic on mobile devices',
      'Fast loading speed that boosts Google rankings and reduces bounce rates',
      'Direct, transparent remote collaboration with experienced engineers'
    ],
    faq: [
      { q: 'Do you use ready-made templates or build custom websites?', a: 'We design and code custom websites specifically tailored to your brand, industry, and conversion goals. This ensures distinctive branding, clean code, and superior loading speed.' },
      { q: 'Will my website rank on Google in India?', a: 'Yes. Every website we build includes complete technical SEO from day one: semantic HTML5, Schema.org markup, meta tags, XML sitemaps, image optimization, and mobile-first responsiveness.' },
      { q: 'Can you integrate WhatsApp and payment buttons on our website?', a: 'Yes. We seamlessly integrate instant WhatsApp chat buttons, custom contact forms, and Indian payment gateways like Razorpay for instant customer action.' },
      { q: 'How long does it take to develop a professional business website?', a: 'A standard professional business website typically takes 2 to 3 weeks, while larger portal builds take 4 to 6 weeks depending on requirements.' }
    ],
    related: ['ecommerce-development', 'custom-software-development', 'api-development']
  },
  {
    slug: 'ecommerce-development',
    title: 'E-Commerce Development',
    navLabel: 'E-Commerce',
    heroTag: 'Conversion-Focused Stores',
    h1: 'E-Commerce Website Development Company in India',
    metaDescription: 'Custom e-commerce website development in India. StackifyX builds secure, high-conversion online stores with Razorpay, inventory tracking & pan-India courier sync.',
    intro: 'An online store must be more than a digital catalog — it must be an automated sales machine. We engineer bespoke e-commerce platforms tailored to Indian buying habits, featuring fast checkout, UPI and card payments, automated inventory management, and smooth order fulfillment.',
    seoKeywords: [
      'E-commerce Website Development India',
      'Online Store Development Company',
      'Custom E-commerce Solutions',
      'E-commerce Web Development Services',
      'B2B E-commerce Portal Development'
    ],
    problems: [
      'High monthly subscription fees and transaction cuts from proprietary store builders',
      'Complex multi-step checkout flows leading to high shopping cart abandonment',
      'Clunky inventory and variant management that limits product scaling',
      'Fragile payment gateway integrations that fail during peak festive traffic'
    ],
    features: [
      'Intuitive product catalog with categories, filters and search',
      'High-speed, friction-free checkout optimized for mobile shoppers',
      'Seamless Indian payment gateway integration (Razorpay, UPI, Cards, NetBanking)',
      'Automated order tracking, customer accounts, and email/SMS alerts',
      'Comprehensive admin portal for managing products, inventory, and promotions',
      'Coupons, discounts, and festive offer management system'
    ],
    technologies: ['Node.js', 'Express.js', 'MongoDB', 'Razorpay Payments', 'REST APIs', 'AWS / Cloudflare'],
    benefits: [
      'You own the platform 100% with zero recurring developer license penalties',
      'Flawless UPI payment flows that convert Indian shoppers rapidly',
      'Scalable architecture capable of handling thousands of simultaneous visitors',
      'Custom features like B2B wholesale pricing, custom bulk orders, or sample requests'
    ],
    faq: [
      { q: 'Can you integrate UPI and Indian payment gateways?', a: 'Yes. We specialize in Razorpay integrations providing smooth 1-click UPI payments (Google Pay, PhonePe, Paytm), net banking, debit/credit cards, and EMI options.' },
      { q: 'Can I easily add new products and manage inventory myself?', a: 'Yes. You receive an intuitive administrative dashboard where non-technical staff can add products, update prices, adjust stock levels, and fulfill orders.' },
      { q: 'How do you handle shipping and courier tracking?', a: 'We can integrate shipping APIs (such as Shiprocket, Delhivery, or custom courier webhooks) for automated rate calculation and tracking numbers.' }
    ],
    related: ['website-development', 'custom-software-development', 'api-development']
  },
  {
    slug: 'custom-software-development',
    title: 'Custom Software Development',
    navLabel: 'Custom Software',
    heroTag: 'Tailored Business Systems',
    h1: 'Custom Software Development Company in India',
    metaDescription: 'Custom software development company in India. StackifyX designs and builds ERP, CRM, business management software & automated platforms for growing companies.',
    intro: 'Off-the-shelf software forces your business into someone else\'s rigid box. StackifyX builds tailored software systems that mirror how your business actually runs — eliminating spreadsheet chaos, connecting departments, and giving leadership real-time operational visibility.',
    seoKeywords: [
      'Custom Software Development Company India',
      'Business Software Development',
      'ERP and CRM Development India',
      'Enterprise Software Solutions',
      'Custom Web Application Development'
    ],
    problems: [
      'Disjointed spreadsheets and manual record-keeping that lead to expensive errors',
      'Expensive per-user monthly SaaS fees that eat into operational margins',
      'Commercial off-the-shelf tools that lack critical features unique to your business',
      'Data silos between sales, warehouse, billing, and customer service teams'
    ],
    features: [
      'Bespoke Business Management Systems (BMS)',
      'Tailored CRM & Sales Pipeline Management portals',
      'Custom ERP, Inventory & Procurement platforms',
      'Role-based access control (Admin, Manager, Staff, Client)',
      'Real-time analytics dashboards and automated reporting',
      'Real-time communication and notification engines via WebSockets'
    ],
    technologies: ['Node.js', 'Express.js', 'MongoDB', 'Socket.IO', 'RESTful APIs', 'Modern JavaScript'],
    benefits: [
      'Software sculpted 100% around your exact business logic and workflow',
      'Unlimited internal users without costly per-seat monthly subscription licenses',
      'Centralized single source of truth for your business data and analytics',
      'Modular architecture that expands as your company grows into new verticals'
    ],
    faq: [
      { q: 'What types of custom software do you build?', a: 'We build operations management systems, custom CRMs, inventory and billing tools, client management portals, and industry-specific solutions (such as clinic and legal management platforms).' },
      { q: 'Can custom software integrate with our existing accounting or billing software?', a: 'Yes. We build custom API connectors to sync data seamlessly between your new software and existing systems like Tally, Zoho, or banking APIs.' },
      { q: 'How do you ensure data security in custom software?', a: 'We enforce strict role-based access control, encrypted sessions, secure password hashing (bcrypt), sanitized database inputs, and regular automated database backups.' }
    ],
    related: ['website-development', 'api-development', 'ai-business-automation']
  },
  {
    slug: 'mobile-app-development',
    title: 'Mobile App Development',
    navLabel: 'Mobile Apps',
    heroTag: 'iOS & Android Applications',
    h1: 'Mobile App Development Company in India',
    metaDescription: 'Mobile app development company in India. StackifyX builds high-performance cross-platform Android and iOS applications with real-time features and secure APIs.',
    intro: 'Mobile apps connect your business directly to your customers\' pockets. We engineer high-performance cross-platform mobile applications for Android and iOS that share unified backend data with your web platforms, giving users a smooth, responsive, and reliable digital experience.',
    seoKeywords: [
      'Mobile App Development Company India',
      'Android and iOS App Development',
      'Cross-Platform Mobile App Development',
      'Custom Mobile Application Services',
      'Business Mobile Apps India'
    ],
    problems: [
      'Customers expect a convenient mobile app that your business currently lacks',
      'High cost and maintenance overhead of building separate native iOS and Android apps',
      'Laggy user interfaces and poor offline capabilities that frustrate users',
      'Mobile apps that fail to sync real-time data with your central database'
    ],
    features: [
      'Cross-platform mobile applications (single codebase for iOS & Android)',
      'Secure customer authentication (Google OAuth, Phone OTP, Email)',
      'Instant push notifications for offers, reminders, and updates',
      'Integrated payment gateways supporting 1-tap UPI and card checkout',
      'Offline data caching and smooth synchronization upon reconnection',
      'Robust backend API architecture connected to your web database'
    ],
    technologies: ['React Native / Flutter Ecosystem', 'Node.js Backend', 'MongoDB', 'Firebase Push Notifications', 'REST APIs'],
    benefits: [
      'Single codebase reduces initial development cost and ongoing maintenance by 40%',
      'Direct customer retention through timely, targeted push notifications',
      'Unified data across website, mobile app, and admin dashboard',
      'Full guidance through Google Play Store and Apple App Store release processes'
    ],
    faq: [
      { q: 'Do you build apps for both Android and iPhone?', a: 'Yes. We develop cross-platform mobile applications that run smoothly on both Android and iOS devices, ensuring broad market reach at optimal cost.' },
      { q: 'Can the mobile app connect to our existing website database?', a: 'Yes. We build secure REST APIs so your website, mobile app, and administrative dashboard share the same real-time database.' },
      { q: 'Do you assist with publishing on Google Play Store and Apple App Store?', a: 'Yes. We guide you through account setup, build generation, screenshot preparation, and app store compliance submission.' }
    ],
    related: ['website-development', 'custom-software-development', 'api-development']
  },
  {
    slug: 'ai-business-automation',
    title: 'AI & Business Automation',
    navLabel: 'AI & Automation',
    heroTag: 'Smart Automation & AI',
    intro: 'You don\'t need expensive speculative AI models — you need less repetitive busywork. We integrate practical AI capabilities and automated workflows into your existing business systems so your team can focus on closing deals, serving clients, and driving revenue.',
    h1: 'AI & Business Automation Services in India',
    metaDescription: 'AI and business automation services in India. StackifyX helps businesses automate repetitive workflows, customer follow-ups & data processing with practical AI tools.',
    seoKeywords: [
      'AI & Business Automation India',
      'Business Process Automation India',
      'AI Workflow Automation',
      'Automated Lead Qualification',
      'Custom AI Integration Services'
    ],
    problems: [
      'Hours lost each week manually entering data between spreadsheets and software',
      'Slow response times to new leads resulting in lost sales to competitors',
      'Repetitive customer inquiries taking up valuable customer support time',
      'Desire to adopt AI tools without knowing where to achieve real commercial ROI'
    ],
    features: [
      'Automated lead intake and instant WhatsApp/Email follow-up sequences',
      'Intelligent document and invoice data extraction',
      'AI-powered customer inquiry assistants and triage bots',
      'Automated multi-system data synchronization (CRM to Billing to Sheets)',
      'Custom notification triggers for operational milestones',
      'API-based integration with OpenAI, Gemini, and specialized AI models'
    ],
    technologies: ['Node.js', 'REST APIs', 'OpenAI / Gemini APIs', 'Webhook Automation', 'MongoDB'],
    benefits: [
      'Reclaim 10+ hours per employee every week by automating routine data entry',
      'Instant lead response within seconds, dramatically boosting conversion rates',
      'Zero expensive internal AI infrastructure — pay only for what you use via secure APIs',
      'Incremental deployment: automate one high-impact workflow first, then expand'
    ],
    faq: [
      { q: 'What business processes can be automated easily?', a: 'The highest-ROI starting points are automated lead routing, instant WhatsApp inquiry responses, invoice processing, order notification triggers, and syncing data between different tools.' },
      { q: 'Do we need a massive dataset or machine learning team?', a: 'Not at all. We leverage proven, enterprise-grade AI APIs (such as OpenAI and Google Gemini) and connect them directly into your existing business workflow.' },
      { q: 'Is automation suitable for small businesses?', a: 'Yes! Small teams benefit the most because automation eliminates the need to hire additional administrative staff for repetitive tasks.' }
    ],
    related: ['custom-software-development', 'api-development', 'website-development']
  },
  {
    slug: 'api-development',
    title: 'API Development & Integration',
    navLabel: 'API Integration',
    heroTag: 'Seamless System Connectors',
    h1: 'API Development & Integration Services in India',
    metaDescription: 'Expert API development and third-party integration services in India. StackifyX builds secure RESTful APIs, payment integrations, WhatsApp APIs & webhook systems.',
    intro: 'Modern business requires interconnected systems. We design, build, and integrate secure, high-performance REST APIs that bridge your web platforms, mobile apps, payment gateways, ERPs, CRMs, and third-party services into a unified digital infrastructure.',
    seoKeywords: [
      'API Development Company India',
      'REST API Integration Services',
      'Payment Gateway Integration India',
      'WhatsApp Business API Integration',
      'Custom API Development'
    ],
    problems: [
      'Valuable business data trapped in disconnected legacy tools and spreadsheets',
      'Manual copy-pasting of customer data between website, CRM, and accounting software',
      'Fragile, undocumented APIs that break during updates or traffic spikes',
      'Inability to partner with external platforms due to lacking an API layer'
    ],
    features: [
      'Custom RESTful API design, development and documentation',
      'Payment gateway integrations (Razorpay, Stripe, Cashfree)',
      'WhatsApp Business API and SMS gateway integrations',
      'Third-party cloud software integrations (CRMs, ERPs, Accounting, Logistics)',
      'Secure API authentication (OAuth2, JWT, API Key tokens)',
      'Real-time Webhook receivers and automated event dispatchers'
    ],
    technologies: ['Node.js', 'Express.js', 'REST Architecture', 'JSON', 'JWT / OAuth', 'MongoDB'],
    benefits: [
      'Eliminate manual data transfer errors between business tools',
      'Enable your product to launch mobile apps and partner integrations effortlessly',
      'Thoroughly documented endpoints with Swagger / Postman documentation',
      'High security with rate limiting, payload validation, and SSL encryption'
    ],
    faq: [
      { q: 'What is API integration and why does my business need it?', a: 'An API acts as a digital bridge between two software systems. For example, connecting your website with your billing software ensures that an online order automatically creates an invoice without manual data entry.' },
      { q: 'Can you integrate the official WhatsApp Business API?', a: 'Yes. We integrate WhatsApp Business APIs for automated order confirmations, inquiry responses, appointment reminders, and support routing.' },
      { q: 'Do you provide documentation for custom APIs you build?', a: 'Yes. Every API project includes clear, structured documentation for endpoints, request payloads, authentication, and error handling.' }
    ],
    related: ['custom-software-development', 'website-development', 'ecommerce-development']
  },

  // Retain legacy slugs and specialized services for backwards compatibility
  {
    slug: 'saas-development',
    title: 'SaaS Platform Development',
    navLabel: 'SaaS Platforms',
    heroTag: 'Multi-Tenant Cloud Software',
    h1: 'SaaS Platform Development Company in India',
    metaDescription: 'StackifyX builds scalable SaaS MVPs and subscription software platforms with authentication, billing & multi-tenant architectures.',
    intro: 'Turn your software product idea into a commercial SaaS reality. We build multi-user platforms with role-based permissions, automated subscription billing, and administrative dashboards.',
    problems: ['Unclear technical roadmap for SaaS MVP', 'Architectures that cannot scale past 50 users', 'No admin portal to manage subscribers'],
    features: ['Multi-tenant database design', 'Subscription & recurring billing', 'Role-based access', 'Interactive analytics dashboards'],
    technologies: ['Node.js', 'MongoDB', 'Razorpay Subscriptions', 'Socket.IO'],
    benefits: ['Scalable architecture from day one', 'Built-in administrative controls', 'Fast time to market'],
    faq: [{ q: 'Can you build a multi-tenant SaaS MVP?', a: 'Yes, we specialize in building scalable multi-user SaaS architectures.' }],
    related: ['custom-software-development', 'website-development', 'api-development']
  },
  {
    slug: 'ui-ux-design',
    title: 'UI/UX Design Services',
    navLabel: 'UI/UX Design',
    heroTag: 'Intuitive Interfaces',
    h1: 'UI/UX Design Services in India',
    metaDescription: 'Professional UI/UX design for web applications, mobile apps & corporate websites. Clean, accessible, and user-centric design systems.',
    intro: 'Great software starts with clear user flows. We design modern, high-contrast, accessible interfaces for digital products before writing production code.',
    problems: ['Cluttered interfaces that confuse users', 'High drop-off rates on sign-up flows', 'Inconsistent styling across pages'],
    features: ['Responsive UI design', 'Interactive clickable prototypes', 'Design systems and style guides', 'Mobile-first UX workflows'],
    technologies: ['Figma', 'Modern CSS', 'Design Systems'],
    benefits: ['Clear user pathways that improve conversion', 'Reduced development rework', 'Consistent brand presentation'],
    faq: [{ q: 'Do you provide design before development?', a: 'Yes, we finalize all wireframes and visual designs before coding.' }],
    related: ['website-development', 'mobile-app-development', 'custom-software-development']
  },
  {
    slug: 'website-maintenance',
    title: 'Website Maintenance & Support',
    navLabel: 'Maintenance & Support',
    heroTag: 'Continuous Care',
    h1: 'Website Maintenance & Support Services',
    metaDescription: 'Reliable website maintenance and support services in India. Security updates, performance tuning, bug fixes & feature enhancements.',
    intro: 'Keep your digital products fast, secure, and always online with our dedicated website maintenance and post-launch support services.',
    problems: ['Unresponsive developers after project handover', 'Outdated dependencies causing security risks', 'Slow page speeds over time'],
    features: ['Routine security audits', 'Performance & speed optimization', 'Scheduled database backups', 'Feature additions and copy updates'],
    technologies: ['Node.js', 'MongoDB', 'Cloud Hosting', 'SSL/Security'],
    benefits: ['Peace of mind knowing engineers are on call', 'Continuous high search engine rankings', 'Zero unexpected downtime'],
    faq: [{ q: 'Can you maintain a website not built by StackifyX?', a: 'We can evaluate and maintain existing Node.js or modern web projects on a case-by-case basis.' }],
    related: ['website-development', 'custom-software-development']
  }
];

const bySlug = Object.fromEntries(services.map(s => [s.slug, s]));

// Backwards-compatible aliases
bySlug['web-development'] = bySlug['website-development'];
bySlug['ai-automation'] = bySlug['ai-business-automation'];

module.exports = { services, bySlug, commonProcess };
