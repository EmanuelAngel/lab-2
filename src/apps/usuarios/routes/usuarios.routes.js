import { Router } from 'express'
import { UsuariosController } from '../controller/usuarios.controller.js'

const usuariosController = new UsuariosController()

// Renombramos la función a 'usuariosRouter' para mayor claridad
export function usuariosRouter () {
  const router = Router()

  router.get('/', usuariosController.getAll)
  router.get('/:id', usuariosController.getById)
  router.post('/', usuariosController.create)
  router.delete('/:id', usuariosController.deactivate)
  router.patch('/:id/', usuariosController.activate)
  router.patch('/:id', usuariosController.partiallyUpdate)

  return router
}
