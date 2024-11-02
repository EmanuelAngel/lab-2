import { z } from 'zod'

// Esquema de validación para los días
const diasSchema = z.object({
  dia: z.string().min(1).max(11)
})

// Validación completa de todos los campos obligatorios
export function validateDias (object) {
  return diasSchema.safeParse(object)
}

// Validación parcial para actualizaciones parciales
export function validatePartialDias (object) {
  return diasSchema.partial().safeParse(object)
}
