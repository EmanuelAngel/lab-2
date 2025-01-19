import { NODE_ENV } from '../../../config/env.js'
import {
  validateUsuarios,
  validatePartialUsuarios
} from '../../usuarios/controller/schemas/usuarios.schema.js'
import { AuthModel } from '../model/auth.model.js'
// import { AuthModel } from '../model/auth2.model.js'
import { ObraSocialModel } from '../../obra_social/models/obra_social.model.js'

export class AuthController {
  // register = async (req, res) => {
  //   const { user } = req.session
  //   const requestedRoleId = req.body.id_rol

  //   // Verificar si el usuario no está logueado y está intentando registrar un rol que no sea paciente
  //   if (!user && requestedRoleId !== 4) {
  //     return res.status(403).json({
  //       error: 'Usuarios no autenticados solo pueden registrar pacientes'
  //     })
  //   }

  //   // Verificar si el usuario logueado no es admin y está intentando registrar un rol que no sea paciente
  //   if (user && user.id_rol !== 1 && requestedRoleId !== 4) {
  //     return res.status(403).json({
  //       error: 'Solo los administradores pueden registrar este tipo de usuario'
  //     })
  //   }

  //   try {
  //     const result = validatePartialUsuarios(req.body)

  //     if (!result.success) {
  //       return res.status(422).json({ error: result.error.issues })
  //     }

  //     const createdUser = await AuthModel.register({ input: req.body })

  //     console.log('createdUser:', createdUser)

  //     return res.status(201).json({ created: createdUser })
  //   } catch (error) {
  //     if (error.code === 'ER_DUP_ENTRY') {
  //       console.error('Error al registrar el usuario: Entrada duplicada:', error)
  //       return res.status(409).json({ error: 'El nombre de usuario, email o dni ya están en uso' })
  //     }

  //     console.error('Error al registrar el usuario:', error)
  //     return res.status(500).json({ error: 'Error interno del servidor al registrar el usuario' })
  //   }
  // }

  register = async (req, res) => {
    const { user } = req.session
    const requestedRoleId = req.body.id_rol

    // Verificar si el usuario no está logueado y está intentando registrar un rol que no sea paciente
    if (!user && requestedRoleId !== 4) {
      return res.status(403).json({
        error: 'Usuarios no autenticados solo pueden registrar pacientes'
      })
    }

    // Verificar si el usuario logueado no es admin y está intentando registrar un rol que no sea paciente
    if (user && user.id_rol !== 1 && requestedRoleId !== 4) {
      return res.status(403).json({
        error: 'Solo los administradores pueden registrar este tipo de usuario'
      })
    }

    try {
      const result = validatePartialUsuarios(req.body)

      if (!result.success) {
        return res.status(422).json({ error: result.error.issues })
      }

      const createdUser = await AuthModel.register({ input: req.body })

      console.log('createdUser:', createdUser)

      return res.status(201).json({ created: createdUser })
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        console.error('Error al registrar el usuario: Entrada duplicada:', error)
        return res.status(409).json({ error: 'El nombre de usuario, email o dni ya están en uso' })
      }

      console.error('Error al registrar el usuario:', error)
      return res.status(500).json({ error: 'Error interno del servidor al registrar el usuario' })
    }
  }

  // Vista para registro
  registerView = async (_req, res) => {
    const obrasSociales = await ObraSocialModel.getAll()

    obrasSociales.unshift({ id_obra_social: '0', nombre: 'No tengo obra social' })

    return res.render('pages/auth/register', { obrasSociales })
  }

  login = async (req, res) => {
    try {
      const result = validatePartialUsuarios(req.body)
      if (!result.success) {
        return res.status(422).json({ error: result.error.issues })
      }

      const { userData, token } = await AuthModel.login({ input: result.data })

      return res
        .status(200)
        .cookie(
          'access_token',
          token,
          {
            httpOnly: true,
            secure: NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 1000 * 60 * 60
          }
        )
        .json(userData)
    } catch (error) {
      if (error.message === 'Usuario no encontrado') {
        return res.status(404).json({ error: error.message })
      } else if (error.message === 'Contraseña incorrecta') {
        return res.status(401).json({ error: error.message })
      } else {
        return res.status(500).json({ error: error.message })
      }
    }
  }

  loginView = async (_req, res) => {
    return res.render('pages/auth/login')
  }

  // Método para cerrar sesión
  logout = async (_req, res) => {
    try {
      res.clearCookie('access_token')

      return res.status(302).redirect('/auth/login')
    } catch (error) {
      console.error('Error al cerrar sesión:', error)
      return res.status(500).json({
        error: 'Error interno del servidor al cerrar sesión'
      })
    }
  }
}
