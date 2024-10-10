import 'dotenv/config'
import mysql from 'mysql2/promise'
import { DEFAULT_CONFIG } from '../../../config/db.config.js'
import { buildUpdateQuery } from '../../.shared/buildUpdateQuery.js'

const connectionString = process.env.DATABASE_URL ?? DEFAULT_CONFIG
const con = await mysql.createConnection(connectionString)

// Definición de constantes para las consultas SQL
const SELECT_ALL_QUERY = 'SELECT * FROM obra_social_paciente WHERE estado = 1;' // Consulta para obtener todas las obras sociales activas de los pacientes
const SELECT_BY_ID_QUERY = 'SELECT * FROM obra_social_paciente WHERE id_paciente = ? AND id_obra_social = ?;' // Consulta para obtener una obra social específica de un paciente por ID
const SELECT_BY_PACIENTE_QUERY = 'SELECT * FROM obra_social_paciente WHERE id_paciente = ? AND estado = 1;' // Consulta para obtener las obras sociales activas de un paciente
const SELECT_BY_OBRA_SOCIAL_QUERY = 'SELECT * FROM obra_social_paciente WHERE id_obra_social = ? AND estado = 1;' // Consulta para obtener los pacientes con una obra social activa
const INSERT_QUERY = 'INSERT INTO obra_social_paciente (id_paciente, id_obra_social, estado) VALUES (?, ?, 1);' // Consulta para insertar una nueva relación obra social-paciente
const UPDATE_DEACTIVATE_QUERY = 'UPDATE obra_social_paciente SET estado = 0 WHERE id_paciente = ? AND id_obra_social = ?;' // Consulta para desactivar una relación obra social-paciente
const UPDATE_ACTIVATE_QUERY = 'UPDATE obra_social_paciente SET estado = 1 WHERE id_paciente = ? AND id_obra_social = ?;' // Consulta para activar una relación obra social-paciente

// Helper para formatear la fecha de actualización
const formatUpdatedAt = (row) => ({
  ...row,
  updatedAt: new Date(row.updatedAt).toLocaleString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  })
})

export class ObraSocialPacienteModel {
  // Obtener todas las relaciones obra social-paciente activas
  static async getAll () {
    try {
      const [rows] = await con.query(SELECT_ALL_QUERY)
      return rows.map(formatUpdatedAt) // Aplicar el formato a cada fila
    } catch (error) {
      console.error('Error al obtener todas las obras sociales de pacientes:', error)
      throw new Error('Error al obtener las obras sociales de pacientes')
    }
  }

  // Obtener una obra social específica de un paciente por ID
  static async getById ({ idPaciente, idObraSocial }) {
    try {
      const [rows] = await con.query(SELECT_BY_ID_QUERY, [idPaciente, idObraSocial])

      if (!rows.length) return null

      return formatUpdatedAt(rows[0]) // Aplicar el formato a la fila
    } catch (error) {
      console.error('Error al obtener la obra social del paciente por ID:', error)
      throw new Error('Error al obtener la obra social del paciente')
    }
  }

  // Obtener las obras sociales activas de un paciente
  static async getByPaciente ({ id_paciente }) {
    try {
      const [rows] = await con.query(SELECT_BY_PACIENTE_QUERY, [id_paciente])
      return rows.map(formatUpdatedAt) // Aplicar el formato a cada fila
    } catch (error) {
      console.error('Error al obtener las obras sociales del paciente:', error)
      throw new Error('Error al obtener las obras sociales del paciente')
    }
  }

  // Obtener los pacientes con una obra social activa
  static async getByObraSocial ({ id_obra_social }) {
    try {
      const [rows] = await con.query(SELECT_BY_OBRA_SOCIAL_QUERY, [id_obra_social])
      return rows.map(formatUpdatedAt) // Aplicar el formato a cada fila
    } catch (error) {
      console.error('Error al obtener los pacientes con la obra social:', error)
      throw new Error('Error al obtener los pacientes con la obra social')
    }
  }

  // Crear una nueva relación obra social-paciente
  static async create ({ input }) {
    const { idPaciente, idObraSocial } = input
    try {
      await con.query(INSERT_QUERY, [idPaciente, idObraSocial])

      const [rows] = await con.query(SELECT_BY_ID_QUERY, [idPaciente, idObraSocial])

      return formatUpdatedAt(rows[0]) // Aplicar el formato a la fila
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        console.error('Error: Relación obra social-paciente ya existe:', error)
        throw new Error('La relación obra social-paciente ya está registrada')
      }

      console.error('Error al crear la relación obra social-paciente:', error)
      throw new Error('Error al crear la relación obra social-paciente')
    }
  }

  // Desactivar una relación obra social-paciente
  static async deactivate ({ idPaciente, idObraSocial }) {
    try {
      await con.query(UPDATE_DEACTIVATE_QUERY, [idPaciente, idObraSocial])
      return true
    } catch (error) {
      console.error('Error al desactivar la relación obra social-paciente:', error)
      throw new Error('Error al desactivar la relación obra social-paciente')
    }
  }

  // Activar una relación obra social-paciente
  static async activate ({ idPaciente, idObraSocial }) {
    try {
      await con.query(UPDATE_ACTIVATE_QUERY, [idPaciente, idObraSocial])
      return true
    } catch (error) {
      console.error('Error al activar la relación obra social-paciente:', error)
      throw new Error('Error al activar la relación obra social-paciente')
    }
  }

  // Actualizar parcialmente una relación obra social-paciente
  static async partiallyUpdate ({ idPaciente, idObraSocial, input }) {
    const { updateFields, updateValues } = buildUpdateQuery(input)

    if (updateFields.length === 0) {
      return null
    }

    updateValues.push(idPaciente, idObraSocial)

    try {
      const updateQuery = `
        UPDATE obra_social_paciente
        SET ${updateFields.join(', ')}
        WHERE id_paciente = ? AND id_obra_social = ?;
      `

      await con.query(updateQuery, updateValues)

      const [rows] = await con.query(SELECT_BY_ID_QUERY, [idPaciente, idObraSocial])

      if (!rows.length) return null

      return formatUpdatedAt(rows[0]) // Aplicar el formato a la fila
    } catch (error) {
      console.error('Error al actualizar la relación obra social-paciente:', error)
      throw new Error('Error al actualizar la relación obra social-paciente')
    }
  }
}