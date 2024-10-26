import {
  validatePartialProfesionales,
  validateProfesionales,
  validateProfesionalesWithUser,
  validatePartialProfesionalesWithUser
}
  from './schemas/profesionales.schema.js'
import { ProfesionalesModel } from '../models/profesionales.model.js'

export class ProfesionalesController {
  getAll = async (req, res) => {
    try {
      // Intentamos obtener todos los profesionales
      const profesionales = await ProfesionalesModel.getAllWithUser()
      return res.json(profesionales)
    } catch (error) {
      // Si ocurre un error, registramos y enviamos una respuesta de error
      console.error('Error al obtener todos los profesionales:', error)
      return res.status(500).json({ error: 'Error interno del servidor al obtener los profesionales' })
    }
  }

  getById = async (req, res) => {
    try {
      // Obtenemos el ID de los parámetros de la solicitud
      const { id } = req.params

      // Intentamos obtener un profesional por su ID
      const profesional = await ProfesionalesModel.getById({ id })

      if (!profesional) {
        // Si no se encuentra el profesional, devolvemos un 404
        return res.status(404).json({ error: 'Profesional no encontrado' })
      }

      return res.json(profesional)
    } catch (error) {
      // Si ocurre un error, lo registramos y respondemos con un error
      console.error('Error al obtener el profesional por ID:', error)
      return res.status(500).json({ error: 'Error interno del servidor al obtener el profesional' })
    }
  }

  create = async (req, res) => {
    try {
      // Validamos el cuerpo de la solicitud
      const result = validateProfesionales(req.body)

      if (result.error) {
        return res.status(422).json({ error: JSON.parse(result.error.message) })
      }

      // Intentamos crear un nuevo profesional
      const createdProfesional = await ProfesionalesModel.create({ input: result.data })
      return res.status(201).json({ created: createdProfesional })
    } catch (error) {
      // Si se produce un error específico de entrada duplicada
      if (error.code === 'ER_DUP_ENTRY') {
        console.error('Error al crear el profesional: Entrada duplicada:', error)
        return res.status(409).json({ error: 'El profesional ya existe con el mismo número de documento' })
      }

      // Si ocurre otro tipo de error, lo registramos y respondemos
      console.error('Error al crear el profesional:', error)
      return res.status(500).json({ error: 'Error interno del servidor al crear el profesional' })
    }
  }

  deactivate = async (req, res) => {
    try {
      // Obtenemos el ID de los parámetros de la solicitud
      const { id } = req.params

      // Intentamos desactivar el profesional
      const result = await ProfesionalesModel.deactivate({ id })

      if (!result) {
        // Si no se encuentra el profesional, devolvemos un 404
        return res.status(404).json({ error: 'Profesional no encontrado' })
      }

      return res.status(200).json({ message: 'Profesional desactivado' })
    } catch (error) {
      // Si ocurre un error, lo registramos y respondemos con un error
      console.error('Error al desactivar el profesional:', error)
      return res.status(500).json({ error: 'Error interno del servidor al desactivar el profesional' })
    }
  }

  activate = async (req, res) => {
    try {
      // Obtenemos el ID de los parámetros de la solicitud
      const { id } = req.params

      // Intentamos activar el profesional
      const result = await ProfesionalesModel.activate({ id })

      if (!result) {
        // Si no se encuentra el profesional, devolvemos un 404
        return res.status(404).json({ error: 'Profesional no encontrado' })
      }

      return res.status(200).json({ message: 'Profesional activado' })
    } catch (error) {
      // Si ocurre un error, lo registramos y respondemos con un error
      console.error('Error al activar el profesional:', error)
      return res.status(500).json({ error: 'Error interno del servidor al activar el profesional' })
    }
  }

  partiallyUpdate = async (req, res) => {
    try {
      // Validamos el cuerpo de la solicitud
      const result = validatePartialProfesionales(req.body)

      if (result.error) {
        return res.status(422).json({ error: JSON.parse(result.error.message) })
      }

      // Obtenemos el ID de los parámetros de la solicitud
      const { id } = req.params

      // Intentamos actualizar parcialmente el profesional
      const updatedProfesional = await ProfesionalesModel.partiallyUpdate({ id, input: result.data })

      if (!updatedProfesional) {
        // Si no se encuentra el profesional o no hay campos para actualizar, devolvemos un 404
        return res.status(404).json({ error: 'Profesional no encontrado o sin cambios' })
      }

      return res.json({ updated: updatedProfesional })
    } catch (error) {
      // Si se produce un error específico de entrada duplicada
      if (error.code === 'ER_DUP_ENTRY') {
        console.error('Error al actualizar el profesional: Entrada duplicada:', error)
        return res.status(409).json({ error: 'El número de documento ingresado ya está asociado a otro profesional' })
      }

      // Si ocurre otro tipo de error, lo registramos y respondemos
      console.error('Error al actualizar parcialmente el profesional:', error)
      return res.status(500).json({ error: 'Error interno del servidor al actualizar el profesional' })
    }
  }

  createWithUser = async (req, res) => {
    try {
      // Validamos el cuerpo de la solicitud
      const result = validateProfesionalesWithUser(req.body)

      if (result.error) {
        return res.status(422).json({ error: JSON.parse(result.error.message) })
      }

      // Intentamos crear un nuevo profesional
      const createdProfesional = await ProfesionalesModel.createWithUser({
        input: result.data
      })

      return res.status(201).json({ created: createdProfesional })
    } catch (error) {
      // Si se produce un error específico de entrada duplicada
      if (error.code === 'ER_DUP_ENTRY') {
        console.error('Error al crear el profesional: Entrada duplicada:', error)
        return res.status(409).json({
          error: 'El profesional ya existe con el mismo número de documento'
        })
      }

      // Si ocurre otro tipo de error, lo registramos y respondemos
      console.error('Error al crear el profesional:', error)
    }
  }

  updateWithUser = async (req, res) => {
    try {
      // Validamos el cuerpo de la solicitud
      const result = validatePartialProfesionalesWithUser(req.body)

      if (result.error) {
        return res.status(422).json({ error: JSON.parse(result.error.message) })
      }

      // Obtenemos el ID de los parámetros de la solicitud
      const { id } = req.params

      // Intentamos actualizar el profesional
      const updatedProfesional = await ProfesionalesModel.updateWithUser(
        { id, input: result.data }
      )

      if (!updatedProfesional) {
        // Si no se encuentra el profesional o no hay campos para actualizar, devolvemos un 404
        return res.status(404).json({ error: 'Profesional no encontrado o sin cambios' })
      }

      return res.json({ updated: updatedProfesional })
    } catch (error) {
      // Si se produce un error específico de entrada duplicada
      if (error.code === 'ER_DUP_ENTRY') {
        console.error('Error al actualizar el profesional: Entrada duplicada:', error)
        return res.status(409).json({
          error: 'El número de documento ingresado ya está asociado a otro profesional'
        })
      }

      // Si ocurre otro tipo de error, lo registramos y respondemos
      console.error('Error al actualizar el profesional:', error)
      return res.status(500).json({
        error: 'Error interno del servidor al actualizar el profesional'
      })
    }
  }
}
