import { Router } from 'express'
import { DiasNoDisponiblesController } from '../controller/dias_no_disponibles.controller.js'

const diasNoDisponiblesController = new DiasNoDisponiblesController()

export function diasNoDisponiblesRouter () {
  const router = Router()

  router.get('/', diasNoDisponiblesController.getAll)
  router.get('/:id', diasNoDisponiblesController.getById)
  router.post('/', diasNoDisponiblesController.create)
  router.delete('/:id', diasNoDisponiblesController.deactivate)
  router.patch('/:id/update', diasNoDisponiblesController.partiallyUpdate)

  // Buscar por día, mes y año
  router.get('/fecha/:dia/:mes/:año', diasNoDisponiblesController.getByFecha)

  // Buscar por mes y año
  router.get('/mes/:mes/:año', diasNoDisponiblesController.getByMes)

  // Buscar por palabra en el motivo
  router.get('/motivo/:palabra', diasNoDisponiblesController.getByMotivo)

  // Buscar días no disponibles dentro de un rango de fechas
  router.get('/rango/:fechaInicio/:fechaFin', diasNoDisponiblesController.getByRangoFechas)

  router.get('/mes/:mesParam/:añoParam/count', diasNoDisponiblesController.countByMes)

  return router
}
