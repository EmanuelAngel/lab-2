import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import express from 'express'
import morgan from 'morgan'
import { corsMiddleware } from './middlewares/cors.js'

// import { userRouter } from './apps/users/routes/user.routes.js'
import { profesionalesRouter } from './apps/profesionales/routes/profesionales.routes.js'
import { especialidadesRouter } from './apps/especialidades/routes/especialidades.routes.js'
import { pacientesRouter } from './apps/pacientes/routes/pacientes.routes.js'

export const __dirname = dirname(fileURLToPath(import.meta.url))

export function createApp () {
  const app = express()

  app.disable('x-powered-by')
  app.use(morgan('dev'))
  app.use(corsMiddleware())
  app.use(express.json())
  app.use(express.static(join(__dirname, '..', 'public')))

  app.get('/', (_req, res) =>
    res.sendFile(join(__dirname, '..', 'public', 'html', 'index.html'))
  )

  app.use('/profesionales', profesionalesRouter())
  app.use('/especialidades', especialidadesRouter())
  app.use('/pacientes', pacientesRouter())
  // app.use('/users', userRouter({ userModel }))

  return app
}
