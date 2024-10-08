import { Router } from 'express'
import { PacientesController } from '../controller/pacientes.controller.js'

const pacientesController = new PacientesController()

export function pacientesRouter () {
  const router = Router()

  // Definimos las rutas
  router.get('/', pacientesController.getAll) // Obtener todos los pacientes
  router.get('/:id', pacientesController.getById) // Obtener un paciente por ID
  router.post('/', pacientesController.create) // Crear un nuevo paciente
  router.delete('/:id', pacientesController.deactivate) // Desactivar un paciente
  router.patch('/:id', pacientesController.activate) // Activar un paciente
  router.patch('/:id', pacientesController.partiallyUpdate) // Actualizar parcialmente un paciente

  return router
}
