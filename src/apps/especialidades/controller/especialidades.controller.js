import { validateEspecialidades, validatePartialEspecialidades } from './schemas/especialidades.schema.js'
import { EspecialidadesModel } from '../models/especialidades.model.js'

export class EspecialidadesController {
  getAll = async (req, res) => {
    try {
      const especialidades = await EspecialidadesModel.getAll()
      return res.json(especialidades)
    } catch (error) {
      console.error('Error al obtener todas las especialidades:', error)
      return res.status(500).json({ error: 'Error interno del servidor al obtener las especialidades' })
    }
  }

  getById = async (req, res) => {
    try {
      const { id } = req.params
      const especialidad = await EspecialidadesModel.getById({ id })

      if (!especialidad) {
        return res.status(404).json({ error: 'Especialidad no encontrada' })
      }

      return res.json(especialidad)
    } catch (error) {
      console.error('Error al obtener la especialidad por ID:', error)
      return res.status(500).json({ error: 'Error interno del servidor al obtener la especialidad' })
    }
  }

  create = async (req, res) => {
    try {
      const result = validateEspecialidades(req.body)

      if (result.error) {
        return res.status(422).json({ error: JSON.parse(result.error.message) })
      }

      const createdEspecialidad = await EspecialidadesModel.create({ input: result.data })
      return res.status(201).json({ created: createdEspecialidad })
    } catch (error) {
      // Si el error es de clave duplicada
      if (error.message === 'La especialidad ya está registrada') {
        return res.status(409).json({ error: 'La especialidad ya está registrada' })
      }

      console.error('Error al crear la especialidad:', error)
      return res.status(500).json({ error: 'Error interno del servidor al crear la especialidad' })
    }
  }

  delete = async (req, res) => {
    try {
      const { id } = req.params
      const deletedEspecialidad = await EspecialidadesModel.delete({ id })

      if (!deletedEspecialidad) {
        return res.status(404).json({ error: 'Especialidad no encontrada' })
      }

      return res.status(200).json({ deleted: deletedEspecialidad })
    } catch (error) {
      console.error('Error al eliminar la especialidad:', error)
      return res.status(500).json({ error: 'Error interno del servidor al eliminar la especialidad' })
    }
  }

  partiallyUpdate = async (req, res) => {
    try {
      const result = validateEspecialidades(req.body)

      if (result.error) {
        return res.status(422).json({ error: JSON.parse(result.error.message) })
      }

      const { id } = req.params
      const updatedEspecialidad = await EspecialidadesModel.partiallyUpdate({ id, input: result.data })

      if (!updatedEspecialidad) {
        return res.status(404).json({ error: 'Especialidad no encontrada' })
      }

      return res.json({ updated: updatedEspecialidad })
    } catch (error) {
      console.error('Error al actualizar la especialidad:', error)
      return res.status(500).json({ error: 'Error interno del servidor al actualizar la especialidad' })
    }
  }
}
