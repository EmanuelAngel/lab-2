import { validateSecre, validatePartialSecre } from './schemas/secre.schema.js'
import { SecreModel } from '../models/secre.model.js'

export class SecreController {
  // Método para obtener todas las secretarias activas
  getAll = async (req, res) => {
    try {
      // Conseguimos todas las secretarias activas (estado = 1)
      const secretarias = await SecreModel.getAll()
      return res.json(secretarias)
    } catch (error) {
      console.error('Error al obtener todas las secretarias:', error)
      return res.status(500).json({ error: 'Error interno del servidor al obtener las secretarias' })
    }
  }

  // Método para obtener una secretaria por su ID
  getById = async (req, res) => {
    try {
      const { id } = req.params
      const secretaria = await SecreModel.getById({ id })

      if (!secretaria) {
        return res.status(404).json({ error: 'Secretaria no encontrada' })
      }

      return res.json(secretaria)
    } catch (error) {
      console.error('Error al obtener la secretaria por ID:', error)
      return res.status(500).json({ error: 'Error interno del servidor al obtener la secretaria' })
    }
  }

  // Método para crear una nueva secretaria
  create = async (req, res) => {
    try {
      // Validamos los datos de la solicitud
      const result = validateSecre(req.body)

      if (result.error) {
        return res.status(422).json({ error: JSON.parse(result.error.message) })
      }

      // Intentamos crear la secretaria con los datos validados
      const createdSecre = await SecreModel.create({ input: result.data })
      return res.status(201).json({ created: createdSecre })
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        console.error('Error al crear la secretaria: Entrada duplicada:', error)
        return res.status(409).json({ error: 'Ya existe una secretaria con el mismo número de usuario' })
      }

      console.error('Error al crear la secretaria:', error)
      return res.status(500).json({ error: 'Error interno del servidor al crear la secretaria' })
    }
  }

  // Método para desactivar una secretaria
  deactivate = async (req, res) => {
    try {
      const { id } = req.params
      const result = await SecreModel.deactivate({ id })

      if (!result) {
        return res.status(404).json({ error: 'Secretaria no encontrada' })
      }

      return res.status(200).json({ message: 'Secretaria desactivada' })
    } catch (error) {
      console.error('Error al desactivar la secretaria:', error)
      return res.status(500).json({ error: 'Error interno del servidor al desactivar la secretaria' })
    }
  }

  // Método para activar una secretaria
  activate = async (req, res) => {
    try {
      const { id } = req.params
      const result = await SecreModel.activate({ id })

      if (!result) {
        return res.status(404).json({ error: 'Secretaria no encontrada' })
      }

      return res.status(200).json({ message: 'Secretaria activada' })
    } catch (error) {
      console.error('Error al activar la secretaria:', error)
      return res.status(500).json({ error: 'Error interno del servidor al activar la secretaria' })
    }
  }

  // Método para actualizar parcialmente los datos de una secretaria
  partiallyUpdate = async (req, res) => {
    try {
      const result = validatePartialSecre(req.body)

      if (result.error) {
        return res.status(422).json({ error: JSON.parse(result.error.message) })
      }

      const { id } = req.params
      const updatedSecre = await SecreModel.partiallyUpdate({ id, input: result.data })

      if (!updatedSecre) {
        return res.status(404).json({ error: 'Secretaria no encontrada o sin cambios' })
      }

      return res.json({ updated: updatedSecre })
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        console.error('Error al actualizar la secretaria: Entrada duplicada:', error)
        return res.status(409).json({ error: 'El id usuario ya se encuentra en uso' })
      }

      console.error('Error al actualizar parcialmente la secretaria:', error)
      return res.status(500).json({ error: 'Error interno del servidor al actualizar la secretaria' })
    }
  }
}
