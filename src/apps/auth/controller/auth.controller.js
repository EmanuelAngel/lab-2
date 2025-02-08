import { NODE_ENV } from '../../../config/env.js'
import { validatePartialUsuarios } from '../../usuarios/controller/schemas/usuarios.schema.js'
import { AuthModel } from '../model/auth.model.js'
import { ObraSocialModel } from '../../obra_social/models/obra_social.model.js'

export class AuthController {
  static registerView = async (req, res) => {
    const obrasSociales = await ObraSocialModel.getAll()

    obrasSociales.unshift({ id_obra_social: '0', nombre: 'No tengo obra social' })

    return res.render('auth/register', {
      obrasSociales,
      user: req.session.user
    })
  }

  static login = async (req, res) => {
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

  static loginView = async (req, res) => {
    return res.render('auth/login', { user: req.session.user })
  }

  // Método para cerrar sesión
  static logout = async (_req, res) => {
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
