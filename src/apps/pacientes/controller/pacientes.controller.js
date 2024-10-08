import { validatePacientes, validatePartialPacientes } from './schemas/pacientes.schemas.js'
import { PacientesModel } from '../models/pacientes.model.js'

export class PacientesController {
  // Método para obtener todos los pacientes
  getAll = async (req, res) => {
    try {
      // Tratamos de conseguir todos los pacientes activos (estado = 1)
      const pacientes = await PacientesModel.getAll()
      return res.json(pacientes)
    } catch (error) {
      // Si algo falla, mostramos el error en la consola y respondemos con un error 500 (error interno del servidor)
      console.error('Error al obtener todos los pacientes:', error)
      return res.status(500).json({ error: 'Error interno del servidor al obtener los pacientes' })
    }
  }

  // Método para obtener un paciente por su ID
  getById = async (req, res) => {
    try {
      // Sacamos el id de los parámetros de la URL
      const { id } = req.params

      // Intentamos conseguir el paciente con ese id
      const paciente = await PacientesModel.getById({ id })

      if (!paciente) {
        // Si no existe, devolvemos un 404 (no encontrado)
        return res.status(404).json({ error: 'Paciente no encontrado' })
      }

      // Si todo salió bien, devolvemos el paciente
      return res.json(paciente)
    } catch (error) {
      // Si hay algún error, lo registramos y devolvemos error 500
      console.error('Error al obtener el paciente por ID:', error)
      return res.status(500).json({ error: 'Error interno del servidor al obtener el paciente' })
    }
  }

  // Método para crear un paciente nuevo
  create = async (req, res) => {
    try {
      // Primero validamos los datos que nos llegan del cuerpo de la solicitud (req.body)
      const result = validatePacientes(req.body)

      if (result.error) {
        // Si hay un error en la validación, devolvemos un 422 (entidad no procesable) con el mensaje del error
        return res.status(422).json({ error: JSON.parse(result.error.message) })
      }

      // Intentamos crear el paciente con los datos ya validados
      const createdPaciente = await PacientesModel.create({ input: result.data })
      return res.status(201).json({ created: createdPaciente })
    } catch (error) {
      // Si el error tiene que ver con que ya existe (id_usuario duplicado)
      if (error.code === 'ER_DUP_ENTRY') {
        console.error('Error al crear el paciente: Entrada duplicada:', error)
        return res.status(409).json({ error: 'Ya existe un paciente con el mismo número de usuario' })
      }

      // Para cualquier otro error, mostramos el mensaje y devolvemos error 500
      console.error('Error al crear el paciente:', error)
      return res.status(500).json({ error: 'Error interno del servidor al crear el paciente' })
    }
  }

  // Método para desactivar un paciente
  deactivate = async (req, res) => {
    try {
      // Obtenemos el id de los parámetros de la solicitud
      const { id } = req.params

      // Intentamos desactivar el paciente (ponemos estado = 0)
      const result = await PacientesModel.deactivate({ id })

      if (!result) {
        // Si no lo encontramos, devolvemos un 404
        return res.status(404).json({ error: 'Paciente no encontrado' })
      }

      return res.status(200).json({ message: 'Paciente desactivado' })
    } catch (error) {
      // Si algo falla, mostramos el error y respondemos con un error interno
      console.error('Error al desactivar el paciente:', error)
      return res.status(500).json({ error: 'Error interno del servidor al desactivar el paciente' })
    }
  }

  // Método para activar un paciente
  activate = async (req, res) => {
    try {
      // Sacamos el id de los parámetros de la solicitud
      const { id } = req.params

      // Intentamos activar el paciente (ponemos estado = 1)
      const result = await PacientesModel.activate({ id })

      if (!result) {
        // Si no lo encontramos, devolvemos un 404
        return res.status(404).json({ error: 'Paciente no encontrado' })
      }

      return res.status(200).json({ message: 'Paciente activado' })
    } catch (error) {
      // Si ocurre algún error, lo mostramos y devolvemos error interno
      console.error('Error al activar el paciente:', error)
      return res.status(500).json({ error: 'Error interno del servidor al activar el paciente' })
    }
  }

  // Método para actualizar parcialmente los datos de un paciente
  partiallyUpdate = async (req, res) => {
    try {
      // Validamos los datos que llegan para actualizar parcialmente al paciente
      const result = validatePartialPacientes(req.body)

      if (result.error) {
        // Si hay algún error en la validación, devolvemos un 422
        return res.status(422).json({ error: JSON.parse(result.error.message) })
      }

      // Sacamos el id de los parámetros de la solicitud
      const { id } = req.params

      // Intentamos actualizar el paciente con los datos validados
      const updatedPaciente = await PacientesModel.partiallyUpdate({ id, input: result.data })

      if (!updatedPaciente) {
        // Si no encontramos el paciente o no hay cambios, devolvemos un 404
        return res.status(404).json({ error: 'Paciente no encontrado o sin cambios' })
      }

      // Devolvemos el paciente actualizado
      return res.json({ updated: updatedPaciente })
    } catch (error) {
      // Si hay un error por un campo duplicado (id_usuario ya en uso)
      if (error.code === 'ER_DUP_ENTRY') {
        console.error('Error al actualizar el paciente: Entrada duplicada:', error)
        return res.status(409).json({ error: 'El id usuario ya se encuentra en uso' })
      }

      // Para cualquier otro error, mostramos el mensaje y respondemos con error interno
      console.error('Error al actualizar parcialmente el paciente:', error)
      return res.status(500).json({ error: 'Error interno del servidor al actualizar el paciente' })
    }
  }
}
