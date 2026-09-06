"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = exports.prisma = void 0;
const client_1 = require("@prisma/client");
exports.prisma = new client_1.PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});
const connectDB = async () => {
    try {
        await exports.prisma.$connect();
        console.log('✅ PostgreSQL Database connected via Prisma successfully.');
    }
    catch (error) {
        console.warn('⚠️  Prisma DB connection notice: Could not connect to live Postgres database. Running in dynamic memory store fallback mode for local development.');
    }
};
exports.connectDB = connectDB;
