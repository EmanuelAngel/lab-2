import { validateDiasNoDisponibles, validatePartialDiasNoDisponibles } from './schemas/dias_no_disponibles.schema.js'
import { DiasNoDisponiblesModel } from '../models/dias_no_disponibles.model.js'

export class DiasNoDisponiblesController {
  // Obtener todos los días no disponibles
  getAll = async (req, res) => {
    try {
      const dias = await DiasNoDisponiblesModel.getAll()
      return res.json(dias)
    } catch (error) {
      console.error('Error al obtener todos los días no disponibles:', error)
      return res.status(500).json({ error: 'Error interno del servidor al obtener los días no disponibles' })
    }
  }

  // Obtener un día no disponible por ID
  getById = async (req, res) => {
    try {
      const { id } = req.params
      const dia = await DiasNoDisponiblesModel.getById({ id })

      if (!dia) {
        return res.status(404).json({ error: 'Día no disponible no encontrado' })
      }

      return res.json(dia)
    } catch (error) {
      console.error('Error al obtener el día no disponible por ID:', error)
      return res.status(500).json({ error: 'Error interno del servidor al obtener el día no disponible' })
    }
  }

  // Crear un nuevo día no disponible
  create = async (req, res) => {
    try {
      const result = validateDiasNoDisponibles(req.body)

      if (result.error) {
        return res.status(422).json({ error: JSON.parse(result.error.message) })
      }

      const createdDia = await DiasNoDisponiblesModel.create({ input: result.data })
      return res.status(201).json({ created: createdDia })
    } catch (error) {
      console.error('Error al crear el día no disponible:', error)
      return res.status(500).json({ error: 'Error interno del servidor al crear el día no disponible' })
    }
  }

  // Actualizar parcialmente un día no disponible
  partiallyUpdate = async (req, res) => {
    try {
      const result = validatePartialDiasNoDisponibles(req.body)

      if (result.error) {
        return res.status(422).json({ error: JSON.parse(result.error.message) })
      }

      const { id } = req.params
      const updatedDia = await DiasNoDisponiblesModel.partiallyUpdate({ id, input: result.data })

      if (!updatedDia) {
        return res.status(404).json({ error: 'Día no disponible no encontrado o sin cambios' })
      }

      return res.json({ updated: updatedDia })
    } catch (error) {
      console.error('Error al actualizar el día no disponible:', error)
      return res.status(500).json({ error: 'Error interno del servidor al actualizar el día no disponible' })
    }
  }

  // Eliminar un día no disponible
  deactivate = async (req, res) => {
    try {
      const { id } = req.params
      const result = await DiasNoDisponiblesModel.deactivate({ id })

      if (!result) {
        return res.status(404).json({ error: 'Día no disponible no encontrado' })
      }

      return res.status(200).json({ message: 'Día no disponible eliminado' })
    } catch (error) {
      console.error('Error al eliminar el día no disponible:', error)
      return res.status(500).json({ error: 'Error interno del servidor al eliminar el día no disponible' })
    }
  }

  // Buscar por día, mes y año
  getByFecha = async (req, res) => {
    try {
      const { dia, mes, año } = req.params
      const dias = await DiasNoDisponiblesModel.getByFecha({ dia, mes, año })
      return res.json(dias)
    } catch (error) {
      console.error('Error al buscar por fecha:', error)
      return res.status(500).json({ error: 'Error interno del servidor al buscar por fecha' })
    }
  }

  // Buscar todos los días no disponibles de un mes específico
  getByMes = async (req, res) => {
    try {
      const { mes, año } = req.params
      const dias = await DiasNoDisponiblesModel.getByMes({ mes, año })
      return res.json(dias)
    } catch (error) {
      console.error('Error al buscar por mes:', error)
      return res.status(500).json({ error: 'Error interno del servidor al buscar por mes' })
    }
  }

  // Buscar por palabra en el motivo
  getByMotivo = async (req, res) => {
    try {
      const { palabra } = req.params
      const dias = await DiasNoDisponiblesModel.getByMotivo({ palabra })
      return res.json(dias)
    } catch (error) {
      console.error('Error al buscar por motivo:', error)
      return res.status(500).json({ error: 'Error interno del servidor al buscar por motivo' })
    }
  }

  // Buscar días no disponibles dentro de un rango de fechas
  getByRangoFechas = async (req, res) => {
    try {
      const { fechaInicio, fechaFin } = req.params
      const dias = await DiasNoDisponiblesModel.getByRangoFechas({ fechaInicio, fechaFin })
      return res.json(dias)
    } catch (error) {
      console.error('Error al buscar por rango de fechas:', error)
      return res.status(500).json({ error: 'Error interno del servidor al buscar por rango de fechas' })
    }
  }

  countByMes = async (req, res) => {
    try {
      const { mesParam: mes, añoParam: año } = req.params
      console.log(`Mes: ${mes}, Año: ${año}`) // Agrega esto para verificar los parámetros

      const total = await DiasNoDisponiblesModel.countByMes({ mes, año })
      return res.json({ total })
    } catch (error) {
      console.error('Error al contar los días no disponibles por mes:', error)
      return res.status(500).json({ error: 'Error interno del servidor al contar los días no disponibles' })
    }
  }
}
