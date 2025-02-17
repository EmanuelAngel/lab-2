import pool from '../../../config/db.config.js'

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
  static async getAll () {
    const con = await pool.getConnection()
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
    } finally {
      con.release()
    }
  }

  static async getById ({ id }) {
    const con = await pool.getConnection()
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
    } finally {
      con.release()
    }
  }

  static async create ({ input }) {
    const con = await pool.getConnection()
    const { id_agenda_base, id_paciente, id_estado_turno, fecha, horario_inicio, horario_fin, motivo_consulta } = input
    try {
      await con.query(
        `INSERT INTO turnos (id_agenda_base, id_paciente, id_estado_turno, fecha, horario_inicio, horario_fin, motivo_consulta)
        VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [id_agenda_base, id_paciente, id_estado_turno, fecha, horario_inicio, horario_fin, motivo_consulta]
      )
      const [turno] = await con.query('SELECT * FROM turnos WHERE id_paciente = ? AND fecha = ?;', [id_paciente, fecha])
      return turno[0]
    } catch (error) {
      console.error('Error al crear el turno:', error)
      throw error
    } finally {
      con.release()
    }
  }

  static async partiallyUpdate ({ id, input }) {
    const con = await pool.getConnection()
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
    } finally {
      con.release()
    }
  }

  static async delete ({ id }) {
    const con = await pool.getConnection()
    try {
      await con.query('DELETE FROM turnos WHERE id_turno = ?;', [id])
      return { message: 'Turno eliminado' }
    } catch (error) {
      console.error('Error al eliminar el turno:', error)
      throw new Error('Error al eliminar el turno')
    } finally {
      con.release()
    }
  }

  static async getByFecha ({ fecha }) {
    const con = await pool.getConnection()
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
    } finally {
      con.release()
    }
  }

  static async getByPaciente ({ id_paciente }) {
    const con = await pool.getConnection()
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
    } finally {
      con.release()
    }
  }

  static async getByEstadoTurno ({ id_estado_turno }) {
    const con = await pool.getConnection()
    try {
      const [rows] = await con.query('SELECT * FROM turnos WHERE id_estado_turno = ?;', [id_estado_turno])
      return rows.map(row => ({
        ...row,
        fecha: formatDate(row.fecha),
        horario_inicio: formatTime(row.horario_inicio),
        horario_fin: formatTime(row.horario_fin)
      }))
    } catch (error) {
      console.error('Error al obtener turnos por estado de turno:', error)
      throw new Error('Error al obtener turnos por estado de turno')
    } finally {
      con.release()
    }
  }

  static async getByMotivoConsulta ({ consulta }) {
    const con = await pool.getConnection()
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
    } finally {
      con.release()
    }
  }
}
