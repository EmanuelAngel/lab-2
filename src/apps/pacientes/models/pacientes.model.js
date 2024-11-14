import pool from '../../../config/db.config.js'
import { hash } from 'bcrypt'

export class PacientesModel {
  static async getAll () {
    const con = await pool.getConnection()
    try {
      const [rows] = await con.query('SELECT * FROM pacientes WHERE estado = 1;')
      return rows
    } catch (error) {
      console.error('Error al obtener todos los pacientes:', error)
      throw new Error('Error al obtener los pacientes')
    } finally {
      con.release()
    }
  }

  static async getById ({ id }) {
    const con = await pool.getConnection()
    try {
      const [rows] = await con.query('SELECT * FROM pacientes WHERE id_paciente = ?;', [id])
      return rows.length ? rows[0] : null
    } catch (error) {
      console.error('Error al obtener el paciente por ID:', error)
      throw new Error('Error al obtener el paciente')
    } finally {
      con.release()
    }
  }

  static async create ({ input }) {
    const con = await pool.getConnection()
    const { tiene_obra_social, id_usuario, fotocopia_dni = null } = input
    try {
      await con.query(
        `INSERT INTO pacientes (tiene_obra_social, estado, id_usuario, fotocopia_dni)
        VALUES (?, 1, ?, ?)`,
        [tiene_obra_social, id_usuario, fotocopia_dni]
      )

      const [pacientes] = await con.query('SELECT * FROM pacientes WHERE id_usuario = ?;', [id_usuario])
      return pacientes[0]
    } catch (error) {
      console.error('Error al crear el paciente:', error)
      throw error
    } finally {
      con.release()
    }
  }

  static async deactivate ({ id }) {
    const con = await pool.getConnection()
    try {
      await con.query('UPDATE pacientes SET estado = 0 WHERE id_paciente = ?;', [id])
      const [paciente] = await con.query('SELECT * FROM pacientes WHERE id_paciente = ?;', [id])
      return paciente.length ? paciente[0] : null
    } catch (error) {
      console.error('Error al desactivar el paciente:', error)
      throw new Error('Error al desactivar el paciente')
    } finally {
      con.release()
    }
  }

  static async activate ({ id }) {
    const con = await pool.getConnection()
    try {
      await con.query('UPDATE pacientes SET estado = 1 WHERE id_paciente = ?;', [id])
      const [paciente] = await con.query('SELECT * FROM pacientes WHERE id_paciente = ?;', [id])
      return paciente.length ? paciente[0] : null
    } catch (error) {
      console.error('Error al activar el paciente:', error)
      throw new Error('Error al activar el paciente')
    } finally {
      con.release()
    }
  }

  static async partiallyUpdate ({ id, input }) {
    const con = await pool.getConnection()
    const updateFields = []
    const updateValues = []

    for (const [key, value] of Object.entries(input)) {
      if (value !== undefined) {
        updateFields.push(`${key} = ?`)
        updateValues.push(value)
      }
    }

    if (updateFields.length === 0) {
      return null
    }

    updateValues.push(id)

    try {
      const updateQuery = `
          UPDATE pacientes 
          SET ${updateFields.join(', ')} 
          WHERE id_paciente = ?;
        `

      await con.query(updateQuery, updateValues)

      const [pacientes] = await con.query('SELECT * FROM pacientes WHERE id_paciente = ?;', [id])
      return pacientes.length ? pacientes[0] : null
    } catch (error) {
      console.error('Error al actualizar el paciente:', error)
      throw new Error('Error al actualizar el paciente')
    } finally {
      con.release()
    }
  }

  static async getByObraSocial ({ tiene_obra_social }) {
    const con = await pool.getConnection()
    try {
      const [rows] = await con.query('SELECT * FROM pacientes WHERE tiene_obra_social = ? AND estado = 1;', [tiene_obra_social])
      return rows
    } catch (error) {
      console.error('Error al obtener pacientes por obra social:', error)
      throw new Error('Error al obtener pacientes por obra social')
    } finally {
      con.release()
    }
  }

  static async getByUsuario ({ id_usuario }) {
    const con = await pool.getConnection()
    try {
      const [rows] = await con.query('SELECT * FROM pacientes WHERE id_usuario = ? AND estado = 1;', [id_usuario])
      return rows
    } catch (error) {
      console.error('Error al obtener pacientes por id_usuario:', error)
      throw new Error('Error al obtener pacientes por id_usuario')
    } finally {
      con.release()
    }
  }

  static async createWithUser ({ input }) {
    const con = await pool.getConnection()
    try {
      await con.beginTransaction()

      const {
        nombre_usuario,
        contraseña,
        nombre,
        apellido,
        dni,
        telefono,
        direccion,
        email,
        obras_sociales
      } = input

      const hashedPassword = await hash(contraseña, 10)

      // Creamos el usuario
      const [user] = await con.execute(/* sql */`
        INSERT INTO usuarios (
          id_rol,
          nombre_usuario,
          contraseña,
          nombre,
          apellido,
          dni,
          telefono,
          direccion,
          email,
          estado
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
      `, [4, nombre_usuario, hashedPassword, nombre,
        apellido, dni, telefono, direccion, email])

      const tieneObraSocial = obras_sociales?.length > 0 ? 1 : 0

      // Creamos el profesional
      const [paciente] = await con.query(`
        INSERT INTO pacientes (
          id_usuario,
          estado,
          tiene_obra_social
          )
          VALUES (?, 1, ?)
      `, [user.insertId, tieneObraSocial])

      if (tieneObraSocial) {
        for (const obraSocial of obras_sociales) {
          await con.execute(/* sql */`
            INSERT INTO obra_social_paciente (
              id_paciente,
              id_obra_social,
              estado
            )
            VALUES (?, ?, 1)
          `, [paciente.insertId, obraSocial.obra_social_id])
        }
      }

      await con.commit()

      return await PacientesModel.getById({ id: paciente.insertId })
    } catch (error) {
      await con.rollback()
      console.log(error)
      throw error
    } finally {
      con.release()
    }
  }

  static async getAllWithUser () {
    const con = await pool.getConnection()
    try {
      const [rows] = await con.query(/* sql */`
        SELECT 
          p.id_paciente,
          p.estado AS estado_paciente,
          p.id_usuario,
          u.nombre_usuario,
          u.nombre,
          u.apellido,
          u.dni,
          u.telefono,
          u.direccion,
          u.email,
          u.estado AS estado_usuario,
          JSON_ARRAYAGG(
            CASE 
              WHEN os.nombre IS NOT NULL 
              THEN JSON_OBJECT('obra_social', os.nombre)
              ELSE NULL 
            END
          ) AS obras_sociales
        FROM pacientes p
        LEFT JOIN usuarios u ON p.id_usuario = u.id_usuario
        LEFT JOIN obra_social_paciente op ON p.id_paciente = op.id_paciente 
          AND op.estado = 1
        LEFT JOIN obra_social os ON op.id_obra_social = os.id_obra_social 
          AND os.estado = 1
        GROUP BY 
          p.id_paciente,
          p.estado,
          p.id_usuario,
          u.nombre_usuario,
          u.nombre,
          u.apellido,
          u.dni,
          u.telefono,
          u.direccion,
          u.email,
          u.estado
      `)

      return rows
    } catch (error) {
      console.log()
      throw error
    } finally {
      con.release()
    }
  }

  static async getByIdWithUser ({ id }) {
    const con = await pool.getConnection()
    try {
      const [rows] = await con.query(/* sql */`
        SELECT 
          p.id_paciente,
          p.estado AS estado_paciente,
          p.id_usuario,
          u.nombre_usuario,
          u.nombre,
          u.apellido,
          u.dni,
          u.telefono,
          u.direccion,
          u.email,
          u.estado AS estado_usuario,
          JSON_ARRAYAGG(
            CASE 
              WHEN os.nombre IS NOT NULL 
              THEN JSON_OBJECT('obra_social', os.nombre)
              ELSE NULL 
            END
          ) AS obras_sociales
        FROM pacientes p
        LEFT JOIN usuarios u ON p.id_usuario = u.id_usuario
        LEFT JOIN obra_social_paciente op ON p.id_paciente = op.id_paciente 
          AND op.estado = 1
        LEFT JOIN obra_social os ON op.id_obra_social = os.id_obra_social 
          AND os.estado = 1
        WHERE p.id_paciente = ?
        GROUP BY 
          p.id_paciente,
          p.estado,
          p.id_usuario,
          u.nombre_usuario,
          u.nombre,
          u.apellido,
          u.dni,
          u.telefono,
          u.direccion,
          u.email,
          u.estado
      `, [id])

      return rows[0] || null
    } catch (error) {
      console.log(error)
      throw error
    } finally {
      con.release()
    }
  }

  static async updateWithUser ({ id, input }) {
    const con = await pool.getConnection()
    try {
      await con.beginTransaction()

      const {
        contraseña,
        nombre,
        apellido,
        dni,
        telefono,
        direccion,
        obras_sociales
      } = input

      // Obtenemos el id_usuario del paciente
      const [[paciente]] = await con.execute(/* sql */`
        SELECT id_usuario 
        FROM pacientes 
        WHERE id_paciente = ?
      `, [id])

      if (!paciente) {
        return null
      }

      // Si viene contraseña la hasheamos, si no usamos la existente
      let passwordQuery = ''
      let passwordParams = []

      if (contraseña) {
        const hashedPassword = await hash(contraseña, 10)
        passwordQuery = 'contraseña = ?,'
        passwordParams = [hashedPassword]
      }

      await con.execute(/* sql */`
        UPDATE usuarios 
        SET ${passwordQuery}
            nombre = ?,
            apellido = ?,
            dni = ?,
            telefono = ?,
            direccion = ?
        WHERE id_usuario = ?
      `, [
        ...passwordParams,
        nombre,
        apellido,
        dni,
        telefono,
        direccion,
        paciente.id_usuario
      ])

      // Desactivamos todas las obras sociales existentes
      await con.execute(/* sql */`
        UPDATE obra_social_paciente
        SET estado = 0
        WHERE id_paciente = ?
      `, [id])

      // Insertamos las nuevas obras sociales
      if (obras_sociales && obras_sociales.length > 0) {
        for (const obraSocial of obras_sociales) {
          // Verificamos si ya existe esa obra social para ese paciente
          const [[existingOS]] = await con.execute(/* sql */`
            SELECT id_paciente 
            FROM obra_social_paciente 
            WHERE id_paciente = ? AND id_obra_social = ?
          `, [id, obraSocial.obra_social_id])

          if (existingOS) {
            // Si existe, la reactivamos
            await con.execute(/* sql */`
              UPDATE obra_social_paciente
              SET estado = 1
              WHERE id_paciente = ? AND id_obra_social = ?
            `, [id, obraSocial.obra_social_id])
          } else {
            // Si no existe, la insertamos
            await con.execute(/* sql */`
              INSERT INTO obra_social_paciente (
                id_paciente,
                id_obra_social,
                estado
              )
              VALUES (?, ?, 1)
            `, [id, obraSocial.obra_social_id])
          }
        }
      }

      await con.commit()

      return await PacientesModel.getByIdWithUser({ id })
    } catch (error) {
      await con.rollback()
      console.log(error)
      throw error
    } finally {
      con.release()
    }
  }

  static async getByEmailWithUser ({ email }) {
    const con = await pool.getConnection()
    try {
      const [rows] = await con.query(/* sql */`
        SELECT 
          p.id_paciente,
          p.estado AS estado_paciente,
          p.id_usuario,
          u.nombre_usuario,
          u.nombre,
          u.apellido,
          u.dni,
          u.telefono,
          u.direccion,
          u.email,
          u.estado AS estado_usuario,
          JSON_ARRAYAGG(
            CASE 
              WHEN os.nombre IS NOT NULL 
              THEN JSON_OBJECT('obra_social', os.nombre)
              ELSE NULL 
            END
          ) AS obras_sociales
        FROM pacientes p
        LEFT JOIN usuarios u ON p.id_usuario = u.id_usuario
        LEFT JOIN obra_social_paciente op ON p.id_paciente = op.id_paciente 
          AND op.estado = 1
        LEFT JOIN obra_social os ON op.id_obra_social = os.id_obra_social 
          AND os.estado = 1
        WHERE u.email = ? 
        AND u.id_rol = 4
        GROUP BY 
          p.id_paciente,
          p.estado,
          p.id_usuario,
          u.nombre_usuario,
          u.nombre,
          u.apellido,
          u.dni,
          u.telefono,
          u.direccion,
          u.email,
          u.estado
      `, [email])

      return rows[0] || null
    } catch (error) {
      console.log(error)
      throw error
    } finally {
      con.release()
    }
  }
}
