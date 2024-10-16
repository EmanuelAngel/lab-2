import { Router } from 'express'
import { EstadosTurnoController } from '../controller/estados_turno.controller.js'

const estadosTurnoController = new EstadosTurnoController()

export function estadosTurnoRouter () {
  const router = Router()

  router.get('/', estadosTurnoController.getAll)
  router.get('/:id', estadosTurnoController.getById)
  router.post('/', estadosTurnoController.create)
  router.patch('/:id/deactivate', estadosTurnoController.deactivate)
  router.patch('/:id/activate', estadosTurnoController.activate)
  router.patch('/:id/update_nombre', estadosTurnoController.updateNombre) // Ruta para actualizar el nombre
  router.get('/search/:nombre', estadosTurnoController.searchByName)

  return router
}
