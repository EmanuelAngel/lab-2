import { Router } from 'express'
import { EstadoAgendaController } from '../controller/estado_agenda.controller.js'

const estadoAgendaController = new EstadoAgendaController()

export function estadoAgendaRouter () {
  const router = Router()

  router.get('/', estadoAgendaController.getAll)
  router.get('/:id', estadoAgendaController.getById)
  router.post('/', estadoAgendaController.create)
  router.delete('/:id', estadoAgendaController.deactivate)
  router.patch('/:id/update', estadoAgendaController.partiallyUpdate)
  router.get('/nombre/:nombre_estado', estadoAgendaController.getByNombre)

  return router
}
