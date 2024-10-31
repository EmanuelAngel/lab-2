import { validateTurno, validatePartialTurno } from './schemas/turnos.schema.js'
import { TurnoModel } from '../models/turnos.model.js'

export class TurnoController {
  // Obtener todos los turnos
  getAll = async (req, res) => {
    try {
      const turnos = await TurnoModel.getAll()
      return res.json(turnos)
    } catch (error) {
      console.error('Error al obtener todos los turnos:', error)
      return res.status(500).json({ error: 'Error interno del servidor al obtener los turnos' })
    }
  }

  // Obtener un turno por ID
  getById = async (req, res) => {
    try {
      const { id } = req.params
      const turno = await TurnoModel.getById({ id })

      if (!turno) {
        return res.status(404).json({ error: 'Turno no encontrado' })
      }

      return res.json(turno)
    } catch (error) {
      console.error('Error al obtener el turno por ID:', error)
      return res.status(500).json({ error: 'Error interno del servidor al obtener el turno' })
    }
  }

  // Crear un nuevo turno
  create = async (req, res) => {
    try {
      const result = validateTurno(req.body)
      if (!result.success) {
        return res.status(422).json({ error: result.error.issues })
      }

      const createdTurno = await TurnoModel.create({ input: result.data })
      return res.status(201).json({ created: createdTurno })
    } catch (error) {
      console.error('Error al crear el turno:', error)
      return res.status(500).json({ error: 'Error interno del servidor al crear el turno' })
    }
  }

  // Actualizar parcialmente un turno
  partiallyUpdate = async (req, res) => {
    try {
      const result = validatePartialTurno(req.body)

      if (result.error) {
        return res.status(422).json({ error: JSON.parse(result.error.message) })
      }

      const { id } = req.params
      const updatedTurno = await TurnoModel.partiallyUpdate({ id, input: result.data })

      if (!updatedTurno) {
        return res.status(404).json({ error: 'Turno no encontrado o sin cambios' })
      }

      return res.json({ updated: updatedTurno })
    } catch (error) {
      console.error('Error al actualizar parcialmente el turno:', error)
      return res.status(500).json({ error: 'Error interno del servidor al actualizar el turno' })
    }
  }

  // Eliminar un turno
  delete = async (req, res) => {
    try {
      const { id } = req.params
      const result = await TurnoModel.delete({ id })

      return res.json(result)
    } catch (error) {
      console.error('Error al eliminar el turno:', error)
      return res.status(500).json({ error: 'Error interno del servidor al eliminar el turno' })
    }
  }

  // Obtener turnos por fecha
  getByFecha = async (req, res) => {
    try {
      const { fecha } = req.params
      const turnos = await TurnoModel.getByFecha({ fecha })
      return res.json(turnos)
    } catch (error) {
      console.error('Error al obtener turnos por fecha:', error)
      return res.status(500).json({ error: 'Error interno del servidor' })
    }
  }

  // Obtener turnos por paciente
  getByPaciente = async (req, res) => {
    try {
      const { id_paciente } = req.params
      const turnos = await TurnoModel.getByPaciente({ id_paciente })
      return res.json(turnos)
    } catch (error) {
      console.error('Error al obtener turnos por paciente:', error)
      return res.status(500).json({ error: 'Error interno del servidor' })
    }
  }

  // Obtener turnos por estado de turno
  getByEstadoTurno = async (req, res) => {
    try {
      const { id_estado_turno } = req.params
      const turnos = await TurnoModel.getByEstadoTurno({ id_estado_turno })
      return res.json(turnos)
    } catch (error) {
      console.error('Error al obtener turnos por estado de turno:', error)
      return res.status(500).json({ error: 'Error interno del servidor' })
    }
  }

  // Obtener turnos por motivo de consulta
  getByMotivoConsulta = async (req, res) => {
    const { consulta } = req.params
    try {
      const turnos = await TurnoModel.getByMotivoConsulta({ consulta })
      return res.json(turnos)
    } catch (error) {
      console.error('Error al obtener turnos por motivo de consulta:', error)
      return res.status(500).json({ error: 'Error interno del servidor' })
    }
  }
}
