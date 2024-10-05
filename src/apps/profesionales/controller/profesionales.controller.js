import { validatePartialProfesionales, validateProfesionales } from './schemas/profesionales.schema.js'

import { ProfesionalesModel } from '../models/profesionales.model.js'

export class ProfesionalesController {
  getAll = async (req, res) => {
    const profesionales = await ProfesionalesModel.getAll()

    return res.json(profesionales)
  }

  getById = async (req, res) => {
    const { id } = req.params

    const profesionales = await ProfesionalesModel.getById({ id })

    if (profesionales === false) {
      return res.status(404).json({ error: 'Professional no encontrado' })
    }

    return res.json(profesionales)
  }

  create = async (req, res) => {
    const result = validateProfesionales(req.body)

    if (result.error) {
      return res.status(422).json({ error: JSON.parse(result.error.message) })
    }

    const createdProfesionales = await ProfesionalesModel.create({ input: result.data })

    return res.status(201).json({ created: createdProfesionales })
  }

  deactivate = async (req, res) => {
    const { id } = req.params

    const result = await ProfesionalesModel.delete({ id })

    if (result === false) {
      return res.status(404).json({ error: 'Profesional no encontrado' })
    }

    return res.status(200).json({ message: 'Profesional eliminado' })
  }

  activate = async (req, res) => {
    const { id } = req.params

    const result = await ProfesionalesModel.activate({ id })

    if (result === false) {
      return res.status(404).json({ error: 'Profesional no encontrado' })
    }

    return res.status(200).json({ message: 'Profesional activado' })
  }

  partiallyUpdate = async (req, res) => {
    const result = validatePartialProfesionales(req.body)

    if (result.error) {
      return res.status(422).json({ error: JSON.parse(result.error.message) })
    }

    const { id } = req.params

    const updatedProfesionales = await ProfesionalesModel.partiallyUpdate({
      id,
      input: result.data
    })

    return res.json({ updated: updatedProfesionales })
  }
}
