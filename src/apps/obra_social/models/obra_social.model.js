import pool from '../../../config/db.config.js'

import { buildUpdateQuery } from '../../.shared/buildUpdateQuery.js'

export class ObraSocialModel {
  static async getAll () {
    const con = await pool.getConnection()
    try {
      const [rows] = await con.query('SELECT * FROM obra_social WHERE estado = 1;')
      return rows
    } catch (error) {
      console.error('Error al obtener todas las obras sociales:', error)
      throw new Error('Error al obtener las obras sociales')
    } finally {
      con.release()
    }
  }

  static async getById ({ id }) {
    const con = await pool.getConnection()
    try {
      const [rows] = await con.query('SELECT * FROM obra_social WHERE id_obra_social = ?;', [id])
      return rows.length ? rows[0] : null
    } catch (error) {
      console.error('Error al obtener la obra social por ID:', error)
      throw new Error('Error al obtener la obra social')
    } finally {
      con.release()
    }
  }

  static async create ({ input }) {
    const con = await pool.getConnection()
    const { nombre } = input
    try {
      await con.query(
        `INSERT INTO obra_social (nombre, estado)
        VALUES (?, 1);`,
        [nombre]
      )

      const [obrasSociales] = await con.query('SELECT * FROM obra_social WHERE nombre = ?;', [nombre])
      return obrasSociales[0]
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        console.error('Error: Obra social ya existe:', error)
        throw new Error('La obra social ya está registrada')
      }

      console.error('Error al crear la obra social:', error)
      throw new Error('Error al crear la obra social')
    } finally {
      con.release()
    }
  }

  static async deactivate ({ id }) {
    const con = await pool.getConnection()
    try {
      await con.query('UPDATE obra_social SET estado = 0 WHERE id_obra_social = ?;', [id])
      return true
    } catch (error) {
      console.error('Error al desactivar la obra social:', error)
      throw new Error('Error al desactivar la obra social')
    } finally {
      con.release()
    }
  }

  static async activate ({ id }) {
    const con = await pool.getConnection()
    try {
      await con.query('UPDATE obra_social SET estado = 1 WHERE id_obra_social = ?;', [id])
      return true
    } catch (error) {
      console.error('Error al activar la obra social:', error)
      throw new Error('Error al activar la obra social')
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
        UPDATE obra_social 
        SET ${updateFields.join(', ')} 
        WHERE id_obra_social = ?;
      `

      await con.query(updateQuery, updateValues)

      const [obrasSociales] = await con.query('SELECT * FROM obra_social WHERE id_obra_social = ?;', [id])
      return obrasSociales.length ? obrasSociales[0] : null
    } catch (error) {
      console.error('Error al actualizar la obra social:', error)
      throw new Error('Error al actualizar la obra social')
    } finally {
      con.release()
    }
  }
}
