import { validateEstadoTurno, validatePartialEstadoTurno } from './schemas/estados_turno.schema.js'
import { EstadosTurnoModel } from '../models/estados_turno.model.js'

export class EstadosTurnoController {
  // Obtener todos los estados de turno
  getAll = async (req, res) => {
    try {
      const estados = await EstadosTurnoModel.getAll()
      return res.json(estados)
    } catch (error) {
      console.error('Error al obtener todos los estados de turno:', error)
      return res.status(500).json({ error: 'Error interno del servidor al obtener los estados de turno' })
    }
  }

  // Obtener un estado de turno por ID
  getById = async (req, res) => {
    try {
      const { id } = req.params
      const estado = await EstadosTurnoModel.getById({ id })

      if (!estado) {
        return res.status(404).json({ error: 'Estado de turno no encontrado' })
      }

      return res.json(estado)
    } catch (error) {
      console.error('Error al obtener el estado de turno por ID:', error)
      return res.status(500).json({ error: 'Error interno del servidor al obtener el estado de turno' })
    }
  }

  // Crear un nuevo estado de turno
  create = async (req, res) => {
    try {
      const result = validateEstadoTurno(req.body)
      if (!result.success) {
        return res.status(422).json({ error: result.error.issues })
      }

      const createdEstado = await EstadosTurnoModel.create({ input: result.data })
      return res.status(201).json({ created: createdEstado })
    } catch (error) {
      console.error('Error al crear el estado de turno:', error)
      return res.status(500).json({ error: 'Error interno del servidor al crear el estado de turno' })
    }
  }

  // Desactivar un estado de turno
  deactivate = async (req, res) => {
    try {
      const { id } = req.params
      const result = await EstadosTurnoModel.deactivate({ id })

      if (!result) {
        return res.status(404).json({ error: 'Estado de turno no encontrado' })
      }

      return res.status(200).json({ message: 'Estado de turno desactivado' })
    } catch (error) {
      console.error('Error al desactivar el estado de turno:', error)
      return res.status(500).json({ error: 'Error interno del servidor al desactivar el estado de turno' })
    }
  }

  // Activar un estado de turno
  activate = async (req, res) => {
    try {
      const { id } = req.params
      const result = await EstadosTurnoModel.activate({ id })

      if (!result) {
        return res.status(404).json({ error: 'Estado de turno no encontrado' })
      }

      return res.status(200).json({ message: 'Estado de turno activado' })
    } catch (error) {
      console.error('Error al activar el estado de turno:', error)
      return res.status(500).json({ error: 'Error interno del servidor al activar el estado de turno' })
    }
  }

  // Modificar el nombre de un estado de turno
  updateNombre = async (req, res) => {
    try {
      const { id } = req.params
      const { nombre_estado } = req.body

      const result = validatePartialEstadoTurno({ nombre_estado })
      if (!result.success) {
        return res.status(422).json({ error: result.error.issues })
      }

      const updatedEstado = await EstadosTurnoModel.updateNombre({ id, nuevoNombre: nombre_estado })

      if (!updatedEstado) {
        return res.status(404).json({ error: 'Estado de turno no encontrado' })
      }

      return res.json({ updated: updatedEstado })
    } catch (error) {
      console.error('Error al actualizar el nombre del estado de turno:', error)
      return res.status(500).json({ error: 'Error interno del servidor al actualizar el nombre del estado de turno' })
    }
  }

  // Buscar estados de turno por nombre
  searchByName = async (req, res) => {
    try {
      const { nombre } = req.params
      const estados = await EstadosTurnoModel.searchByName({ nombre })
      return res.json(estados)
    } catch (error) {
      console.error('Error al buscar estados de turno por nombre:', error)
      return res.status(500).json({ error: 'Error interno del servidor al buscar estados de turno' })
    }
  }
}
