import { Router } from 'express'
import { ObraSocialController } from '../controller/obra_social.controller.js'

const obraSocialController = new ObraSocialController()

export function obraSocialRouter () {
  const router = Router()

  router.get('/', obraSocialController.getAll)
  router.get('/:id', obraSocialController.getById)
  router.post('/', obraSocialController.create)
  router.delete('/:id', obraSocialController.deactivate)
  router.patch('/:id/activate', obraSocialController.activate)
  router.patch('/:id/update', obraSocialController.partiallyUpdate)

  return router
}
