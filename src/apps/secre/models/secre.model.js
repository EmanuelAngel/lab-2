import pool from '../../../config/db.config.js'

export class SecreModel {
  static async getAll () {
    const con = await pool.getConnection()
    try {
      // Intentamos obtener todo/as secretari@ que tienen estado 1 (activos)
      const [rows] = await con.query('SELECT * FROM secre WHERE estado = 1;')
      return rows
    } catch (error) {
      // Si ocurre un error, lo registramos en la consola y lanzamos un error personalizado
      console.error('Error al obtener todos los secretarios:', error)
      // Lanzamos el error para que el controlador lo pueda manejar
      throw new Error('Error al obtener los secretarios')
    } finally {
      con.release()
    }
  }

  static async getById ({ id }) {
    const con = await pool.getConnection()
    try {
      // Intentamos obtener el secretario por ID
      const [rows] = await con.query('SELECT * FROM secre WHERE id_secre = ?;', [id])
      // Si no se encuentra el secretario, retornamos null
      return rows.length ? rows[0] : null
    } catch (error) {
      // Si ocurre un error, lo registramos en la consola y lanzamos un error personalizado
      console.error('Error al obtener el secretario por ID:', error)
      // Lanzamos el error para que el controlador lo pueda manejar
      throw new Error('Error al obtener el secretario')
    } finally {
      con.release()
    }
  }

  static async create ({ input }) {
    const con = await pool.getConnection()
    const { id_usuario, id_sucursal } = input
    try {
      // Intentamos crear un nuevo secretario en la base de datos
      await con.query(
        `INSERT INTO secre (estado, id_usuario, id_sucursal)
        VALUES (1, ?, ?)`,
        [id_usuario, id_sucursal]
      )

      // Intentamos obtener el secretario recién creado utilizando el id_usuario
      const [secre] = await con.query('SELECT * FROM secre WHERE id_usuario = ?;', [id_usuario])
      return secre[0]
    } catch (error) {
      // Si ocurre un error, lo registramos en la consola y lanzamos un error personalizado
      console.error('Error al crear el secretario:', error)
      // Lanzamos el error para que el controlador lo pueda manejar
      throw error
    } finally {
      con.release()
    }
  }

  static async deactivate ({ id }) {
    const con = await pool.getConnection()
    try {
      // Intentamos desactivar el secretario cambiando el estado a 0
      await con.query('UPDATE secre SET estado = 0 WHERE id_secre = ?;', [id])

      // Intentamos obtener el secretario para verificar el cambio
      const [secre] = await con.query('SELECT * FROM secre WHERE id_secre = ?;', [id])
      return secre.length ? secre[0] : null
    } catch (error) {
      // Si ocurre un error, lo registramos en la consola y lanzamos un error personalizado
      console.error('Error al desactivar el secretario:', error)
      // Lanzamos el error para que el controlador lo pueda manejar
      throw new Error('Error al desactivar el secretario')
    } finally {
      con.release()
    }
  }

  static async activate ({ id }) {
    const con = await pool.getConnection()
    try {
      // Intentamos activar el secretario cambiando el estado a 1
      await con.query('UPDATE secre SET estado = 1 WHERE id_secre = ?;', [id])

      // Intentamos obtener el secretario para verificar el cambio
      const [secre] = await con.query('SELECT * FROM secre WHERE id_secre = ?;', [id])
      return secre.length ? secre[0] : null
    } catch (error) {
      // Si ocurre un error, lo registramos en la consola y lanzamos un error personalizado
      console.error('Error al activar el secretario:', error)
      // Lanzamos el error para que el controlador lo pueda manejar
      throw new Error('Error al activar el secretario')
    } finally {
      con.release()
    }
  }

  static async partiallyUpdate ({ id, input }) {
    const con = await pool.getConnection()
    const updateFields = []
    const updateValues = []

    // Iteramos sobre las propiedades del input para determinar qué campos se van a actualizar
    for (const [key, value] of Object.entries(input)) {
      if (value !== undefined) {
        updateFields.push(`${key} = ?`)
        updateValues.push(value)
      }
    }

    // Si no hay campos para actualizar, retornamos null
    if (updateFields.length === 0) {
      return null
    }

    updateValues.push(id)

    try {
      // Construimos y ejecutamos la consulta para actualizar el secretario
      const updateQuery = `
        UPDATE secre 
        SET ${updateFields.join(', ')} 
        WHERE id_secre = ?;
      `

      await con.query(updateQuery, updateValues)

      // Obtenemos el secretario actualizado
      const [secres] = await con.query('SELECT * FROM secre WHERE id_secre = ?;', [id])
      return secres.length ? secres[0] : null
    } catch (error) {
      // Si ocurre un error, lo registramos en la consola y lanzamos un error personalizado
      console.error('Error al actualizar el profesional:', error)
      // Lanzamos el error para que el controlador lo pueda manejar
      throw new Error('Error al actualizar el profesional')
    } finally {
      con.release()
    }
  }
}
