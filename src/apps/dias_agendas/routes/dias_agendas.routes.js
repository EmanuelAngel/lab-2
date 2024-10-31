import { Router } from 'express'
import { DiasAgendasController } from '../controller/dias_agendas.controller.js'

const diasAgendasController = new DiasAgendasController()

export function diasAgendasRouter () {
  const router = Router()

  router.get('/', diasAgendasController.getAll)
  router.get('/:id_dia/:id_agenda_base', diasAgendasController.getById)
  router.post('/', diasAgendasController.create)
  router.patch('/:id_dia/:id_agenda_base', diasAgendasController.partiallyUpdate)
  router.delete('/:id_dia/:id_agenda_base', diasAgendasController.delete)
  router.get('/dia/:id_dia', diasAgendasController.getByDia)
  router.get('/horario/:startTime/:endTime', diasAgendasController.getByHorarioRange)

  return router
}
