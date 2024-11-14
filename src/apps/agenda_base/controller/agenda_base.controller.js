import { validateAgendaBase, validatePartialAgendaBase, validateEstadoAgenda } from './schemas/agenda_base.schema.js'
import { AgendaBaseModel } from '../models/agenda_base.model.js'

export class AgendaBaseController {
  // Obtener todas las agendas base activas
  getAll = async (req, res) => {
    try {
      const { expanded } = req.query
      let agendas

      expanded === 'true'
        ? agendas = await AgendaBaseModel.getAllDetailed()
        : agendas = await AgendaBaseModel.getAll()

      return res.json(agendas)
    } catch (error) {
      console.error('Error al obtener todas las agendas base:', error)
      return res.status(500).json({ error: 'Error interno del servidor al obtener las agendas base' })
    }
  }

  // Obtener una agenda base por su ID
  getById = async (req, res) => {
    try {
      const { id } = req.params
      const { expanded } = req.query
      let agenda

      expanded === 'true'
        ? agenda = await AgendaBaseModel.getByIdDetailed({ id })
        : agenda = await AgendaBaseModel.getById({ id })

      if (!agenda) {
        return res.status(404).json({ error: 'Agenda base no encontrada' })
      }

      return res.json(agenda)
    } catch (error) {
      console.error('Error al obtener la agenda base por ID:', error)
      return res.status(500).json({ error: 'Error interno del servidor al obtener la agenda base' })
    }
  }

  // Crear una nueva agenda base
  create = async (req, res) => {
    try {
      const result = validateAgendaBase(req.body)
      if (!result.success) {
        return res.status(422).json({ error: result.error.issues })
      }

      const createdAgenda = await AgendaBaseModel.create({ input: result.data })
      return res.status(201).json({ created: createdAgenda })
    } catch (error) {
      console.error('Error al crear la agenda base:', error)
      return res.status(500).json({ error: 'Error interno del servidor al crear la agenda base' })
    }
  }

  // Actualizar parcialmente una agenda base
  partiallyUpdate = async (req, res) => {
    try {
      const result = validatePartialAgendaBase(req.body)
      if (!result.success) {
        return res.status(422).json({ error: result.error.issues })
      }

      const { id } = req.params
      const updatedAgenda = await AgendaBaseModel.partiallyUpdate({ id_agenda_base: id, input: result.data })

      if (!updatedAgenda) {
        return res.status(404).json({ error: 'Agenda base no encontrada o sin cambios' })
      }

      return res.json({ updated: updatedAgenda })
    } catch (error) {
      console.error('Error al actualizar parcialmente la agenda base:', error)
      return res.status(500).json({ error: 'Error interno del servidor al actualizar la agenda base' })
    }
  }

  // Desactivar una agenda base
  deactivate = async (req, res) => {
    try {
      const { id } = req.params
      const result = await AgendaBaseModel.deactivate({ id })

      if (!result) {
        return res.status(404).json({ error: 'Agenda base no encontrada' })
      }

      return res.status(200).json({ message: 'Agenda base desactivada' })
    } catch (error) {
      console.error('Error al desactivar la agenda base:', error)
      return res.status(500).json({ error: 'Error interno del servidor al desactivar la agenda base' })
    }
  }

  // Activar una agenda base
  activate = async (req, res) => {
    try {
      const { id } = req.params
      const result = await AgendaBaseModel.activate({ id })

      if (!result) {
        return res.status(404).json({ error: 'Agenda base no encontrada' })
      }

      return res.status(200).json({ message: 'Agenda base activada' })
    } catch (error) {
      console.error('Error al activar la agenda base:', error)
      return res.status(500).json({ error: 'Error interno del servidor al activar la agenda base' })
    }
  }

  // Obtener agendas por matrícula
  getByMatricula = async (req, res) => {
    try {
      const { matricula } = req.params
      const agendas = await AgendaBaseModel.getByMatricula({ matricula })
      return res.json(agendas)
    } catch (error) {
      console.error('Error al obtener agendas por matrícula:', error)
      return res.status(500).json({ error: 'Error interno del servidor' })
    }
  }

  // Obtener agendas por estado de la agenda
  getByEstadoAgenda = async (req, res) => {
    try {
      const { id_estado_agenda } = req.params
      const agendas = await AgendaBaseModel.getByEstadoAgenda({ id_estado_agenda })
      return res.json(agendas)
    } catch (error) {
      console.error('Error al obtener agendas por estado de agenda:', error)
      return res.status(500).json({ error: 'Error interno del servidor' })
    }
  }

  // Obtener todas las agendas de una sucursal específica
  getBySucursal = async (req, res) => {
    try {
      const { id_sucursal } = req.params
      const agendas = await AgendaBaseModel.getBySucursal({ id_sucursal })
      return res.json(agendas)
    } catch (error) {
      console.error('Error al obtener agendas por sucursal:', error)
      return res.status(500).json({ error: 'Error interno del servidor al obtener agendas por sucursal' })
    }
  }

  // Obtener todas las id_sucursal distintas
  getAllSucursales = async (req, res) => {
    try {
      const sucursales = await AgendaBaseModel.getAllSucursales()
      return res.json(sucursales)
    } catch (error) {
      console.error('Error al obtener todas las sucursales:', error)
      return res.status(500).json({ error: 'Error interno del servidor al obtener todas las sucursales' })
    }
  }

  // Obtener agendas por combinación de sucursal y clasificación
  getBySucursalAndClasificacion = async (req, res) => {
    try {
      const { id_sucursal, id_clasificacion } = req.params
      const agendas = await AgendaBaseModel.getBySucursalAndClasificacion({ id_sucursal, id_clasificacion })
      return res.json(agendas)
    } catch (error) {
      console.error('Error al obtener agendas por sucursal y clasificación:', error)
      return res.status(500).json({ error: 'Error interno del servidor' })
    }
  }

  getAgendaWithTurnos = async (req, res) => {
    console.log('MUY LO QUE ES:', req.params.id)

    try {
      const { id } = req.params
      const { fechaInicio, fechaFin } = req.query

      const result = await AgendaBaseModel.getAgendaWithTurnos({ id, fechaInicio, fechaFin })

      res.json(result)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  }

  asignarTurno = async (req, res) => {
    try {
      const { idTurno } = req.params
      const { idPaciente, motivoConsulta } = req.body

      const result = await AgendaBaseModel.asignarTurno({
        idTurno,
        idPaciente,
        motivoConsulta
      })

      res.json(result)
    } catch (error) {
      res.status(400).json({ error: error.message })
    }
  }
}
