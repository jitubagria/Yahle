import dotenv from 'dotenv';

dotenv.config();

const required = ['DATABASE_URL', 'JWT_SECRET'];

for (const k of required) {
  if (!process.env[k]) {
    throw new Error(`${k} is required in environment`);
  }
}

export const ENV = {
  DATABASE_URL: process.env.DATABASE_URL!,
  PORT: Number(process.env.PORT || 5000),
  NODE_ENV: process.env.NODE_ENV || 'development',
  JWT_SECRET: process.env.JWT_SECRET!,
};

export default ENV;
