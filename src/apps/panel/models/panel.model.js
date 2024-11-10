import 'dotenv/config'
import mysql from 'mysql2/promise'
import { DEFAULT_CONFIG } from '../../../config/db.config.js'

import bcrypt from 'bcrypt'

const connectionString = process.env.DATABASE_URL ?? DEFAULT_CONFIG

const con = await mysql.createConnection(connectionString)

export class AdminDashboardModel {
  static async registerAdmin ({ input }) {
    const {
      id_rol,
      nombre_usuario,
      contraseña,
      nombre,
      apellido,
      dni,
      telefono,
      direccion,
      email
    } = input

    try {
      con.beginTransaction()

      const hashedPassword = await bcrypt.hash(contraseña, 10)

      const [createdUser] = await con.execute(
        `INSERT INTO usuarios
        (id_rol, nombre_usuario, contraseña, nombre,
        apellido, dni, telefono, direccion, email, estado)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1)`,
        [id_rol, nombre_usuario, hashedPassword, nombre,
          apellido, dni, telefono, direccion, email]
      )

      if (createdUser.affectedRows === 0) {
        con.rollback()
        throw new Error('Error al registrar el usuario')
      }

      const [createdAdmin] = await con.execute(
        `INSERT INTO admins (id_usuario)
        VALUES (?)`,
        [createdUser.insertId]
      )

      if (createdAdmin.affectedRows === 0) {
        con.rollback()
        throw new Error('Error al registrar el admin')
      }

      con.commit()
      return createdAdmin
    } catch (error) {
      con.rollback()
      console.log(error)
      throw new Error('Error al registrar el administrador')
    }
  }

  static async registerSecre ({ input }) {
    // Code to register a secre
  }

  static async registerProfesional ({ input }) {
    // Code to register a profesional
  }
}
