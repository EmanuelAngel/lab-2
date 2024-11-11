import pool from '../../../config/db.config.js'

export class EspecialidadesProfesionalModel {
  static async getAll () {
    const con = await pool.getConnection()
    try {
      const [rows] = await con.query('SELECT * FROM especialidades_profesional WHERE estado = 1;')
      return rows
    } catch (error) {
      console.error('Error al obtener todas las especialidades de los profesionales:', error)
      throw new Error('Error al obtener las especialidades de los profesionales')
    } finally {
      con.release()
    }
  }

  static async getById ({ id_profesional, id_especialidad }) {
    const con = await pool.getConnection()
    try {
      const [rows] = await con.query('SELECT * FROM especialidades_profesional WHERE id_profesional = ? AND id_especialidad = ?;', [id_profesional, id_especialidad])
      return rows.length ? rows[0] : null
    } catch (error) {
      console.error('Error al obtener la especialidad del profesional por ID:', error)
      throw new Error('Error al obtener la especialidad del profesional')
    } finally {
      con.release()
    }
  }

  static async create ({ input }) {
    const con = await pool.getConnection()
    const { id_profesional, id_especialidad, matricula } = input
    try {
      await con.query(
        `INSERT INTO especialidades_profesional (id_profesional, id_especialidad, matricula, estado)
        VALUES (?, ?, ?, 1)`,
        [id_profesional, id_especialidad, matricula]
      )

      const [especialidadProfesional] = await con.query('SELECT * FROM especialidades_profesional WHERE id_profesional = ? AND id_especialidad = ?;', [id_profesional, id_especialidad])
      return especialidadProfesional[0]
    } catch (error) {
      console.error('Error al crear la relación especialidad-profesional:', error)
      throw error
    } finally {
      con.release()
    }
  }

  static async deactivate ({ id_profesional, id_especialidad }) {
    const con = await pool.getConnection()
    try {
      await con.query('UPDATE especialidades_profesional SET estado = 0 WHERE id_profesional = ? AND id_especialidad = ?;', [id_profesional, id_especialidad])

      const [especialidadProfesional] = await con.query('SELECT * FROM especialidades_profesional WHERE id_profesional = ? AND id_especialidad = ?;', [id_profesional, id_especialidad])
      return especialidadProfesional.length ? especialidadProfesional[0] : null
    } catch (error) {
      console.error('Error al desactivar la relación especialidad-profesional:', error)
      throw new Error('Error al desactivar la relación especialidad-profesional')
    } finally {
      con.release()
    }
  }

  static async activate ({ id_profesional, id_especialidad }) {
    const con = await pool.getConnection()
    try {
      await con.query('UPDATE especialidades_profesional SET estado = 1 WHERE id_profesional = ? AND id_especialidad = ?;', [id_profesional, id_especialidad])

      const [especialidadProfesional] = await con.query('SELECT * FROM especialidades_profesional WHERE id_profesional = ? AND id_especialidad = ?;', [id_profesional, id_especialidad])
      return especialidadProfesional.length ? especialidadProfesional[0] : null
    } catch (error) {
      console.error('Error al activar la relación especialidad-profesional:', error)
      throw new Error('Error al activar la relación especialidad-profesional')
    } finally {
      con.release()
    }
  }

  static async partiallyUpdate ({ id_profesional, id_especialidad, input }) {
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

    updateValues.push(id_profesional, id_especialidad)

    try {
      const updateQuery = `
        UPDATE especialidades_profesional 
        SET ${updateFields.join(', ')} 
        WHERE id_profesional = ? AND id_especialidad = ?;
      `

      await con.query(updateQuery, updateValues)

      input.id_especialidad = input.id_especialidad || id_especialidad
      input.id_profesional = input.id_profesional || id_profesional

      const [especialidadProfesional] = await con.query('SELECT * FROM especialidades_profesional WHERE id_profesional = ? AND id_especialidad = ?;', [input.id_profesional, input.id_especialidad])
      return especialidadProfesional.length ? especialidadProfesional[0] : null
    } catch (error) {
      console.error('Error al actualizar la relación especialidad-profesional:', error)
      throw new Error('Error al actualizar la relación especialidad-profesional')
    } finally {
      con.release()
    }
  }

  static async getByProfesional ({ id_profesional }) {
    const con = await pool.getConnection()
    try {
      const [rows] = await con.query('SELECT * FROM especialidades_profesional WHERE id_profesional = ? AND estado = 1;', [id_profesional])
      return rows
    } catch (error) {
      console.error('Error al obtener las especialidades del profesional:', error)
      throw new Error('Error al obtener las especialidades del profesional')
    } finally {
      con.release()
    }
  }

  static async getByEspecialidad ({ id_especialidad }) {
    const con = await pool.getConnection()
    try {
      const [rows] = await con.query('SELECT * FROM especialidades_profesional WHERE id_especialidad = ? AND estado = 1;', [id_especialidad])
      return rows
    } catch (error) {
      console.error('Error al obtener los profesionales con la especialidad:', error)
      throw new Error('Error al obtener los profesionales con la especialidad')
    } finally {
      con.release()
    }
  }

  // Nuevo método para obtener una relación especialidad-profesional por matrícula
  static async getByMatricula ({ matricula }) {
    const con = await pool.getConnection()
    try {
      const [rows] = await con.query('SELECT * FROM especialidades_profesional WHERE matricula = ? AND estado = 1;', [matricula])
      return rows.length ? rows[0] : null
    } catch (error) {
      console.error('Error al obtener la especialidad-profesional por matrícula:', error)
      throw new Error('Error al obtener la especialidad-profesional por matrícula')
    } finally {
      con.release()
    }
  }
}

// updateRelation = async (req, res) => {
//   try {
//     const { id_profesional, id_especialidad } = req.params
//     const { new_id_especialidad } = req.body // El nuevo valor del id_especialidad

//     // Validar los datos de entrada
//     if (!new_id_especialidad) {
//       return res.status(400).json({ error: 'Debes proporcionar un nuevo id_especialidad' })
//     }

//     // Verificar si la relación actual existe
//     const existingRelation = await EspecialidadesProfesionalModel.getById(id_profesional, id_especialidad)
//     if (!existingRelation) {
//       return res.status(404).json({ error: 'Relación no encontrada' })
//     }

//     // Eliminar la relación actual
//     await EspecialidadesProfesionalModel.deactivate({ idProfesional: id_profesional, idEspecialidad: id_especialidad })

//     // Crear la nueva relación con el nuevo id_especialidad
//     const newRelation = await EspecialidadesProfesionalModel.create({
//       idProfesional: id_profesional,
//       idEspecialidad: new_id_especialidad,
//       estado: existingRelation.estado // Mantener el estado actual
//     })

//     return res.json({ updated: newRelation })
//   } catch (error) {
//     console.error('Error al actualizar la relación especialidad-profesional:', error)
//     return res.status(500).json({ error: 'Error interno del servidor al actualizar la relación' })
//   }
// }
