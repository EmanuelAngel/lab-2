import { validateDiasAgenda, validatePartialDiasAgenda } from './schemas/dias_agendas.schema.js'
import { DiasAgendasModel } from '../models/dias_agendas.model.js'

export class DiasAgendasController {
  getAll = async (req, res) => {
    try {
      const diasAgendas = await DiasAgendasModel.getAll()
      return res.json(diasAgendas)
    } catch (error) {
      console.error('Error al obtener todas las relaciones dia-agenda:', error)
      return res.status(500).json({ error: 'Error interno del servidor al obtener las relaciones dia-agenda' })
    }
  }

  getById = async (req, res) => {
    try {
      const { id_dia, id_agenda_base } = req.params
      const diaAgenda = await DiasAgendasModel.getById({ id_dia, id_agenda_base })

      if (!diaAgenda) {
        return res.status(404).json({ error: 'Relación dia-agenda no encontrada' })
      }

      return res.json(diaAgenda)
    } catch (error) {
      console.error('Error al obtener la relación dia-agenda por ID:', error)
      return res.status(500).json({ error: 'Error interno del servidor al obtener la relación dia-agenda' })
    }
  }

  create = async (req, res) => {
    try {
      const result = validateDiasAgenda(req.body)

      if (!result.success) {
        return res.status(422).json({ error: result.error.issues })
      }

      const createdDiaAgenda = await DiasAgendasModel.create({ input: result.data })
      return res.status(201).json({ created: createdDiaAgenda })
    } catch (error) {
      console.error('Error al crear la relación dia-agenda:', error)
      return res.status(500).json({ error: 'Error interno del servidor al crear la relación dia-agenda' })
    }
  }

  partiallyUpdate = async (req, res) => {
    try {
      const result = validatePartialDiasAgenda(req.body)

      if (!result.success) {
        return res.status(422).json({ error: result.error.issues })
      }

      const { id_dia, id_agenda_base } = req.params
      const updatedDiaAgenda = await DiasAgendasModel.partiallyUpdate({ id_dia, id_agenda_base, input: result.data })

      if (!updatedDiaAgenda) {
        return res.status(404).json({ error: 'Relación dia-agenda no encontrada o sin cambios' })
      }

      return res.json({ updated: updatedDiaAgenda })
    } catch (error) {
      console.error('Error al actualizar parcialmente la relación dia-agenda:', error)
      return res.status(500).json({ error: 'Error interno del servidor al actualizar la relación dia-agenda' })
    }
  }

  delete = async (req, res) => {
    try {
      const { id_dia, id_agenda_base } = req.params
      const result = await DiasAgendasModel.delete({ id_dia, id_agenda_base })

      return res.json(result)
    } catch (error) {
      console.error('Error al eliminar la relación dia-agenda:', error)
      return res.status(500).json({ error: 'Error interno del servidor al eliminar la relación dia-agenda' })
    }
  }

  getByDia = async (req, res) => {
    try {
      const { id_dia } = req.params
      const diasAgendas = await DiasAgendasModel.getByDia({ id_dia })

      if (!diasAgendas.length) {
        return res.status(404).json({ error: 'No se encontraron relaciones para el día especificado' })
      }

      return res.json(diasAgendas)
    } catch (error) {
      console.error('Error al obtener relaciones por día:', error)
      return res.status(500).json({ error: 'Error interno del servidor al obtener relaciones por día' })
    }
  }

  getByHorarioRange = async (req, res) => {
    const { startTime, endTime } = req.params
    try {
      const diasAgendas = await DiasAgendasModel.getByHorarioRange({ startTime, endTime })

      if (!diasAgendas.length) {
        return res.status(404).json({ error: 'No se encontraron relaciones en el rango de horario especificado' })
      }

      return res.json(diasAgendas)
    } catch (error) {
      console.error('Error al obtener relaciones por rango de horario:', error)
      return res.status(500).json({ error: 'Error interno del servidor al obtener relaciones por rango de horario' })
    }
  }
}
