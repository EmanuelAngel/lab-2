import pool from '../../../config/db.config.js'

export class AgendaBaseModel {
  // Obtener todas las agendas activas (estado = 1)
  static async getAll () {
    const con = await pool.getConnection()
    try {
      const [rows] = await con.query('SELECT * FROM agenda_base WHERE estado = 1;')
      return rows
    } catch (error) {
      console.error('Error al obtener todas las agendas base:', error)
      throw new Error('Error al obtener las agendas base')
    } finally {
      con.release()
    }
  }

  // Obtener una agenda base por ID
  static async getById ({ id }) {
    const con = await pool.getConnection()
    try {
      const [rows] = await con.query('SELECT * FROM agenda_base WHERE id_agenda_base = ?;', [id])
      return rows.length ? rows[0] : null
    } catch (error) {
      console.error('Error al obtener la agenda base por ID:', error)
      throw new Error('Error al obtener la agenda base')
    } finally {
      con.release()
    }
  }

  // Crear una nueva agenda base
  static async create ({ input }) {
    const con = await pool.getConnection()
    const {
      id_sucursal,
      estado = 1,
      id_estado_agenda = 1,
      id_clasificacion,
      duracion_turno,
      sobreturnos_maximos,
      matricula
    } = input
    try {
      await con.query(
        `INSERT INTO agenda_base (id_sucursal, estado, id_estado_agenda, id_clasificacion, duracion_turno, sobreturnos_maximos, matricula)
        VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [id_sucursal, estado, id_estado_agenda, id_clasificacion, duracion_turno, sobreturnos_maximos, matricula]
      )
      const [agendas] = await con.query('SELECT * FROM agenda_base WHERE id_sucursal = ?;', [id_sucursal])
      return agendas[0]
    } catch (error) {
      console.error('Error al crear la agenda base:', error)
      throw error
    } finally {
      con.release()
    }
  }

  // Activar una agenda base (cambia estado a 1)
  static async activate ({ id }) {
    const con = await pool.getConnection()
    try {
      await con.query('UPDATE agenda_base SET estado = 1 WHERE id_agenda_base = ?;', [id])
      const [agenda] = await con.query('SELECT * FROM agenda_base WHERE id_agenda_base = ?;', [id])
      return agenda.length ? agenda[0] : null
    } catch (error) {
      console.error('Error al activar la agenda base:', error)
      throw new Error('Error al activar la agenda base')
    } finally {
      con.release()
    }
  }

  // Desactivar una agenda base (cambia estado a 0)
  static async deactivate ({ id }) {
    const con = await pool.getConnection()
    try {
      await con.query('UPDATE agenda_base SET estado = 0 WHERE id_agenda_base = ?;', [id])
      const [agenda] = await con.query('SELECT * FROM agenda_base WHERE id_agenda_base = ?;', [id])
      return agenda.length ? agenda[0] : null
    } catch (error) {
      console.error('Error al desactivar la agenda base:', error)
      throw new Error('Error al desactivar la agenda base')
    } finally {
      con.release()
    }
  }

  // Actualizar parcialmente una agenda base
  static async partiallyUpdate ({ id_agenda_base, input }) {
    const con = await pool.getConnection()
    const updateFields = []
    const updateValues = []

    // Iterar sobre las propiedades para actualizar solo los campos que se incluyen en "input"
    for (const [key, value] of Object.entries(input)) {
      if (value !== undefined) {
        updateFields.push(`${key} = ?`)
        updateValues.push(value)
      }
    }

    if (updateFields.length === 0) {
      return null
    }

    updateValues.push(id_agenda_base)

    try {
      const updateQuery = `
      UPDATE agenda_base 
      SET ${updateFields.join(', ')} 
      WHERE id_agenda_base = ?;
    `

      await con.query(updateQuery, updateValues)

      const [agendaBase] = await con.query('SELECT * FROM agenda_base WHERE id_agenda_base = ?;', [id_agenda_base])
      return agendaBase.length ? agendaBase[0] : null
    } catch (error) {
      console.error('Error al actualizar la agenda base:', error)
      throw new Error('Error al actualizar la agenda base')
    } finally {
      con.release()
    }
  }

  // Obtener agendas por matrícula
  static async getByMatricula ({ matricula }) {
    const con = await pool.getConnection()
    try {
      const [rows] = await con.query('SELECT * FROM agenda_base WHERE matricula = ?;', [matricula])
      return rows
    } catch (error) {
      console.error('Error al obtener agendas por matrícula:', error)
      throw new Error('Error al obtener agendas por matrícula')
    } finally {
      con.release()
    }
  }

  // Obtener agendas según id_estado_agenda
  static async getByEstadoAgenda ({ id_estado_agenda }) {
    const con = await pool.getConnection()
    try {
      const [rows] = await con.query('SELECT * FROM agenda_base WHERE id_estado_agenda = ?;', [id_estado_agenda])
      return rows
    } catch (error) {
      console.error('Error al obtener agendas por estado de agenda:', error)
      throw new Error('Error al obtener agendas por estado de agenda')
    } finally {
      con.release()
    }
  }

  // Obtener todas las agendas para una sucursal específica
  static async getBySucursal ({ id_sucursal }) {
    const con = await pool.getConnection()
    try {
      const [rows] = await con.query('SELECT * FROM agenda_base WHERE id_sucursal = ?;', [id_sucursal])
      return rows
    } catch (error) {
      console.error('Error al obtener agendas por sucursal:', error)
      throw new Error('Error al obtener agendas por sucursal')
    } finally {
      con.release()
    }
  }

  // Obtener agendas por id_sucursal y id_clasificacion
  static async getBySucursalAndClasificacion ({ id_sucursal, id_clasificacion }) {
    const con = await pool.getConnection()
    try {
      const [rows] = await con.query('SELECT * FROM agenda_base WHERE id_sucursal = ? AND id_clasificacion = ?;', [id_sucursal, id_clasificacion])
      return rows
    } catch (error) {
      console.error('Error al obtener agendas por sucursal y clasificación:', error)
      throw new Error('Error al obtener agendas por sucursal y clasificación')
    } finally {
      con.release()
    }
  }

  static async getAllDetailed () {
    const con = await pool.getConnection()
    try {
      const [result] = await con.query(/* sql */ `
        SELECT 
          a.*,
          s.nombre as sucursal_nombre,
          c.nombre_clasificacion as clasificacion_nombre,
          ea.nombre_estado as estado_nombre,
          u.nombre as profesional_nombre,
          u.apellido as profesional_apellido,
          e.nombre as especialidad_nombre
        FROM agenda_base a
        LEFT JOIN sucursal s ON a.id_sucursal = s.id_sucursal
        LEFT JOIN clasificacion_consulta c ON a.id_clasificacion = c.id_clasificacion
        LEFT JOIN estado_agenda ea ON a.id_estado_agenda = ea.id_estado_agenda
        LEFT JOIN especialidades_profesional ep ON a.matricula = ep.matricula
        LEFT JOIN profesionales p ON ep.id_profesional = p.id_profesional
        LEFT JOIN usuarios u ON p.id_usuario = u.id_usuario
        LEFT JOIN especialidades e ON ep.id_especialidad = e.id_especialidad
        ORDER BY a.createdAt DESC
      `)

      return result
    } catch (error) {
      console.log(error)
      throw new Error(`Error al obtener agendas detalladas: ${error.message}`)
    } finally {
      con.release()
    }
  }

  static async getByIdDetailed ({ id }) {
    const con = await pool.getConnection()
    try {
      const [[result]] = await con.query(/* sql */ `
        SELECT 
          a.*,
          s.nombre as sucursal_nombre,
          c.nombre_clasificacion as clasificacion_nombre,
          ea.nombre_estado as estado_nombre,
          u.nombre as profesional_nombre,
          u.apellido as profesional_apellido,
          p.id_profesional,
          e.nombre as especialidad_nombre
        FROM agenda_base a
        LEFT JOIN sucursal s ON a.id_sucursal = s.id_sucursal
        LEFT JOIN clasificacion_consulta c ON a.id_clasificacion = c.id_clasificacion
        LEFT JOIN estado_agenda ea ON a.id_estado_agenda = ea.id_estado_agenda
        LEFT JOIN especialidades_profesional ep ON a.matricula = ep.matricula
        LEFT JOIN profesionales p ON ep.id_profesional = p.id_profesional
        LEFT JOIN usuarios u ON p.id_usuario = u.id_usuario
        LEFT JOIN especialidades e ON ep.id_especialidad = e.id_especialidad
        WHERE a.id_agenda_base = ?
        ORDER BY a.createdAt DESC;
      `, [id])

      return result
    } catch (error) {
      console.log(error)
      throw new Error(`Error al obtener agendas detalladas: ${error.message}`)
    } finally {
      con.release()
    }
  }

  static async getAgendaWithTurnos ({ id, fechaInicio = null, fechaFin = null }) {
    const con = await pool.getConnection()
    try {
      const agenda = await AgendaBaseModel.getByIdDetailed({ id })
      const [[turnos]] = await con.query(/* sql */ `
        CALL ObtenerTurnosAgenda(?, ?, ?);
        `, [id, fechaInicio, fechaFin])

      return {
        agenda,
        turnos: turnos.map(turno => ({
          ...turno,
          fecha: turno.fecha.toISOString().split('T')[0]
        }))
      }
    } catch (error) {
      console.log(error)
      throw new Error(`Error al obtener turnos de agenda: ${error.message}`)
    } finally {
      con.release()
    }
  }

  static async asignarTurno ({ idTurno, idPaciente, motivoConsulta }) {
    const con = await pool.getConnection()
    try {
      // Primero ejecutamos el procedimiento almacenado
      await con.execute(
        'CALL AsignarTurno(?, ?, ?, @p_resultado, @p_mensaje)',
        [idTurno, idPaciente, motivoConsulta]
      )

      // Luego obtenemos los resultados de las variables de sesión
      const [[result]] = await con.execute(
        'SELECT @p_resultado as resultado, @p_mensaje as mensaje'
      )

      if (!result.resultado) {
        throw new Error(result.mensaje)
      }

      return { mensaje: result.mensaje }
    } catch (error) {
      console.log(error)
      throw error
    } finally {
      con.release()
    }
  }
}
