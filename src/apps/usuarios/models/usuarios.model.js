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

export class UsuariosModel {
  // Obtener todos los usuarios activos (estado = 1)
  static async getAll () {
    try {
      const [rows] = await con.query('SELECT * FROM usuarios WHERE estado = 1;')
      return rows
    } catch (error) {
      console.error('Error al obtener todos los usuarios:', error)
      throw new Error('Error al obtener los usuarios')
    }
  }

  // Obtener un usuario por ID
  static async getById ({ id }) {
    try {
      const [rows] = await con.query('SELECT * FROM usuarios WHERE id_usuario = ?;', [id])
      return rows.length ? rows[0] : null
    } catch (error) {
      console.error('Error al obtener el usuario por ID:', error)
      throw new Error('Error al obtener el usuario')
    }
  }

  // Crear un nuevo usuario
  static async create ({ input }) {
    const { id_rol, nombre_usuario, contraseña, nombre, apellido, dni, telefono, direccion, email } = input
    try {
      await con.query(
        `INSERT INTO usuarios (id_rol, nombre_usuario, contraseña, nombre, apellido, dni, telefono, direccion, email, estado)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1)`,
        [id_rol, nombre_usuario, contraseña, nombre, apellido, dni, telefono, direccion, email]
      )

      const [usuarios] = await con.query('SELECT * FROM usuarios WHERE dni = ?;', [dni])
      return usuarios[0]
    } catch (error) {
      console.error('Error al crear el usuario:', error)
      throw error
    }
  }

  // Desactivar un usuario (cambia estado a 0)
  static async deactivate ({ id }) {
    try {
      await con.query('UPDATE usuarios SET estado = 0 WHERE id_usuario = ?;', [id])

      const [usuario] = await con.query('SELECT * FROM usuarios WHERE id_usuario = ?;', [id])
      return usuario.length ? usuario[0] : null
    } catch (error) {
      console.error('Error al desactivar el usuario:', error)
      throw new Error('Error al desactivar el usuario')
    }
  }

  // Activar un usuario (cambia estado a 1)
  static async activate ({ id }) {
    try {
      await con.query('UPDATE usuarios SET estado = 1 WHERE id_usuario = ?;', [id])

      const [usuario] = await con.query('SELECT * FROM usuarios WHERE id_usuario = ?;', [id])
      return usuario.length ? usuario[0] : null
    } catch (error) {
      console.error('Error al activar el usuario:', error)
      throw new Error('Error al activar el usuario')
    }
  }

  // Actualización parcial del usuario
  static async partiallyUpdate ({ id, input }) {
    const updateFields = []
    const updateValues = []

    // Iteramos sobre las propiedades para agregar solo los campos que se actualizarán
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
        UPDATE usuarios
        SET ${updateFields.join(', ')}
        WHERE id_usuario = ?;
      `
      await con.query(updateQuery, updateValues)

      const [usuarios] = await con.query('SELECT * FROM usuarios WHERE id_usuario = ?;', [id])
      return usuarios.length ? usuarios[0] : null
    } catch (error) {
      console.error('Error al actualizar el usuario:', error)
      throw new Error('Error al actualizar el usuario')
    }
  }
}
