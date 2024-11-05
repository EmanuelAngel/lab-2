import { Router } from 'express'
import { EspecialidadesController } from '../controller/especialidades.controller.js'

const especialidadesController = new EspecialidadesController()

export function especialidadesRouter () {
  const router = Router()

  router.get('/', especialidadesController.getAll)
  router.get('/:id', especialidadesController.getById)
  router.post('/', especialidadesController.create)
  router.patch('/:id/desactivate', especialidadesController.deactivate)
  router.patch('/:id/activate', especialidadesController.activate)
  router.patch('/:id/update', especialidadesController.partiallyUpdate)
  router.get('/search/:nombre', especialidadesController.getByPartialName)

  return router
}
