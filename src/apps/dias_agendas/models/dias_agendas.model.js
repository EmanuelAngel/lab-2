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

// Helper para formatear horas
const formatTime = (timeString) => {
  const time = new Date(`1970-01-01T${timeString}`)
  return time.toLocaleTimeString('es-AR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  })
}

export class DiasAgendasModel {
  static async getAll () {
    try {
      const [rows] = await con.query('SELECT * FROM dias_agendas;')
      return rows.map(row => ({
        ...row,
        horario_inicio: formatTime(row.horario_inicio),
        horario_fin: formatTime(row.horario_fin)
      }))
    } catch (error) {
      console.error('Error al obtener todas las relaciones dia-agenda:', error)
      throw new Error('Error al obtener las relaciones dia-agenda')
    }
  }

  static async getById ({ id_dia, id_agenda_base }) {
    try {
      const [rows] = await con.query('SELECT * FROM dias_agendas WHERE id_dia = ? AND id_agenda_base = ?;', [id_dia, id_agenda_base])
      return rows.length
        ? {
            ...rows[0],
            horario_inicio: formatTime(rows[0].horario_inicio),
            horario_fin: formatTime(rows[0].horario_fin)
          }
        : null
    } catch (error) {
      console.error('Error al obtener la relación dia-agenda por ID:', error)
      throw new Error('Error al obtener la relación dia-agenda')
    }
  }

  static async create ({ input }) {
    const { id_dia, id_agenda_base, horario_inicio, horario_fin } = input
    try {
      await con.query(
        `INSERT INTO dias_agendas (id_dia, id_agenda_base, horario_inicio, horario_fin)
        VALUES (?, ?, ?, ?)`,
        [id_dia, id_agenda_base, horario_inicio, horario_fin]
      )
      const [diaAgenda] = await con.query('SELECT * FROM dias_agendas WHERE id_dia = ? AND id_agenda_base = ?;', [id_dia, id_agenda_base])
      return diaAgenda[0]
    } catch (error) {
      console.error('Error al crear la relación dia-agenda:', error)
      throw error
    }
  }

  static async partiallyUpdate ({ id_dia, id_agenda_base, input }) {
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

    updateValues.push(id_dia, id_agenda_base)

    try {
      const updateQuery = `
        UPDATE dias_agendas 
        SET ${updateFields.join(', ')} 
        WHERE id_dia = ? AND id_agenda_base = ?;
      `

      await con.query(updateQuery, updateValues)

      const [diaAgenda] = await con.query('SELECT * FROM dias_agendas WHERE id_dia = ? AND id_agenda_base = ?;', [id_dia, id_agenda_base])
      return diaAgenda.length
        ? {
            ...diaAgenda[0],
            horario_inicio: formatTime(diaAgenda[0].horario_inicio),
            horario_fin: formatTime(diaAgenda[0].horario_fin)
          }
        : null
    } catch (error) {
      console.error('Error al actualizar la relación dia-agenda:', error)
      throw new Error('Error al actualizar la relación dia-agenda')
    }
  }

  static async delete ({ id_dia, id_agenda_base }) {
    try {
      await con.query('DELETE FROM dias_agendas WHERE id_dia = ? AND id_agenda_base = ?;', [id_dia, id_agenda_base])
      return { message: 'Relación dia-agenda eliminada' }
    } catch (error) {
      console.error('Error al eliminar la relación dia-agenda:', error)
      throw new Error('Error al eliminar la relación dia-agenda')
    }
  }

  static async getByDia ({ id_dia }) {
    try {
      const [rows] = await con.query('SELECT * FROM dias_agendas WHERE id_dia = ?;', [id_dia])
      return rows.map(row => ({
        ...row,
        horario_inicio: formatTime(row.horario_inicio),
        horario_fin: formatTime(row.horario_fin)
      }))
    } catch (error) {
      console.error('Error al obtener relaciones por día:', error)
      throw new Error('Error al obtener relaciones por día')
    }
  }

  static async getByHorarioRange ({ startTime, endTime }) {
    try {
      const [rows] = await con.query('SELECT * FROM dias_agendas WHERE horario_inicio BETWEEN ? AND ?;', [startTime, endTime])
      return rows.map(row => ({
        ...row,
        horario_inicio: formatTime(row.horario_inicio),
        horario_fin: formatTime(row.horario_fin)
      }))
    } catch (error) {
      console.error('Error al obtener relaciones por rango de horario:', error)
      throw new Error('Error al obtener relaciones por rango de horario')
    }
  }
}
