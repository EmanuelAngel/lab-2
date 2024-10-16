import { validateTurnoEspecial, validatePartialTurnoEspecial } from './schemas/turno_especial.schema.js'
import { TurnoEspecialModel } from '../models/turno_especial.model.js'

export class TurnoEspecialController {
  // Obtener todos los turnos especiales
  getAll = async (req, res) => {
    try {
      const turnos = await TurnoEspecialModel.getAll()
      return res.json(turnos)
    } catch (error) {
      console.error('Error al obtener todos los turnos especiales:', error)
      return res.status(500).json({ error: 'Error interno del servidor al obtener los turnos especiales' })
    }
  }

  // Obtener un turno especial por ID
  getById = async (req, res) => {
    try {
      const { id } = req.params
      const turno = await TurnoEspecialModel.getById({ id })

      if (!turno) {
        return res.status(404).json({ error: 'Turno especial no encontrado' })
      }

      return res.json(turno)
    } catch (error) {
      console.error('Error al obtener el turno especial por ID:', error)
      return res.status(500).json({ error: 'Error interno del servidor al obtener el turno especial' })
    }
  }

  // Crear un nuevo turno especial
  create = async (req, res) => {
    try {
      const result = validateTurnoEspecial(req.body)
      if (!result.success) {
        return res.status(422).json({ error: result.error.issues })
      }

      const createdTurno = await TurnoEspecialModel.create({ input: result.data })
      return res.status(201).json({ created: createdTurno })
    } catch (error) {
      console.error('Error al crear el turno especial:', error)
      return res.status(500).json({ error: 'Error interno del servidor al crear el turno especial' })
    }
  }

  // Actualizar parcialmente un turno especial
  partiallyUpdate = async (req, res) => {
    try {
      const result = validatePartialTurnoEspecial(req.body)

      if (result.error) {
        return res.status(422).json({ error: JSON.parse(result.error.message) })
      }

      const { id } = req.params

      const updatedTurno = await TurnoEspecialModel.partiallyUpdate({ id, input: result.data })

      if (!updatedTurno) {
        return res.status(404).json({ error: 'Turno especial no encontrado o sin cambios' })
      }

      return res.json({ updated: updatedTurno })
    } catch (error) {
      console.error('Error al actualizar el turno especial:', error)
      return res.status(500).json({ error: 'Error interno del servidor al actualizar el turno especial' })
    }
  }

  // Eliminar un turno especial
  delete = async (req, res) => {
    try {
      const { id } = req.params
      const result = await TurnoEspecialModel.delete({ id })

      if (!result) {
        return res.status(404).json({ error: 'Turno especial no encontrado' })
      }

      return res.status(200).json({ message: 'Turno especial eliminado' })
    } catch (error) {
      console.error('Error al eliminar el turno especial:', error)
      return res.status(500).json({ error: 'Error interno del servidor al eliminar el turno especial' })
    }
  }

  // Obtener turnos especiales por fecha
  getByFecha = async (req, res) => {
    try {
      const { fecha } = req.params
      const turnos = await TurnoEspecialModel.getByFecha({ fecha })
      return res.json(turnos)
    } catch (error) {
      console.error('Error al obtener turnos especiales por fecha:', error)
      return res.status(500).json({ error: 'Error interno del servidor al obtener turnos especiales por fecha' })
    }
  }

  // Obtener turnos especiales por agenda base
  getByAgendaBase = async (req, res) => {
    try {
      const { id_agenda_base } = req.params
      const turnos = await TurnoEspecialModel.getByAgendaBase({ id_agenda_base })
      return res.json(turnos)
    } catch (error) {
      console.error('Error al obtener turnos especiales por agenda base:', error)
      return res.status(500).json({ error: 'Error interno del servidor al obtener turnos especiales por agenda base' })
    }
  }

  // Obtener turnos especiales dentro de un rango de fechas
  getByDateRange = async (req, res) => {
    try {
      const { startDate, endDate } = req.params
      const turnos = await TurnoEspecialModel.getByDateRange({ startDate, endDate })
      return res.json(turnos)
    } catch (error) {
      console.error('Error al obtener turnos especiales por rango de fechas:', error)
      return res.status(500).json({ error: 'Error interno del servidor al obtener turnos especiales por rango de fechas' })
    }
  }

  // Obtener turnos especiales por estado
  getByEstadoTurno = async (req, res) => {
    try {
      const { id_estado_turno } = req.params
      const turnos = await TurnoEspecialModel.getByEstadoTurno({ id_estado_turno })
      return res.json(turnos)
    } catch (error) {
      console.error('Error al obtener turnos especiales por estado:', error)
      return res.status(500).json({ error: 'Error interno del servidor al obtener turnos especiales por estado' })
    }
  }

  // Contar turnos especiales por fecha
  countTurnosByFecha = async (req, res) => {
    try {
      const { fecha } = req.params
      const total = await TurnoEspecialModel.countTurnosByFecha({ fecha })
      return res.json({ total })
    } catch (error) {
      console.error('Error al contar turnos especiales por fecha:', error)
      return res.status(500).json({ error: 'Error interno del servidor al contar turnos especiales' })
    }
  }
}
