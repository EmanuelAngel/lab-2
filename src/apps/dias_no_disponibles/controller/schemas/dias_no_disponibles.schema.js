import { z } from 'zod'

// Esquema para validar los datos de un día no disponible
const diasNoDisponiblesSchema = z.object({
  id_agenda_base: z.number().int(),
  fecha: z.string().refine(fecha => {
    const today = new Date()
    const inputDate = new Date(fecha)
    return inputDate >= today
  }, { message: 'La fecha debe ser en el futuro' }),
  motivo: z.string().max(255).optional(),
  tipo_bloqueo: z.string().max(50).optional()
})

// Función para validar todos los campos
export function validateDiasNoDisponibles (object) {
  return diasNoDisponiblesSchema.safeParse(object)
}

// Función para validación parcial
export function validatePartialDiasNoDisponibles (object) {
  return diasNoDisponiblesSchema.partial().safeParse(object)
}
