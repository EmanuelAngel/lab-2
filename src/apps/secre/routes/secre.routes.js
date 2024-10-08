import { Router } from 'express'
import { SecreController } from '../controller/secre.controller.js'

const secreController = new SecreController()

export function secreRouter () {
  const router = Router()

  router.get('/', secreController.getAll)
  router.get('/:id', secreController.getById)
  router.post('/', secreController.create)
  router.delete('/:id', secreController.deactivate)
  router.patch('/:id/activate', secreController.activate) // Ruta para activar
  router.patch('/:id/update', secreController.partiallyUpdate) // Ruta para actualización parcial (modificada)

  return router
}
