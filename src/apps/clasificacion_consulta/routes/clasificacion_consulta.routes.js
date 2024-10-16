import { Router } from 'express'
import { ClasificacionConsultaController } from '../controller/clasificacion_consulta.controller.js'

const clasificacionConsultaController = new ClasificacionConsultaController()

export function clasificacionConsultaRouter () {
  const router = Router()

  router.get('/', clasificacionConsultaController.getAll)
  router.get('/:id', clasificacionConsultaController.getById)
  router.post('/', clasificacionConsultaController.create)
  router.patch('/:id', clasificacionConsultaController.partiallyUpdate)
  router.delete('/:id', clasificacionConsultaController.delete)
  router.get('/nombre/:nombre_clasificacion', clasificacionConsultaController.getByNombre)

  return router
}
