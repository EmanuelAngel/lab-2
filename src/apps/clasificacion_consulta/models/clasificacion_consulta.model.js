import pool from '../../../config/db.config.js'

export class ClasificacionConsultaModel {
  // Obtener todas las clasificaciones
  static async getAll () {
    const con = await pool.getConnection()
    try {
      const [rows] = await con.query('SELECT * FROM clasificacion_consulta;')
      return rows
    } catch (error) {
      console.error('Error al obtener todas las clasificaciones:', error)
      throw new Error('Error al obtener las clasificaciones')
    } finally {
      con.release()
    }
  }

  // Obtener una clasificación por ID
  static async getById ({ id }) {
    const con = await pool.getConnection()
    try {
      const [rows] = await con.query('SELECT * FROM clasificacion_consulta WHERE id_clasificacion = ?;', [id])
      return rows.length ? rows[0] : null
    } catch (error) {
      console.error('Error al obtener la clasificación por ID:', error)
      throw new Error('Error al obtener la clasificación')
    } finally {
      con.release()
    }
  }

  // Crear una nueva clasificación
  static async create ({ input }) {
    const con = await pool.getConnection()
    const { nombre_clasificacion, descripcion } = input
    try {
      await con.query(
        `INSERT INTO clasificacion_consulta (nombre_clasificacion, descripcion)
        VALUES (?, ?)`,
        [nombre_clasificacion, descripcion]
      )
      const [clasificacion] = await con.query('SELECT * FROM clasificacion_consulta WHERE nombre_clasificacion = ?;', [nombre_clasificacion])
      return clasificacion[0]
    } catch (error) {
      console.error('Error al crear la clasificación:', error)
      throw error
    } finally {
      con.release()
    }
  }

  // Actualizar parcialmente una clasificación
  static async partiallyUpdate ({ id, input }) {
    const con = await pool.getConnection()
    const updateFields = []
    const updateValues = []

    for (const [key, value] of Object.entries(input)) {
      if (value !== undefined) {
        updateFields.push(`${key} = ?`)
        updateValues.push(value)
      }
    }

    if (updateFields.length === 0) {
      return null
    }

    updateValues.push(id)

    try {
      const updateQuery = `
        UPDATE clasificacion_consulta 
        SET ${updateFields.join(', ')} 
        WHERE id_clasificacion = ?;
      `

      await con.query(updateQuery, updateValues)

      const [clasificacion] = await con.query('SELECT * FROM clasificacion_consulta WHERE id_clasificacion = ?;', [id])
      return clasificacion.length ? clasificacion[0] : null
    } catch (error) {
      console.error('Error al actualizar la clasificación:', error)
      throw new Error('Error al actualizar la clasificación')
    } finally {
      con.release()
    }
  }

  // Eliminar una clasificación
  static async delete ({ id }) {
    const con = await pool.getConnection()
    try {
      await con.query('DELETE FROM clasificacion_consulta WHERE id_clasificacion = ?;', [id])
      return { message: 'Clasificación eliminada' }
    } catch (error) {
      console.error('Error al eliminar la clasificación:', error)
      throw new Error('Error al eliminar la clasificación')
    } finally {
      con.release()
    }
  }

  // Buscar clasificaciones por nombre (incluye coincidencias parciales)
  static async getByNombre ({ nombre_clasificacion }) {
    const con = await pool.getConnection()
    const likeQuery = `%${nombre_clasificacion}%`
    try {
      const [rows] = await con.query('SELECT * FROM clasificacion_consulta WHERE nombre_clasificacion LIKE ?;', [likeQuery])
      return rows
    } catch (error) {
      console.error('Error al buscar clasificaciones por nombre:', error)
      throw new Error('Error al buscar clasificaciones por nombre')
    } finally {
      con.release()
    }
  }
}
