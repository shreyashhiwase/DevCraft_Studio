// app.js - Main application entry point
require('dotenv').config();
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const path = require('path');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const methodOverride = require('method-override');

const connectDB = require('./config/db');
const { attachUser } = require('./middleware/auth');
const setupSocket = require('./socket');

// Connect to MongoDB
connectDB();

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: { origin: '*', methods: ['GET', 'POST'] }
});

// ===== VIEW ENGINE =====
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// ===== STATIC FILES =====
app.use(express.static(path.join(__dirname, 'public')));

// ===== MIDDLEWARE =====
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

// Session configuration
const sessionMiddleware = session({
  secret: process.env.SESSION_SECRET || 'devcraft_secret_2024',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI,
    touchAfter: 24 * 3600
  }),
  cookie: {
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production'
  }
});

app.use(sessionMiddleware);

// Flash messages
app.use(flash());

// Attach user and flash to locals
app.use(attachUser);
app.use((req, res, next) => {
  res.locals.successMsg = req.flash('success');
  res.locals.errorMsg = req.flash('error');
  res.locals.appName = 'DevCraft Studio';
  next();
});

// Setup Socket.IO
setupSocket(io, sessionMiddleware);

// ===== ROUTES =====
app.use('/auth', require('./routes/auth'));
app.use('/', require('./routes/projects'));
app.use('/', require('./routes/inquiries'));
app.use('/', require('./routes/payments'));
app.use('/', require('./routes/chat'));
app.use('/', require('./routes/reviews'));

// Landing page
app.get('/', (req, res) => {
  if (req.session.userId) {
    return res.redirect(req.session.userRole === 'admin' ? '/admin/dashboard' : '/dashboard');
  }
  res.render('landing', { title: 'DevCraft Studio - Professional Project Services' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).render('error', { title: '404 - Not Found', code: 404, message: 'Page not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render('error', { title: '500 - Server Error', code: 500, message: 'Something went wrong' });
});

// ===== ADMIN SEEDER =====
const seedAdmin = async () => {
  try {
    const User = require('./models/User');
    const adminExists = await User.findOne({ role: 'admin' });
    if (!adminExists) {
      await User.create({
        name: process.env.ADMIN_NAME || 'Admin',
        email: process.env.ADMIN_EMAIL || 'admin@devcraft.com',
        password: process.env.ADMIN_PASSWORD || 'Admin@123456',
        role: 'admin'
      });
      console.log('✅ Admin user created');
      console.log(`   Email: ${process.env.ADMIN_EMAIL || 'admin@devcraft.com'}`);
      console.log(`   Password: ${process.env.ADMIN_PASSWORD || 'Admin@123456'}`);
    }
  } catch (err) {
    console.error('Admin seeder error:', err.message);
  }
};

// ===== START SERVER =====
const PORT = process.env.PORT || 3000;
server.listen(PORT, async () => {
  await seedAdmin();
  // Verify email configuration on startup
  const { verifyEmailConfig } = require('./utils/email');
  await verifyEmailConfig();
  console.log(`\n🚀 DevCraft Studio running on http://localhost:${PORT}`);
  console.log(`📱 Environment: ${process.env.NODE_ENV || 'development'}\n`);
});

module.exports = { app, server };
