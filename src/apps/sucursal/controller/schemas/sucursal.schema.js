import { z } from 'zod'

// Esquema de validación para sucursales
const sucursalSchema = z.object({
  nombre: z.string().min(2).max(100), // El nombre debe tener al menos 2 caracteres y un máximo de 100
  direccion: z.string().min(5).max(255), // La dirección debe tener al menos 5 caracteres
  telefono: z.string().min(7).max(20), // El teléfono debe tener entre 7 y 20 caracteres, ya que puede incluir caracteres no numéricos como "+"
  email: z.string().email().max(100) // Validación de email y longitud máxima de 100 caracteres
})

export function validateSucursal (object) {
  return sucursalSchema.safeParse(object)
}

export function validatePartialSucursal (object) {
  return sucursalSchema.partial().safeParse(object)
}
