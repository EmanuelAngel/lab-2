import { z } from 'zod'

const diasAgendaSchema = z.object({
  id_dia: z.number().int(),
  id_agenda_base: z.number().int(),
  horario_inicio: z.string().refine(hora => /^\d{2}:\d{2}:\d{2}$/.test(hora), {
    message: 'El horario de inicio debe estar en el formato HH:MM:SS'
  }),
  horario_fin: z.string().refine(hora => /^\d{2}:\d{2}:\d{2}$/.test(hora), {
    message: 'El horario de fin debe estar en el formato HH:MM:SS'
  })
})

export function validateDiasAgenda (object) {
  return diasAgendaSchema.safeParse(object)
}

export function validatePartialDiasAgenda (object) {
  return diasAgendaSchema.partial().safeParse(object)
}
