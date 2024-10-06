import { z } from 'zod'

const especialidadesSchema = z.object({
  nombre: z.string().min(3).max(100)
})

export function validateEspecialidades (object) {
  return especialidadesSchema.safeParse(object)
}

export function validatePartialEspecialidades (object) {
  return especialidadesSchema.partial().safeParse(object)
}
