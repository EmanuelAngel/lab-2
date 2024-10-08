import { validateRole, validatePartialRole } from './schemas/roles.schema.js'
import { RolesModel } from '../models/roles.model.js'

export class RolesController {
  // Método para obtener todos los roles
  getAll = async (req, res) => {
    try {
      // Conseguimos todos los roles
      const roles = await RolesModel.getAll()
      return res.json(roles)
    } catch (error) {
      console.error('Error al obtener todos los roles:', error)
      return res.status(500).json({ error: 'Error interno del servidor al obtener los roles' })
    }
  }

  // Método para obtener un rol por su ID
  getById = async (req, res) => {
    try {
      const { id } = req.params
      const role = await RolesModel.getById({ id })

      if (!role) {
        return res.status(404).json({ error: 'Rol no encontrado' })
      }

      return res.json(role)
    } catch (error) {
      console.error('Error al obtener el rol por ID:', error)
      return res.status(500).json({ error: 'Error interno del servidor al obtener el rol' })
    }
  }

  // Método para crear un nuevo rol
  create = async (req, res) => {
    try {
      // Validamos los datos de la solicitud
      const result = validateRole(req.body)

      if (result.error) {
        return res.status(422).json({ error: JSON.parse(result.error.message) })
      }

      // Intentamos crear el rol con los datos validados
      const createdRole = await RolesModel.create({ input: result.data })
      return res.status(201).json({ created: createdRole })
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        console.error('Error al crear el rol: Entrada duplicada:', error)
        return res.status(409).json({ error: 'Ya existe un rol con el mismo nombre' })
      }

      console.error('Error al crear el rol:', error)
      return res.status(500).json({ error: 'Error interno del servidor al crear el rol' })
    }
  }

  // Método para actualizar un rol
  partiallyUpdate = async (req, res) => {
    try {
      const result = validatePartialRole(req.body)

      if (result.error) {
        return res.status(422).json({ error: JSON.parse(result.error.message) })
      }

      const { id } = req.params
      const updatedRole = await RolesModel.partiallyUpdate({ id, input: result.data })

      if (!updatedRole) {
        return res.status(404).json({ error: 'Rol no encontrado o sin cambios' })
      }

      return res.json({ updated: updatedRole })
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        console.error('Error al actualizar el rol: Entrada duplicada:', error)
        return res.status(409).json({ error: 'El nombre del rol ya se encuentra en uso' })
      }

      console.error('Error al actualizar parcialmente el rol:', error)
      return res.status(500).json({ error: 'Error interno del servidor al actualizar el rol' })
    }
  }

  // Método para desactivar un rol
  deactivate = async (req, res) => {
    try {
      const { id } = req.params
      const result = await RolesModel.deactivate({ id })

      if (!result) {
        return res.status(404).json({ error: 'Rol no encontrado' })
      }

      return res.status(200).json({ message: 'Rol desactivado' })
    } catch (error) {
      console.error('Error al desactivar el rol:', error)
      return res.status(500).json({ error: 'Error interno del servidor al desactivar el rol' })
    }
  }
}
