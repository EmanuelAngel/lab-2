import { Router } from 'express'
import { EspecialidadesProfesionalController } from '../controller/especialidades_profesional.controller.js'

const especialidadesProfesionalController = new EspecialidadesProfesionalController()

export function especialidadesProfesionalRouter () {
  const router = Router()

  router.get('/', especialidadesProfesionalController.getAll)
  router.get('/profesional/:id_profesional', especialidadesProfesionalController.getByProfesional)
  router.get('/especialidad/:id_especialidad', especialidadesProfesionalController.getByEspecialidad)
  router.get('/matricula/:matricula', especialidadesProfesionalController.getByMatricula)
  router.post('/', especialidadesProfesionalController.create)
  router.delete('/:id_profesional/:id_especialidad', especialidadesProfesionalController.deactivate)
  router.patch('/:id_profesional/:id_especialidad/activate', especialidadesProfesionalController.activate)
  router.patch('/:id_profesional/:id_especialidad/update', especialidadesProfesionalController.partiallyUpdate)

  return router
}
