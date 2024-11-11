import pool from '../../../config/db.config.js'

export class EstadoAgendaModel {
  // Obtener todos los estados de agenda
  static async getAll () {
    const con = await pool.getConnection()
    try {
      const [rows] = await con.query('SELECT * FROM estado_agenda;')
      return rows
    } catch (error) {
      console.error('Error al obtener todos los estados de agenda:', error)
      throw new Error('Error al obtener los estados de agenda')
    } finally {
      con.release()
    }
  }

  // Obtener un estado de agenda por ID
  static async getById ({ id }) {
    const con = await pool.getConnection()
    try {
      const [rows] = await con.query('SELECT * FROM estado_agenda WHERE id_estado_agenda = ?;', [id])
      return rows.length ? rows[0] : null
    } catch (error) {
      console.error('Error al obtener el estado de agenda por ID:', error)
      throw new Error('Error al obtener el estado de agenda')
    } finally {
      con.release()
    }
  }

  static async getByNombre ({ nombre_estado }) {
    const con = await pool.getConnection()
    try {
      const [rows] = await con.query('SELECT * FROM estado_agenda WHERE nombre_estado = ?;', [nombre_estado])
      return rows.length ? rows[0] : null
    } catch (error) {
      console.error('Error al obtener el estado de agenda por nombre:', error)
      throw new Error('Error al obtener el estado de agenda por nombre')
    } finally {
      con.release()
    }
  }

  // Crear un nuevo estado de agenda
  static async create ({ input }) {
    const con = await pool.getConnection()
    const { nombre_estado } = input
    try {
      await con.query('INSERT INTO estado_agenda (nombre_estado) VALUES (?);', [nombre_estado])

      const [estado] = await con.query('SELECT * FROM estado_agenda WHERE nombre_estado = ?;', [nombre_estado])
      return estado[0]
    } catch (error) {
      console.error('Error al crear el estado de agenda:', error)
      throw error
    } finally {
      con.release()
    }
  }

  // Actualizar parcialmente un estado de agenda
  static async partiallyUpdate ({ id, input }) {
    const con = await pool.getConnection()
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
    } finally {
      con.release()
    }
  }

  // Desactivar (eliminar) un estado de agenda
  static async deactivate ({ id }) {
    const con = await pool.getConnection()
    try {
      await con.query('DELETE FROM estado_agenda WHERE id_estado_agenda = ?;', [id])
      return { message: 'Estado de agenda eliminado' }
    } catch (error) {
      console.error('Error al eliminar el estado de agenda:', error)
      throw new Error('Error al eliminar el estado de agenda')
    } finally {
      con.release()
    }
  }
}
