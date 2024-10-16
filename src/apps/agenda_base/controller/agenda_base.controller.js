import { validateAgendaBase, validatePartialAgendaBase, validateEstadoAgenda } from './schemas/agenda_base.schema.js'

import { AgendaBaseModel } from '../models/agenda_base.model.js'

export class AgendaBaseController {
  // Obtener todas las agendas base activas
  getAll = async (req, res) => {
    try {
      const agendas = await AgendaBaseModel.getAll()
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
      const agenda = await AgendaBaseModel.getById({ id })

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

  // Actualizar parcialmente una relación agenda base
  partiallyUpdate = async (req, res) => {
    try {
      // Validar los datos entrantes con el esquema parcial
      const result = validatePartialAgendaBase(req.body)

      if (result.error) {
        return res.status(422).json({ error: JSON.parse(result.error.message) })
      }

      // Extraer los parámetros de la URL
      const { id_profesional, id_sucursal, id_especialidad } = req.params

      // Intentar actualizar parcialmente la relación en la base de datos
      const updatedAgendaBase = await AgendaBaseModel.partiallyUpdate({
        id_profesional,
        id_sucursal,
        id_especialidad,
        input: result.data
      })

      if (!updatedAgendaBase) {
        return res.status(404).json({ error: 'Relación agenda base no encontrada o sin cambios' })
      }

      return res.json({ updated: updatedAgendaBase })
    } catch (error) {
      console.error('Error al actualizar parcialmente la relación agenda base:', error)
      return res.status(500).json({ error: 'Error interno del servidor al actualizar la relación agenda base' })
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

  // Obtener todas las agendas según el estado
  getByEstadoAgenda = async (req, res) => {
    try {
      const { id_estado_agenda } = req.params
      const agendas = await AgendaBaseModel.getByEstadoAgenda({ id_estado_agenda })

      return res.json(agendas)
    } catch (error) {
      console.error('Error al obtener agendas por estado:', error)
      return res.status(500).json({ error: 'Error interno del servidor al obtener las agendas por estado' })
    }
  }

  changeEstadoAgenda = async (req, res) => {
    try {
      const { id } = req.params // ID de la agenda base
      const { id_estado_agenda } = req.body // Nuevo estado
      console.log(id_estado_agenda)
      // Validar que id_estado_agenda esté definido y sea un número
      const validationResult = validateEstadoAgenda.safeParse({ id_estado_agenda })

      if (!validationResult.success) {
        return res.status(422).json({ error: validationResult.error.issues })
      }

      // Llamar al método en el modelo para cambiar el estado
      const updatedAgenda = await AgendaBaseModel.estadoAgenda({ id, id_estado_agenda })

      if (!updatedAgenda) {
        return res.status(404).json({ error: 'Agenda base no encontrada' })
      }

      return res.json({ updated: updatedAgenda })
    } catch (error) {
      console.error('Error al cambiar el estado de la agenda base:', error)
      return res.status(500).json({ error: 'Error interno del servidor al cambiar el estado de la agenda base' })
    }
  }

  getByProfesional = async (req, res) => {
    try {
      const { id_profesional } = req.params
      const agendas = await AgendaBaseModel.getByProfesional({ id_profesional })
      return res.json(agendas)
    } catch (error) {
      console.error('Error al obtener agendas por profesional:', error)
      return res.status(500).json({ error: 'Error interno del servidor' })
    }
  }

  getBySucursal = async (req, res) => {
    try {
      const { id_sucursal } = req.params
      const agendas = await AgendaBaseModel.getBySucursal({ id_sucursal })
      return res.json(agendas)
    } catch (error) {
      console.error('Error al obtener agendas por sucursal:', error)
      return res.status(500).json({ error: 'Error interno del servidor' })
    }
  }

  getByEspecialidad = async (req, res) => {
    try {
      const { id_especialidad } = req.params
      const agendas = await AgendaBaseModel.getByEspecialidad({ id_especialidad })
      return res.json(agendas)
    } catch (error) {
      console.error('Error al obtener agendas por especialidad:', error)
      return res.status(500).json({ error: 'Error interno del servidor' })
    }
  }

  getByProfesionalAndSucursal = async (req, res) => {
    try {
      const { id_profesional, id_sucursal } = req.params
      const agendas = await AgendaBaseModel.getByProfesionalAndSucursal({ id_profesional, id_sucursal })
      return res.json(agendas)
    } catch (error) {
      console.error('Error al obtener agendas por profesional y sucursal:', error)
      return res.status(500).json({ error: 'Error interno del servidor' })
    }
  }

  getByProfesionalAndEspecialidad = async (req, res) => {
    try {
      const { id_profesional, id_especialidad } = req.params
      const agendas = await AgendaBaseModel.getByProfesionalAndEspecialidad({ id_profesional, id_especialidad })
      return res.json(agendas)
    } catch (error) {
      console.error('Error al obtener agendas por profesional y especialidad:', error)
      return res.status(500).json({ error: 'Error interno del servidor' })
    }
  }

  // Obtener agendas por clasificación
  getByClasificacion = async (req, res) => {
    try {
      const { id_clasificacion } = req.params
      const agendas = await AgendaBaseModel.getByClasificacion({ id_clasificacion })
      return res.json(agendas)
    } catch (error) {
      console.error('Error al obtener agendas por clasificación:', error)
      return res.status(500).json({ error: 'Error interno del servidor' })
    }
  }

  // Obtener agendas por clasificación y estado
  getByClasificacionAndEstadoAgenda = async (req, res) => {
    try {
      const { id_clasificacion, id_estado_agenda } = req.params
      const agendas = await AgendaBaseModel.getByClasificacionAndEstadoAgenda({ id_clasificacion, id_estado_agenda })
      return res.json(agendas)
    } catch (error) {
      console.error('Error al obtener agendas por clasificación y estado:', error)
      return res.status(500).json({ error: 'Error interno del servidor' })
    }
  }
}
