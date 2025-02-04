import { Router } from 'express'

import { profesionalesRouter } from '../apps/profesionales/routes/profesionales.routes.js'
import { especialidadesRouter } from '../apps/especialidades/routes/especialidades.routes.js'
import { pacientesRouter } from '../apps/pacientes/routes/pacientes.routes.js'
import { usuariosRouter } from '../apps/usuarios/routes/usuarios.routes.js'
import { secreRouter } from '../apps/secre/routes/secre.routes.js'
import { adminsRouter } from '../apps/admins/routes/admins.routes.js'
import { rolesRouter } from '../apps/roles/routes/roles.routes.js'
import { especialidadesProfesionalRouter } from '../apps/especialidades_profesional/routes/especialidades_profesional.routes.js'
import { obraSocialRouter } from '../apps/obra_social/routes/obra_social.routes.js'
import { obraSocialPacienteRouter } from '../apps/obra_social_paciente/routes/obra_social_paciente.routes.js'
import { sucursalRouter } from '../apps/sucursal/routes/sucursal.routes.js'
import { agendaBaseRouter } from '../apps/agenda_base/routes/agenda_base.routes.js'
import { estadoAgendaRouter } from '../apps/estado_agenda/routes/estado_agenda.routes.js'
import { diasNoDisponiblesRouter } from '../apps/dias_no_disponibles/routes/dias_no_disponibles.routes.js'
import { clasificacionConsultaRouter } from '../apps/clasificacion_consulta/routes/clasificacion_consulta.routes.js'
import { turnoEspecialRouter } from '../apps/turno_especial/routes/turno_especial.routes.js'
import { estadosTurnoRouter } from '../apps/estados_turno/routes/estados_turno.routes.js'
import { turnosRouter } from '../apps/turnos/routes/turnos.routes.js'
import { diasRouter } from '../apps/dias/routes/dias.routes.js'
import { diasAgendasRouter } from '../apps/dias_agendas/routes/dias_agendas.routes.js'

export const appRoutes = Router()

appRoutes.use('/profesionales', profesionalesRouter())
appRoutes.use('/especialidades', especialidadesRouter())
appRoutes.use('/pacientes', pacientesRouter())
appRoutes.use('/usuarios', usuariosRouter())
appRoutes.use('/secre', secreRouter())
appRoutes.use('/admins', adminsRouter())
appRoutes.use('/roles', rolesRouter())
appRoutes.use('/especialidades_profesional', especialidadesProfesionalRouter())
appRoutes.use('/obra_social', obraSocialRouter())
appRoutes.use('/obra_social_paciente', obraSocialPacienteRouter())
appRoutes.use('/sucursal', sucursalRouter())
appRoutes.use('/agenda_base', agendaBaseRouter())
appRoutes.use('/estado_agenda', estadoAgendaRouter())
appRoutes.use('/dias_no_disponibles', diasNoDisponiblesRouter())
appRoutes.use('/clasificacion_consulta', clasificacionConsultaRouter())
appRoutes.use('/turno_especial', turnoEspecialRouter())
appRoutes.use('/estados_turno', estadosTurnoRouter())
appRoutes.use('/turnos', turnosRouter())
appRoutes.use('/dias', diasRouter())
appRoutes.use('/dias_agendas', diasAgendasRouter())
