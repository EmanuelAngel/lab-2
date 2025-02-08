import { Router } from 'express'
import { AuthController } from '../controller/auth.controller.js'

export const authRouter = Router()

authRouter
  .get('/register', AuthController.registerView)
  .get('/login', AuthController.loginView)
  .post('/login', AuthController.login)
  .get('/logout', AuthController.logout)
