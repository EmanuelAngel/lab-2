import { z } from 'zod'

// Esquema para validar los datos de un paciente
const pacientesSchema = z.object({
  tiene_obra_social: z.enum(['0', '1']),

  id_usuario: z.number().int()
})

// Función para validar todos los campos obligatorios de un paciente
export function validatePacientes (object) {
  return pacientesSchema.safeParse(object) // Revisa si todos los campos cumplen las reglas del esquema
}

// Función para validación parcial (para actualizaciones parciales)
export function validatePartialPacientes (object) {
  return pacientesSchema.partial().safeParse(object) // Permite que los campos no requeridos sean omitidos
}
