import { Router } from 'express'
import { EspecialidadesController } from '../controller/especialidades.controller.js'

const especialidadesController = new EspecialidadesController()

export function especialidadesRouter () {
  const router = Router()

  router.get('/', especialidadesController.getAll)
  router.get('/:id', especialidadesController.getById)
  router.post('/', especialidadesController.create)
  router.delete('/:id', especialidadesController.deactivate)
  router.patch('/:id/activate', especialidadesController.activate)
  router.patch('/:id/update', especialidadesController.partiallyUpdate)

  return router
}
