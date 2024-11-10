import { Router } from 'express'
import { AuthController } from '../controller/auth.controller.js'

const authController = new AuthController()

export function authRouter () {
  const router = Router()

  router.get('/register', authController.registerView)
  // router.post('/register', authController.register)
  // router.get('/login', authController.loginView)
  // router.post('/login', authController.login)
  // router.post('/logout', authController.logout)

  /*
  Para futuro desarrollo

  router.get('/reset-password', (_req, res) => {
    res.json({ message: 'reset password page' })
  })

  // post o put o patch?
  router.post('/reset-password', (_req, res) => {
    res.json({ message: 'reset password action' })
  })
  */

  return router
}
