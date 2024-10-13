import { z } from 'zod'

// Esquema para validar los datos de un estado de agenda
const estadoAgendaSchema = z.object({
  nombre_estado: z.string().min(2).max(50)
})

// Función para validar todos los campos obligatorios de un estado de agenda
export function validateEstadoAgenda (object) {
  return estadoAgendaSchema.safeParse(object)
}

// Función para validación parcial (para actualizaciones parciales)
export function validatePartialEstadoAgenda (object) {
  return estadoAgendaSchema.partial().safeParse(object)
}
