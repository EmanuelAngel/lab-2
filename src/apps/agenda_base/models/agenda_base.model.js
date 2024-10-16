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
    const { id_profesional, id_sucursal, id_especialidad, id_clasificacion, estado = 1, id_estado_agenda = 1 } = input
    try {
      await con.query(
        `INSERT INTO agenda_base (id_profesional, id_sucursal, id_especialidad, id_clasificacion, estado, id_estado_agenda)
        VALUES (?, ?, ?, ?, ?, ?)`,
        [id_profesional, id_sucursal, id_especialidad, id_clasificacion, estado, id_estado_agenda]
      )
      const [agendas] = await con.query('SELECT * FROM agenda_base WHERE id_profesional = ? AND id_sucursal = ?;', [id_profesional, id_sucursal])
      return agendas[0]
    } catch (error) {
      console.error('Error al crear la agenda base:', error)
      throw error
    }
  }

  // Actualizar parcialmente una agenda base
  static async partiallyUpdate ({ id_profesional, id_sucursal, id_especialidad, input }) {
    const updateFields = []
    const updateValues = []

    // Iterar sobre las propiedades para actualizar solo los campos que se incluyen en "input"
    for (const [key, value] of Object.entries(input)) {
      if (value !== undefined) {
        updateFields.push(`${key} = ?`)
        updateValues.push(value)
      }
    }

    // Si no hay campos a actualizar, devolver null
    if (updateFields.length === 0) {
      return null
    }

    // Añadir los identificadores al final de los valores para la cláusula WHERE
    updateValues.push(id_profesional, id_sucursal, id_especialidad)

    try {
      const updateQuery = `
      UPDATE agenda_base 
      SET ${updateFields.join(', ')} 
      WHERE id_profesional = ? AND id_sucursal = ? AND id_especialidad = ?;
    `

      await con.query(updateQuery, updateValues)

      // Actualizar los valores de los identificadores si no han sido proporcionados en el input
      input.id_profesional = input.id_profesional || id_profesional
      input.id_sucursal = input.id_sucursal || id_sucursal
      input.id_especialidad = input.id_especialidad || id_especialidad

      // Consultar la fila actualizada para devolver el nuevo estado
      const [agendaBase] = await con.query('SELECT * FROM agenda_base WHERE id_profesional = ? AND id_sucursal = ? AND id_especialidad = ?;', [input.id_profesional, input.id_sucursal, input.id_especialidad])
      return agendaBase.length ? agendaBase[0] : null
    } catch (error) {
      console.error('Error al actualizar la agenda base:', error)
      throw new Error('Error al actualizar la agenda base')
    }
  }

  // Desactivar una agenda base (cambia estado a 0)
  // PARATE PARA REVISAR LUEGO SI CORRESPONDE MANTENER O DIRECTAMENTE USAR DELETE

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

  // Cambiar el estado de una agenda base, esto es con la relacion de estado de la agenda (1 al 4)
  static async estadoAgenda ({ id, id_estado_agenda }) {
    try {
    // Actualiza el id_estado_agenda en agenda_base
      console.log(id_estado_agenda)
      await con.query('UPDATE agenda_base SET id_estado_agenda = ? WHERE id_agenda_base = ?;', [id_estado_agenda, id])
      console.log('llego aca')
      console.log(id_estado_agenda)
      const [agenda] = await con.query('SELECT * FROM agenda_base WHERE id_agenda_base = ?;', [id])
      return agenda.length ? agenda[0] : null // Retorna la agenda actualizada
    } catch (error) {
      console.error('Error al actualizar el estado de la agenda base:', error)
      throw new Error('Error al actualizar el estado de la agenda base')
    }
  }

  // Obtener todas las agendas según el id_estado_agenda (1 al 4)
  static async getByEstadoAgenda ({ id_estado_agenda }) {
    try {
      const [rows] = await con.query('SELECT * FROM agenda_base WHERE id_estado_agenda = ?;', [id_estado_agenda])
      return rows // Retorna todas las agendas con el estado solicitado
    } catch (error) {
      console.error('Error al obtener las agendas por estado:', error)
      throw new Error('Error al obtener las agendas por estado')
    }
  }

  // Obtener todas las agendas de un profesional específico
  static async getByProfesional ({ id_profesional }) {
    try {
      const [rows] = await con.query('SELECT * FROM agenda_base WHERE id_profesional = ? AND estado = 1;', [id_profesional])
      return rows
    } catch (error) {
      console.error('Error al obtener las agendas del profesional:', error)
      throw new Error('Error al obtener las agendas del profesional')
    }
  }

  // Obtener todas las agendas para una sucursal específica
  static async getBySucursal ({ id_sucursal }) {
    try {
      const [rows] = await con.query('SELECT * FROM agenda_base WHERE id_sucursal = ? AND estado = 1;', [id_sucursal])
      return rows
    } catch (error) {
      console.error('Error al obtener las agendas para la sucursal:', error)
      throw new Error('Error al obtener las agendas para la sucursal')
    }
  }

  // Obtener todas las agendas para una especialidad específica
  static async getByEspecialidad ({ id_especialidad }) {
    try {
      const [rows] = await con.query('SELECT * FROM agenda_base WHERE id_especialidad = ? AND estado = 1;', [id_especialidad])
      return rows
    } catch (error) {
      console.error('Error al obtener las agendas para la especialidad:', error)
      throw new Error('Error al obtener las agendas para la especialidad')
    }
  }

  // Obtener todas las agendas de un profesional en una sucursal específica
  static async getByProfesionalAndSucursal ({ id_profesional, id_sucursal }) {
    try {
      const [rows] = await con.query('SELECT * FROM agenda_base WHERE id_profesional = ? AND id_sucursal = ? AND estado = 1;', [id_profesional, id_sucursal])
      return rows
    } catch (error) {
      console.error('Error al obtener las agendas del profesional en la sucursal:', error)
      throw new Error('Error al obtener las agendas del profesional en la sucursal')
    }
  }

  // Obtener todas las agendas de un profesional para una especialidad específica
  static async getByProfesionalAndEspecialidad ({ id_profesional, id_especialidad }) {
    try {
      const [rows] = await con.query('SELECT * FROM agenda_base WHERE id_profesional = ? AND id_especialidad = ? AND estado = 1;', [id_profesional, id_especialidad])
      return rows
    } catch (error) {
      console.error('Error al obtener las agendas del profesional para la especialidad:', error)
      throw new Error('Error al obtener las agendas del profesional para la especialidad')
    }
  }

  // Obtener todas las agendas según el id_clasificacion
  static async getByClasificacion ({ id_clasificacion }) {
    try {
      const [rows] = await con.query('SELECT * FROM agenda_base WHERE id_clasificacion = ? AND estado = 1;', [id_clasificacion])
      return rows
    } catch (error) {
      console.error('Error al obtener las agendas por clasificación:', error)
      throw new Error('Error al obtener las agendas por clasificación')
    }
  }

  // Obtener agendas combinando id_clasificacion y id_estado_agenda
  static async getByClasificacionAndEstadoAgenda ({ id_clasificacion, id_estado_agenda }) {
    try {
      const [rows] = await con.query('SELECT * FROM agenda_base WHERE id_clasificacion = ? AND id_estado_agenda = ? AND estado = 1;', [id_clasificacion, id_estado_agenda])
      return rows
    } catch (error) {
      console.error('Error al obtener las agendas por clasificación y estado:', error)
      throw new Error('Error al obtener las agendas por clasificación y estado')
    }
  }
}
