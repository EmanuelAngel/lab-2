import { z } from 'zod'

// Esquema para validar los datos de un secretario
const secreSchema = z.object({
  id_usuario: z.number().int(),
  id_sucursal: z.number().int()
})

// Función para validar todos los campos obligatorios de un secretario
export function validateSecre (object) {
  return secreSchema.safeParse(object) // Revisa si todos los campos cumplen las reglas del esquema
}

// Función para validación parcial (para actualizaciones parciales)
export function validatePartialSecre (object) {
  return secreSchema.partial().safeParse(object) // Permite que los campos no requeridos sean omitidos
}
