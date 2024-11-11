import pool from '../../../config/db.config.js'

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
    const con = await pool.getConnection()
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
    } finally {
      con.release()
    }
  }

  static async getById ({ id_dia, id_agenda_base }) {
    const con = await pool.getConnection()
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
    } finally {
      con.release()
    }
  }

  static async create ({ input }) {
    const con = await pool.getConnection()
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
    } finally {
      con.release()
    }
  }

  static async partiallyUpdate ({ id_dia, id_agenda_base, input }) {
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
    } finally {
      con.release()
    }
  }

  static async delete ({ id_dia, id_agenda_base }) {
    const con = await pool.getConnection()
    try {
      await con.query('DELETE FROM dias_agendas WHERE id_dia = ? AND id_agenda_base = ?;', [id_dia, id_agenda_base])
      return { message: 'Relación dia-agenda eliminada' }
    } catch (error) {
      console.error('Error al eliminar la relación dia-agenda:', error)
      throw new Error('Error al eliminar la relación dia-agenda')
    } finally {
      con.release()
    }
  }

  static async getByDia ({ id_dia }) {
    const con = await pool.getConnection()
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
    } finally {
      con.release()
    }
  }

  static async getByHorarioRange ({ startTime, endTime }) {
    const con = await pool.getConnection()
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
    } finally {
      con.release()
    }
  }
}
