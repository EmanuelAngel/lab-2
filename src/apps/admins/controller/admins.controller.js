import { validateAdmin, validatePartialAdmin } from './schemas/admins.schema.js'
import { AdminsModel } from '../models/admins.model.js'

export class AdminsController {
  // Método para obtener todos los administradores activos
  getAll = async (req, res) => {
    try {
      // Conseguimos todos los administradores activos (estado = 1)
      const admins = await AdminsModel.getAll()
      return res.json(admins)
    } catch (error) {
      console.error('Error al obtener todos los administradores:', error)
      return res.status(500).json({ error: 'Error interno del servidor al obtener los administradores' })
    }
  }

  // Método para obtener un administrador por su ID
  getById = async (req, res) => {
    try {
      const { id } = req.params
      const admin = await AdminsModel.getById({ id })

      if (!admin) {
        return res.status(404).json({ error: 'Administrador no encontrado' })
      }

      return res.json(admin)
    } catch (error) {
      console.error('Error al obtener el administrador por ID:', error)
      return res.status(500).json({ error: 'Error interno del servidor al obtener el administrador' })
    }
  }

  // Método para crear un nuevo administrador
  create = async (req, res) => {
    try {
      // Validamos los datos de la solicitud
      const result = validateAdmin(req.body)

      if (result.error) {
        return res.status(422).json({ error: JSON.parse(result.error.message) })
      }

      // Intentamos crear el administrador con los datos validados
      const createdAdmin = await AdminsModel.create({ input: result.data })
      return res.status(201).json({ created: createdAdmin })
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        console.error('Error al crear el administrador: Entrada duplicada:', error)
        return res.status(409).json({ error: 'Ya existe un administrador con el mismo número de usuario' })
      }

      console.error('Error al crear el administrador:', error)
      return res.status(500).json({ error: 'Error interno del servidor al crear el administrador' })
    }
  }

  // Método para desactivar un administrador
  deactivate = async (req, res) => {
    try {
      const { id } = req.params
      const result = await AdminsModel.deactivate({ id })

      if (!result) {
        return res.status(404).json({ error: 'Administrador no encontrado' })
      }

      return res.status(200).json({ message: 'Administrador desactivado' })
    } catch (error) {
      console.error('Error al desactivar el administrador:', error)
      return res.status(500).json({ error: 'Error interno del servidor al desactivar el administrador' })
    }
  }

  // Método para activar un administrador
  activate = async (req, res) => {
    try {
      const { id } = req.params
      const result = await AdminsModel.activate({ id })

      if (!result) {
        return res.status(404).json({ error: 'Administrador no encontrado' })
      }

      return res.status(200).json({ message: 'Administrador activado' })
    } catch (error) {
      console.error('Error al activar el administrador:', error)
      return res.status(500).json({ error: 'Error interno del servidor al activar el administrador' })
    }
  }

  // Método para actualizar parcialmente los datos de un administrador
  partiallyUpdate = async (req, res) => {
    try {
      const result = validatePartialAdmin(req.body)

      if (result.error) {
        return res.status(422).json({ error: JSON.parse(result.error.message) })
      }

      const { id } = req.params
      const updatedAdmin = await AdminsModel.partiallyUpdate({ id, input: result.data })

      if (!updatedAdmin) {
        return res.status(404).json({ error: 'Administrador no encontrado o sin cambios' })
      }

      return res.json({ updated: updatedAdmin })
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        console.error('Error al actualizar el administrador: Entrada duplicada:', error)
        return res.status(409).json({ error: 'El id usuario ya se encuentra en uso' })
      }

      console.error('Error al actualizar parcialmente el administrador:', error)
      return res.status(500).json({ error: 'Error interno del servidor al actualizar el administrador' })
    }
  }
}
