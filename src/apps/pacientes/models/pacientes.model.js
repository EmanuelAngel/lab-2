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

export class PacientesModel {
  static async getAll () {
    try {
      const [rows] = await con.query('SELECT * FROM pacientes WHERE estado = 1;')
      return rows
    } catch (error) {
      console.error('Error al obtener todos los pacientes:', error)
      throw new Error('Error al obtener los pacientes')
    }
  }

  static async getById ({ id }) {
    try {
      const [rows] = await con.query('SELECT * FROM pacientes WHERE id_paciente = ?;', [id])
      return rows.length ? rows[0] : null
    } catch (error) {
      console.error('Error al obtener el paciente por ID:', error)
      throw new Error('Error al obtener el paciente')
    }
  }

  static async create ({ input }) {
    const { tiene_obra_social, id_usuario, fotocopia_dni = null } = input
    try {
      await con.query(
        `INSERT INTO pacientes (tiene_obra_social, estado, id_usuario, fotocopia_dni)
        VALUES (?, 1, ?, ?)`,
        [tiene_obra_social, id_usuario, fotocopia_dni]
      )

      const [pacientes] = await con.query('SELECT * FROM pacientes WHERE id_usuario = ?;', [id_usuario])
      return pacientes[0]
    } catch (error) {
      console.error('Error al crear el paciente:', error)
      throw error
    }
  }

  static async deactivate ({ id }) {
    try {
      await con.query('UPDATE pacientes SET estado = 0 WHERE id_paciente = ?;', [id])
      const [paciente] = await con.query('SELECT * FROM pacientes WHERE id_paciente = ?;', [id])
      return paciente.length ? paciente[0] : null
    } catch (error) {
      console.error('Error al desactivar el paciente:', error)
      throw new Error('Error al desactivar el paciente')
    }
  }

  static async activate ({ id }) {
    try {
      await con.query('UPDATE pacientes SET estado = 1 WHERE id_paciente = ?;', [id])
      const [paciente] = await con.query('SELECT * FROM pacientes WHERE id_paciente = ?;', [id])
      return paciente.length ? paciente[0] : null
    } catch (error) {
      console.error('Error al activar el paciente:', error)
      throw new Error('Error al activar el paciente')
    }
  }

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
          UPDATE pacientes 
          SET ${updateFields.join(', ')} 
          WHERE id_paciente = ?;
        `

      await con.query(updateQuery, updateValues)

      const [pacientes] = await con.query('SELECT * FROM pacientes WHERE id_paciente = ?;', [id])
      return pacientes.length ? pacientes[0] : null
    } catch (error) {
      console.error('Error al actualizar el paciente:', error)
      throw new Error('Error al actualizar el paciente')
    }
  }

  static async getByObraSocial ({ tiene_obra_social }) {
    try {
      const [rows] = await con.query('SELECT * FROM pacientes WHERE tiene_obra_social = ? AND estado = 1;', [tiene_obra_social])
      return rows
    } catch (error) {
      console.error('Error al obtener pacientes por obra social:', error)
      throw new Error('Error al obtener pacientes por obra social')
    }
  }

  static async getByUsuario ({ id_usuario }) {
    try {
      const [rows] = await con.query('SELECT * FROM pacientes WHERE id_usuario = ? AND estado = 1;', [id_usuario])
      return rows
    } catch (error) {
      console.error('Error al obtener pacientes por id_usuario:', error)
      throw new Error('Error al obtener pacientes por id_usuario')
    }
  }
}
