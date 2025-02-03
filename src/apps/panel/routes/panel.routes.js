import { Router } from 'express'
import { PanelController } from '../controller/panel.controller.js'

import { checkRoles } from '../../../middlewares/auth/checkRoles.js'

const panelController = new PanelController()

export function panelRouter () {
  const router = Router()

  router.get('/', panelController.index)
  // router.get('/register', panelController.registerView)
  // router.post('/register', panelController.register)

  router.get('/profesionales', panelController.profesionales)
  router.get('/profesionales/register', checkRoles(1), panelController.createProfesional)
  router.get('/profesionales/edit/:id', checkRoles(1), panelController.editProfesional)

  // especialides

  router.get('/especialidades', panelController.especialidades)
  router.get('/especialidades/registrarEsp', checkRoles(1), panelController.createEspecialidades)
  router.get('/especialidades/edit/:id', checkRoles(1), panelController.editEspecialidades)

  // Pacientes

  router.get('/pacientes', panelController.pacientes)
  router.get('/pacientes/edit/:id', [checkRoles(1)], panelController.editPaciente)

  // Agendas
  router.get('/agendas', panelController.agendas)
  router.get('/agendas/:id', panelController.agenda)
  // router.get('/agendas/edit/:id', panelController.editAgenda)
  router.get('/agendas/:id/turnos/:id', panelController.asignar)

  return router
}
