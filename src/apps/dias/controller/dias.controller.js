import { validateDias, validatePartialDias } from './schemas/dias.schema.js'
import { DiasModel } from '../models/dias.model.js'

export class DiasController {
  // Obtener todos los días
  getAll = async (req, res) => {
    try {
      const dias = await DiasModel.getAll()
      return res.json(dias)
    } catch (error) {
      console.error('Error al obtener todos los días:', error)
      return res.status(500).json({ error: 'Error interno del servidor al obtener los días' })
    }
  }

  // Obtener un día por ID
  getById = async (req, res) => {
    try {
      const { id } = req.params
      const dia = await DiasModel.getById({ id })

      if (!dia) {
        return res.status(404).json({ error: 'Día no encontrado' })
      }

      return res.json(dia)
    } catch (error) {
      console.error('Error al obtener el día por ID:', error)
      return res.status(500).json({ error: 'Error interno del servidor al obtener el día' })
    }
  }

  // Crear un nuevo día
  create = async (req, res) => {
    try {
      const result = validateDias(req.body)
      if (!result.success) {
        return res.status(422).json({ error: result.error.issues })
      }

      const createdDia = await DiasModel.create({ input: result.data })
      return res.status(201).json({ created: createdDia })
    } catch (error) {
      console.error('Error al crear el día:', error)
      return res.status(500).json({ error: 'Error interno del servidor al crear el día' })
    }
  }

  // Actualizar un día por ID
  update = async (req, res) => {
    try {
      const result = validatePartialDias(req.body)

      if (result.error) {
        return res.status(422).json({ error: JSON.parse(result.error.message) })
      }

      const { id } = req.params
      const updatedDia = await DiasModel.update({ id, input: result.data })

      if (!updatedDia) {
        return res.status(404).json({ error: 'Día no encontrado o sin cambios' })
      }

      return res.json({ updated: updatedDia })
    } catch (error) {
      console.error('Error al actualizar el día:', error)
      return res.status(500).json({ error: 'Error interno del servidor al actualizar el día' })
    }
  }

  // Eliminar un día por ID
  delete = async (req, res) => {
    try {
      const { id } = req.params
      const result = await DiasModel.delete({ id })

      return res.json(result)
    } catch (error) {
      console.error('Error al eliminar el día:', error)
      return res.status(500).json({ error: 'Error interno del servidor al eliminar el día' })
    }
  }

  // Obtener un día por nombre
  getByNombre = async (req, res) => {
    try {
      const { dia } = req.params
      const dias = await DiasModel.getByNombre({ dia })
      return res.json(dias)
    } catch (error) {
      console.error('Error al buscar el día por nombre:', error)
      return res.status(500).json({ error: 'Error interno del servidor al buscar el día' })
    }
  }
}
