import { z } from 'zod'

const profesionalesSchema = z.object({
  id_usuario: z.number().int().min(1)
})

export function validateProfesionales (object) {
  return profesionalesSchema.safeParse(object)
}

export function validatePartialProfesionales (object) {
  return profesionalesSchema.partial().safeParse(object)
}
