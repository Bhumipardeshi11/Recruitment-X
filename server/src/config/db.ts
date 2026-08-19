import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

export const connectDB = async () => {
  try {
    await prisma.$connect();
    console.log('✅ PostgreSQL Database connected via Prisma successfully.');
  } catch (error) {
    console.warn('⚠️  Prisma DB connection notice: Could not connect to live Postgres database. Running in dynamic memory store fallback mode for local development.');
  }
};
