import app from './app';
import { env } from './config/env';
import { connectDB } from './config/db';

const startServer = async () => {
  await connectDB();

  const PORT = parseInt(env.PORT, 10) || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 RecruitmentX Express API Server running on http://localhost:${PORT}`);
    console.log(`📡 Health Check available at http://localhost:${PORT}/health`);
    console.log(`⚡ API Router base path: http://localhost:${PORT}/api/v1`);
  });
};

startServer().catch((err) => {
  console.error('Failed to start RecruitmentX API Server:', err);
  process.exit(1);
});
