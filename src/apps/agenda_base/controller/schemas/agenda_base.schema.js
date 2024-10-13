import { z } from 'zod'

// Esquema de validación para agenda_base
const agendaBaseSchema = z.object({
  id_profesional: z.number().int().min(1),
  id_sucursal: z.number().int().min(1),
  id_especialidad: z.number().int().min(1),
  id_estado_agenda: z.number().int().min(1).max(4) // Validación para id_estado_agenda
})

// Esquema de validación solo para el id_estado_agenda
export const validateEstadoAgenda = z.object({
  id_estado_agenda: z.number().int().min(1).max(4)
})

export function validateAgendaBase (object) {
  return agendaBaseSchema.safeParse(object)
}

export function validatePartialAgendaBase (object) {
  return agendaBaseSchema.partial().safeParse(object)
}
