// utils/email.js — Nodemailer email service
// Sends 4 emails: Welcome, Inquiry Accepted, Project Started, Project Completed
const nodemailer = require('nodemailer');

// ─── Guard: check credentials are configured ──────────────────────────────
const credentialsReady = () => {
  const missing = [];
  if (!process.env.EMAIL_USER) missing.push('EMAIL_USER');
  if (!process.env.EMAIL_PASS) missing.push('EMAIL_PASS');
  if (!process.env.EMAIL_FROM) missing.push('EMAIL_FROM');
  if (missing.length) {
    console.warn(`⚠️  Email: missing env vars [${missing.join(', ')}] — email will not be sent.`);
    return false;
  }
  return true;
};

// ─── Create transporter ───────────────────────────────────────────────────
const createTransporter = () => {
  return nodemailer.createTransport({
    host:   process.env.EMAIL_HOST || 'smtp.gmail.com',
    port:   parseInt(process.env.EMAIL_PORT) || 587,
    secure: false,                       // true for port 465, false for 587
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,      // use Gmail App Password, NOT your login password
    },
    tls: {
      rejectUnauthorized: false,         // prevents self-signed cert errors
    },
  });
};

// ─── Verify connection on startup (call once from app.js if needed) ────────
const verifyEmailConfig = async () => {
  if (!credentialsReady()) return false;
  try {
    const transporter = createTransporter();
    await transporter.verify();
    console.log('✅ Email service connected successfully');
    return true;
  } catch (err) {
    console.error('❌ Email service connection failed:', err.message);
    console.error('   Check EMAIL_USER, EMAIL_PASS, EMAIL_HOST in your .env file.');
    return false;
  }
};

// ─── Core send helper ─────────────────────────────────────────────────────
const sendEmail = async ({ to, subject, html }) => {
  if (!credentialsReady()) return;          // silently skip if not configured

  const transporter = createTransporter();
  try {
    const info = await transporter.sendMail({
      from:    `"DevCraft Studio" <${process.env.EMAIL_FROM}>`,
      to,
      subject,
      html,
    });
    console.log(`📧 Email sent → ${to} | MsgID: ${info.messageId}`);
  } catch (err) {
    // Log full error so developer can debug; never crash the request
    console.error(`❌ Email FAILED → ${to} | Subject: ${subject}`);
    console.error('   Error:', err.message);
    if (err.code === 'EAUTH') {
      console.error('   Hint: Gmail App Password required. Enable 2FA → Google Account → Security → App Passwords.');
    }
  }
};

// ─── Beautiful HTML base template ─────────────────────────────────────────
const baseTemplate = (content, title) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    *{margin:0;padding:0;box-sizing:border-box}
    body{font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;background:#07070f;color:#e2e8f0}
    .wrap{max-width:600px;margin:40px auto;background:#111118;border-radius:20px;overflow:hidden;border:1px solid rgba(255,255,255,0.07)}
    .header{background:linear-gradient(135deg,#63b3ed,#a78bfa);padding:44px 36px;text-align:center}
    .header h1{color:#fff;font-size:26px;font-weight:800;letter-spacing:-0.5px;margin-bottom:6px}
    .header p{color:rgba(255,255,255,0.75);font-size:14px}
    .body{padding:40px 36px}
    .body p{color:#94a3b8;line-height:1.75;margin-bottom:16px;font-size:15px}
    .badge{display:inline-block;padding:6px 16px;border-radius:100px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;margin-bottom:24px}
    .badge-success{background:#064e3b;color:#10b981}
    .badge-info{background:#0c4a6e;color:#38bdf8}
    .badge-welcome{background:#3b0764;color:#c084fc}
    .infocard{background:#1a1a26;border-radius:12px;padding:20px 24px;margin:20px 0;border-left:4px solid #63b3ed}
    .infocard h3{color:#e2e8f0;font-size:16px;font-weight:700;margin-bottom:6px}
    .infocard p{color:#8888aa;font-size:14px;margin:0;line-height:1.6}
    .btn{display:inline-block;background:linear-gradient(135deg,#63b3ed,#a78bfa);color:#fff;padding:14px 32px;border-radius:10px;text-decoration:none;font-weight:700;font-size:15px;margin-top:24px}
    .divider{height:1px;background:rgba(255,255,255,0.07);margin:28px 0}
    .footer{background:#0c0c14;padding:28px 36px;text-align:center}
    .footer p{color:#475569;font-size:13px;line-height:1.6}
    .footer strong{color:#63b3ed}
  </style>
</head>
<body>
  <div class="wrap">
    <div class="header">
      <h1>⚡ DevCraft Studio</h1>
      <p>Your Personal Project Service Platform</p>
    </div>
    <div class="body">${content}</div>
    <div class="footer">
      <p>© ${new Date().getFullYear()} <strong>DevCraft Studio</strong>. All rights reserved.</p>
      <p style="margin-top:6px;">If you didn't expect this email, you can safely ignore it.</p>
    </div>
  </div>
</body>
</html>`;

// ─── 1. Welcome email — sent on registration ──────────────────────────────
const sendWelcome = async (user) => {
  console.log(`📧 Sending welcome email to ${user.email}…`);
  await sendEmail({
    to:      user.email,
    subject: '🎉 Welcome to DevCraft Studio!',
    html: baseTemplate(`
      <span class="badge badge-welcome">👋 Welcome aboard</span>
      <p>Hi <strong style="color:#e2e8f0">${user.name}</strong>,</p>
      <p>Your DevCraft Studio account is ready! You can now submit project requests, track progress in real-time, and chat directly with our dev team.</p>
      <div class="infocard">
        <h3>🚀 Get started in 3 steps</h3>
        <p>1. Submit a project inquiry with your requirements &amp; budget<br>
           2. We'll review and accept within 24 hours<br>
           3. Track progress and chat with us anytime</p>
      </div>
      <p>We're excited to build something great together!</p>
      <a href="${process.env.APP_URL || 'http://localhost:3000'}/dashboard" class="btn">Go to Dashboard →</a>
    `, 'Welcome to DevCraft Studio'),
  });
};

// ─── 2. Inquiry accepted — sent when admin accepts an inquiry ─────────────
const sendInquiryAccepted = async (user, inquiry) => {
  console.log(`📧 Sending inquiry-accepted email to ${user.email}…`);
  await sendEmail({
    to:      user.email,
    subject: `✅ Your inquiry has been accepted — ${inquiry.title}`,
    html: baseTemplate(`
      <span class="badge badge-success">✓ Inquiry Accepted</span>
      <p>Hi <strong style="color:#e2e8f0">${user.name}</strong>,</p>
      <p>Great news! We've reviewed your project inquiry and we're excited to move forward with it.</p>
      <div class="infocard">
        <h3>📋 ${inquiry.title}</h3>
        <p>${inquiry.description.substring(0, 180)}${inquiry.description.length > 180 ? '…' : ''}</p>
      </div>
      <p>We'll be in touch shortly to discuss the project details, finalize pricing, and set up your project dashboard.</p>
      <div class="divider"></div>
      <p style="font-size:13px;color:#64748b;">Budget submitted: ₹${Number(inquiry.budget).toLocaleString('en-IN')} &nbsp;|&nbsp; Category: ${inquiry.category} &nbsp;|&nbsp; Timeline: ${inquiry.timeline}</p>
      <a href="${process.env.APP_URL || 'http://localhost:3000'}/dashboard" class="btn">View Dashboard →</a>
    `, 'Inquiry Accepted'),
  });
};

// ─── 3. Project started — sent when admin sets status → in-progress ────────
const sendProjectStarted = async (user, project) => {
  console.log(`📧 Sending project-started email to ${user.email}…`);
  const deadline = project.deadline
    ? new Date(project.deadline).toLocaleDateString('en-IN', { dateStyle: 'long' })
    : 'To be confirmed';
  await sendEmail({
    to:      user.email,
    subject: `🚀 Development started — ${project.title}`,
    html: baseTemplate(`
      <span class="badge badge-info">🚀 Project Started</span>
      <p>Hi <strong style="color:#e2e8f0">${user.name}</strong>,</p>
      <p>Development on your project has officially kicked off! You can track progress in real-time from your dashboard.</p>
      <div class="infocard">
        <h3>🏗️ ${project.title}</h3>
        <p>Deadline: <strong style="color:#63b3ed">${deadline}</strong><br>
           Price: <strong style="color:#63b3ed">₹${Number(project.price).toLocaleString('en-IN')}</strong></p>
      </div>
      <p>Use the <strong style="color:#e2e8f0">project chat</strong> anytime to ask questions or request updates — we typically respond within a few hours.</p>
      <a href="${process.env.APP_URL || 'http://localhost:3000'}/projects/${project._id}" class="btn">Track Your Project →</a>
    `, 'Project Started'),
  });
};

// ─── 4. Project completed — sent when admin sets status → completed ────────
const sendProjectCompleted = async (user, project) => {
  console.log(`📧 Sending project-completed email to ${user.email}…`);
  await sendEmail({
    to:      user.email,
    subject: `🎉 Your project is complete — ${project.title}`,
    html: baseTemplate(`
      <span class="badge badge-success">🎉 Project Completed</span>
      <p>Hi <strong style="color:#e2e8f0">${user.name}</strong>,</p>
      <p>Your project is done and ready for delivery! Head to your dashboard to download all the files.</p>
      <div class="infocard">
        <h3>✅ ${project.title}</h3>
        <p>All deliverables have been uploaded. Download your files and let us know if you need anything adjusted.</p>
      </div>
      <p>We'd love to hear your thoughts — please leave a <strong style="color:#e2e8f0">star rating &amp; review</strong> on the project page. It helps us a lot!</p>
      <div class="divider"></div>
      <p style="font-size:13px;color:#64748b;">Thank you for choosing DevCraft Studio. We hope to work with you again!</p>
      <a href="${process.env.APP_URL || 'http://localhost:3000'}/projects/${project._id}" class="btn">View &amp; Download Files →</a>
    `, 'Project Completed'),
  });
};

module.exports = {
  verifyEmailConfig,
  sendWelcome,
  sendInquiryAccepted,
  sendProjectStarted,
  sendProjectCompleted,
};
