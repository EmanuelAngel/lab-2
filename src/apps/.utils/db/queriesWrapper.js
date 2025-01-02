import pool from '../../../config/db.config.js'

// Wrapper para consultas con mejor manejo de errores
export const query = async ({ sql, params }) => {
  try {
    const [results] = await pool.execute(sql, params);

    return results;
  } catch (error) {
    console.error('Query error:', error.message);
    
    throw new Error(`Database query failed: ${error.message}`);
  }
};

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
