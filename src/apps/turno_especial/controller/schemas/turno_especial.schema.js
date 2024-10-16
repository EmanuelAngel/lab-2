import { z } from 'zod'

// Esquema de validación para turno_especial
const turnoEspecialSchema = z.object({
  id_agenda_base: z.number().int().min(1),
  fecha: z.string().refine(fecha => {
    const today = new Date()
    const inputDate = new Date(fecha)
    return inputDate >= today
  }, { message: 'La fecha debe ser en el futuro' }),
  horario_inicio: z.string().refine(horario => /^\d{2}:\d{2}:\d{2}$/.test(horario), {
    message: 'El horario inicio debe estar en el formato HH:MM:SS'
  }),
  horario_fin: z.string().refine(horario => /^\d{2}:\d{2}:\d{2}$/.test(horario), {
    message: 'El horario fin debe estar en el formato HH:MM:SS'
  }),
  id_estado_turno: z.number().int().min(1),
  motivo: z.string().max(255).optional()
})

// Función para validar los datos completos
export function validateTurnoEspecial (object) {
  return turnoEspecialSchema.safeParse(object)
}

// Función para validación parcial
export function validatePartialTurnoEspecial (object) {
  return turnoEspecialSchema.partial().safeParse(object)
}
