import { Router } from 'express'
import { ProfesionalesController } from '../controller/profesionales.controller.js'

import { checkRoles } from '../../../middlewares/auth/checkRoles.js'
import { isLoggedIn } from '../../../middlewares/auth/isLoggedIn.js'

const profesionalesController = new ProfesionalesController()

export function profesionalesRouter () {
  const router = Router()

  router.get('/', [isLoggedIn, checkRoles(1)], profesionalesController.getAll)
  router.get('/:id', profesionalesController.getById)
  router.post('/', [checkRoles(1)], profesionalesController.create)
  router.delete('/:id', [checkRoles(1)], profesionalesController.deactivate)
  router.patch('/:id/activate', [checkRoles(1)], profesionalesController.activate) // Ruta para activar
  router.patch('/:id/update', [checkRoles(1)], profesionalesController.partiallyUpdate) // Ruta para actualización parcial (modificada)

  router.post('/users', [checkRoles(1)], profesionalesController.createWithUser)
  router.put('/:id', [checkRoles(1)], profesionalesController.updateWithUser)

  return router
}
