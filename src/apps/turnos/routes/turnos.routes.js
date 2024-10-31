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
  router.get('/estado/:id_estado_turno', turnoController.getByEstadoTurno)
  router.get('/motivo/:consulta', turnoController.getByMotivoConsulta)

  return router
}
