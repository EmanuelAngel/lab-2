import { z } from 'zod'

const especialidadesProfesionalSchema = z.object({
  id_profesional: z.number().int(),
  id_especialidad: z.number().int(),
  matricula: z.string().max(25)
})

export function validateEspecialidadesProfesional (object) {
  return especialidadesProfesionalSchema.safeParse(object)
}

export function validatePartialEspecialidadesProfesional (object) {
  return especialidadesProfesionalSchema.partial().safeParse(object)
}
