import { validateEstadoAgenda, validatePartialEstadoAgenda } from './schemas/estado_agenda.schema.js'
import { EstadoAgendaModel } from '../models/estado_agenda.model.js'

export class EstadoAgendaController {
  // Obtener todos los estados de agenda
  getAll = async (req, res) => {
    try {
      const estados = await EstadoAgendaModel.getAll()
      return res.json(estados)
    } catch (error) {
      console.error('Error al obtener los estados de agenda:', error)
      return res.status(500).json({ error: 'Error interno del servidor al obtener los estados de agenda' })
    }
  }

  // Obtener un estado de agenda por su ID
  getById = async (req, res) => {
    try {
      const { id } = req.params
      const estado = await EstadoAgendaModel.getById({ id })

      if (!estado) {
        return res.status(404).json({ error: 'Estado de agenda no encontrado' })
      }

      return res.json(estado)
    } catch (error) {
      console.error('Error al obtener el estado de agenda por ID:', error)
      return res.status(500).json({ error: 'Error interno del servidor al obtener el estado de agenda' })
    }
  }

  // Obtener un estado de agenda por su nombre
  getByNombre = async (req, res) => {
    try {
      const { nombre_estado } = req.params
      const estado = await EstadoAgendaModel.getByNombre({ nombre_estado })

      if (!estado) {
        return res.status(404).json({ error: 'Estado de agenda no encontrado' })
      }

      return res.json(estado)
    } catch (error) {
      console.error('Error al obtener el estado de agenda por nombre:', error)
      return res.status(500).json({ error: 'Error interno del servidor al obtener el estado de agenda' })
    }
  }

  // Crear un nuevo estado de agenda
  create = async (req, res) => {
    try {
      const result = validateEstadoAgenda(req.body)

      if (result.error) {
        return res.status(422).json({ error: JSON.parse(result.error.message) })
      }

      const createdEstado = await EstadoAgendaModel.create({ input: result.data })
      return res.status(201).json({ created: createdEstado })
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        console.error('Error al crear el estado de agenda: Entrada duplicada:', error)
        return res.status(409).json({ error: 'Ya existe un estado de agenda con el mismo nombre' })
      }

      console.error('Error al crear el estado de agenda:', error)
      return res.status(500).json({ error: 'Error interno del servidor al crear el estado de agenda' })
    }
  }

  // Actualizar parcialmente un estado de agenda
  partiallyUpdate = async (req, res) => {
    try {
      const result = validatePartialEstadoAgenda(req.body)

      if (result.error) {
        return res.status(422).json({ error: JSON.parse(result.error.message) })
      }

      const { id } = req.params
      const updatedEstado = await EstadoAgendaModel.partiallyUpdate({ id, input: result.data })

      if (!updatedEstado) {
        return res.status(404).json({ error: 'Estado de agenda no encontrado o sin cambios' })
      }

      return res.json({ updated: updatedEstado })
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        console.error('Error al actualizar el estado de agenda: Entrada duplicada:', error)
        return res.status(409).json({ error: 'El nombre del estado ya se encuentra en uso' })
      }

      console.error('Error al actualizar parcialmente el estado de agenda:', error)
      return res.status(500).json({ error: 'Error interno del servidor al actualizar el estado de agenda' })
    }
  }

  // Eliminar un estado de agenda
  deactivate = async (req, res) => {
    try {
      const { id } = req.params
      const result = await EstadoAgendaModel.deactivate({ id })

      if (!result) {
        return res.status(404).json({ error: 'Estado de agenda no encontrado' })
      }

      return res.status(200).json({ message: 'Estado de agenda eliminado' })
    } catch (error) {
      console.error('Error al eliminar el estado de agenda:', error)
      return res.status(500).json({ error: 'Error interno del servidor al eliminar el estado de agenda' })
    }
  }
}
