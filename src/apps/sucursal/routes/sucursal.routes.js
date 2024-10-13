import { Router } from 'express'
import { SucursalController } from '../controller/sucursal.controller.js'

const sucursalController = new SucursalController()

export function sucursalRouter () {
  const router = Router()

  router.get('/', sucursalController.getAll)
  router.get('/:id', sucursalController.getById)
  router.post('/', sucursalController.create)
  router.delete('/:id', sucursalController.deactivate)
  router.patch('/:id/activate', sucursalController.activate) // Ruta para activar
  router.patch('/:id/update', sucursalController.partiallyUpdate) // Ruta para actualización parcial (modificada)
  router.get('/nombre/:nombre', sucursalController.getByNombre) // Ruta para obtener por nombre

  return router
}
