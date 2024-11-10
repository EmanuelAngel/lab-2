// import { validatePartialUsuarios } from '../../usuarios/controller/schemas/usuarios.schema.js'
// import { validatePartialAdmin } from '../../admins/controller/schemas/admins.schema.js'
// import { AdminDashboardModel } from '../models/panel.model.js'
// import { PacientesModel } from '../../pacientes/models/pacientes.model.js'
import { ProfesionalesModel } from '../../profesionales/models/profesionales.model.js'
import { EspecialidadesModel } from '../../especialidades/models/especialidades.model.js'
import { PacientesModel } from '../../pacientes/models/pacientes.model.js'

export class PanelController {
  index = async (req, res) => {
    res.render('pages/panel/index', { title: 'Panel de Administración' })
  }

  // registerView = async (req, res) => {
  //   res.render('pages/panel/register', { title: 'Registro de Usuarios' })
  // }

  // register = async (req, res) => {
  //   try {
  //     if (req.body.id_rol === 1) {
  //       const userVal = validatePartialUsuarios(req.body)
  //       if (userVal.error) {
  //         res.status(422).json(userVal.error)
  //       }

  //       const adminVal = validatePartialAdmin(req.body)

  //       if (adminVal.error) {
  //         res.status(422).json(adminVal.error)
  //       }

  //       const created = await AdminDashboardModel.registerAdmin({ input: req.body })

  //       return res.status(201).json(created)
  //     }
  //   } catch (error) {
  //     res.status(500).json(error)
  //   }

  //   if (req.body.id_rol === 2) { return res.json('Secretaria') }
  //   if (req.body.id_rol === 3) { return res.json('Profesional') }
  // }

  // pacientes = async (req, res) => {
  //   const pacientes = await PacientesModel.getAllWithUser()

  //   res.render('pages/panel/pacientes/index',
  //     {
  //       title: 'Pacientes',
  //       pacientes
  //     }
  //   )
  // }

  // editPaciente = async (req, res) => {
  //   const id = parseInt(req.params.id, 10)
  //   const paciente = await PacientesModel.getByIdWithUser({ id })

  //   if (!paciente) {
  //     return res.status(404).json({ message: 'Paciente no encontrado' })
  //   }

  //   res.render('pages/panel/pacientes/edit',
  //     {
  //       title: 'Editar Paciente',
  //       paciente
  //     }
  //   )
  // }

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
}
