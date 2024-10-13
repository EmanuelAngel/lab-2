import 'dotenv/config'
import mysql from 'mysql2/promise'

const DEFAULT_CONFIG = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  port: process.env.DB_PORT,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME
}

const connectionString = process.env.DATABASE_URL ?? DEFAULT_CONFIG

const con = await mysql.createConnection(connectionString)

export class SucursalModel {
  // Obtener todas las sucursales activas (estado = 1)
  static async getAll () {
    try {
      const [rows] = await con.query('SELECT * FROM sucursal WHERE estado = 1;')
      return rows
    } catch (error) {
      console.error('Error al obtener todas las sucursales:', error)
      throw new Error('Error al obtener las sucursales')
    }
  }

  // Obtener una sucursal por ID
  static async getById ({ id }) {
    try {
      const [rows] = await con.query('SELECT * FROM sucursal WHERE id_sucursal = ?;', [id])
      return rows.length ? rows[0] : null
    } catch (error) {
      console.error('Error al obtener la sucursal por ID:', error)
      throw new Error('Error al obtener la sucursal')
    }
  }

  // Crear una nueva sucursal
  static async create ({ input }) {
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
    }
  }

  // Desactivar una sucursal (cambia estado a 0)
  static async deactivate ({ id }) {
    try {
      await con.query('UPDATE sucursal SET estado = 0 WHERE id_sucursal = ?;', [id])

      const [sucursal] = await con.query('SELECT * FROM sucursal WHERE id_sucursal = ?;', [id])
      return sucursal.length ? sucursal[0] : null
    } catch (error) {
      console.error('Error al desactivar la sucursal:', error)
      throw new Error('Error al desactivar la sucursal')
    }
  }

  // Activar una sucursal (cambia estado a 1)
  static async activate ({ id }) {
    try {
      await con.query('UPDATE sucursal SET estado = 1 WHERE id_sucursal = ?;', [id])

      const [sucursal] = await con.query('SELECT * FROM sucursal WHERE id_sucursal = ?;', [id])
      return sucursal.length ? sucursal[0] : null
    } catch (error) {
      console.error('Error al activar la sucursal:', error)
      throw new Error('Error al activar la sucursal')
    }
  }

  // Actualización parcial de la sucursal
  static async partiallyUpdate ({ id, input }) {
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
    }
  }

  // Obtener una sucursal por nombre
  static async getByNombre ({ nombre }) {
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
    }
  }
}
