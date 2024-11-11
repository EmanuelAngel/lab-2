import pool from '../../../config/db.config.js'

import { buildUpdateQuery } from '../../.shared/buildUpdateQuery.js'

export class EspecialidadesModel {
  static async getAll () {
    const con = await pool.getConnection()
    try {
      const [rows] = await con.query('SELECT * FROM especialidades;')
      return rows
    } catch (error) {
      console.error('Error al obtener todas las especialidades:', error)
      throw new Error('Error al obtener las especialidades')
    } finally {
      con.release()
    }
  }

  static async getById ({ id }) {
    const con = await pool.getConnection()
    try {
      const [rows] = await con.query('SELECT * FROM especialidades WHERE id_especialidad = ?;', [id])
      return rows.length ? rows[0] : null
    } catch (error) {
      console.error('Error al obtener la especialidad por ID:', error)
      throw new Error('Error al obtener la especialidad')
    } finally {
      con.release()
    }
  }

  static async create ({ input }) {
    const con = await pool.getConnection()
    const { nombre } = input
    try {
      await con.query(
        `INSERT INTO especialidades (nombre, estado)
        VALUES (?, 1);`,
        [nombre]
      )

      const [especialidades] = await con.query('SELECT * FROM especialidades WHERE nombre = ?;', [nombre])
      return especialidades[0]
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        console.error('Error: Especialidad ya existe:', error)
        throw new Error('La especialidad ya está registrada')
      }

      console.error('Error al crear la especialidad:', error)
      throw new Error('Error al crear la especialidad')
    } finally {
      con.release()
    }
  }

  static async deactivate ({ id }) {
    const con = await pool.getConnection()
    try {
      await con.query('UPDATE especialidades SET estado = 0 WHERE id_especialidad = ?;', [id])
      return true
    } catch (error) {
      console.error('Error al desactivar la especialidad:', error)
      throw new Error('Error al desactivar la especialidad')
    } finally {
      con.release()
    }
  }

  static async activate ({ id }) {
    const con = await pool.getConnection()
    try {
      await con.query('UPDATE especialidades SET estado = 1 WHERE id_especialidad = ?;', [id])
      return true
    } catch (error) {
      console.error('Error al activar la especialidad:', error)
      throw new Error('Error al activar la especialidad')
    } finally {
      con.release()
    }
  }

  static async partiallyUpdate ({ id, input }) {
    const con = await pool.getConnection()
    const { updateFields, updateValues } = buildUpdateQuery(input)

    if (updateFields.length === 0) {
      return null
    }

    updateValues.push(id)

    try {
      const updateQuery = `
        UPDATE especialidades 
        SET ${updateFields.join(', ')} 
        WHERE id_especialidad = ?;
      `

      await con.query(updateQuery, updateValues)

      const [especialidades] = await con.query('SELECT * FROM especialidades WHERE id_especialidad = ?;', [id])
      return especialidades.length ? especialidades[0] : null
    } catch (error) {
      console.error('Error al actualizar la especialidad:', error)
      throw new Error('Error al actualizar la especialidad')
    } finally {
      con.release()
    }
  }

  // static async getByPartialName ({ nombre }) {
  //   const con = await pool.getConnection()
  //   try {
  //     const [rows] = await con.query('SELECT * FROM especialidades WHERE nombre LIKE ? AND estado = 1;', [`%${nombre}%`])
  //     return rows
  //   } catch (error) {
  //     console.error('Error al obtener especialidades por nombre parcial:', error)
  //     throw new Error('Error al obtener especialidades por nombre parcial')
  //   }
  // }
}
