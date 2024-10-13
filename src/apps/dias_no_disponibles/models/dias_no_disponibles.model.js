import 'dotenv/config'
import mysql from 'mysql2/promise'

// Función para formatear la fecha como DD/MM/AAAA
function formatFecha (fecha) {
  const date = new Date(fecha)
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()
  return `${day}/${month}/${year}`
}

const DEFAULT_CONFIG = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  port: process.env.DB_PORT,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME
}

const connectionString = process.env.DATABASE_URL ?? DEFAULT_CONFIG
const con = await mysql.createConnection(connectionString)

export class DiasNoDisponiblesModel {
  // Obtener todos los días no disponibles
  static async getAll () {
    try {
      const [rows] = await con.query('SELECT * FROM dias_no_disponibles;')
      return rows.map(row => ({ ...row, fecha: formatFecha(row.fecha) }))
    } catch (error) {
      console.error('Error al obtener todos los días no disponibles:', error)
      throw new Error('Error al obtener los días no disponibles')
    }
  }

  // Obtener un día no disponible por ID
  static async getById ({ id }) {
    try {
      const [rows] = await con.query('SELECT * FROM dias_no_disponibles WHERE id_dia_no_disponible = ?;', [id])
      return rows.length ? { ...rows[0], fecha: formatFecha(rows[0].fecha) } : null
    } catch (error) {
      console.error('Error al obtener el día no disponible por ID:', error)
      throw new Error('Error al obtener el día no disponible')
    }
  }

  // Crear un nuevo día no disponible
  static async create ({ input }) {
    const { id_agenda_base, fecha, motivo, tipo_bloqueo } = input
    try {
      await con.query(
        `INSERT INTO dias_no_disponibles (id_agenda_base, fecha, motivo, tipo_bloqueo)
        VALUES (?, ?, ?, ?)`,
        [id_agenda_base, fecha, motivo, tipo_bloqueo]
      )
      const [dia] = await con.query('SELECT * FROM dias_no_disponibles WHERE fecha = ?;', [fecha])
      return { ...dia[0], fecha: formatFecha(dia[0].fecha) }
    } catch (error) {
      console.error('Error al crear el día no disponible:', error)
      throw error
    }
  }

  // Actualizar parcialmente un día no disponible
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
        UPDATE dias_no_disponibles
        SET ${updateFields.join(', ')}
        WHERE id_dia_no_disponible = ?;
      `
      await con.query(updateQuery, updateValues)

      const [dias] = await con.query('SELECT * FROM dias_no_disponibles WHERE id_dia_no_disponible = ?;', [id])
      return dias.length ? { ...dias[0], fecha: formatFecha(dias[0].fecha) } : null
    } catch (error) {
      console.error('Error al actualizar el día no disponible:', error)
      throw new Error('Error al actualizar el día no disponible')
    }
  }

  // Eliminar un día no disponible
  static async deactivate ({ id }) {
    try {
      await con.query('DELETE FROM dias_no_disponibles WHERE id_dia_no_disponible = ?;', [id])
      return { message: 'Día no disponible eliminado' }
    } catch (error) {
      console.error('Error al eliminar el día no disponible:', error)
      throw new Error('Error al eliminar el día no disponible')
    }
  }

  // Buscar por día, mes y año
  static async getByFecha ({ dia, mes, año }) {
    const fecha = `${año}-${mes}-${dia}`
    try {
      const [rows] = await con.query('SELECT * FROM dias_no_disponibles WHERE fecha = ?;', [fecha])
      return rows.map(row => ({ ...row, fecha: formatFecha(row.fecha) }))
    } catch (error) {
      console.error('Error al buscar por fecha:', error)
      throw new Error('Error al buscar por fecha')
    }
  }

  // Buscar todos los días no disponibles de un mes específico
  static async getByMes ({ mes, año }) {
    const fechaInicio = `${año}-${mes}-01`
    const fechaFin = `${año}-${mes}-31`
    try {
      const [rows] = await con.query('SELECT * FROM dias_no_disponibles WHERE fecha BETWEEN ? AND ?;', [fechaInicio, fechaFin])
      return rows.map(row => ({ ...row, fecha: formatFecha(row.fecha) }))
    } catch (error) {
      console.error('Error al buscar por mes:', error)
      throw new Error('Error al buscar por mes')
    }
  }

  // Buscar por palabra en el motivo
  static async getByMotivo ({ palabra }) {
    const likeQuery = `%${palabra}%`
    try {
      const [rows] = await con.query('SELECT * FROM dias_no_disponibles WHERE motivo LIKE ?;', [likeQuery])
      return rows.map(row => ({ ...row, fecha: formatFecha(row.fecha) }))
    } catch (error) {
      console.error('Error al buscar por motivo:', error)
      throw new Error('Error al buscar por motivo')
    }
  }

  // Buscar días no disponibles dentro de un rango de fechas
  static async getByRangoFechas ({ fechaInicio, fechaFin }) {
    try {
      const [rows] = await con.query('SELECT * FROM dias_no_disponibles WHERE fecha BETWEEN ? AND ?;', [fechaInicio, fechaFin])
      return rows.map(row => ({ ...row, fecha: formatFecha(row.fecha) }))
    } catch (error) {
      console.error('Error al buscar por rango de fechas:', error)
      throw new Error('Error al buscar por rango de fechas')
    }
  }

  // Contar días no disponibles en un mes específico sin date-fns
  static async countByMes ({ mes, año }) {
    const mesPadded = mes.toString().padStart(2, '0') // Asegura que el mes tenga dos dígitos
    const diasEnMes = new Date(año, mes, 0).getDate() // Obtiene el último día del mes (maneja bien 28, 30 o 31 días)

    const fechaInicio = `${año}-${mesPadded}-01`
    const fechaFin = `${año}-${mesPadded}-${diasEnMes}`
    console.log(fechaInicio, fechaFin)
    try {
      console.log(fechaInicio, fechaFin)
      const [rows] = await con.query('SELECT COUNT(*) as total FROM dias_no_disponibles WHERE fecha BETWEEN ? AND ?;', [fechaInicio, fechaFin])
      return console.log(rows[0].total) || rows[0].total
    } catch (error) {
      console.error('Error al contar los días no disponibles por mes:', error)
      throw new Error('Error al contar los días no disponibles por mes')
    }
  }
}
