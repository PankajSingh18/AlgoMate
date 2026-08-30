export const RATE_LIMITS = {
  CONTACT_API: {
    LIMIT: 5,
  },
  SMTP: {
    DAILY_QUOTA: parseInt(process.env.SMTP_DAILY_QUOTA || "400", 10),
  },
};
