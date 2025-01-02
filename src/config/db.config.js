import {
  DB_HOST,
  DB_USER,
  DB_PORT,
  DB_PASS,
  DB_NAME,
  DB_CONNECTION_LIMIT
} from './env.js'

import { createPool } from 'mysql2/promise'

const dbConfig = {
  host: DB_HOST,
  user: DB_USER,
  port: Number(DB_PORT),
  password: DB_PASS,
  database: DB_NAME,
  waitForConnections: true,
  connectionLimit: Number(DB_CONNECTION_LIMIT),
  queueLimit: 0
}

let pool

try {
  pool = createPool(dbConfig);

  // Verify first connection
  (async () => {
    let connection
    try {
      connection = await pool.getConnection()

      console.log('Database connection established successfully')

      connection.release()
    } catch (err) {
      if (err.code === 'ECONNREFUSED') {
        console.error(
          '🚨 ATTENTION: Could not connect to database.'
        )
        console.warn(
          '[ESP] Lo más probable es que Laragon o XAMPP esté apagado.'
        )
        console.warn(
          'Please, init your database server before trying again.'
        )
      }

      console.error('Error connecting to the database:', err.message)
      console.error('Full error details:', err)

      // Optional: Log additional context like database configuration
      console.error('You tried using:', {
        host: DB_HOST,
        port: DB_PORT,
        database: DB_NAME
      })
    }
  })()
} catch (error) {
  console.error('Error creating pool:', error.message)
}

export default pool
