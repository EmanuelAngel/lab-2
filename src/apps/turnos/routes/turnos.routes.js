import { Router } from 'express'
import { TurnoController } from '../controller/turnos.controller.js'

const turnoController = new TurnoController()

export function turnosRouter () {
  const router = Router()

  router.get('/', turnoController.getAll)
  router.get('/:id', turnoController.getById)
  router.post('/', turnoController.create)
  router.patch('/:id', turnoController.partiallyUpdate)
  router.delete('/:id', turnoController.delete)
  router.get('/fecha/:fecha', turnoController.getByFecha)
  router.get('/paciente/:id_paciente', turnoController.getByPaciente)
  router.get('/especialidad/:id_especialidad', turnoController.getByEspecialidad)
  router.get('/count/:fecha', turnoController.countTurnosByFecha)
  router.get('/horario/:startTime/:endTime', turnoController.getByHoraRange)
  router.get('/profesional/:id_profesional/semana/:weekStart/:weekEnd', turnoController.getTurnosInWeek)
  router.get('/especialidad/:id_especialidad/semana/:weekStart/:weekEnd', turnoController.getTurnosInWeekByEspecialidad)
  router.get('/profesional/:id_profesional/rango/:startDate/:endDate', turnoController.getByProfesionalBetweenDates)
  router.get('/especialidad/:id_especialidad/rango/:startDate/:endDate', turnoController.getByEspecialidadBetweenDates)
  router.get('/profesional/:id_profesional/mes/:month/:year', turnoController.getTurnosInMonth)
  router.get('/especialidad/:id_especialidad/mes/:month/:year', turnoController.getTurnosInMonthByEspecialidad)
  router.get('/motivo/:consulta', turnoController.getByMotivoConsulta)

  return router
}
