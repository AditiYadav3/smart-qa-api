require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const Document = require('../src/models/Document');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/smart-qa-api';

const sampleDocs = [
  {
    title: 'Refund Policy',
    content:
      'Our refund policy allows customers to request a full refund within 30 days of purchase. Refunds are processed within 5-7 business days back to the original payment method. Digital products are non-refundable once downloaded. To initiate a refund, contact support@example.com with your order number.',
    tags: ['refund', 'policy', 'payment', 'support'],
  },
  {
    title: 'Shipping Information',
    content:
      'We offer standard shipping (5-7 business days) and express shipping (1-2 business days). Free standard shipping is available on orders over $50. International shipping is available to over 50 countries with delivery times of 10-21 business days. Tracking numbers are emailed once the order ships.',
    tags: ['shipping', 'delivery', 'international', 'tracking'],
  },
  {
    title: 'Account Security',
    content:
      'To keep your account secure, we recommend using a strong password with at least 12 characters including uppercase, lowercase, numbers, and symbols. Enable two-factor authentication (2FA) in your account settings. We will never ask for your password via email. If you suspect unauthorized access, reset your password immediately.',
    tags: ['security', 'password', '2fa', 'account'],
  },
  {
    title: 'Subscription Plans',
    content:
      'We offer three subscription tiers: Basic ($9/month) with 5GB storage and 3 projects, Pro ($29/month) with 50GB storage and unlimited projects, and Enterprise ($99/month) with 500GB storage, unlimited projects, and dedicated support. All plans include a 14-day free trial. Annual billing saves 20%.',
    tags: ['subscription', 'pricing', 'plans', 'billing'],
  },
  {
    title: 'API Rate Limits',
    content:
      'API rate limits depend on your subscription plan. Basic plan: 100 requests/hour. Pro plan: 1000 requests/hour. Enterprise plan: 10,000 requests/hour. Rate limit headers (X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Reset) are included in every API response. Exceeding limits returns HTTP 429.',
    tags: ['api', 'rate-limit', 'developer', 'integration'],
  },
  {
    title: 'Data Privacy & GDPR',
    content:
      'We are fully GDPR compliant. User data is stored in EU-based servers. You can request a full export of your data at any time from your account settings. Data deletion requests are processed within 30 days. We do not sell personal data to third parties. Cookies are used only for essential functionality and analytics with your consent.',
    tags: ['privacy', 'gdpr', 'data', 'compliance'],
  },
  {
    title: 'Technical Support',
    content:
      'Technical support is available 24/7 for Enterprise customers and during business hours (9am-6pm UTC) for Basic and Pro plans. Support channels include live chat, email (support@example.com), and a community forum. Average response time is under 2 hours for Pro and under 30 minutes for Enterprise. Critical issues are escalated immediately.',
    tags: ['support', 'help', 'contact', 'technical'],
  },
];

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    await Document.deleteMany({});
    console.log('Cleared existing documents');

    const inserted = await Document.insertMany(sampleDocs);
    console.log(`Seeded ${inserted.length} documents successfully`);

    inserted.forEach((doc) => console.log(`  - [${doc._id}] ${doc.title}`));
  } catch (err) {
    console.error('Seed failed:', err.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

seed();
