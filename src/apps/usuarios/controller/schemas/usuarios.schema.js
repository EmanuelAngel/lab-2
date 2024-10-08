import { z } from 'zod'

// Esquema de validación para los usuarios
const usuariosSchema = z.object({
  id_rol: z.number().int().min(1), // id_rol debe ser un número entero positivo
  nombre_usuario: z.string().min(2).max(100), // El nombre de usuario debe tener al menos 2 caracteres y un máximo de 100
  contraseña: z.string().min(8).max(255), // Contraseña debe tener al menos 8 caracteres
  nombre: z.string().min(2).max(100), // El nombre debe tener al menos 2 caracteres
  apellido: z.string().min(2).max(100), // El apellido debe tener al menos 2 caracteres
  dni: z.number().int().min(1),
  telefono: z.number().int().min(1), // Valida que el teléfono sea un número entero
  direccion: z.string().min(5).max(255), // La dirección debe tener al menos 5 caracteres
  email: z.string().email().max(100) // Validación de email y longitud máxima de 100 caracteres
})

export function validateUsuarios (object) {
  return usuariosSchema.safeParse(object)
}

export function validatePartialUsuarios (object) {
  return usuariosSchema.partial().safeParse(object)
}
