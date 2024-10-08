import { Router } from 'express'
import { ProfesionalesController } from '../controller/profesionales.controller.js'

const profesionalesController = new ProfesionalesController()

export function profesionalesRouter () {
  const router = Router()

  router.get('/', profesionalesController.getAll)
  router.get('/:id', profesionalesController.getById)
  router.post('/', profesionalesController.create)
  router.delete('/:id', profesionalesController.deactivate)
  router.patch('/:id/activate', profesionalesController.activate) // Ruta para activar
  router.patch('/:id/update', profesionalesController.partiallyUpdate) // Ruta para actualización parcial (modificada)

  return router
}
