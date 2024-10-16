import { Router } from 'express'
import { AgendaBaseController } from '../controller/agenda_base.controller.js'

const agendaBaseController = new AgendaBaseController()

export function agendaBaseRouter () {
  const router = Router()

  router.get('/', agendaBaseController.getAll)
  router.get('/:id', agendaBaseController.getById)
  router.post('/', agendaBaseController.create)
  router.delete('/:id', agendaBaseController.deactivate)
  router.patch('/:id/activate', agendaBaseController.activate)
  router.patch('/profesional/:id_profesional/sucursal/:id_sucursal/especialidad/:id_especialidad/update', agendaBaseController.partiallyUpdate)
  router.patch('/:id/estado', agendaBaseController.changeEstadoAgenda)
  router.get('/profesional/:id_profesional', agendaBaseController.getByProfesional)
  router.get('/sucursal/:id_sucursal', agendaBaseController.getBySucursal)
  router.get('/especialidad/:id_especialidad', agendaBaseController.getByEspecialidad)
  router.get('/profesional/:id_profesional/sucursal/:id_sucursal', agendaBaseController.getByProfesionalAndSucursal)
  router.get('/profesional/:id_profesional/especialidad/:id_especialidad', agendaBaseController.getByProfesionalAndEspecialidad)
  router.get('/estado/:id_estado_agenda', agendaBaseController.getByEstadoAgenda)
  router.get('/clasificacion/:id_clasificacion', agendaBaseController.getByClasificacion)
  router.get('/clasificacion/:id_clasificacion/estado/:id_estado_agenda', agendaBaseController.getByClasificacionAndEstadoAgenda)

  return router
}
