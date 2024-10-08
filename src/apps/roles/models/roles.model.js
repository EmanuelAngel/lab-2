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

export class RolesModel {
  // Obtener todos los roles activos
  static async getAll () {
    try {
      // Seleccionamos todos los roles
      const [rows] = await con.query('SELECT * FROM roles;')
      return rows
    } catch (error) {
      console.error('Error al obtener todos los roles:', error)
      throw new Error('Error al obtener los roles')
    }
  }

  // Obtener un rol por ID
  static async getById ({ id }) {
    try {
      const [rows] = await con.query('SELECT * FROM roles WHERE id_rol = ?;', [id])
      return rows.length ? rows[0] : null
    } catch (error) {
      console.error('Error al obtener el rol por ID:', error)
      throw new Error('Error al obtener el rol')
    }
  }

  // Crear un nuevo rol
  static async create ({ input }) {
    const { nombre, descripcion } = input
    try {
      await con.query(
        `INSERT INTO roles (nombre, descripcion)
        VALUES (?, ?)`,
        [nombre, descripcion]
      )

      // Intentamos obtener el rol recién creado utilizando el nombre
      const [role] = await con.query('SELECT * FROM roles WHERE nombre = ?;', [nombre])
      return role[0]
    } catch (error) {
      console.error('Error al crear el rol:', error)
      throw error
    }
  }

  // Actualizar un rol
  static async update ({ id, input }) {
    const updateFields = []
    const updateValues = []

    for (const [key, value] of Object.entries(input)) {
      if (value !== undefined) {
        updateFields.push(`${key} = ?`)
        updateValues.push(value)
      }
    }

    if (updateFields.length === 0) {
      return null // No hay campos para actualizar
    }

    updateValues.push(id)

    try {
      const updateQuery = `
        UPDATE roles 
        SET ${updateFields.join(', ')} 
        WHERE id_rol = ?;
      `

      await con.query(updateQuery, updateValues)

      const [roles] = await con.query('SELECT * FROM roles WHERE id_rol = ?;', [id])
      return roles.length ? roles[0] : null
    } catch (error) {
      console.error('Error al actualizar el rol:', error)
      throw new Error('Error al actualizar el rol')
    }
  }

  // Desactivar un rol
  static async deactivate ({ id }) {
    try {
      await con.query('DELETE FROM roles WHERE id_rol = ?;', [id])
      return { message: 'Rol desactivado' }
    } catch (error) {
      console.error('Error al desactivar el rol:', error)
      throw new Error('Error al desactivar el rol')
    }
  }
}
