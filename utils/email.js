// utils/email.js — Nodemailer email service
// Works locally (port 587) AND on Render/production (port 465 SSL)
const nodemailer = require('nodemailer');

// ─── Detect environment ────────────────────────────────────────────────────
const isProduction = process.env.NODE_ENV === 'production';

// ─── Credential guard ──────────────────────────────────────────────────────
const credentialsReady = () => {
  const missing = [];
  if (!process.env.EMAIL_USER) missing.push('EMAIL_USER');
  if (!process.env.EMAIL_PASS) missing.push('EMAIL_PASS');
  if (missing.length) {
    console.warn(`⚠️  Email: missing env vars [${missing.join(', ')}] — email skipped.`);
    return false;
  }
  return true;
};

// ─── Smart transporter ─────────────────────────────────────────────────────
// LOCAL  → port 587, secure:false, STARTTLS  (standard Gmail dev setup)
// RENDER → port 465, secure:true,  SSL       (Render blocks 587 outbound)
// Override via EMAIL_PORT + EMAIL_SECURE env vars if needed
const createTransporter = () => {
  const port   = parseInt(process.env.EMAIL_PORT)   || (isProduction ? 465 : 587);
  const secure = process.env.EMAIL_SECURE === 'true' || isProduction
                   ? true                            // SSL — required on Render
                   : false;                          // STARTTLS — fine locally

  console.log(`📧 SMTP: ${process.env.EMAIL_HOST || 'smtp.gmail.com'}:${port} secure=${secure}`);

  return nodemailer.createTransport({
    host:   process.env.EMAIL_HOST || 'smtp.gmail.com',
    port,
    secure,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,   // Gmail: use an App Password, NOT login password
    },
    tls: {
      rejectUnauthorized: false,      // prevents cert errors on some hosts
      minVersion: 'TLSv1.2',
    },
    // Increase timeouts for slow cloud environments
    connectionTimeout: 10000,
    greetingTimeout:   10000,
    socketTimeout:     15000,
  });
};

// ─── Startup connection check ──────────────────────────────────────────────
const verifyEmailConfig = async () => {
  if (!credentialsReady()) return false;
  try {
    const t = createTransporter();
    await t.verify();
    console.log('✅ Email service ready');
    return true;
  } catch (err) {
    console.error('❌ Email service FAILED:', err.message);
    if (err.code === 'EAUTH')
      console.error('   → Gmail: go to Account → Security → App Passwords and create one.');
    if (err.code === 'ECONNREFUSED' || err.code === 'ETIMEDOUT')
      console.error('   → Render/cloud: set EMAIL_PORT=465 and EMAIL_SECURE=true in env vars.');
    return false;
  }
};

// ─── Core send helper ──────────────────────────────────────────────────────
const sendEmail = async ({ to, subject, html }) => {
  if (!credentialsReady()) return;
  try {
    const info = await createTransporter().sendMail({
      from:    `"DevCraft Studio" <${process.env.EMAIL_FROM || process.env.EMAIL_USER}>`,
      to, subject, html,
    });
    console.log(`📧 Sent → ${to} [${info.messageId}]`);
  } catch (err) {
    console.error(`❌ Email failed → ${to} | ${subject}`);
    console.error('   Reason:', err.message);
    if (err.code === 'EAUTH')
      console.error('   Fix: use a Gmail App Password, not your login password.');
    if (err.responseCode === 535)
      console.error('   Fix: wrong credentials — double-check EMAIL_USER and EMAIL_PASS.');
  }
};

// ─── Shared HTML base template ─────────────────────────────────────────────
const base = (content, title) => `<!DOCTYPE html>
<html lang="en"><head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${title}</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'Segoe UI',Tahoma,sans-serif;background:#07070f;color:#e2e8f0}
.wrap{max-width:600px;margin:40px auto;background:#111118;border-radius:20px;overflow:hidden;border:1px solid rgba(255,255,255,.07)}
.hdr{background:linear-gradient(135deg,#63b3ed,#a78bfa);padding:44px 36px;text-align:center}
.hdr h1{color:#fff;font-size:26px;font-weight:800;margin-bottom:6px}
.hdr p{color:rgba(255,255,255,.75);font-size:14px}
.bdy{padding:40px 36px}
.bdy p{color:#94a3b8;line-height:1.75;margin-bottom:16px;font-size:15px}
.badge{display:inline-block;padding:6px 16px;border-radius:100px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;margin-bottom:24px}
.bs{background:#064e3b;color:#10b981}
.bi{background:#0c4a6e;color:#38bdf8}
.bw{background:#3b0764;color:#c084fc}
.br{background:#450a0a;color:#fca5a5}
.ic{background:#1a1a26;border-radius:12px;padding:20px 24px;margin:20px 0;border-left:4px solid #63b3ed}
.ic h3{color:#e2e8f0;font-size:16px;font-weight:700;margin-bottom:6px}
.ic p{color:#8888aa;font-size:14px;margin:0;line-height:1.6}
.btn{display:inline-block;background:linear-gradient(135deg,#63b3ed,#a78bfa);color:#fff;padding:14px 32px;border-radius:10px;text-decoration:none;font-weight:700;font-size:15px;margin-top:24px}
.divider{height:1px;background:rgba(255,255,255,.07);margin:28px 0}
.ftr{background:#0c0c14;padding:28px 36px;text-align:center}
.ftr p{color:#475569;font-size:13px;line-height:1.6}
.ftr strong{color:#63b3ed}
</style></head>
<body><div class="wrap">
<div class="hdr"><h1>⚡ DevCraft Studio</h1><p>Your Personal Project Service Platform</p></div>
<div class="bdy">${content}</div>
<div class="ftr">
  <p>© ${new Date().getFullYear()} <strong>DevCraft Studio</strong>. All rights reserved.</p>
  <p style="margin-top:6px">If you didn't expect this email, you can safely ignore it.</p>
</div>
</div></body></html>`;

// ─── 1. Welcome ────────────────────────────────────────────────────────────
const sendWelcome = (user) => sendEmail({
  to: user.email,
  subject: '🎉 Welcome to DevCraft Studio!',
  html: base(`
    <span class="badge bw">👋 Welcome aboard</span>
    <p>Hi <strong style="color:#e2e8f0">${user.name}</strong>,</p>
    <p>Your DevCraft Studio account is ready! Submit project requests, track progress live, and chat directly with our dev team.</p>
    <div class="ic">
      <h3>🚀 Get started in 3 steps</h3>
      <p>1. Submit a project inquiry with your requirements &amp; budget<br>
         2. We'll review and accept within 24 hours<br>
         3. Track progress and chat with us anytime</p>
    </div>
    <a href="${process.env.APP_URL || 'http://localhost:3000'}/dashboard" class="btn">Go to Dashboard →</a>
  `, 'Welcome to DevCraft Studio'),
});

// ─── 2. Inquiry accepted ───────────────────────────────────────────────────
const sendInquiryAccepted = (user, inquiry) => sendEmail({
  to: user.email,
  subject: `✅ Inquiry accepted — ${inquiry.title}`,
  html: base(`
    <span class="badge bs">✓ Accepted</span>
    <p>Hi <strong style="color:#e2e8f0">${user.name}</strong>,</p>
    <p>We've reviewed your inquiry and we're excited to move forward!</p>
    <div class="ic">
      <h3>📋 ${inquiry.title}</h3>
      <p>${inquiry.description.substring(0,180)}${inquiry.description.length>180?'…':''}</p>
    </div>
    <p style="font-size:13px;color:#64748b">Budget: ₹${Number(inquiry.budget).toLocaleString('en-IN')} &nbsp;|&nbsp; Category: ${inquiry.category} &nbsp;|&nbsp; Timeline: ${inquiry.timeline}</p>
    <a href="${process.env.APP_URL || 'http://localhost:3000'}/dashboard" class="btn">View Dashboard →</a>
  `, 'Inquiry Accepted'),
});

// ─── 3. Project started ────────────────────────────────────────────────────
const sendProjectStarted = (user, project) => sendEmail({
  to: user.email,
  subject: `🚀 Development started — ${project.title}`,
  html: base(`
    <span class="badge bi">🚀 Started</span>
    <p>Hi <strong style="color:#e2e8f0">${user.name}</strong>,</p>
    <p>Development on your project has officially kicked off! Track progress in real-time from your dashboard.</p>
    <div class="ic">
      <h3>🏗️ ${project.title}</h3>
      <p>Deadline: <strong style="color:#63b3ed">${project.deadline ? new Date(project.deadline).toLocaleDateString('en-IN',{dateStyle:'long'}) : 'TBD'}</strong><br>
         Price: <strong style="color:#63b3ed">₹${Number(project.price).toLocaleString('en-IN')}</strong></p>
    </div>
    <a href="${process.env.APP_URL || 'http://localhost:3000'}/projects/${project._id}" class="btn">Track Your Project →</a>
  `, 'Project Started'),
});

// ─── 4. Project completed ──────────────────────────────────────────────────
const sendProjectCompleted = (user, project) => sendEmail({
  to: user.email,
  subject: `🎉 Project complete — ${project.title}`,
  html: base(`
    <span class="badge bs">🎉 Complete</span>
    <p>Hi <strong style="color:#e2e8f0">${user.name}</strong>,</p>
    <p>Your project is done and ready for delivery! Head to your dashboard to download all files.</p>
    <div class="ic">
      <h3>✅ ${project.title}</h3>
      <p>All deliverables have been uploaded. Please leave a review — it helps us a lot!</p>
    </div>
    <a href="${process.env.APP_URL || 'http://localhost:3000'}/projects/${project._id}" class="btn">View &amp; Download →</a>
  `, 'Project Completed'),
});

// ─── 5. Password reset ─────────────────────────────────────────────────────
const sendPasswordReset = (user, resetURL) => sendEmail({
  to: user.email,
  subject: '🔐 Reset your DevCraft Studio password',
  html: base(`
    <span class="badge br">🔐 Password Reset</span>
    <p>Hi <strong style="color:#e2e8f0">${user.name}</strong>,</p>
    <p>We received a request to reset your password. Click the button below — this link expires in <strong style="color:#e2e8f0">30 minutes</strong>.</p>
    <div class="ic">
      <h3>⚠️ Didn't request this?</h3>
      <p>If you didn't ask for a password reset, you can safely ignore this email. Your password won't change.</p>
    </div>
    <a href="${resetURL}" class="btn">Reset My Password →</a>
    <div class="divider"></div>
    <p style="font-size:13px;color:#64748b;word-break:break-all">Or copy this link:<br>${resetURL}</p>
  `, 'Reset Your Password'),
});

module.exports = {
  verifyEmailConfig,
  sendWelcome,
  sendInquiryAccepted,
  sendProjectStarted,
  sendProjectCompleted,
  sendPasswordReset,
};
