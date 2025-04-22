import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Handle __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from .env
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// ✅ Create a connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || '',
  database: process.env.DB_NAME || 'voting',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// ✅ Optional: test connection immediately
(async () => {
  try {
    const connection = await pool.getConnection();
    console.log('✅ MySQL pool connected successfully.');
    connection.release();
  } catch (err) {
    console.error('❌ Unable to connect to DB:', err.message);
  }
})();

export default pool;
