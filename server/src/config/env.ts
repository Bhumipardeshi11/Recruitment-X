import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../../.env') });

export const env = {
  PORT: process.env.PORT || '5000',
  NODE_ENV: process.env.NODE_ENV || 'development',
  DATABASE_URL: process.env.DATABASE_URL || 'postgresql://recruitmentx_user:recruitmentx_secret@localhost:5432/recruitmentx_db?schema=public',
  JWT_SECRET: process.env.JWT_SECRET || 'recruitmentx_jwt_super_secret_key_2026_prod_ready',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  GEMINI_API_KEY: process.env.GEMINI_API_KEY || '',
  OPENAI_API_KEY: process.env.OPENAI_API_KEY || '',
  GITHUB_TOKEN: process.env.GITHUB_TOKEN || '',
  AWS_REGION: process.env.AWS_REGION || 'us-east-1',
  AWS_S3_BUCKET_NAME: process.env.AWS_S3_BUCKET_NAME || 'recruitmentx-resumes',
};
