import { validateEspecialidadesProfesional, validatePartialEspecialidadesProfesional } from './schemas/especialidades_profesional.schema.js'
import { EspecialidadesProfesionalModel } from '../models/especialidades_profesional.model.js'

export class EspecialidadesProfesionalController {
  getAll = async (req, res) => {
    try {
      const especialidadesProfesionales = await EspecialidadesProfesionalModel.getAll()
      return res.json(especialidadesProfesionales)
    } catch (error) {
      console.error('Error al obtener todas las relaciones especialidad-profesional:', error)
      return res.status(500).json({ error: 'Error interno del servidor al obtener las relaciones especialidad-profesional' })
    }
  }

  getById = async (req, res) => {
    try {
      const { id_profesional, id_especialidad } = req.params
      const especialidadProfesional = await EspecialidadesProfesionalModel.getById({ id_profesional, id_especialidad })

      if (!especialidadProfesional) {
        return res.status(404).json({ error: 'Relación especialidad-profesional no encontrada' })
      }

      return res.json(especialidadProfesional)
    } catch (error) {
      console.error('Error al obtener la relación especialidad-profesional por ID:', error)
      return res.status(500).json({ error: 'Error interno del servidor al obtener la relación especialidad-profesional' })
    }
  }

  create = async (req, res) => {
    try {
      const result = validateEspecialidadesProfesional(req.body)

      if (!result.success) {
        return res.status(422).json({ error: result.error.issues })
      }

      const createdEspecialidadProfesional = await EspecialidadesProfesionalModel.create({ input: result.data })
      return res.status(201).json({ created: createdEspecialidadProfesional })
    } catch (error) {
      if (error.message === 'La relación especialidad-profesional ya existe') {
        return res.status(409).json({ error: 'La relación especialidad-profesional ya está registrada' })
      }

      console.error('Error al crear la relación especialidad-profesional:', error)
      return res.status(500).json({ error: 'Error interno del servidor al crear la relación especialidad-profesional' })
    }
  }

  deactivate = async (req, res) => {
    try {
      const { id_profesional, id_especialidad } = req.params
      const result = await EspecialidadesProfesionalModel.deactivate({ id_profesional, id_especialidad })

      if (!result) {
        return res.status(404).json({ error: 'Relación especialidad-profesional no encontrada' })
      }

      return res.status(200).json({ message: 'Relación especialidad-profesional desactivada' })
    } catch (error) {
      console.error('Error al desactivar la relación especialidad-profesional:', error)
      return res.status(500).json({ error: 'Error interno del servidor al desactivar la relación especialidad-profesional' })
    }
  }

  activate = async (req, res) => {
    try {
      const { id_profesional, id_especialidad } = req.params
      const result = await EspecialidadesProfesionalModel.activate({ id_profesional, id_especialidad })

      if (!result) {
        return res.status(404).json({ error: 'Relación especialidad-profesional no encontrada' })
      }

      return res.status(200).json({ message: 'Relación especialidad-profesional activada' })
    } catch (error) {
      console.error('Error al activar la relación especialidad-profesional:', error)
      return res.status(500).json({ error: 'Error interno del servidor al activar la relación especialidad-profesional' })
    }
  }

  partiallyUpdate = async (req, res) => {
    try {
      const result = validatePartialEspecialidadesProfesional(req.body)

      if (!result.success) {
        return res.status(422).json({ error: result.error.issues })
      }

      const { id_profesional, id_especialidad } = req.params
      const updatedEspecialidadProfesional = await EspecialidadesProfesionalModel.partiallyUpdate({ id_profesional, id_especialidad, input: result.data })

      if (!updatedEspecialidadProfesional) {
        return res.status(404).json({ error: 'Relación especialidad-profesional no encontrada o sin cambios' })
      }

      return res.json({ updated: updatedEspecialidadProfesional })
    } catch (error) {
      console.error('Error al actualizar parcialmente la relación especialidad-profesional:', error)
      return res.status(500).json({ error: 'Error interno del servidor al actualizar la relación especialidad-profesional' })
    }
  }

  // Obtener todas las especialidades de un profesional
  getByProfesional = async (req, res) => {
    try {
      const { id_profesional } = req.params
      const especialidades = await EspecialidadesProfesionalModel.getByProfesional({ id_profesional })

      if (!especialidades.length) {
        return res.status(404).json({ error: 'No se encontraron especialidades para este profesional' })
      }

      return res.json(especialidades)
    } catch (error) {
      console.error('Error al obtener las especialidades del profesional:', error)
      return res.status(500).json({ error: 'Error interno del servidor al obtener las especialidades del profesional' })
    }
  }

  // Obtener todos los profesionales que tienen una especialidad asignada
  getByEspecialidad = async (req, res) => {
    try {
      const { id_especialidad } = req.params
      const profesionales = await EspecialidadesProfesionalModel.getByEspecialidad({ id_especialidad })

      if (!profesionales.length) {
        return res.status(404).json({ error: 'No se encontraron profesionales para esta especialidad' })
      }

      return res.json(profesionales)
    } catch (error) {
      console.error('Error al obtener los profesionales con la especialidad:', error)
      return res.status(500).json({ error: 'Error interno del servidor al obtener los profesionales con la especialidad' })
    }
  }

  getByMatricula = async (req, res) => {
    try {
      const { matricula } = req.params
      const especialidadProfesional = await EspecialidadesProfesionalModel.getByMatricula({ matricula })

      if (!especialidadProfesional) {
        return res.status(404).json({ error: 'Relación especialidad-profesional no encontrada para esta matrícula' })
      }

      return res.json(especialidadProfesional)
    } catch (error) {
      console.error('Error al obtener la relación especialidad-profesional por matrícula:', error)
      return res.status(500).json({ error: 'Error interno del servidor al obtener la relación especialidad-profesional por matrícula' })
    }
  }
}
