const mysql = require('mysql2/promise');

/**
 * Database configuration and connection pool
 */
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'anime_shelf',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

/**
 * Test database connection
 */
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Successfully connected to MySQL database!');
    connection.release();
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    return false;
  }
}

/**
 * Ensure database schema is correct
 * Checks for table existence and updates column types if necessary
 */
async function ensureSchema() {
  try {
    const connection = await pool.getConnection();

    // Check if anime table exists
    const [tables] = await connection.query("SHOW TABLES LIKE 'anime'");

    if (tables.length > 0) {
      console.log('🔄 Verifying database schema...');
      // Update columns to TEXT to support long content
      await connection.query("ALTER TABLE anime MODIFY COLUMN description TEXT");
      await connection.query("ALTER TABLE anime MODIFY COLUMN image_url TEXT");
      console.log('✅ Database schema verified and updated if needed.');
    } else {
      console.log('⚠️ Anime table does not exist. Please run the initial setup script.');
    }

    connection.release();
    return true;
  } catch (error) {
    // Ignore error if column doesn't exist or other minor schema issues
    console.warn('⚠️ Schema verification warning:', error.message);
    return false;
  }
}

module.exports = { pool, testConnection, ensureSchema };
