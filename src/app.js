import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import express from 'express'
import morgan from 'morgan'
import { corsMiddleware } from './middlewares/cors.js'

// import { userRouter } from './apps/users/routes/user.routes.js'
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
  app.use('/usuarios', usuariosRouter())
  app.use('/secre', secreRouter())
  app.use('/admins', adminsRouter())
  app.use('/roles', rolesRouter())
  app.use('/especialidades_profesional', especialidadesProfesionalRouter())
  app.use('/obra_social', obraSocialRouter())
  app.use('/obra_social_paciente', obraSocialPacienteRouter())
  app.use('/sucursal', sucursalRouter())
  app.use('/agenda_base', agendaBaseRouter())
  app.use('/estado_agenda', estadoAgendaRouter())
  app.use('/dias_no_disponibles', diasNoDisponiblesRouter())
  app.use('/clasificacion_consulta', clasificacionConsultaRouter())
  app.use('/turno_especial', turnoEspecialRouter())
  app.use('/estados_turno', estadosTurnoRouter())
  app.use('/turnos', turnosRouter())

  // app.use('/users', userRouter({ userModel }))

  return app
}
