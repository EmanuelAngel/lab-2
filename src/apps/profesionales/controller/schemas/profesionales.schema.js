import { z } from 'zod'

const profesionalesSchema = z.object({
  nombre: z.string().min(2).max(255),
  apellido: z.string().min(2).max(255),
  numero_documento: z.string().min(7).max(20),
  telefono: z.string().min(10).max(20).nullable(),
  email: z.string().email().max(100).nullable()
})

export function validateProfesionales (object) {
  return profesionalesSchema.safeParse(object)
}

export function validatePartialProfesionales (object) {
  return profesionalesSchema.partial().safeParse(object)
}
