import { Router } from 'express'
import { PanelController } from '../controller/panel.controller.js'

const panelController = new PanelController()

export function panelRouter () {
  const router = Router()

  router.get('/', panelController.index)
  // router.get('/register', panelController.registerView)
  // router.post('/register', panelController.register)

  // router.get('/pacientes', panelController.pacientes)
  // router.get('/pacientes/edit/:id', panelController.editPaciente)

  router.get('/profesionales', panelController.profesionales)
  router.get('/profesionales/register', panelController.createProfesional)
  router.get('/profesionales/edit/:id', panelController.editProfesional)

  return router
}
