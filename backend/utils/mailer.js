const nodemailer = require('nodemailer');
const dns = require('dns');

// Render environments may not have outbound IPv6 for Gmail SMTP.
// Prefer IPv4 resolution so mail delivery works reliably in production.
dns.setDefaultResultOrder('ipv4first');

const SMTP_PROFILES = [
  // Try SMTPS first because some hosts time out on STARTTLS upgrade.
  { port: 465, secure: true },
  { port: 587, secure: false },
];

const getMailConfig = () => {
  const host = process.env.SMTP_HOST || process.env.EMAIL_HOST || 'smtp.gmail.com';
  const user = process.env.SMTP_USER || process.env.EMAIL_USER || process.env.GMAIL_USER;
  const pass = process.env.SMTP_PASS || process.env.EMAIL_PASS || process.env.GMAIL_APP_PASSWORD;
  const from = process.env.SMTP_FROM || process.env.EMAIL_FROM || user;

  if (!user || !pass) {
    return null;
  }

  return { host, user, pass, from };
};

const createTransporter = ({ port, secure }, mailConfig) => {
  return nodemailer.createTransport({
    host: mailConfig.host,
    port,
    secure,
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 15000,
    dnsTimeout: 8000,
    auth: {
      user: mailConfig.user,
      pass: mailConfig.pass,
    },
  });
};

const sendMail = async ({ to, subject, text, html }) => {
  const mailConfig = getMailConfig();

  if (!mailConfig) {
    throw new Error('SMTP_USER/SMTP_PASS or GMAIL_USER/GMAIL_APP_PASSWORD must be configured');
  }

  let lastError = null;

  for (const profile of SMTP_PROFILES) {
    const transporter = createTransporter(profile, mailConfig);

    try {
      await transporter.sendMail({
        from: mailConfig.from,
        to,
        subject,
        text,
        html,
      });
      return;
    } catch (error) {
      lastError = error;
      console.error(`SMTP send failed on port ${profile.port}:`, error.message);
    }
  }

  throw lastError || new Error('Mail send failed');
};

const sendVerificationCodeEmail = async ({ to, code }) => {
  await sendMail({
    to,
    subject: 'Verify your Skill Swap email',
    text: `Your Skill Swap verification code is ${code}. It will expire in 10 minutes.`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #0f172a;">
        <h2 style="margin-bottom: 12px;">Verify your Skill Swap email</h2>
        <p>Your verification code is:</p>
        <div style="font-size: 32px; font-weight: 700; letter-spacing: 8px; margin: 16px 0;">${code}</div>
        <p>This code expires in 10 minutes.</p>
      </div>
    `,
  });
};

const sendRequestReceivedEmail = async ({ to, senderName, skillOffered, skillRequested, message }) => {
  await sendMail({
    to,
    subject: `${senderName} requested your ${skillRequested} skill`,
    text: `${senderName} sent you a skill swap request requesting your ${skillRequested} skill. Offered: ${skillOffered}. Message: ${message}`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #0f172a;">
        <h2 style="margin-bottom: 12px;">New skill swap request</h2>
        <p><strong>${senderName}</strong> sent you a request.</p>
        <p><strong>Requested from you:</strong> ${skillRequested}</p>
        <p><strong>Offered:</strong> ${skillOffered}</p>
        <p><strong>Message:</strong> ${message}</p>
        <p>Open Skill Swap to review the request.</p>
      </div>
    `,
  });
};

const sendRequestSentConfirmationEmail = async ({ to, receiverName, skillOffered, skillRequested }) => {
  await sendMail({
    to,
    subject: `Your ${skillRequested} request to ${receiverName} was sent`,
    text: `Your skill swap request to ${receiverName} has been sent. You requested: ${skillRequested}. You offered: ${skillOffered}.`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #0f172a;">
        <h2 style="margin-bottom: 12px;">Request sent</h2>
        <p>Your request to <strong>${receiverName}</strong> has been sent.</p>
        <p><strong>You requested:</strong> ${skillRequested}</p>
        <p><strong>You offered:</strong> ${skillOffered}</p>
        <p>We’ll notify you again when the request is accepted.</p>
      </div>
    `,
  });
};

const sendPendingRequestReminderEmail = async ({ to, pendingCount }) => {
  await sendMail({
    to,
    subject: 'You have pending skill swap requests',
    text: `You currently have ${pendingCount} pending skill swap requests waiting for your response.`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #0f172a;">
        <h2 style="margin-bottom: 12px;">Pending requests reminder</h2>
        <p>You currently have <strong>${pendingCount}</strong> pending skill swap requests waiting for your response.</p>
        <p>Open Skill Swap to review them.</p>
      </div>
    `,
  });
};

const sendRequestAcceptedEmail = async ({ to, senderName, receiverName }) => {
  await sendMail({
    to,
    subject: `${receiverName} accepted your skill swap request`,
    text: `${receiverName} accepted your request. You can now connect and chat with them in Skill Swap.`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #0f172a;">
        <h2 style="margin-bottom: 12px;">Request accepted</h2>
        <p><strong>${receiverName}</strong> accepted your request, ${senderName}.</p>
        <p>You can now connect and chat with them inside Skill Swap.</p>
      </div>
    `,
  });
};

module.exports = {
  sendVerificationCodeEmail,
  sendRequestSentConfirmationEmail,
  sendRequestReceivedEmail,
  sendPendingRequestReminderEmail,
  sendRequestAcceptedEmail,
  sendMail,
};
