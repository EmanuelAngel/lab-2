import { validateObraSocialPaciente, validatePartialObraSocialPaciente } from './schemas/obra_social_paciente.schema.js'
import { ObraSocialPacienteModel } from '../models/obra_social_paciente.model.js'

export class ObraSocialPacienteController {
  // Obtener todas las obras sociales de pacientes
  getAll = async (req, res) => {
    try {
      const obrasSocialesPacientes = await ObraSocialPacienteModel.getAll()
      return res.json(obrasSocialesPacientes)
    } catch (error) {
      console.error('Error al obtener todas las obras sociales de pacientes:', error)
      return res.status(500).json({ error: 'Error interno del servidor al obtener las obras sociales de pacientes' })
    }
  }

  // Obtener una obra social específica de un paciente por ID
  getById = async (req, res) => {
    try {
      const { id_paciente, id_obra_social } = req.params // Asegúrate de que id_obra_social esté en los parámetros
      const obraSocialPaciente = await ObraSocialPacienteModel.getById({ idPaciente: id_paciente, idObraSocial: id_obra_social })

      if (!obraSocialPaciente) {
        return res.status(404).json({ error: 'Obra social del paciente no encontrada' })
      }

      return res.json(obraSocialPaciente)
    } catch (error) {
      console.error('Error al obtener la obra social del paciente por ID:', error)
      return res.status(500).json({ error: 'Error interno del servidor al obtener la obra social del paciente' })
    }
  }

  // Obtener las obras sociales activas de un paciente
  getByPaciente = async (req, res) => {
    try {
      const { id_paciente } = req.params
      const obrasSociales = await ObraSocialPacienteModel.getByPaciente({ id_paciente })

      if (!obrasSociales.length) {
        return res.status(404).json({ error: 'No se encontraron obras sociales para este paciente' })
      }

      return res.json(obrasSociales)
    } catch (error) {
      console.error('Error al obtener las obras sociales del paciente:', error)
      return res.status(500).json({ error: 'Error interno del servidor al obtener las obras sociales del paciente' })
    }
  }

  // Obtener los pacientes con una obra social activa
  getByObraSocial = async (req, res) => {
    try {
      const { id_obra_social } = req.params
      const pacientes = await ObraSocialPacienteModel.getByObraSocial({ id_obra_social })

      if (!pacientes.length) {
        return res.status(404).json({ error: 'No se encontraron pacientes para esta obra social' })
      }

      return res.json(pacientes)
    } catch (error) {
      console.error('Error al obtener los pacientes con la obra social:', error)
      return res.status(500).json({ error: 'Error interno del servidor al obtener los pacientes con la obra social' })
    }
  }

  // Crear una nueva relación obra social-paciente
  create = async (req, res) => {
    try {
      const result = validateObraSocialPaciente(req.body)

      if (result.error) {
        return res.status(422).json({ error: JSON.parse(result.error.message) })
      }

      const createdObraSocialPaciente = await ObraSocialPacienteModel.create({ input: result.data })
      return res.status(201).json({ created: createdObraSocialPaciente })
    } catch (error) {
      if (error.message === 'La obra social ya está asociada al paciente') {
        return res.status(409).json({ error: 'La obra social ya está asociada al paciente' })
      }

      console.error('Error al crear la obra social del paciente:', error)
      return res.status(500).json({ error: 'Error interno del servidor al crear la obra social del paciente' })
    }
  }

  // Desactivar una relación obra social-paciente
  deactivate = async (req, res) => {
    try {
      const { id_paciente, id_obra_social } = req.params
      const result = await ObraSocialPacienteModel.deactivate({ idPaciente: id_paciente, idObraSocial: id_obra_social })

      if (!result) {
        return res.status(404).json({ error: 'Obra social del paciente no encontrada' })
      }

      return res.status(200).json({ message: 'Obra social del paciente desactivada' })
    } catch (error) {
      console.error('Error al desactivar la obra social del paciente:', error)
      return res.status(500).json({ error: 'Error interno del servidor al desactivar la obra social del paciente' })
    }
  }

  // Activar una relación obra social-paciente
  activate = async (req, res) => {
    try {
      const { id_paciente, id_obra_social } = req.params
      const result = await ObraSocialPacienteModel.activate({ idPaciente: id_paciente, idObraSocial: id_obra_social })

      if (!result) {
        return res.status(404).json({ error: 'Obra social del paciente no encontrada' })
      }

      return res.status(200).json({ message: 'Obra social del paciente activada' })
    } catch (error) {
      console.error('Error al activar la obra social del paciente:', error)
      return res.status(500).json({ error: 'Error interno del servidor al activar la obra social del paciente' })
    }
  }

  // Actualizar parcialmente una relación obra social-paciente
  partiallyUpdate = async (req, res) => {
    try {
      const result = validatePartialObraSocialPaciente(req.body)

      if (result.error) {
        return res.status(422).json({ error: JSON.parse(result.error.message) })
      }

      const { id_paciente, id_obra_social } = req.params
      const updatedObraSocialPaciente = await ObraSocialPacienteModel.partiallyUpdate({ idPaciente: id_paciente, idObraSocial: id_obra_social, input: result.data })

      if (!updatedObraSocialPaciente) {
        return res.status(404).json({ error: 'Obra social del paciente no encontrada o sin cambios' })
      }

      return res.json({ updated: updatedObraSocialPaciente })
    } catch (error) {
      console.error('Error al actualizar parcialmente la obra social del paciente:', error)
      return res.status(500).json({ error: 'Error interno del servidor al actualizar la obra social del paciente' })
    }
  }
}
