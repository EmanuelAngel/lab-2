import 'dotenv/config'
import { z } from 'zod'

const envSchema = z.object({
  ENDPOINT: z.string().url().default('http://localhost:3000'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().transform(Number).pipe(z.number().positive()).default('3000'),

  DB_HOST: z.string().min(1).default('localhost'),
  DB_USER: z.string().min(1).default('root'),
  DB_PORT: z.string().regex(/^\d+$/, 'Port has to be a number').default('3306'),
  DB_PASS: z.string().optional().default(''),
  DB_NAME: z.string().min(1).default('agenda_consultorio'),
  DB_CONNECTION_LIMIT: z.string().transform(Number).pipe(
    z.number().positive().max(100)
  ).default('5'),

  JWT_SECRET: z.string().min(6, 'JWT secret has to contain at least 6 characters'),
  JWT_EXPIRES: z.string().regex(
    /^\d+[hdms]$/,
    'Invalid expiration format. Valid formats: "1h", "30m", "7d"'
  ).default('1h')
})

const { success, error, data } = envSchema.safeParse(process.env)

if (!success) {
  console.error('Invalid environment variables:', error.message)

  process.exit(1)
}

export const {
  ENDPOINT,
  NODE_ENV,
  PORT,
  DB_HOST,
  DB_USER,
  DB_PORT,
  DB_PASS,
  DB_NAME,
  DB_CONNECTION_LIMIT,
  DB_URI = `mysql://${data.DB_USER}:${data.DB_PASS}@${data.DB_HOST}:${data.DB_PORT}/${data.DB_NAME}`,
  JWT_SECRET,
  JWT_EXPIRES
} = data
