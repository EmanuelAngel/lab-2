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

export class EstadoAgendaModel {
  // Obtener todos los estados de agenda
  static async getAll () {
    try {
      const [rows] = await con.query('SELECT * FROM estado_agenda;')
      return rows
    } catch (error) {
      console.error('Error al obtener todos los estados de agenda:', error)
      throw new Error('Error al obtener los estados de agenda')
    }
  }

  // Obtener un estado de agenda por ID
  static async getById ({ id }) {
    try {
      const [rows] = await con.query('SELECT * FROM estado_agenda WHERE id_estado_agenda = ?;', [id])
      return rows.length ? rows[0] : null
    } catch (error) {
      console.error('Error al obtener el estado de agenda por ID:', error)
      throw new Error('Error al obtener el estado de agenda')
    }
  }

  static async getByNombre ({ nombre_estado }) {
    try {
      const [rows] = await con.query('SELECT * FROM estado_agenda WHERE nombre_estado = ?;', [nombre_estado])
      return rows.length ? rows[0] : null
    } catch (error) {
      console.error('Error al obtener el estado de agenda por nombre:', error)
      throw new Error('Error al obtener el estado de agenda por nombre')
    }
  }

  // Crear un nuevo estado de agenda
  static async create ({ input }) {
    const { nombre_estado } = input
    try {
      await con.query('INSERT INTO estado_agenda (nombre_estado) VALUES (?);', [nombre_estado])

      const [estado] = await con.query('SELECT * FROM estado_agenda WHERE nombre_estado = ?;', [nombre_estado])
      return estado[0]
    } catch (error) {
      console.error('Error al crear el estado de agenda:', error)
      throw error
    }
  }

  // Actualizar parcialmente un estado de agenda
  static async partiallyUpdate ({ id, input }) {
    const { nombre_estado } = input
    if (!nombre_estado) {
      return null // Solo se puede actualizar el campo "nombre_estado"
    }

    try {
      await con.query('UPDATE estado_agenda SET nombre_estado = ? WHERE id_estado_agenda = ?;', [nombre_estado, id])

      const [estado] = await con.query('SELECT * FROM estado_agenda WHERE id_estado_agenda = ?;', [id])
      return estado.length ? estado[0] : null
    } catch (error) {
      console.error('Error al actualizar el estado de agenda:', error)
      throw new Error('Error al actualizar el estado de agenda')
    }
  }

  // Desactivar (eliminar) un estado de agenda
  static async deactivate ({ id }) {
    try {
      await con.query('DELETE FROM estado_agenda WHERE id_estado_agenda = ?;', [id])
      return { message: 'Estado de agenda eliminado' }
    } catch (error) {
      console.error('Error al eliminar el estado de agenda:', error)
      throw new Error('Error al eliminar el estado de agenda')
    }
  }
}
