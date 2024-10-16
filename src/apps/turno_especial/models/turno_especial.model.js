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

// Helper para formatear fechas
const formatDate = (date) => {
  return new Date(date).toLocaleDateString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

// Helper para formatear horarios
const formatTime = (time) => {
  return time.slice(0, 5) // Devuelve el formato HH:MM
}

export class TurnoEspecialModel {
  // Obtener todos los turnos especiales
  static async getAll () {
    try {
      const [rows] = await con.query('SELECT * FROM turno_especial;')
      return rows.map(row => ({
        ...row,
        fecha: formatDate(row.fecha), // Formatear la fecha
        horario_inicio: formatTime(row.horario_inicio), // Formatear el horario
        horario_fin: formatTime(row.horario_fin), // Formatear el horario
        id_estado_turno: row.id_estado_turno,
        motivo: row.motivo
      }))
    } catch (error) {
      console.error('Error al obtener todos los turnos especiales:', error)
      throw new Error('Error al obtener los turnos especiales')
    }
  }

  // Obtener un turno especial por ID
  static async getById ({ id }) {
    try {
      const [rows] = await con.query('SELECT * FROM turno_especial WHERE id_turno_especial = ?;', [id])
      return rows.length ? {
        ...rows[0],
        fecha: formatDate(rows[0].fecha), // Formatear la fecha
        horario_inicio: formatTime(rows[0].horario_inicio), // Formatear el horario
        horario_fin: formatTime(rows[0].horario_fin) // Formatear el horario
      } : null
    } catch (error) {
      console.error('Error al obtener el turno especial por ID:', error)
      throw new Error('Error al obtener el turno especial')
    }
  }

  // Crear un nuevo turno especial
  static async create ({ input }) {
    const { id_agenda_base, fecha, horario_inicio, horario_fin, id_estado_turno, motivo } = input
    try {
      await con.query(
        `INSERT INTO turno_especial (id_agenda_base, fecha, horario_inicio, horario_fin, id_estado_turno, motivo)
        VALUES (?, ?, ?, ?, ?, ?)`,
        [id_agenda_base, fecha, horario_inicio, horario_fin, id_estado_turno, motivo]
      )
      const [turno] = await con.query('SELECT * FROM turno_especial WHERE id_agenda_base = ? AND fecha = ?;', [id_agenda_base, fecha])
      return {
        ...turno[0],
        fecha: formatDate(turno[0].fecha), // Formatear la fecha
        horario_inicio: formatTime(turno[0].horario_inicio), // Formatear el horario
        horario_fin: formatTime(turno[0].horario_fin) // Formatear el horario
      }
    } catch (error) {
      console.error('Error al crear el turno especial:', error)
      throw error
    }
  }

  // Actualizar parcialmente un turno especial
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
        UPDATE turno_especial 
        SET ${updateFields.join(', ')} 
        WHERE id_turno_especial = ?;
      `

      await con.query(updateQuery, updateValues)

      // Actualizar los valores de los identificadores si no han sido proporcionados en el input
      input.id_agenda_base = input.id_agenda_base || (await TurnoEspecialModel.getById({ id })).id_agenda_base

      const [turno] = await con.query('SELECT * FROM turno_especial WHERE id_turno_especial = ?;', [id])
      return turno.length ? {
        ...turno[0],
        fecha: formatDate(turno[0].fecha), // Formatear la fecha
        horario_inicio: formatTime(turno[0].horario_inicio), // Formatear el horario
        horario_fin: formatTime(turno[0].horario_fin) // Formatear el horario
      } : null
    } catch (error) {
      console.error('Error al actualizar el turno especial:', error)
      throw new Error('Error al actualizar el turno especial')
    }
  }

  // Eliminar un turno especial
  static async delete ({ id }) {
    try {
      await con.query('DELETE FROM turno_especial WHERE id_turno_especial = ?;', [id])
      return { message: 'Turno especial eliminado' }
    } catch (error) {
      console.error('Error al eliminar el turno especial:', error)
      throw new Error('Error al eliminar el turno especial')
    }
  }

  // Obtener turnos especiales por fecha
  static async getByFecha ({ fecha }) {
    try {
      const [rows] = await con.query('SELECT * FROM turno_especial WHERE fecha = ?;', [fecha])
      return rows.map(row => ({
        ...row,
        fecha: formatDate(row.fecha), // Formatear la fecha
        horario_inicio: formatTime(row.horario_inicio), // Formatear el horario
        horario_fin: formatTime(row.horario_fin) // Formatear el horario
      }))
    } catch (error) {
      console.error('Error al obtener turnos especiales por fecha:', error)
      throw new Error('Error al obtener turnos especiales por fecha')
    }
  }

  // Obtener todos los turnos especiales relacionados con una agenda específica
  static async getByAgendaBase ({ id_agenda_base }) {
    try {
      const [rows] = await con.query('SELECT * FROM turno_especial WHERE id_agenda_base = ?;', [id_agenda_base])
      return rows.map(row => ({
        ...row,
        fecha: formatDate(row.fecha), // Formatear la fecha
        horario_inicio: formatTime(row.horario_inicio), // Formatear el horario
        horario_fin: formatTime(row.horario_fin) // Formatear el horario
      }))
    } catch (error) {
      console.error('Error al obtener turnos especiales por agenda base:', error)
      throw new Error('Error al obtener turnos especiales por agenda base')
    }
  }

  // Obtener turnos especiales dentro de un rango de fechas
  static async getByDateRange ({ startDate, endDate }) {
    try {
      const [rows] = await con.query('SELECT * FROM turno_especial WHERE fecha BETWEEN ? AND ?;', [startDate, endDate])
      return rows.map(row => ({
        ...row,
        fecha: formatDate(row.fecha), // Formatear la fecha
        horario_inicio: formatTime(row.horario_inicio), // Formatear el horario
        horario_fin: formatTime(row.horario_fin) // Formatear el horario
      }))
    } catch (error) {
      console.error('Error al obtener turnos especiales por rango de fechas:', error)
      throw new Error('Error al obtener turnos especiales por rango de fechas')
    }
  }

  // Obtener turnos especiales por estado
  static async getByEstadoTurno ({ id_estado_turno }) {
    try {
      const [rows] = await con.query('SELECT * FROM turno_especial WHERE id_estado_turno = ?;', [id_estado_turno])
      return rows.map(row => ({
        ...row,
        fecha: formatDate(row.fecha), // Formatear la fecha
        horario_inicio: formatTime(row.horario_inicio), // Formatear el horario
        horario_fin: formatTime(row.horario_fin) // Formatear el horario
      }))
    } catch (error) {
      console.error('Error al obtener turnos especiales por estado:', error)
      throw new Error('Error al obtener turnos especiales por estado')
    }
  }

  // Contar turnos especiales por fecha
  static async countTurnosByFecha ({ fecha }) {
    try {
      const [rows] = await con.query('SELECT COUNT(*) as total FROM turno_especial WHERE fecha = ?;', [fecha])
      return rows[0].total
    } catch (error) {
      console.error('Error al contar turnos especiales por fecha:', error)
      throw new Error('Error al contar turnos especiales por fecha')
    }
  }
}
