// utils/email.js
//
// HOW IT WORKS:
//   LOCAL  (NODE_ENV != production) → Gmail SMTP via Nodemailer  ✅
//   RENDER (NODE_ENV = production)  → Resend HTTP API             ✅
//
// Why two providers?
//   Render's free tier BLOCKS all outbound SMTP ports (25, 465, 587).
//   Gmail SMTP cannot work on Render — period.
//   Resend uses HTTPS (port 443) which is never blocked.
//
// Setup:
//   Local  → keep your EMAIL_USER / EMAIL_PASS in .env
//   Render → add RESEND_API_KEY in Render dashboard env vars
//            Get free key at https://resend.com (3000 emails/month free)

const nodemailer = require('nodemailer');

// ─── Which provider to use ────────────────────────────────────────────────
const useResend = () =>
  process.env.NODE_ENV === 'production' || !!process.env.RESEND_API_KEY;

// ─── SMTP credential check (local) ────────────────────────────────────────
const smtpReady = () => {
  const missing = [];
  if (!process.env.EMAIL_USER) missing.push('EMAIL_USER');
  if (!process.env.EMAIL_PASS) missing.push('EMAIL_PASS');
  if (missing.length) {
    console.warn(`⚠️  SMTP: missing [${missing.join(', ')}] — email skipped.`);
    return false;
  }
  return true;
};

// ─── Resend credential check (production) ─────────────────────────────────
const resendReady = () => {
  if (!process.env.RESEND_API_KEY) {
    console.warn('⚠️  Resend: RESEND_API_KEY not set — email skipped.');
    console.warn('   Get a free key at https://resend.com and add it to Render env vars.');
    return false;
  }
  return true;
};

// ─── Local SMTP transporter (Nodemailer + Gmail) ──────────────────────────
const createSmtpTransporter = () =>
  nodemailer.createTransport({
    host:   process.env.EMAIL_HOST || 'smtp.gmail.com',
    port:   parseInt(process.env.EMAIL_PORT) || 587,
    secure: false,
    auth:   { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    tls:    { rejectUnauthorized: false },
    connectionTimeout: 10000,
    socketTimeout:     15000,
  });

// ─── Send via Resend HTTP API (production / Render) ───────────────────────
const sendViaResend = async ({ to, subject, html }) => {
  // Dynamic import so the package is only loaded when needed
  const { Resend } = require('resend');
  const resend = new Resend(process.env.RESEND_API_KEY);

  const from = process.env.RESEND_FROM ||
               process.env.EMAIL_FROM  ||
               'DevCraft Studio <onboarding@resend.dev>';  // works without domain verification

  const { data, error } = await resend.emails.send({ from, to, subject, html });

  if (error) {
    console.error('❌ Resend error:', error);
    throw new Error(error.message);
  }
  console.log(`📧 Resend sent → ${to} [id: ${data?.id}]`);
};

// ─── Send via Nodemailer SMTP (local) ─────────────────────────────────────
const sendViaSmtp = async ({ to, subject, html }) => {
  const transporter = createSmtpTransporter();
  const from = `"DevCraft Studio" <${process.env.EMAIL_FROM || process.env.EMAIL_USER}>`;
  const info  = await transporter.sendMail({ from, to, subject, html });
  console.log(`📧 SMTP sent → ${to} [id: ${info.messageId}]`);
};

// ─── Master send function ─────────────────────────────────────────────────
const sendEmail = async ({ to, subject, html }) => {
  try {
    if (useResend()) {
      if (!resendReady()) return;
      console.log(`📧 Using Resend API → ${to}`);
      await sendViaResend({ to, subject, html });
    } else {
      if (!smtpReady()) return;
      console.log(`📧 Using Gmail SMTP → ${to}`);
      await sendViaSmtp({ to, subject, html });
    }
  } catch (err) {
    console.error(`❌ Email failed → ${to} | ${subject}`);
    console.error('   Reason:', err.message);

    if (err.message?.includes('EAUTH') || err.message?.includes('535')) {
      console.error('   Gmail fix: use an App Password, not your login password.');
      console.error('   Path: Google Account → Security → 2-Step Verification → App Passwords');
    }
    if (err.message?.includes('API key')) {
      console.error('   Resend fix: check RESEND_API_KEY in your Render environment variables.');
    }
    // Never re-throw — email failure should never crash a request
  }
};

// ─── Startup connection check ──────────────────────────────────────────────
const verifyEmailConfig = async () => {
  if (useResend()) {
    if (!resendReady()) return false;
    console.log('✅ Email provider: Resend (HTTP API) — works on Render ✓');
    return true;
  } else {
    if (!smtpReady()) return false;
    try {
      await createSmtpTransporter().verify();
      console.log('✅ Email provider: Gmail SMTP — connected ✓');
      return true;
    } catch (err) {
      console.error('❌ Gmail SMTP failed:', err.message);
      if (err.code === 'EAUTH')
        console.error('   → Use a Gmail App Password (not your login password).');
      return false;
    }
  }
};

// ─── Shared HTML template ──────────────────────────────────────────────────
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
</div></div></body></html>`;

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
         2. We review and accept within 24 hours<br>
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
    <p>Great news! We reviewed your inquiry and we're excited to move forward.</p>
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
    <p>Development on your project has officially kicked off! Track live progress from your dashboard.</p>
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
      <p>All deliverables uploaded. Please leave a review — it really helps us!</p>
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
    <p>We received a request to reset your password. Click below — this link expires in <strong style="color:#e2e8f0">30 minutes</strong>.</p>
    <div class="ic">
      <h3>⚠️ Didn't request this?</h3>
      <p>If you didn't ask for a reset, ignore this email — your password won't change.</p>
    </div>
    <a href="${resetURL}" class="btn">Reset My Password →</a>
    <div class="divider"></div>
    <p style="font-size:12px;color:#64748b;word-break:break-all">Or copy this link:<br>${resetURL}</p>
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
