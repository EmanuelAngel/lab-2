import { Router } from 'express'
import { ObraSocialPacienteController } from '../controller/obra_social_paciente.controller.js'

const obraSocialPacienteController = new ObraSocialPacienteController()

export function obraSocialPacienteRouter () {
  const router = Router()

  // Obtener todas las obras sociales de pacientes
  router.get('/', obraSocialPacienteController.getAll)

  // Obtener la obra social de un paciente por ID
  router.get('/:id_paciente/:id_obra_social', obraSocialPacienteController.getById)

  // Crear una nueva obra social para un paciente
  router.post('/', obraSocialPacienteController.create)

  // Desactivar una obra social de un paciente
  router.delete('/:id_paciente/:id_obra_social', obraSocialPacienteController.deactivate)

  // Activar una obra social de un paciente
  router.patch('/:id_paciente/:id_obra_social/activate', obraSocialPacienteController.activate)

  // Actualizar parcialmente una obra social de un paciente
  router.patch('/:id_paciente/:id_obra_social/update', obraSocialPacienteController.partiallyUpdate)

  // Obtener todas las obras sociales de un paciente
  router.get('/paciente/:id_paciente', obraSocialPacienteController.getByPaciente)

  // Obtener todos los pacientes de una obra social
  router.get('/obrasocial/:id_obra_social', obraSocialPacienteController.getByObraSocial)

  return router
}
