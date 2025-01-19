import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import express from 'express'
import morgan from 'morgan'
import { corsMiddleware } from './middlewares/cors.js'

// Auth
import cookieParser from 'cookie-parser'
import { verifyAccessToken } from './middlewares/auth/verifyAccessToken.js'

import isLoggedIn from './middlewares/auth/isLoggedIn.js'
import isAdmin from './middlewares/auth/isAdmin.js'
import isSecre from './middlewares/auth/isSecre.js'
import isProfesional from './middlewares/auth/isProfesional.js'

import { authRouter } from './apps/auth/routes/auth.routes.js'

import { panelRouter } from './apps/panel/routes/panel.routes.js'

import { profesionalesRouter } from './apps/profesionales/routes/profesionales.routes.js'
import { especialidadesRouter } from './apps/especialidades/routes/especialidades.routes.js'
import { pacientesRouter } from './apps/pacientes/routes/pacientes.routes.js'
import { usuariosRouter } from './apps/usuarios/routes/usuarios.routes.js'
import { secreRouter } from './apps/secre/routes/secre.routes.js'
import { adminsRouter } from './apps/admins/routes/admins.routes.js'
import { rolesRouter } from './apps/roles/routes/roles.routes.js'
import { especialidadesProfesionalRouter } from './apps/especialidades_profesional/routes/especialidades_profesional.routes.js'
import { obraSocialRouter } from './apps/obra_social/routes/obra_social.routes.js'
import { obraSocialPacienteRouter } from './apps/obra_social_paciente/routes/obra_social_paciente.routes.js'
import { sucursalRouter } from './apps/sucursal/routes/sucursal.routes.js'
import { agendaBaseRouter } from './apps/agenda_base/routes/agenda_base.routes.js'
import { estadoAgendaRouter } from './apps/estado_agenda/routes/estado_agenda.routes.js'
import { diasNoDisponiblesRouter } from './apps/dias_no_disponibles/routes/dias_no_disponibles.routes.js'
import { clasificacionConsultaRouter } from './apps/clasificacion_consulta/routes/clasificacion_consulta.routes.js'
import { turnoEspecialRouter } from './apps/turno_especial/routes/turno_especial.routes.js'
import { estadosTurnoRouter } from './apps/estados_turno/routes/estados_turno.routes.js'
import { turnosRouter } from './apps/turnos/routes/turnos.routes.js'
import { diasRouter } from './apps/dias/routes/dias.routes.js'
import { diasAgendasRouter } from './apps/dias_agendas/routes/dias_agendas.routes.js'

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

  app.get('/', (_req, res) =>
    res.render('pages/index', { title: 'Inicio' })
  )

  app.use('/auth', authRouter())

  app.use('/panel', [isLoggedIn], panelRouter())

  app.use('/profesionales', [isLoggedIn], profesionalesRouter())
  app.use('/especialidades', [isLoggedIn], especialidadesRouter())
  app.use('/pacientes', [isLoggedIn], pacientesRouter())
  app.use('/usuarios', [isLoggedIn], usuariosRouter())
  app.use('/secre', [isLoggedIn], secreRouter())
  app.use('/admins', [isLoggedIn], adminsRouter())
  app.use('/roles', [isLoggedIn], rolesRouter())
  app.use('/especialidades_profesional', [isLoggedIn], especialidadesProfesionalRouter())
  app.use('/obra_social', [isLoggedIn], obraSocialRouter())
  app.use('/obra_social_paciente', [isLoggedIn], obraSocialPacienteRouter())
  app.use('/sucursal', [isLoggedIn], sucursalRouter())
  app.use('/agenda_base', [isLoggedIn], agendaBaseRouter())
  app.use('/estado_agenda', [isLoggedIn], estadoAgendaRouter())
  app.use('/dias_no_disponibles', [isLoggedIn], diasNoDisponiblesRouter())
  app.use('/clasificacion_consulta', [isLoggedIn], clasificacionConsultaRouter())
  app.use('/turno_especial', [isLoggedIn], turnoEspecialRouter())
  app.use('/estados_turno', [isLoggedIn], estadosTurnoRouter())
  app.use('/turnos', [isLoggedIn], turnosRouter())
  app.use('/dias', [isLoggedIn], diasRouter())
  app.use('/dias_agendas', [isLoggedIn], diasAgendasRouter())

  // Test de auth
  app.use('/test', [
    isLoggedIn,
    (_req, res) => res.send('Logged in!')
  ])

  // Error 404
  app.use(notFoundHandler)

  // Manejador global de errores
  app.use(globalErrorHandler)

  return app
}
