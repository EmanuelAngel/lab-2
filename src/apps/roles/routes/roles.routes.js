import { Router } from 'express'
import { RolesController } from '../controller/roles.controller.js'

const rolesController = new RolesController()

export function rolesRouter () {
  const router = Router()

  router.get('/', rolesController.getAll)
  router.get('/:id', rolesController.getById)
  router.post('/', rolesController.create)
  router.delete('/:id', rolesController.deactivate)
  router.patch('/:id/update', rolesController.partiallyUpdate) // Ruta para actualización parcial (modificada)

  return router
}
