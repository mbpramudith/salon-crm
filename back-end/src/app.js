const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const typeDefs = require('./graphql/types');
const resolvers = require('./graphql/resolvers');
const { authMiddleware } = require('./middleware/auth');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function createApp() {
  const app = express();

  // Security middleware
  app.use(helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false
  }));
  
  app.use(cors({
    origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
    credentials: true
  }));

  // Rate limiting
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 1000, // limit each IP to 1000 requests per windowMs
    message: 'Too many requests from this IP, please try again later.'
  });
  app.use(limiter);

  // Body parsing middleware
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true }));

  // Health check endpoint
  app.get('/health', (req, res) => {
    res.status(200).json({ 
      status: 'OK', 
      timestamp: new Date().toISOString(),
      uptime: process.uptime()
    });
  });

  // Create Apollo Server
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => {
      return {
        prisma,
        user: req.user,
        apiKey: req.headers['x-api-key']
      };
    },
    introspection: process.env.NODE_ENV !== 'production',
    playground: process.env.NODE_ENV !== 'production'
  });

  await server.start();

  // Apply authentication middleware to GraphQL endpoint
  app.use('/graphql', authMiddleware);
  
  // Apply Apollo GraphQL middleware
  server.applyMiddleware({ app, path: '/graphql' });

  // 404 handler
  app.use('*', (req, res) => {
    res.status(404).json({ error: 'Endpoint not found' });
  });

  // Global error handler
  app.use((error, req, res, next) => {
    console.error('Global error handler:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
    });
  });

  return app;
}

module.exports = createApp;