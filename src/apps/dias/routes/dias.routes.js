import { Router } from 'express'
import { DiasController } from '../controller/dias.controller.js'

const diasController = new DiasController()

export function diasRouter () {
  const router = Router()

  router.get('/', diasController.getAll) // Obtener todos los días
  router.get('/:id', diasController.getById) // Obtener un día por ID
  router.post('/', diasController.create) // Crear un nuevo día
  router.patch('/:id', diasController.update) // Actualizar un día
  router.delete('/:id', diasController.delete) // Eliminar un día
  router.get('/nombre/:dia', diasController.getByNombre) // Buscar un día por nombre

  return router
}
