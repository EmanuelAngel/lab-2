import { ProfesionalesModel } from '../../profesionales/models/profesionales.model.js'
import { EspecialidadesModel } from '../../especialidades/models/especialidades.model.js'
import { PacientesModel } from '../../pacientes/models/pacientes.model.js'
import { ObraSocialModel } from '../../obra_social/models/obra_social.model.js'
import { AgendaBaseModel } from '../../agenda_base/models/agenda_base.model.js'
import { EstadosTurnoModel } from '../../estados_turno/models/estados_turno.model.js'
import { TurnoModel } from '../../turnos/models/turnos.model.js'

export class PanelController {
  index = async (req, res) => {
    res.render('pages/panel/index', { title: 'Panel de Administración' })
  }

  profesionales = async (req, res) => {
    const profesionales = await ProfesionalesModel.getAllWithUser()

    res.render('pages/panel/profesionales/index',
      {
        title: 'Profesionales',
        profesionales
      }
    )
  }

  createProfesional = async (req, res) => {
    const especialidades = await EspecialidadesModel.getAll()

    res.render('pages/panel/profesionales/register',
      {
        title: 'Crear Profesional',
        especialidades
      }
    )
  }

  editProfesional = async (req, res) => {
    const id = req.params.id
    const profesional = await ProfesionalesModel.getByIdWithUser({ id })

    const especialidades = await EspecialidadesModel.getAll()

    if (!profesional) {
      return res.status(404).json({ message: 'Profesional no encontrado' })
    }

    res.render('pages/panel/profesionales/edit',
      {
        title: 'Editar Profesional',
        profesional,
        especialidades
      }
    )
  }

  especialidades = async (req, res) => {
    const especialidades = await EspecialidadesModel.getAll()
    res.render('pages/panel/especialidades/index',
      {
        title: 'Especialidades',
        especialidades
      }
    )
  }

  createEspecialidades = async (req, res) => {
    const especialidades = await EspecialidadesModel.getAll()

    res.render('pages/panel/especialidades/registrarEsp',
      {
        title: 'Crear Especialidad',
        especialidades
      }
    )
  }

  editEspecialidades = async (req, res) => {
    const id = req.params.id
    const especialidades = await ProfesionalesModel.getByIdWithUser({ id })

    if (!especialidades) {
      return res.status(404).json({ message: 'Especialidad no encontrado' })
    }

    res.render('pages/panel/especialidades/edit',
      {
        title: 'Editar Especialidad',
        especialidades
      }
    )
  }

  pacientes = async (req, res) => {
    const pacientes = await PacientesModel.getAllWithUser()

    res.render('pages/panel/pacientes/index',
      {
        title: 'Pacientes',
        pacientes
      }
    )
  }

  editPaciente = async (req, res) => {
    const id = req.params.id
    const paciente = await PacientesModel.getByIdWithUser({ id })
    const obrasSociales = await ObraSocialModel.getAll()

    if (!paciente) {
      return res.status(404).json({ message: 'Paciente no encontrado' })
    }

    res.render('pages/panel/pacientes/edit',
      {
        title: 'Editar Paciente',
        paciente,
        obrasSociales
      }
    )
  }

  agendas = async (_req, res) => {
    const agendas = await AgendaBaseModel.getAllDetailed()

    res.render('pages/panel/agendas/index',
      {
        title: 'Agendas',
        agendas
      }
    )
  }

  agenda = async (req, res) => {
    const { id } = req.params
    const agenda = await AgendaBaseModel.getAgendaWithTurnos({ id })
    const estadosTurnos = await EstadosTurnoModel.getAll()

    if (!agenda) {
      return res.status(404).json({ message: 'Agenda no encontrada' })
    }

    const turnosConPacientes = await Promise.all(
      agenda.turnos.map(async (turno) => {
        if (turno.id_paciente) {
          const paciente = await PacientesModel.getByIdWithUser({ id: turno.id_paciente })
          return {
            ...turno,
            paciente: paciente?.email
          }
        }
        return turno
      })
    )

    res.render('pages/panel/agendas/turnos',
      {
        title: 'Agenda',
        agenda: agenda.agenda,
        turnos: turnosConPacientes,
        estadosTurnos
      }
    )
  }

  asignar = async (req, res) => {
    const { id } = req.params
    const { id_profesional } = req.query

    const turno = await TurnoModel.getById({ id })
    const profesional = await ProfesionalesModel.getByIdWithUser({ id: id_profesional })

    res.render('pages/panel/agendas/asignar', {
      title: 'Asignar turno',
      turno,
      profesional
    })
  }
}
