import { validateClasificacionConsulta, validatePartialClasificacionConsulta } from './schemas/clasificacion_consulta.schema.js'
import { ClasificacionConsultaModel } from '../models/clasificacion_consulta.model.js'

export class ClasificacionConsultaController {
  // Obtener todas las clasificaciones
  getAll = async (req, res) => {
    try {
      const clasificaciones = await ClasificacionConsultaModel.getAll()
      return res.json(clasificaciones)
    } catch (error) {
      console.error('Error al obtener todas las clasificaciones:', error)
      return res.status(500).json({ error: 'Error interno del servidor al obtener las clasificaciones' })
    }
  }

  // Obtener una clasificación por ID
  getById = async (req, res) => {
    try {
      const { id } = req.params
      const clasificacion = await ClasificacionConsultaModel.getById({ id })

      if (!clasificacion) {
        return res.status(404).json({ error: 'Clasificación no encontrada' })
      }

      return res.json(clasificacion)
    } catch (error) {
      console.error('Error al obtener la clasificación por ID:', error)
      return res.status(500).json({ error: 'Error interno del servidor al obtener la clasificación' })
    }
  }

  // Crear una nueva clasificación
  create = async (req, res) => {
    try {
      const result = validateClasificacionConsulta(req.body)
      if (!result.success) {
        return res.status(422).json({ error: result.error.issues })
      }

      const createdClasificacion = await ClasificacionConsultaModel.create({ input: result.data })
      return res.status(201).json({ created: createdClasificacion })
    } catch (error) {
      console.error('Error al crear la clasificación:', error)
      return res.status(500).json({ error: 'Error interno del servidor al crear la clasificación' })
    }
  }

  // Actualizar parcialmente una clasificación
  partiallyUpdate = async (req, res) => {
    try {
      const result = validatePartialClasificacionConsulta(req.body)

      if (result.error) {
        return res.status(422).json({ error: JSON.parse(result.error.message) })
      }

      const { id } = req.params

      const updatedClasificacion = await ClasificacionConsultaModel.partiallyUpdate({ id, input: result.data })

      if (!updatedClasificacion) {
        return res.status(404).json({ error: 'Clasificación no encontrada o sin cambios' })
      }

      return res.json({ updated: updatedClasificacion })
    } catch (error) {
      console.error('Error al actualizar la clasificación:', error)
      return res.status(500).json({ error: 'Error interno del servidor al actualizar la clasificación' })
    }
  }

  // Eliminar una clasificación
  delete = async (req, res) => {
    try {
      const { id } = req.params
      const result = await ClasificacionConsultaModel.delete({ id })

      if (!result) {
        return res.status(404).json({ error: 'Clasificación no encontrada' })
      }

      return res.status(200).json({ message: 'Clasificación eliminada' })
    } catch (error) {
      console.error('Error al eliminar la clasificación:', error)
      return res.status(500).json({ error: 'Error interno del servidor al eliminar la clasificación' })
    }
  }

  // Buscar clasificaciones por nombre
  getByNombre = async (req, res) => {
    try {
      const { nombre_clasificacion } = req.params
      const clasificaciones = await ClasificacionConsultaModel.getByNombre({ nombre_clasificacion })
      return res.json(clasificaciones)
    } catch (error) {
      console.error('Error al buscar clasificaciones por nombre:', error)
      return res.status(500).json({ error: 'Error interno del servidor al buscar clasificaciones por nombre' })
    }
  }
}
