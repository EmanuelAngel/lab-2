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
const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

// Helper para formatear horas
const formatTime = (timeString) => {
  const time = new Date(`1970-01-01T${timeString}`)
  return time.toLocaleTimeString('es-AR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  })
}

export class TurnoModel {
  // Obtener todos los turnos
  static async getAll () {
    try {
      const [rows] = await con.query('SELECT * FROM turnos;')
      return rows.map(row => ({
        ...row,
        fecha: formatDate(row.fecha),
        horario_inicio: formatTime(row.horario_inicio),
        horario_fin: formatTime(row.horario_fin)
      }))
    } catch (error) {
      console.error('Error al obtener todos los turnos:', error)
      throw new Error('Error al obtener los turnos')
    }
  }

  // Obtener un turno por ID
  static async getById ({ id }) {
    try {
      const [rows] = await con.query('SELECT * FROM turnos WHERE id_turno = ?;', [id])
      return rows.length
        ? {
            ...rows[0],
            fecha: formatDate(rows[0].fecha),
            horario_inicio: formatTime(rows[0].horario_inicio),
            horario_fin: formatTime(rows[0].horario_fin)
          }
        : null
    } catch (error) {
      console.error('Error al obtener el turno por ID:', error)
      throw new Error('Error al obtener el turno')
    }
  }

  // Crear un nuevo turno
  static async create ({ input }) {
    const { id_agenda_base, id_paciente, id_profesional, id_especialidad, id_estado_turno, fecha, horario_inicio, horario_fin, motivo_consulta, es_sobreturno = 0 } = input
    try {
      await con.query(
        `INSERT INTO turnos (id_agenda_base, id_paciente, id_profesional, id_especialidad, id_estado_turno, fecha, horario_inicio, horario_fin, motivo_consulta, es_sobreturno)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [id_agenda_base, id_paciente, id_profesional, id_especialidad, id_estado_turno, fecha, horario_inicio, horario_fin, motivo_consulta, es_sobreturno]
      )
      const [turno] = await con.query('SELECT * FROM turnos WHERE id_paciente = ? AND fecha = ?;', [id_paciente, fecha])
      return turno[0]
    } catch (error) {
      console.error('Error al crear el turno:', error)
      throw error
    }
  }

  // Actualizar parcialmente un turno
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
        UPDATE turnos 
        SET ${updateFields.join(', ')} 
        WHERE id_turno = ?;
      `

      await con.query(updateQuery, updateValues)

      // Actualizar los valores de los identificadores si no han sido proporcionados en el input
      input.id_agenda_base = input.id_agenda_base || (await TurnoModel.getById({ id })).id_agenda_base
      input.id_paciente = input.id_paciente || (await TurnoModel.getById({ id })).id_paciente
      input.id_profesional = input.id_profesional || (await TurnoModel.getById({ id })).id_profesional
      input.id_especialidad = input.id_especialidad || (await TurnoModel.getById({ id })).id_especialidad
      input.id_estado_turno = input.id_estado_turno || (await TurnoModel.getById({ id })).id_estado_turno

      const [turno] = await con.query('SELECT * FROM turnos WHERE id_turno = ?;', [id])
      return turno.length
        ? {
            ...turno[0],
            fecha: formatDate(turno[0].fecha),
            horario_inicio: formatTime(turno[0].horario_inicio),
            horario_fin: formatTime(turno[0].horario_fin)
          }
        : null
    } catch (error) {
      console.error('Error al actualizar el turno:', error)
      throw new Error('Error al actualizar el turno')
    }
  }

  // Eliminar un turno
  static async delete ({ id }) {
    try {
      await con.query('DELETE FROM turnos WHERE id_turno = ?;', [id])
      return { message: 'Turno eliminado' }
    } catch (error) {
      console.error('Error al eliminar el turno:', error)
      throw new Error('Error al eliminar el turno')
    }
  }

  // Obtener turnos por fecha
  static async getByFecha ({ fecha }) {
    try {
      const [rows] = await con.query('SELECT * FROM turnos WHERE fecha = ?;', [fecha])
      return rows.map(row => ({
        ...row,
        fecha: formatDate(row.fecha),
        horario_inicio: formatTime(row.horario_inicio),
        horario_fin: formatTime(row.horario_fin)
      }))
    } catch (error) {
      console.error('Error al obtener turnos por fecha:', error)
      throw new Error('Error al obtener turnos por fecha')
    }
  }

  // Obtener turnos por paciente
  static async getByPaciente ({ id_paciente }) {
    try {
      const [rows] = await con.query('SELECT * FROM turnos WHERE id_paciente = ?;', [id_paciente])
      return rows.map(row => ({
        ...row,
        fecha: formatDate(row.fecha),
        horario_inicio: formatTime(row.horario_inicio),
        horario_fin: formatTime(row.horario_fin)
      }))
    } catch (error) {
      console.error('Error al obtener turnos por paciente:', error)
      throw new Error('Error al obtener turnos por paciente')
    }
  }

  // Obtener turnos por especialidad
  static async getByEspecialidad ({ id_especialidad }) {
    try {
      const [rows] = await con.query('SELECT * FROM turnos WHERE id_especialidad = ?;', [id_especialidad])
      return rows.map(row => ({
        ...row,
        fecha: formatDate(row.fecha),
        horario_inicio: formatTime(row.horario_inicio),
        horario_fin: formatTime(row.horario_fin)
      }))
    } catch (error) {
      console.error('Error al obtener turnos por especialidad:', error)
      throw new Error('Error al obtener turnos por especialidad')
    }
  }

  // Contar turnos por fecha
  static async countTurnosByFecha ({ fecha }) {
    try {
      const [rows] = await con.query('SELECT COUNT(*) as total FROM turnos WHERE fecha = ?;', [fecha])
      return rows[0].total
    } catch (error) {
      console.error('Error al contar turnos por fecha:', error)
      throw new Error('Error al contar turnos por fecha')
    }
  }

  // Obtener turnos por rango de horas
  static async getByHoraRange ({ startTime, endTime }) {
    try {
      const [rows] = await con.query('SELECT * FROM turnos WHERE horario_inicio BETWEEN ? AND ?;', [startTime, endTime])
      return rows.map(row => ({
        ...row,
        fecha: formatDate(row.fecha),
        horario_inicio: formatTime(row.horario_inicio),
        horario_fin: formatTime(row.horario_fin)
      }))
    } catch (error) {
      console.error('Error al obtener turnos por rango de horas:', error)
      throw new Error('Error al obtener turnos por rango de horas')
    }
  }

  // Obtener turnos en una semana específica para un profesional
  static async getTurnosInWeek ({ id_profesional, weekStart, weekEnd }) {
    try {
      const [rows] = await con.query('SELECT * FROM turnos WHERE id_profesional = ? AND fecha BETWEEN ? AND ?;', [id_profesional, weekStart, weekEnd])
      return rows.map(row => ({
        ...row,
        fecha: formatDate(row.fecha),
        horario_inicio: formatTime(row.horario_inicio),
        horario_fin: formatTime(row.horario_fin)
      }))
    } catch (error) {
      console.error('Error al obtener turnos de un profesional en una semana específica:', error)
      throw new Error('Error al obtener turnos de un profesional en una semana específica')
    }
  }

  // Obtener turnos en una semana específica
  static async getTurnosInWeekGeneral ({ weekStart, weekEnd }) {
    try {
      const [rows] = await con.query('SELECT * FROM turnos WHERE fecha BETWEEN ? AND ?;', [weekStart, weekEnd])
      return rows.map(row => ({
        ...row,
        fecha: formatDate(row.fecha),
        horario_inicio: formatTime(row.horario_inicio),
        horario_fin: formatTime(row.horario_fin)
      }))
    } catch (error) {
      console.error('Error al obtener turnos en una semana específica:', error)
      throw new Error('Error al obtener turnos en una semana específica')
    }
  }

  // Obtener turnos por profesional en un rango de fechas
  static async getByProfesionalBetweenDates ({ id_profesional, startDate, endDate }) {
    try {
      const [rows] = await con.query('SELECT * FROM turnos WHERE id_profesional = ? AND fecha BETWEEN ? AND ?;', [id_profesional, startDate, endDate])
      return rows.map(row => ({
        ...row,
        fecha: formatDate(row.fecha),
        horario_inicio: formatTime(row.horario_inicio),
        horario_fin: formatTime(row.horario_fin)
      }))
    } catch (error) {
      console.error('Error al obtener turnos de un profesional entre fechas:', error)
      throw new Error('Error al obtener turnos de un profesional entre fechas')
    }
  }

  // Obtener turnos por especialidad en un rango de fechas
  static async getByEspecialidadBetweenDates ({ id_especialidad, startDate, endDate }) {
    try {
      const [rows] = await con.query('SELECT * FROM turnos WHERE id_especialidad = ? AND fecha BETWEEN ? AND ?;', [id_especialidad, startDate, endDate])
      return rows.map(row => ({
        ...row,
        fecha: formatDate(row.fecha),
        horario_inicio: formatTime(row.horario_inicio),
        horario_fin: formatTime(row.horario_fin)
      }))
    } catch (error) {
      console.error('Error al obtener turnos de una especialidad entre fechas:', error)
      throw new Error('Error al obtener turnos de una especialidad entre fechas')
    }
  }

  // Obtener turnos en un mes específico para un profesional
  static async getTurnosInMonth ({ id_profesional, month, year }) {
    try {
      const [rows] = await con.query('SELECT * FROM turnos WHERE id_profesional = ? AND MONTH(fecha) = ? AND YEAR(fecha) = ?;', [id_profesional, month, year])
      return rows.map(row => ({
        ...row,
        fecha: formatDate(row.fecha),
        horario_inicio: formatTime(row.horario_inicio),
        horario_fin: formatTime(row.horario_fin)
      }))
    } catch (error) {
      console.error('Error al obtener turnos de un profesional en un mes específico:', error)
      throw new Error('Error al obtener turnos de un profesional en un mes específico')
    }
  }

  // Obtener turnos en un mes específico para una especialidad
  static async getTurnosInMonthByEspecialidad ({ id_especialidad, month, year }) {
    try {
      const [rows] = await con.query('SELECT * FROM turnos WHERE id_especialidad = ? AND MONTH(fecha) = ? AND YEAR(fecha) = ?;', [id_especialidad, month, year])
      return rows.map(row => ({
        ...row,
        fecha: formatDate(row.fecha),
        horario_inicio: formatTime(row.horario_inicio),
        horario_fin: formatTime(row.horario_fin)
      }))
    } catch (error) {
      console.error('Error al obtener turnos de una especialidad en un mes específico:', error)
      throw new Error('Error al obtener turnos de una especialidad en un mes específico')
    }
  }

  // Obtener turnos que contienen un motivo de consulta específico
  static async getByMotivoConsulta ({ consulta }) {
    try {
      const [rows] = await con.query('SELECT * FROM turnos WHERE motivo_consulta LIKE ?;', [`%${consulta}%`])
      return rows.map(row => ({
        ...row,
        fecha: formatDate(row.fecha),
        horario_inicio: formatTime(row.horario_inicio),
        horario_fin: formatTime(row.horario_fin)
      }))
    } catch (error) {
      console.error('Error al obtener turnos por motivo de consulta:', error)
      throw new Error('Error al obtener turnos por motivo de consulta')
    }
  }
}
