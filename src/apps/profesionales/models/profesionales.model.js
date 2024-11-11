import pool from '../../../config/db.config.js'
import { hash } from 'bcrypt'

export class ProfesionalesModel {
  static async getAll () {
    const con = await pool.getConnection()
    try {
      // Intentamos obtener todos los profesionales que tienen estado 1 (activos)
      const [rows] = await con.query('SELECT * FROM profesionales WHERE estado = 1;')
      return rows
    } catch (error) {
      // Si ocurre un error, lo registramos en la consola y lanzamos un error personalizado
      console.error('Error al obtener todos los profesionales:', error)
      // Lanzamos el error para que el controlador lo pueda manejar
      throw new Error('Error al obtener los profesionales')
    } finally {
      con.release()
    }
  }

  static async getById ({ id }) {
    const con = await pool.getConnection()
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
    } finally {
      con.release()
    }
  }

  static async create ({ input }) {
    const con = await pool.getConnection()
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
    } finally {
      con.release()
    }
  }

  static async deactivate ({ id }) {
    const con = await pool.getConnection()
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
    } finally {
      con.release()
    }
  }

  static async activate ({ id }) {
    const con = await pool.getConnection()
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
    } finally {
      con.release()
    }
  }

  static async getAllWithUser () {
    const con = await pool.getConnection()
    try {
      // Intentamos obtener todos los profesionales agrupando sus especialidades como un arreglo
      const [rows] = await con.query(/* sql */`
        SELECT 
          p.id_profesional,
          p.estado AS estado_profesional,
          p.id_usuario,
          u.nombre_usuario,
          u.nombre,
          u.apellido,
          u.dni,
          u.telefono,
          u.direccion,
          u.email,
          u.estado AS estado_usuario,
          IF(p.estado = 1, 
            JSON_ARRAYAGG(
              JSON_OBJECT(
                'especialidad', e.nombre,
                'matricula', ep.matricula
              )
            ),
            NULL
          ) AS especialidades
        FROM profesionales p
        LEFT JOIN usuarios u ON p.id_usuario = u.id_usuario
        LEFT JOIN especialidades_profesional ep ON p.id_profesional = ep.id_profesional
        LEFT JOIN especialidades e ON ep.id_especialidad = e.id_especialidad
        WHERE ep.estado = 1 AND e.estado = 1
        GROUP BY 
          p.id_profesional,
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
      console.error('Error al obtener todos los profesionales:', error)
      throw new Error('Error al obtener los profesionales')
    } finally {
      con.release()
    }
  }

  static async getByIdWithUser ({ id }) {
    const con = await pool.getConnection()
    try {
      // Intentamos obtener el profesional por ID, agrupando sus especialidades como un arreglo
      const [rows] = await con.query(`
        SELECT 
          p.id_profesional,
          p.estado AS estado_profesional,
          p.id_usuario,
          u.nombre_usuario,
          u.nombre,
          u.apellido,
          u.dni,
          u.telefono,
          u.direccion,
          u.email,
          u.estado AS estado_usuario,
          IF(p.estado = 1, 
            JSON_ARRAYAGG(
              JSON_OBJECT(
                'id_especialidad', e.id_especialidad,
                'especialidad', e.nombre,
                'matricula', ep.matricula
              )
            ),
            NULL
          ) AS especialidades
        FROM profesionales p
        LEFT JOIN usuarios u ON p.id_usuario = u.id_usuario
        LEFT JOIN especialidades_profesional ep ON p.id_profesional = ep.id_profesional
        LEFT JOIN especialidades e ON ep.id_especialidad = e.id_especialidad
        WHERE p.id_profesional = ?
        GROUP BY 
          p.id_profesional,
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

      // Si no se encuentra el profesional, devolvemos null
      return rows.length ? rows[0] : null
    } catch (error) {
      console.error('Error al obtener el profesional por ID:', error)
      throw new Error('Error al obtener el profesional')
    } finally {
      con.release()
    }
  }

  static async createWithUser ({ input }) {
    const con = await pool.getConnection()
    try {
      con.beginTransaction()

      const {
        nombre_usuario,
        contraseña,
        nombre,
        apellido,
        dni,
        telefono,
        direccion,
        email,
        especialidades
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
    `, [3, nombre_usuario, hashedPassword, nombre, apellido, dni, telefono, direccion, email])

      // Creamos el profesional
      const [profesional] = await con.query(`
        INSERT INTO profesionales (
          id_usuario,
          estado
          )
          VALUES (?, 1)
      `, [user.insertId])

      // Creamos la relación especialidades profesionales
      for (const especialidad of especialidades) {
        await con.execute(/* sql */`
          INSERT INTO especialidades_profesional (
            id_profesional,
            id_especialidad,
            matricula,
            estado
            )
            VALUES (?, ?, ?, 1)
        `, [profesional.insertId, especialidad.especialidad_id, especialidad.matricula])
      }

      con.commit()

      return await ProfesionalesModel.getById({ id: profesional.insertId })
    } catch (error) {
      con.rollback()
      throw error
    } finally {
      con.release()
    }
  }

  static async updateWithUser ({ id, input }) {
    const con = await pool.getConnection()
    try {
      con.beginTransaction()

      const {
        nombre_usuario,
        contraseña,
        nombre,
        apellido,
        dni,
        telefono,
        direccion,
        email,
        especialidades
      } = input

      // Obtenemos el id_usuario del profesional
      const [[profesional]] = await con.execute(/* sql */`
        SELECT id_usuario 
        FROM profesionales 
        WHERE id_profesional = ?
      `, [id])

      if (!profesional) {
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

      // Actualizamos el usuario
      await con.execute(/* sql */`
        UPDATE usuarios 
        SET nombre_usuario = ?,
            ${passwordQuery}
            nombre = ?,
            apellido = ?,
            dni = ?,
            telefono = ?,
            direccion = ?,
            email = ?
        WHERE id_usuario = ?
      `, [
        nombre_usuario,
        ...passwordParams,
        nombre,
        apellido,
        dni,
        telefono,
        direccion,
        email,
        profesional.id_usuario
      ])

      // Obtenemos las especialidades actuales
      const [especialidadesActuales] = await con.execute(/* sql */`
        SELECT id_especialidad, matricula 
        FROM especialidades_profesional
        WHERE id_profesional = ?
      `, [id])

      // Creamos un mapa de las especialidades actuales para fácil acceso
      const especialidadesActualesMap = new Map(
        especialidadesActuales.map(e => [e.id_especialidad, e])
      )

      // Para cada especialidad en el input
      for (const especialidad of especialidades) {
        const especialidadExistente = especialidadesActualesMap.get(especialidad.especialidad_id)

        if (especialidadExistente) {
          // Si existe y cambió la matrícula, actualizamos
          if (especialidadExistente.matricula !== especialidad.matricula) {
            await con.execute(/* sql */`
              UPDATE especialidades_profesional 
              SET matricula = ?
              WHERE id_profesional = ? AND id_especialidad = ?
            `, [especialidad.matricula, id, especialidad.especialidad_id])
          }
          // Removemos del map para saber cuáles eliminar después
          especialidadesActualesMap.delete(especialidad.especialidad_id)
        } else {
          // Si no existe, la insertamos
          await con.execute(/* sql */`
            INSERT INTO especialidades_profesional (
              id_profesional,
              id_especialidad,
              matricula,
              estado
            )
            VALUES (?, ?, ?, 1)
          `, [id, especialidad.especialidad_id, especialidad.matricula])
        }
      }

      // Las especialidades que quedaron en el map son las que ya no están en el input
      // Solo las desactivamos en lugar de eliminarlas
      for (const [idEspecialidad] of especialidadesActualesMap) {
        await con.execute(/* sql */`
          UPDATE especialidades_profesional 
          SET estado = 0
          WHERE id_profesional = ? AND id_especialidad = ?
        `, [id, idEspecialidad])
      }

      await con.commit()

      return await ProfesionalesModel.getByIdWithUser({ id })
    } catch (error) {
      await con.rollback()
      throw error
    } finally {
      con.release()
    }
  }
}
