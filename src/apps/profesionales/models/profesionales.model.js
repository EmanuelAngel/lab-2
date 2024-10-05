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
    const [rows] = await con.query('SELECT * FROM profesionales WHERE estado = 1;')

    return rows
  }

  static async getById ({ id }) {
    const [rows] = await con.query('SELECT * FROM profesionales WHERE id_profesional = ?;', [id])

    return rows
  }

  static async create ({ input }) {
    const { nombre, apellido, numero_documento, telefono, email } = input

    await con.query(
      `INSERT INTO profesionales (nombre, apellido, numero_documento, telefono, email, estado)
      VALUES (?, ?, ?, ?, ?, 1)`,
      [nombre, apellido, numero_documento, telefono, email]
    )

    const [profesionales] = await con.query('SELECT * FROM profesionales WHERE numero_documento = ?;', [numero_documento])

    return profesionales[0]
  }

  static async deactivate ({ id }) {
    await con.query('UPDATE profesionales SET estado = 0 WHERE id_profesional = ?;', [id])

    const [profesional] = await con.query('SELECT * FROM profesionales WHERE id_profesional = ?;', [id])

    return profesional[0]
  }

  static async activate ({ id }) {
    await con.query('UPDATE profesionales SET estado = 1 WHERE id_profesional = ?;', [id])

    const [profesional] = await con.query('SELECT * FROM profesionales WHERE id_profesional = ?;', [id])

    return profesional[0]
  }

  static async partiallyUpdate ({ id, input }) {
    // Creamos un array para almacenar los campos a actualizar y sus valores
    const updateFields = []
    const updateValues = []

    // Iteramos sobre las propiedades del input
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

    // Agregamos el id al final de los valores
    updateValues.push(id)

    // Construimos la consulta SQL
    const updateQuery = `
        UPDATE profesionales 
        SET ${updateFields.join(', ')} 
        WHERE id_profesional = ?;
      `

    // Ejecutamos la consulta
    await con.query(updateQuery, updateValues)

    // Obtenemos el profesionales actualizado
    const [profesionales] = await con.query('SELECT * FROM profesionales WHERE id_profesional = ?;', [id])

    // Retornamos el profesionales actualizado
    return profesionales[0]
  }
}
