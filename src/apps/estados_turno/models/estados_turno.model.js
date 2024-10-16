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

export class EstadosTurnoModel {
  // Obtener todos los estados de turno activos
  static async getAll () {
    try {
      const [rows] = await con.query('SELECT * FROM estados_turno WHERE estado_activo = 1;')
      return rows
    } catch (error) {
      console.error('Error al obtener todos los estados de turno:', error)
      throw new Error('Error al obtener los estados de turno')
    }
  }

  // Obtener un estado de turno por ID
  static async getById ({ id }) {
    try {
      const [rows] = await con.query('SELECT * FROM estados_turno WHERE id_estado_turno = ?;', [id])
      return rows.length ? rows[0] : null
    } catch (error) {
      console.error('Error al obtener el estado de turno por ID:', error)
      throw new Error('Error al obtener el estado de turno')
    }
  }

  // Crear un nuevo estado de turno
  static async create ({ input }) {
    const { nombre_estado, estado_activo = 1 } = input
    try {
      await con.query(
        `INSERT INTO estados_turnos (nombre_estado, estado_activo)
        VALUES (?, ?)`,
        [nombre_estado, estado_activo]
      )
      const [estado] = await con.query('SELECT * FROM estados_turno WHERE nombre_estado = ?;', [nombre_estado])
      return estado[0]
    } catch (error) {
      console.error('Error al crear el estado de turno:', error)
      throw error
    }
  }

  // Desactivar un estado de turno
  static async deactivate ({ id }) {
    try {
      await con.query('UPDATE estados_turno SET estado_activo = 0 WHERE id_estado_turno = ?;', [id])
      const [estado] = await con.query('SELECT * FROM estados_turno WHERE id_estado_turno = ?;', [id])
      return estado.length ? estado[0] : null
    } catch (error) {
      console.error('Error al desactivar el estado de turno:', error)
      throw new Error('Error al desactivar el estado de turno')
    }
  }

  // Activar un estado de turno
  static async activate ({ id }) {
    try {
      await con.query('UPDATE estados_turno SET estado_activo = 1 WHERE id_estado_turno = ?;', [id])
      const [estado] = await con.query('SELECT * FROM estados_turno WHERE id_estado_turno = ?;', [id])
      return estado.length ? estado[0] : null
    } catch (error) {
      console.error('Error al activar el estado de turno:', error)
      throw new Error('Error al activar el estado de turno')
    }
  }

  // Modificar el nombre de un estado de turno
  static async updateNombre ({ id, nuevoNombre }) {
    try {
      await con.query('UPDATE estados_turno SET nombre_estado = ? WHERE id_estado_turno = ?;', [nuevoNombre, id])
      const [estado] = await con.query('SELECT * FROM estados_turno WHERE id_estado_turno = ?;', [id])
      return estado.length ? estado[0] : null
    } catch (error) {
      console.error('Error al actualizar el nombre del estado de turno:', error)
      throw new Error('Error al actualizar el nombre del estado de turno')
    }
  }

  // Buscar estados de turno por nombre
  static async searchByName ({ nombre }) {
    try {
      const [rows] = await con.query('SELECT * FROM estados_turno WHERE nombre_estado LIKE ?;', [`%${nombre}%`])
      return rows
    } catch (error) {
      console.error('Error al buscar estados de turno por nombre:', error)
      throw new Error('Error al buscar estados de turno')
    }
  }
}
