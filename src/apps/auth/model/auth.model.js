import jwt from 'jsonwebtoken'

import { comparePassword } from '../../.utils/bcrypt.js'

import { UsuariosModel } from '../../usuarios/models/usuarios.model.js'

import { JWT_SECRET, JWT_EXPIRES } from '../../../config/env.js'

export class AuthModel {
  static async login ({ input }) {
    const { nombre_usuario, contraseña } = input

    const user = await UsuariosModel.getByNombreUsuario({ nombre_usuario })

    console.log('user:', user)

    if (!user) throw new Error('Usuario no encontrado')

    const isPasswordValid = await comparePassword({
      password: contraseña,
      hash: user.contraseña
    })
    if (!isPasswordValid) throw new Error('Contraseña incorrecta')

    // Crear token de sesión
    let token
    try {
      token = jwt.sign(
        {
          id_usuario: user.id_usuario,
          nombre_usuario: user.nombre_usuario,
          id_rol: user.id_rol
        },
        JWT_SECRET,
        {
          expiresIn: JWT_EXPIRES
        }
      )
    } catch (error) {
      throw new Error('Error al generar el token de sesión')
    }

    // Quitamos la contraseña del usuario
    const { contraseña: _, ...userData } = user

    return { userData, token }
  }
}
