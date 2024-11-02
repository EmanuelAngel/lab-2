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

export class AgendaBaseModel {
  // Obtener todas las agendas activas (estado = 1)
  static async getAll () {
    try {
      const [rows] = await con.query('SELECT * FROM agenda_base WHERE estado = 1;')
      return rows
    } catch (error) {
      console.error('Error al obtener todas las agendas base:', error)
      throw new Error('Error al obtener las agendas base')
    }
  }

  // Obtener una agenda base por ID
  static async getById ({ id }) {
    try {
      const [rows] = await con.query('SELECT * FROM agenda_base WHERE id_agenda_base = ?;', [id])
      return rows.length ? rows[0] : null
    } catch (error) {
      console.error('Error al obtener la agenda base por ID:', error)
      throw new Error('Error al obtener la agenda base')
    }
  }

  // Crear una nueva agenda base
  static async create ({ input }) {
    const {
      id_sucursal,
      estado = 1,
      id_estado_agenda = 1,
      id_clasificacion,
      duracion_turno,
      sobreturnos_maximos,
      matricula
    } = input
    try {
      await con.query(
        `INSERT INTO agenda_base (id_sucursal, estado, id_estado_agenda, id_clasificacion, duracion_turno, sobreturnos_maximos, matricula)
        VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [id_sucursal, estado, id_estado_agenda, id_clasificacion, duracion_turno, sobreturnos_maximos, matricula]
      )
      const [agendas] = await con.query('SELECT * FROM agenda_base WHERE id_sucursal = ?;', [id_sucursal])
      return agendas[0]
    } catch (error) {
      console.error('Error al crear la agenda base:', error)
      throw error
    }
  }

  // Activar una agenda base (cambia estado a 1)
  static async activate ({ id }) {
    try {
      await con.query('UPDATE agenda_base SET estado = 1 WHERE id_agenda_base = ?;', [id])
      const [agenda] = await con.query('SELECT * FROM agenda_base WHERE id_agenda_base = ?;', [id])
      return agenda.length ? agenda[0] : null
    } catch (error) {
      console.error('Error al activar la agenda base:', error)
      throw new Error('Error al activar la agenda base')
    }
  }

  // Desactivar una agenda base (cambia estado a 0)
  static async deactivate ({ id }) {
    try {
      await con.query('UPDATE agenda_base SET estado = 0 WHERE id_agenda_base = ?;', [id])
      const [agenda] = await con.query('SELECT * FROM agenda_base WHERE id_agenda_base = ?;', [id])
      return agenda.length ? agenda[0] : null
    } catch (error) {
      console.error('Error al desactivar la agenda base:', error)
      throw new Error('Error al desactivar la agenda base')
    }
  }

  // Actualizar parcialmente una agenda base
  static async partiallyUpdate ({ id_agenda_base, input }) {
    const updateFields = []
    const updateValues = []

    // Iterar sobre las propiedades para actualizar solo los campos que se incluyen en "input"
    for (const [key, value] of Object.entries(input)) {
      if (value !== undefined) {
        updateFields.push(`${key} = ?`)
        updateValues.push(value)
      }
    }

    if (updateFields.length === 0) {
      return null
    }

    updateValues.push(id_agenda_base)

    try {
      const updateQuery = `
      UPDATE agenda_base 
      SET ${updateFields.join(', ')} 
      WHERE id_agenda_base = ?;
    `

      await con.query(updateQuery, updateValues)

      const [agendaBase] = await con.query('SELECT * FROM agenda_base WHERE id_agenda_base = ?;', [id_agenda_base])
      return agendaBase.length ? agendaBase[0] : null
    } catch (error) {
      console.error('Error al actualizar la agenda base:', error)
      throw new Error('Error al actualizar la agenda base')
    }
  }

  // Obtener agendas por matrícula
  static async getByMatricula ({ matricula }) {
    try {
      const [rows] = await con.query('SELECT * FROM agenda_base WHERE matricula = ?;', [matricula])
      return rows
    } catch (error) {
      console.error('Error al obtener agendas por matrícula:', error)
      throw new Error('Error al obtener agendas por matrícula')
    }
  }

  // Obtener agendas según id_estado_agenda
  static async getByEstadoAgenda ({ id_estado_agenda }) {
    try {
      const [rows] = await con.query('SELECT * FROM agenda_base WHERE id_estado_agenda = ?;', [id_estado_agenda])
      return rows
    } catch (error) {
      console.error('Error al obtener agendas por estado de agenda:', error)
      throw new Error('Error al obtener agendas por estado de agenda')
    }
  }

  // Obtener todas las agendas para una sucursal específica
  static async getBySucursal ({ id_sucursal }) {
    try {
      const [rows] = await con.query('SELECT * FROM agenda_base WHERE id_sucursal = ?;', [id_sucursal])
      return rows
    } catch (error) {
      console.error('Error al obtener agendas por sucursal:', error)
      throw new Error('Error al obtener agendas por sucursal')
    }
  }

  // Obtener agendas por id_sucursal y id_clasificacion
  static async getBySucursalAndClasificacion ({ id_sucursal, id_clasificacion }) {
    try {
      const [rows] = await con.query('SELECT * FROM agenda_base WHERE id_sucursal = ? AND id_clasificacion = ?;', [id_sucursal, id_clasificacion])
      return rows
    } catch (error) {
      console.error('Error al obtener agendas por sucursal y clasificación:', error)
      throw new Error('Error al obtener agendas por sucursal y clasificación')
    }
  }
}
