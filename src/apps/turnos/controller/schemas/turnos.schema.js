import { z } from 'zod'

// Esquema de validación para los turnos
const turnosSchema = z.object({
  id_agenda_base: z.number().int().min(1),
  id_paciente: z.number().int().min(1),
  id_estado_turno: z.number().int().min(1),
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
  motivo_consulta: z.string().max(255).optional(),
  es_sobreturno: z.number().int().min(0).max(1).optional()
})

// Función para validar todos los campos
export function validateTurno (object) {
  return turnosSchema.safeParse(object)
}

// Función para validación parcial
export function validatePartialTurno (object) {
  return turnosSchema.partial().safeParse(object)
}
