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

export class UserModel {
  static async getAll () {
    const [rows] = await con.query('SELECT * FROM users;')

    return rows
  }

  static async getById ({ id }) {
    const [rows] = await con.query('SELECT * FROM users WHERE id = ?;', [id])

    return rows
  }

  static async create ({ input }) {
    const { email, username, password_hash, name, nationality, phone } = input

    const [uuidResult] = await con.query('SELECT UUID() uuid;')
    const [{ uuid }] = uuidResult

    await con.query(
      `INSERT INTO users (id, email, username, password_hash, name, nationality, phone)
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [uuid, email, username, password_hash, name, nationality, phone]
    )

    const [users] = await con.query('SELECT * FROM users WHERE id = ?;', [uuid])

    return users[0]
  }

  static async delete ({ id }) {
    const [user] = await con.query('SELECT * FROM users WHERE id = ?;', [id])

    await con.query('DELETE FROM users WHERE id = ?;', [id])

    return user[0]
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
        UPDATE users 
        SET ${updateFields.join(', ')} 
        WHERE id = ?;
      `

    // Ejecutamos la consulta
    await con.query(updateQuery, updateValues)

    // Obtenemos el usuario actualizado
    const [users] = await con.query('SELECT * FROM users WHERE id = ?;', [id])

    // Retornamos el usuario actualizado
    return users[0]
  }
}
