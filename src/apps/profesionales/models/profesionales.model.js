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

export class ProfesionalesModel {
  static async getAll () {
    try {
      // Intentamos obtener todos los profesionales que tienen estado 1 (activos)
      const [rows] = await con.query('SELECT * FROM profesionales WHERE estado = 1;')
      return rows
    } catch (error) {
      // Si ocurre un error, lo registramos en la consola y lanzamos un error personalizado
      console.error('Error al obtener todos los profesionales:', error)
      // Lanzamos el error para que el controlador lo pueda manejar
      throw new Error('Error al obtener los profesionales')
    }
  }

  static async getById ({ id }) {
    try {
      // Intentamos obtener el profesional por ID
      const [rows] = await con.query('SELECT * FROM profesionales WHERE id_profesional = ?;', [id])
      // Si no se encuentra el profesional, retornamos null
      return rows.length ? rows[0] : null
    } catch (error) {
      // Si ocurre un error, lo registramos en la consola y lanzamos un error personalizado
      console.error('Error al obtener el profesional por ID:', error)
      // Lanzamos el error para que el controlador lo pueda manejar
      throw new Error('Error al obtener el profesional')
    }
  }

  static async create ({ input }) {
    const { id_usuario } = input
    try {
      // Intentamos crear un nuevo profesional en la base de datos
      await con.query(
        `INSERT INTO profesionales (estado, id_usuario)
        VALUES (1, ?)`,
        [id_usuario]
      )

      // Intentamos obtener el profesional recién creado utilizando el id_usuario
      const [profesionales] = await con.query('SELECT * FROM profesionales WHERE id_usuario = ?;', [id_usuario])
      return profesionales[0]
    } catch (error) {
      // Si ocurre un error, lo registramos en la consola y lanzamos un error personalizado
      console.error('Error al crear el profesional:', error)
      // Lanzamos el error para que el controlador lo pueda manejar
      throw error
    }
  }

  static async deactivate ({ id }) {
    try {
      // Intentamos desactivar el profesional cambiando el estado a 0
      await con.query('UPDATE profesionales SET estado = 0 WHERE id_profesional = ?;', [id])

      // Intentamos obtener el profesional para verificar el cambio
      const [profesional] = await con.query('SELECT * FROM profesionales WHERE id_profesional = ?;', [id])
      return profesional.length ? profesional[0] : null
    } catch (error) {
      // Si ocurre un error, lo registramos en la consola y lanzamos un error personalizado
      console.error('Error al desactivar el profesional:', error)
      // Lanzamos el error para que el controlador lo pueda manejar
      throw new Error('Error al desactivar el profesional')
    }
  }

  static async activate ({ id }) {
    try {
      // Intentamos activar el profesional cambiando el estado a 1
      await con.query('UPDATE profesionales SET estado = 1 WHERE id_profesional = ?;', [id])

      // Intentamos obtener el profesional para verificar el cambio
      const [profesional] = await con.query('SELECT * FROM profesionales WHERE id_profesional = ?;', [id])
      return profesional.length ? profesional[0] : null
    } catch (error) {
      // Si ocurre un error, lo registramos en la consola y lanzamos un error personalizado
      console.error('Error al activar el profesional:', error)
      // Lanzamos el error para que el controlador lo pueda manejar
      throw new Error('Error al activar el profesional')
    }
  }

  static async partiallyUpdate ({ id, input }) {
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
      // Construimos y ejecutamos la consulta para actualizar el profesional
      const updateQuery = `
        UPDATE profesionales 
        SET ${updateFields.join(', ')} 
        WHERE id_profesional = ?;
      `

      await con.query(updateQuery, updateValues)

      // Obtenemos el profesional actualizado
      const [profesionales] = await con.query('SELECT * FROM profesionales WHERE id_profesional = ?;', [id])
      return profesionales.length ? profesionales[0] : null
    } catch (error) {
      // Si ocurre un error, lo registramos en la consola y lanzamos un error personalizado
      console.error('Error al actualizar el profesional:', error)
      // Lanzamos el error para que el controlador lo pueda manejar
      throw new Error('Error al actualizar el profesional')
    }
  }
}
