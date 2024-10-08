import { Router } from 'express'
import { AdminsController } from '../controller/admins.controller.js'

const adminsController = new AdminsController()

export function adminsRouter () {
  const router = Router()

  router.get('/', adminsController.getAll)
  router.get('/:id', adminsController.getById)
  router.post('/', adminsController.create)
  router.delete('/:id', adminsController.deactivate)
  router.patch('/:id/activate', adminsController.activate) // Ruta para activar
  router.patch('/:id/update', adminsController.partiallyUpdate) // Ruta para actualización parcial (modificada)

  return router
}
