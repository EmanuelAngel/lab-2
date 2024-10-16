import { Router } from 'express'
import { TurnoEspecialController } from '../controller/turno_especial.controller.js'

const turnoEspecialController = new TurnoEspecialController()

export function turnoEspecialRouter () {
  const router = Router()

  router.get('/', turnoEspecialController.getAll)
  router.get('/:id', turnoEspecialController.getById)
  router.post('/', turnoEspecialController.create)
  router.patch('/:id', turnoEspecialController.partiallyUpdate)
  router.delete('/:id', turnoEspecialController.delete)
  router.get('/fecha/:fecha', turnoEspecialController.getByFecha)
  router.get('/agenda/:id_agenda_base', turnoEspecialController.getByAgendaBase) // Obtener turnos por agenda
  router.get('/rango/:startDate/:endDate', turnoEspecialController.getByDateRange) // Obtener turnos por rango de fechas
  router.get('/estado/:id_estado_turno', turnoEspecialController.getByEstadoTurno) // Obtener turnos por estado
  router.get('/contar/:fecha', turnoEspecialController.countTurnosByFecha) // Contar turnos por fecha

  return router
}
