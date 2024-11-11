import pool from '../../../config/db.config.js'

export class SucursalModel {
  // Obtener todas las sucursales activas (estado = 1)
  static async getAll () {
    const con = await pool.getConnection()
    try {
      const [rows] = await con.query('SELECT * FROM sucursal WHERE estado = 1;')
      return rows
    } catch (error) {
      console.error('Error al obtener todas las sucursales:', error)
      throw new Error('Error al obtener las sucursales')
    } finally {
      con.release()
    }
  }

  // Obtener una sucursal por ID
  static async getById ({ id }) {
    const con = await pool.getConnection()
    try {
      const [rows] = await con.query('SELECT * FROM sucursal WHERE id_sucursal = ?;', [id])
      return rows.length ? rows[0] : null
    } catch (error) {
      console.error('Error al obtener la sucursal por ID:', error)
      throw new Error('Error al obtener la sucursal')
    } finally {
      con.release()
    }
  }

  // Crear una nueva sucursal
  static async create ({ input }) {
    const con = await pool.getConnection()
    const { nombre, direccion, telefono, email } = input
    try {
      await con.query(
        `INSERT INTO sucursal (nombre, direccion, telefono, email, estado)
        VALUES (?, ?, ?, ?, 1)`,
        [nombre, direccion, telefono, email]
      )

      const [sucursal] = await con.query('SELECT * FROM sucursal WHERE nombre = ?;', [nombre])
      return sucursal[0]
    } catch (error) {
      console.error('Error al crear la sucursal:', error)
      throw error
    } finally {
      con.release()
    }
  }

  // Desactivar una sucursal (cambia estado a 0)
  static async deactivate ({ id }) {
    const con = await pool.getConnection()
    try {
      await con.query('UPDATE sucursal SET estado = 0 WHERE id_sucursal = ?;', [id])

      const [sucursal] = await con.query('SELECT * FROM sucursal WHERE id_sucursal = ?;', [id])
      return sucursal.length ? sucursal[0] : null
    } catch (error) {
      console.error('Error al desactivar la sucursal:', error)
      throw new Error('Error al desactivar la sucursal')
    } finally {
      con.release()
    }
  }

  // Activar una sucursal (cambia estado a 1)
  static async activate ({ id }) {
    const con = await pool.getConnection()
    try {
      await con.query('UPDATE sucursal SET estado = 1 WHERE id_sucursal = ?;', [id])

      const [sucursal] = await con.query('SELECT * FROM sucursal WHERE id_sucursal = ?;', [id])
      return sucursal.length ? sucursal[0] : null
    } catch (error) {
      console.error('Error al activar la sucursal:', error)
      throw new Error('Error al activar la sucursal')
    } finally {
      con.release()
    }
  }

  // Actualización parcial de la sucursal
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
        UPDATE sucursal
        SET ${updateFields.join(', ')}
        WHERE id_sucursal = ?;
      `
      await con.query(updateQuery, updateValues)

      const [sucursal] = await con.query('SELECT * FROM sucursal WHERE id_sucursal = ?;', [id])
      return sucursal.length ? sucursal[0] : null
    } catch (error) {
      console.error('Error al actualizar la sucursal:', error)
      throw new Error('Error al actualizar la sucursal')
    } finally {
      con.release()
    }
  }

  // Obtener una sucursal por nombre
  static async getByNombre ({ nombre }) {
    const con = await pool.getConnection()
    try {
      const [rows] = await con.query(`
        SELECT * FROM sucursal
        WHERE nombre = ?;`,
      [nombre]
      )
      return rows.length ? rows[0] : null
    } catch (error) {
      console.error('Error al obtener la sucursal por nombre:', error)
      throw new Error('Error al obtener la sucursal')
    } finally {
      con.release()
    }
  }
}
