import { Router } from 'express'
import { EspecialidadesController } from '../controller/especialidades.controller.js'

const especialidadesController = new EspecialidadesController()

export function especialidadesRouter () {
  const router = Router()

  router.get('/', especialidadesController.getAll)
  router.get('/:id', especialidadesController.getById)
  router.post('/', especialidadesController.create)
  router.delete('/:id', especialidadesController.deactivate)
  router.patch('/:id', especialidadesController.activate)
  router.patch('/:id', especialidadesController.partiallyUpdate)

  return router
}
