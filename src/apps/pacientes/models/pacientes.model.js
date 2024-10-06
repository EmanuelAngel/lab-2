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

export class PacientesModel {
  static async getAll () {
    try {
      // Intentamos obtener todos los pacientes que tienen estado 1 (activos)
      const [rows] = await con.query('SELECT * FROM pacientes WHERE estado = 1;')
      return rows
    } catch (error) {
      // Si ocurre un error, lo registramos en la consola y lanzamos un error personalizado
      console.error('Error al obtener todos los pacientes:', error)
      // Lanzamos el error para que el controlador lo pueda manejar
      throw new Error('Error al obtener los pacientes')
    }
  }

  static async getById ({ id }) {
    try {
      // Intentamos obtener el paciente por ID
      const [rows] = await con.query('SELECT * FROM pacientes WHERE id_paciente = ?;', [id])
      // Si no se encuentra el paciente, retornamos null
      return rows.length ? rows[0] : null
    } catch (error) {
      // Si ocurre un error, lo registramos en la consola y lanzamos un error personalizado
      console.error('Error al obtener el paciente por ID:', error)
      // Lanzamos el error para que el controlador lo pueda manejar
      throw new Error('Error al obtener el paciente')
    }
  }

  static async create ({ input }) {
    const { apellido, nombre, dni, obra_social, telefono, email, direccion, es_profesional } = input
    try {
      // Intentamos crear un nuevo paciente en la base de datos
      await con.query(
          `INSERT INTO pacientes (apellido, nombre, dni, obra_social, telefono, email, direccion, es_profesional, estado)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1)`,
          [apellido, nombre, dni, obra_social, telefono, email, direccion, es_profesional] // Asegúrate de que es_profesional esté aquí
      )

      // Intentamos obtener el paciente recién creado utilizando el DNI
      const [pacientes] = await con.query('SELECT * FROM pacientes WHERE dni = ?;', [dni])
      return pacientes[0]
    } catch (error) {
      // Si ocurre un error, lo registramos en la consola y lanzamos un error personalizado
      console.error('Error al crear el paciente:', error)
      // Lanzamos el error para que el controlador lo pueda manejar
      throw error
    }
  }

  static async deactivate ({ id }) {
    try {
      // Intentamos desactivar el paciente cambiando el estado a 0
      await con.query('UPDATE pacientes SET estado = 0 WHERE id_paciente = ?;', [id])

      // Intentamos obtener el paciente para verificar el cambio
      const [paciente] = await con.query('SELECT * FROM pacientes WHERE id_paciente = ?;', [id])
      return paciente.length ? paciente[0] : null
    } catch (error) {
      // Si ocurre un error, lo registramos en la consola y lanzamos un error personalizado
      console.error('Error al desactivar el paciente:', error)
      // Lanzamos el error para que el controlador lo pueda manejar
      throw new Error('Error al desactivar el paciente')
    }
  }

  static async activate ({ id }) {
    try {
      // Intentamos activar el paciente cambiando el estado a 1
      await con.query('UPDATE pacientes SET estado = 1 WHERE id_paciente = ?;', [id])

      // Intentamos obtener el paciente para verificar el cambio
      const [paciente] = await con.query('SELECT * FROM pacientes WHERE id_paciente = ?;', [id])
      return paciente.length ? paciente[0] : null
    } catch (error) {
      // Si ocurre un error, lo registramos en la consola y lanzamos un error personalizado
      console.error('Error al activar el paciente:', error)
      // Lanzamos el error para que el controlador lo pueda manejar
      throw new Error('Error al activar el paciente')
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
      // Construimos y ejecutamos la consulta para actualizar el paciente
      const updateQuery = `
          UPDATE pacientes 
          SET ${updateFields.join(', ')} 
          WHERE id_paciente = ?;
        `

      await con.query(updateQuery, updateValues)

      // Obtenemos el paciente actualizado
      const [pacientes] = await con.query('SELECT * FROM pacientes WHERE id_paciente = ?;', [id])
      return pacientes.length ? pacientes[0] : null
    } catch (error) {
      // Si ocurre un error, lo registramos en la consola y lanzamos un error personalizado
      console.error('Error al actualizar el paciente:', error)
      // Lanzamos el error para que el controlador lo pueda manejar
      throw new Error('Error al actualizar el paciente')
    }
  }
}
