import { Router } from 'express'
import { EspecialidadesProfesionalController } from '../controller/especialidades_profesional.controller.js'

const especialidadesProfesionalController = new EspecialidadesProfesionalController()

export function especialidadesProfesionalRouter () {
  const router = Router()

  router.get('/', especialidadesProfesionalController.getAll) // Obtener todas las relaciones especialidad-profesional
  router.get('/profesional/:id_profesional', especialidadesProfesionalController.getByProfesional) // Obtener todas las especialidades de un profesional
  router.get('/especialidad/:id_especialidad', especialidadesProfesionalController.getByEspecialidad) // Obtener todos los profesionales de una especialidad
  router.post('/', especialidadesProfesionalController.create) // Crear una nueva relación especialidad-profesional
  router.delete('/:id_profesional/:id_especialidad', especialidadesProfesionalController.deactivate) // Desactivar una relación especialidad-profesional
  router.patch('/:id_profesional/:id_especialidad/activate', especialidadesProfesionalController.activate) // Activar una relación especialidad-profesional
  router.patch('/:id_profesional/:id_especialidad/update', especialidadesProfesionalController.partiallyUpdate) // Actualizar parcialmente una relación

  return router
}
