import { z } from 'zod'

// Esquema de validación para agenda_base
const agendaBaseSchema = z.object({
  id_sucursal: z.number().int().min(1),
  estado: z.number().int().min(0).max(1).optional(),
  id_estado_agenda: z.number().int().min(1).max(4),
  id_clasificacion: z.number().int().min(1),
  duracion_turno: z.number().int().positive(),
  sobreturnos_maximos: z.number().int().nonnegative(),
  matricula: z.string().max(25)
})

// Esquema de validación para el id_estado_agenda
export const validateEstadoAgenda = z.object({
  id_estado_agenda: z.number().int().min(1).max(4)
})

// Funciones para validación
export function validateAgendaBase (object) {
  return agendaBaseSchema.safeParse(object)
}

export function validatePartialAgendaBase (object) {
  return agendaBaseSchema.partial().safeParse(object)
}
