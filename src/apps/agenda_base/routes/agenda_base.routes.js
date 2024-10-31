import { Router } from 'express'
import { AgendaBaseController } from '../controller/agenda_base.controller.js'

const agendaBaseController = new AgendaBaseController()

export function agendaBaseRouter () {
  const router = Router()

  // Rutas CRUD y de búsqueda avanzada
  router.get('/', agendaBaseController.getAll) // Obtener todas las agendas activas
  router.get('/:id', agendaBaseController.getById) // Obtener una agenda por ID
  router.post('/', agendaBaseController.create) // Crear una nueva agenda base
  router.patch('/:id', agendaBaseController.partiallyUpdate) // Actualizar parcialmente una agenda
  router.delete('/:id', agendaBaseController.deactivate) // Desactivar una agenda
  router.patch('/:id/activate', agendaBaseController.activate) // Activar una agenda
  router.get('/matricula/:matricula', agendaBaseController.getByMatricula) // Obtener agendas por matrícula
  router.get('/estado/:id_estado_agenda', agendaBaseController.getByEstadoAgenda) // Obtener agendas por estado de agenda
  router.get('/sucursal/:id_sucursal', agendaBaseController.getBySucursal) // Obtener agendas por sucursal
  router.get('/sucursales', agendaBaseController.getAllSucursales) // Obtener todas las sucursales únicas
  router.get('/sucursal/:id_sucursal/clasificacion/:id_clasificacion', agendaBaseController.getBySucursalAndClasificacion) // Obtener agendas por combinación de sucursal y clasificación

  return router
}
