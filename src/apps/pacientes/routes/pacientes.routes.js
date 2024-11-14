import { Router } from 'express'
import { PacientesController } from '../controller/pacientes.controller.js'

const pacientesController = new PacientesController()

export function pacientesRouter () {
  const router = Router()

  router.get('/', pacientesController.getAll)
  router.get('/:id', pacientesController.getById)
  router.post('/', pacientesController.create)
  router.delete('/:id', pacientesController.deactivate)
  router.patch('/:id/activate', pacientesController.activate)
  router.patch('/:id/update', pacientesController.partiallyUpdate)
  router.get('/obra_social/:tiene_obra_social', pacientesController.getByObraSocial) // Nueva ruta
  router.get('/usuario/:id_usuario', pacientesController.getByUsuario) // Nueva ruta

  router.post('/users', pacientesController.createWithUser)
  router.put('/:id', pacientesController.updateWithUser)
  router.get('/users/:email', pacientesController.getByEmailWithUser)

  return router
}
