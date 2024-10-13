import { validateSucursal, validatePartialSucursal } from './schemas/sucursal.schema.js'
import { SucursalModel } from '../models/sucursal.model.js'

export class SucursalController {
  // Método para obtener todas las sucursales activas
  getAll = async (req, res) => {
    try {
      const sucursales = await SucursalModel.getAll()
      return res.json(sucursales)
    } catch (error) {
      console.error('Error al obtener todas las sucursales:', error)
      return res.status(500).json({ error: 'Error interno del servidor al obtener las sucursales' })
    }
  }

  // Método para obtener una sucursal por su ID
  getById = async (req, res) => {
    try {
      const { id } = req.params
      const sucursal = await SucursalModel.getById({ id })

      if (!sucursal) {
        return res.status(404).json({ error: 'Sucursal no encontrada' })
      }

      return res.json(sucursal)
    } catch (error) {
      console.error('Error al obtener la sucursal por ID:', error)
      return res.status(500).json({ error: 'Error interno del servidor al obtener la sucursal' })
    }
  }

  // Método para crear una nueva sucursal
  create = async (req, res) => {
    try {
      const result = validateSucursal(req.body)

      if (!result.success) {
        return res.status(422).json({ error: result.error.issues })
      }

      const createdSucursal = await SucursalModel.create({ input: result.data })
      return res.status(201).json({ created: createdSucursal })
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        console.error('Error al crear la sucursal: Entrada duplicada:', error)
        return res.status(409).json({ error: 'El nombre o email de la sucursal ya están en uso' })
      }

      console.error('Error al crear la sucursal:', error)
      return res.status(500).json({ error: 'Error interno del servidor al crear la sucursal' })
    }
  }

  // Método para desactivar una sucursal
  deactivate = async (req, res) => {
    try {
      const { id } = req.params
      const result = await SucursalModel.deactivate({ id })

      if (!result) {
        return res.status(404).json({ error: 'Sucursal no encontrada' })
      }

      return res.status(200).json({ message: 'Sucursal desactivada' })
    } catch (error) {
      console.error('Error al desactivar la sucursal:', error)
      return res.status(500).json({ error: 'Error interno del servidor al desactivar la sucursal' })
    }
  }

  // Método para activar una sucursal
  activate = async (req, res) => {
    try {
      const { id } = req.params
      const result = await SucursalModel.activate({ id })

      if (!result) {
        return res.status(404).json({ error: 'Sucursal no encontrada' })
      }

      return res.status(200).json({ message: 'Sucursal activada' })
    } catch (error) {
      console.error('Error al activar la sucursal:', error)
      return res.status(500).json({ error: 'Error interno del servidor al activar la sucursal' })
    }
  }

  // Método para actualizar parcialmente una sucursal
  partiallyUpdate = async (req, res) => {
    try {
      const result = validatePartialSucursal(req.body)

      if (!result.success) {
        return res.status(422).json({ error: result.error.issues })
      }

      const { id } = req.params
      const updatedSucursal = await SucursalModel.partiallyUpdate({ id, input: result.data })

      if (!updatedSucursal) {
        return res.status(404).json({ error: 'Sucursal no encontrada o sin cambios' })
      }

      return res.json({ updated: updatedSucursal })
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        console.error('Error al actualizar la sucursal: Entrada duplicada:', error)
        return res.status(409).json({ error: 'El nombre o email de la sucursal ya están en uso' })
      }

      console.error('Error al actualizar la sucursal:', error)
      return res.status(500).json({ error: 'Error interno del servidor al actualizar la sucursal' })
    }
  }

  // Método para obtener una sucursal por nombre
  getByNombre = async (req, res) => {
    const { nombre } = req.params

    try {
      const result = validatePartialSucursal({ nombre })

      if (!result.success) {
        return res.status(422).json({ error: result.error.issues })
      }

      const sucursal = await SucursalModel.getByNombre({ nombre })

      if (!sucursal) {
        return res.status(404).json({ error: 'Sucursal no encontrada por nombre' })
      }

      return res.json(sucursal)
    } catch (error) {
      console.error('Error al obtener la sucursal por nombre:', error)
      return res.status(500).json({ error: 'Error interno del servidor al obtener la sucursal' })
    }
  }
}
