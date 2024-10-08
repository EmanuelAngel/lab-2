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

export class AdminsModel {
  // Obtener todos los administradores activos
  static async getAll () {
    try {
      // Seleccionamos todos los admins que tienen estado 1 (activos)
      const [rows] = await con.query('SELECT * FROM admins WHERE estado = 1;')
      return rows
    } catch (error) {
      console.error('Error al obtener todos los administradores:', error)
      throw new Error('Error al obtener los administradores')
    }
  }

  // Obtener un administrador por ID
  static async getById ({ id }) {
    try {
      const [rows] = await con.query('SELECT * FROM admins WHERE id_admin = ?;', [id])
      return rows.length ? rows[0] : null
    } catch (error) {
      console.error('Error al obtener el administrador por ID:', error)
      throw new Error('Error al obtener el administrador')
    }
  }

  // Crear un nuevo administrador
  static async create ({ input }) {
    const { id_usuario } = input
    try {
      await con.query(
        `INSERT INTO admins (estado, id_usuario)
        VALUES (1, ?)`,
        [id_usuario]
      )

      // Intentamos obtener el administrador recién creado utilizando el id_usuario
      const [admin] = await con.query('SELECT * FROM admins WHERE id_usuario = ?;', [id_usuario])
      return admin[0]
    } catch (error) {
      console.error('Error al crear el administrador:', error)
      throw error
    }
  }

  // Desactivar un administrador
  static async deactivate ({ id }) {
    try {
      await con.query('UPDATE admins SET estado = 0 WHERE id_admin = ?;', [id])

      const [admin] = await con.query('SELECT * FROM admins WHERE id_admin = ?;', [id])
      return admin.length ? admin[0] : null
    } catch (error) {
      console.error('Error al desactivar el administrador:', error)
      throw new Error('Error al desactivar el administrador')
    }
  }

  // Activar un administrador
  static async activate ({ id }) {
    try {
      await con.query('UPDATE admins SET estado = 1 WHERE id_admin = ?;', [id])

      const [admin] = await con.query('SELECT * FROM admins WHERE id_admin = ?;', [id])
      return admin.length ? admin[0] : null
    } catch (error) {
      console.error('Error al activar el administrador:', error)
      throw new Error('Error al activar el administrador')
    }
  }

  // Actualizar parcialmente un administrador
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
        UPDATE admins 
        SET ${updateFields.join(', ')} 
        WHERE id_admin = ?;
      `

      await con.query(updateQuery, updateValues)

      const [admins] = await con.query('SELECT * FROM admins WHERE id_admin = ?;', [id])
      return admins.length ? admins[0] : null
    } catch (error) {
      console.error('Error al actualizar el administrador:', error)
      throw new Error('Error al actualizar el administrador')
    }
  }
}
