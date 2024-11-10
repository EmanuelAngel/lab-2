import {
  validatePacientes,
  validatePartialPacientes,
  validatePacientesWithUser
}
  from './schemas/pacientes.schemas.js'

import { PacientesModel } from '../models/pacientes.model.js'

export class PacientesController {
  getAll = async (req, res) => {
    try {
      const pacientes = await PacientesModel.getAllWithUser()
      return res.json(pacientes)
    } catch (error) {
      console.error('Error al obtener todos los pacientes:', error)
      return res.status(500).json({ error: 'Error interno del servidor al obtener los pacientes' })
    }
  }

  getById = async (req, res) => {
    try {
      const { id } = req.params
      const paciente = await PacientesModel.getById({ id })

      if (!paciente) {
        return res.status(404).json({ error: 'Paciente no encontrado' })
      }

      return res.json(paciente)
    } catch (error) {
      console.error('Error al obtener el paciente por ID:', error)
      return res.status(500).json({ error: 'Error interno del servidor al obtener el paciente' })
    }
  }

  create = async (req, res) => {
    try {
      const result = validatePacientes(req.body)

      if (result.error) {
        return res.status(422).json({ error: JSON.parse(result.error.message) })
      }

      const createdPaciente = await PacientesModel.create({ input: result.data })
      return res.status(201).json({ created: createdPaciente })
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        console.error('Error al crear el paciente: Entrada duplicada:', error)
        return res.status(409).json({ error: 'Ya existe un paciente con el mismo número de usuario' })
      }

      console.error('Error al crear el paciente:', error)
      return res.status(500).json({ error: 'Error interno del servidor al crear el paciente' })
    }
  }

  deactivate = async (req, res) => {
    try {
      const { id } = req.params
      const result = await PacientesModel.deactivate({ id })

      if (!result) {
        return res.status(404).json({ error: 'Paciente no encontrado' })
      }

      return res.status(200).json({ message: 'Paciente desactivado' })
    } catch (error) {
      console.error('Error al desactivar el paciente:', error)
      return res.status(500).json({ error: 'Error interno del servidor al desactivar el paciente' })
    }
  }

  activate = async (req, res) => {
    try {
      const { id } = req.params
      const result = await PacientesModel.activate({ id })

      if (!result) {
        return res.status(404).json({ error: 'Paciente no encontrado' })
      }

      return res.status(200).json({ message: 'Paciente activado' })
    } catch (error) {
      console.error('Error al activar el paciente:', error)
      return res.status(500).json({ error: 'Error interno del servidor al activar el paciente' })
    }
  }

  partiallyUpdate = async (req, res) => {
    try {
      const result = validatePartialPacientes(req.body)

      if (result.error) {
        return res.status(422).json({ error: JSON.parse(result.error.message) })
      }

      const { id } = req.params
      const updatedPaciente = await PacientesModel.partiallyUpdate({ id, input: result.data })

      if (!updatedPaciente) {
        return res.status(404).json({ error: 'Paciente no encontrado o sin cambios' })
      }

      return res.json({ updated: updatedPaciente })
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        console.error('Error al actualizar el paciente: Entrada duplicada:', error)
        return res.status(409).json({ error: 'El id usuario ya se encuentra en uso' })
      }

      console.error('Error al actualizar parcialmente el paciente:', error)
      return res.status(500).json({ error: 'Error interno del servidor al actualizar el paciente' })
    }
  }

  getByObraSocial = async (req, res) => {
    try {
      const { tiene_obra_social } = req.params
      const pacientes = await PacientesModel.getByObraSocial({ tiene_obra_social })

      if (!pacientes.length) {
        return res.status(404).json({ error: 'No se encontraron pacientes con la obra social especificada' })
      }

      return res.json(pacientes)
    } catch (error) {
      console.error('Error al obtener pacientes por obra social:', error)
      return res.status(500).json({ error: 'Error interno del servidor al obtener pacientes por obra social' })
    }
  }

  getByUsuario = async (req, res) => {
    try {
      const { id_usuario } = req.params
      const pacientes = await PacientesModel.getByUsuario({ id_usuario })

      if (!pacientes.length) {
        return res.status(404).json({ error: 'No se encontraron pacientes con el usuario especificado' })
      }

      return res.json(pacientes)
    } catch (error) {
      console.error('Error al obtener pacientes por usuario:', error)
      return res.status(500).json({ error: 'Error interno del servidor al obtener pacientes por usuario' })
    }
  }

  createWithUser = async (req, res) => {
    try {
      // Validamos el cuerpo de la solicitud
      const result = validatePacientesWithUser(req.body)
      if (result.error) {
        return res.status(422).json({ error: JSON.parse(result.error.message) })
      }

      // Intentamos crear un nuevo paciente
      const createdPaciente = await PacientesModel.createWithUser({
        input: result.data
      })

      return res.status(201).json({ created: createdPaciente })
    } catch (error) {
      // Si se produce un error específico de entrada duplicada
      if (error.code === 'ER_DUP_ENTRY') {
        console.error('Error al crear el paciente: Entrada duplicada:', error)
        return res.status(409).json({
          error: 'El nombre de usuario ingresado ya está registrado en el sistema'
        })
      }

      // Si ocurre otro tipo de error, lo registramos y respondemos
      console.error('Error al crear el paciente:', error)
      return res.status(500).json({
        error: 'Error interno del servidor al crear el paciente'
      })
    }
  }
}
