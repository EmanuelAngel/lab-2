import { validateObraSocial, validatePartialObraSocial } from './schemas/obra_social.schema.js'
import { ObraSocialModel } from '../models/obra_social.model.js'

export class ObraSocialController {
  getAll = async (req, res) => {
    try {
      const obrasSociales = await ObraSocialModel.getAll()
      return res.json(obrasSociales)
    } catch (error) {
      console.error('Error al obtener todas las obras sociales:', error)
      return res.status(500).json({ error: 'Error interno del servidor al obtener las obras sociales' })
    }
  }

  getById = async (req, res) => {
    try {
      const { id } = req.params
      const obraSocial = await ObraSocialModel.getById({ id })

      if (!obraSocial) {
        return res.status(404).json({ error: 'Obra social no encontrada' })
      }

      return res.json(obraSocial)
    } catch (error) {
      console.error('Error al obtener la obra social por ID:', error)
      return res.status(500).json({ error: 'Error interno del servidor al obtener la obra social' })
    }
  }

  create = async (req, res) => {
    try {
      const result = validateObraSocial(req.body)

      if (result.error) {
        return res.status(422).json({ error: JSON.parse(result.error.message) })
      }

      const createdObraSocial = await ObraSocialModel.create({ input: result.data })
      return res.status(201).json({ created: createdObraSocial })
    } catch (error) {
      if (error.message === 'La obra social ya está registrada') {
        return res.status(409).json({ error: 'La obra social ya está registrada' })
      }

      console.error('Error al crear la obra social:', error)
      return res.status(500).json({ error: 'Error interno del servidor al crear la obra social' })
    }
  }

  deactivate = async (req, res) => {
    try {
      const { id } = req.params
      const result = await ObraSocialModel.deactivate({ id })

      if (!result) {
        return res.status(404).json({ error: 'Obra social no encontrada' })
      }

      return res.status(200).json({ message: 'Obra social desactivada' })
    } catch (error) {
      console.error('Error al desactivar la obra social:', error)
      return res.status(500).json({ error: 'Error interno del servidor al desactivar la obra social' })
    }
  }

  activate = async (req, res) => {
    try {
      const { id } = req.params
      const result = await ObraSocialModel.activate({ id })

      if (!result) {
        return res.status(404).json({ error: 'Obra social no encontrada' })
      }

      return res.status(200).json({ message: 'Obra social activada' })
    } catch (error) {
      console.error('Error al activar la obra social:', error)
      return res.status(500).json({ error: 'Error interno del servidor al activar la obra social' })
    }
  }

  partiallyUpdate = async (req, res) => {
    try {
      const result = validatePartialObraSocial(req.body)

      if (result.error) {
        return res.status(422).json({ error: JSON.parse(result.error.message) })
      }

      const { id } = req.params
      const updatedObraSocial = await ObraSocialModel.partiallyUpdate({ id, input: result.data })

      if (!updatedObraSocial) {
        return res.status(404).json({ error: 'Obra social no encontrada o sin cambios' })
      }

      return res.json({ updated: updatedObraSocial })
    } catch (error) {
      console.error('Error al actualizar parcialmente la obra social:', error)
      return res.status(500).json({ error: 'Error interno del servidor al actualizar la obra social' })
    }
  }
}
