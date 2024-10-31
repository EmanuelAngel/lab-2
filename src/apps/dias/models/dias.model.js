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

export class DiasModel {
  // Obtener todos los días
  static async getAll () {
    try {
      const [rows] = await con.query('SELECT * FROM dias;')
      return rows
    } catch (error) {
      console.error('Error al obtener todos los días:', error)
      throw new Error('Error al obtener los días')
    }
  }

  // Obtener un día por ID
  static async getById ({ id }) {
    try {
      const [rows] = await con.query('SELECT * FROM dias WHERE id_dia = ?;', [id])
      return rows.length ? rows[0] : null
    } catch (error) {
      console.error('Error al obtener el día por ID:', error)
      throw new Error('Error al obtener el día')
    }
  }

  // Crear un nuevo día
  static async create ({ input }) {
    const { dia } = input
    try {
      await con.query(
        'INSERT INTO dias (dia) VALUES (?);',
        [dia]
      )

      const [createdDay] = await con.query('SELECT * FROM dias WHERE dia = ?;', [dia])
      return createdDay[0]
    } catch (error) {
      console.error('Error al crear el día:', error)
      throw error
    }
  }

  // Actualizar un día por ID
  static async update ({ id, input }) {
    const { dia } = input
    try {
      await con.query('UPDATE dias SET dia = ? WHERE id_dia = ?;', [dia, id])

      const [updatedDay] = await con.query('SELECT * FROM dias WHERE id_dia = ?;', [id])
      return updatedDay.length ? updatedDay[0] : null
    } catch (error) {
      console.error('Error al actualizar el día:', error)
      throw new Error('Error al actualizar el día')
    }
  }

  // Eliminar un día por ID
  static async delete ({ id }) {
    try {
      await con.query('DELETE FROM dias WHERE id_dia = ?;', [id])
      return { message: 'Día eliminado' }
    } catch (error) {
      console.error('Error al eliminar el día:', error)
      throw new Error('Error al eliminar el día')
    }
  }

  // Obtener un día por nombre
  static async getByNombre ({ dia }) {
    try {
      const [rows] = await con.query('SELECT * FROM dias WHERE dia LIKE ?;', [`%${dia}%`])
      return rows
    } catch (error) {
      console.error('Error al buscar día por nombre:', error)
      throw new Error('Error al buscar día por nombre')
    }
  }
}
