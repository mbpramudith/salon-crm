module.exports = {
  port: process.env.PORT || 4000,
  nodeEnv: process.env.NODE_ENV || 'development',
  jwtSecret: process.env.JWT_SECRET || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIwMjBlMjc0MS00YWUyLTQ4MjYtODRmYy1hNjA3MDgzZWFiYmMiLCJlbWFpbCI6InN1cGVyYWRtaW5Ac2Fsb25jcm0uY29tIiwicm9sZSI6IlNVUEVSX0FETUlOIiwic2Fsb25JZCI6bnVsbCwiaWF0IjoxNzU4NjEwMTI2LCJleHAiOjE3NTg2OTY1MjZ9.bXVJIzmHDar-tQeKixRcFfaCP7qswkQOC4RMpspHM4w',
  apiKey: process.env.API_KEY || 'your-api-key',
  
  // Database configuration
  database: {
    url: process.env.DATABASE_URL
  },

  // External services configuration
  twilio: {
    accountSid: process.env.TWILIO_ACCOUNT_SID,
    authToken: process.env.TWILIO_AUTH_TOKEN,
    phoneNumber: process.env.TWILIO_PHONE_NUMBER
  },

  // Email configuration
  email: {
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT || 587,
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  },

  // Redis configuration
  redis: {
    url: process.env.REDIS_URL || 'redis://localhost:6379'
  },

  // CORS configuration
  cors: {
    origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
    credentials: true
  },

  // Rate limiting
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 1000 // limit each IP to 1000 requests per windowMs
  }
};