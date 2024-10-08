import { validateUsuarios, validatePartialUsuarios } from './schemas/usuarios.schema.js'
import { UsuariosModel } from '../models/usuarios.model.js'

export class UsuariosController {
  // Método para obtener todos los usuarios
  getAll = async (req, res) => {
    try {
      // Obtenemos todos los usuarios activos (estado 1)
      const usuarios = await UsuariosModel.getAll()
      return res.json(usuarios)
    } catch (error) {
      console.error('Error al obtener todos los usuarios:', error)
      return res.status(500).json({ error: 'Error interno del servidor al obtener los usuarios' })
    }
  }

  // Método para obtener un usuario por su ID
  getById = async (req, res) => {
    try {
      const { id } = req.params

      const usuario = await UsuariosModel.getById({ id })

      if (!usuario) {
        return res.status(404).json({ error: 'Usuario no encontrado' })
      }

      return res.json(usuario)
    } catch (error) {
      console.error('Error al obtener el usuario por ID:', error)
      return res.status(500).json({ error: 'Error interno del servidor al obtener el usuario' })
    }
  }

  // Método para crear un nuevo usuario
  create = async (req, res) => {
    try {
      // Validamos los datos que llegan en el cuerpo de la solicitud
      const result = validateUsuarios(req.body)

      if (!result.success) {
        return res.status(422).json({ error: result.error.issues })
      }

      // Intentamos crear el usuario con los datos validados
      const createdUsuario = await UsuariosModel.create({ input: result.data })
      return res.status(201).json({ created: createdUsuario })
    } catch (error) {
      // Manejo de errores de duplicado (email, dni, nombre de usuario)
      if (error.code === 'ER_DUP_ENTRY') {
        console.error('Error al crear el usuario: Entrada duplicada:', error)
        return res.status(409).json({ error: 'El nombre de usuario, email o dni ya están en uso' })
      }

      console.error('Error al crear el usuario:', error)
      return res.status(500).json({ error: 'Error interno del servidor al crear el usuario' })
    }
  }

  // Método para desactivar un usuario
  deactivate = async (req, res) => {
    try {
      const { id } = req.params

      const result = await UsuariosModel.deactivate({ id })

      if (!result) {
        return res.status(404).json({ error: 'Usuario no encontrado' })
      }

      return res.status(200).json({ message: 'Usuario desactivado' })
    } catch (error) {
      console.error('Error al desactivar el usuario:', error)
      return res.status(500).json({ error: 'Error interno del servidor al desactivar el usuario' })
    }
  }

  // Método para activar un usuario
  activate = async (req, res) => {
    try {
      const { id } = req.params

      const result = await UsuariosModel.activate({ id })

      if (!result) {
        return res.status(404).json({ error: 'Usuario no encontrado' })
      }

      return res.status(200).json({ message: 'Usuario activado' })
    } catch (error) {
      console.error('Error al activar el usuario:', error)
      return res.status(500).json({ error: 'Error interno del servidor al activar el usuario' })
    }
  }

  // Método para actualizar parcialmente un usuario
  partiallyUpdate = async (req, res) => {
    try {
      // Validamos los datos que llegan para la actualización parcial
      const result = validatePartialUsuarios(req.body)

      if (!result.success) {
        return res.status(422).json({ error: result.error.issues })
      }

      const { id } = req.params

      const updatedUsuario = await UsuariosModel.partiallyUpdate({ id, input: result.data })

      if (!updatedUsuario) {
        return res.status(404).json({ error: 'Usuario no encontrado o sin cambios' })
      }

      return res.json({ updated: updatedUsuario })
    } catch (error) {
      // Manejo de errores por entrada duplicada
      if (error.code === 'ER_DUP_ENTRY') {
        console.error('Error al actualizar el usuario: Entrada duplicada:', error)
        return res.status(409).json({ error: 'El DNI, email o nombre de usuario ya están en uso' })
      }

      console.error('Error al actualizar el usuario:', error)
      return res.status(500).json({ error: 'Error interno del servidor al actualizar el usuario' })
    }
  }
}
