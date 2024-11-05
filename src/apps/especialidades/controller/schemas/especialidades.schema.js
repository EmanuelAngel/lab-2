import { z } from 'zod'

const especialidadesSchema = z.object({
  nombre: z.string().min(3).max(100),
  estado: z.number().int().min(0).max(1).optional()
})

export function validateEspecialidades (object) {
  return especialidadesSchema.safeParse(object)
}

export function validatePartialEspecialidades (object) {
  return especialidadesSchema.partial().safeParse(object)
}
