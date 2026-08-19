import express, { Application } from 'express';
import cors from 'cors';
import path from 'path';
import apiRouter from './routes';
import { errorHandler } from './middleware/errorHandler';

const app: Application = express();

// Middlewares
app.use(cors({
  origin: '*',
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static uploads folder for resume files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Health Check Endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    service: 'RecruitmentX AI ATS API Engine',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
  });
});

// REST API V1 Routes
app.use('/api/v1', apiRouter);

// Global Error Handler
app.use(errorHandler);

export default app;
