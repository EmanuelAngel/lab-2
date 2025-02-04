import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import express from 'express'
import morgan from 'morgan'
import { corsMiddleware } from './middlewares/cors.js'

// Auth
import cookieParser from 'cookie-parser'
import { verifyAccessToken } from './middlewares/auth/verifyAccessToken.js'

import { authRouter } from './apps/auth/routes/auth.routes.js'
import { panelRouter } from './apps/panel/routes/panel.routes.js'
import { appRoutes } from './routes/app.routes.js'

import { notFoundHandler } from './middlewares/error/notFoundHandler.js'
import { globalErrorHandler } from './middlewares/error/globalErrorHandler.js'

import { NODE_ENV } from './config/env.js'

export const __dirname = dirname(fileURLToPath(import.meta.url))

export function createApp () {
  const app = express()

  app.disable('x-powered-by')

  if (NODE_ENV === 'development') app.use(morgan('dev'))
  app.use(corsMiddleware())
  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))
  app.use(express.static(join(__dirname, '..', 'public')))

  // Auth
  app.use(cookieParser())
  app.use(verifyAccessToken)

  app.set('view engine', 'pug')
  app.set('views', join(__dirname, 'views/templates'))

  app.get('/', (req, res) =>
    res.render('index', {
      title: 'Inicio',
      user: req.session.user
    }
    ))

  // Auth module routes
  app.use('/auth', authRouter())

  // Panel (views) routes
  app.use('/panel', panelRouter())

  // App ("API") routes
  app.use('/', appRoutes)

  // Error 404
  app.use(notFoundHandler)

  // Manejador global de errores
  app.use(globalErrorHandler)

  return app
}
