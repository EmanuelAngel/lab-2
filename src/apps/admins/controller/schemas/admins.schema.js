import { z } from 'zod'

// Esquema para validar los datos de un admin
const adminsSchema = z.object({
  id_usuario: z.number().int()

})

// Función para validar todos los campos obligatorios de un admin
export function validateAdmin (object) {
  return adminsSchema.safeParse(object) // Revisa si todos los campos cumplen las reglas del esquema
}

// Función para validación parcial (para actualizaciones parciales)
export function validatePartialAdmin (object) {
  return adminsSchema.partial().safeParse(object) // Permite que los campos no requeridos sean omitidos
}
