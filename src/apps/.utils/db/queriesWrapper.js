import pool from '../../../config/db.config.js'

/**
 * Wrapper for executing SQL queries with improved error handling.
 * 
 * @param {Object} options - Options for the query.
 * @param {string} options.sql - The SQL query to execute.
 * @param {Array} [options.params] - Parameters for the SQL query (optional).
 * @returns {Promise<Array>} - The result of the query.
 * @throws {Error} - If the query fails, an error with details is thrown.
 * 
 * @example
 * const results = await query({
 *   sql: 'SELECT * FROM users WHERE id = ?',
 *   params: [1]
 * });
 * console.log(results);
 */
export const query = async ({ sql, params }) => {
  try {
    const [results] = await pool.execute(sql, params);

    return results;
  } catch (error) {
    console.error('Query error:', error.message);
    
    throw new Error(`Database query failed: ${error.message}`);
  }
};

/**
 * Wrapper for executing database operations within a transaction.
 * 
 * @param {Object} options - Options for the transaction.
 * @param {Function} options.callback - A function that receives a connection and executes operations within the transaction.
 * @returns {Promise<any>} - The result of the `callback` function.
 * @throws {Error} - If an error occurs, a rollback is performed, and the exception is thrown.
 * 
 * @example
 * const result = await transaction({
 *   callback: async (connection) => {
 *     await connection.execute('UPDATE users SET balance = balance - ? WHERE id = ?', [100, 1]);
 *     await connection.execute('UPDATE users SET balance = balance + ? WHERE id = ?', [100, 2]);
 *     return 'Transaction completed successfully';
 *   }
 * });
 * console.log(result);
 */
export const transaction = async ({ callback }) => {
  const connection = await pool.getConnection();

  await connection.beginTransaction();

  try {
    const result = await callback(connection);

    await connection.commit();

    return result;
  } catch (error) {
    await connection.rollback();

    throw error;
  } finally {
    connection.release();
  }
};
