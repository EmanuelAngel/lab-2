import { z } from 'zod'

const especialidadesSchema = z.object({
  nombre: z.string().min(3).max(100),
  estado: z.enum(['0', '1']) // Solo puede ser '0' o '1' como string

})

export function validateEspecialidades (object) {
  return especialidadesSchema.safeParse(object)
}

export function validatePartialEspecialidades (object) {
  return especialidadesSchema.partial().safeParse(object)
}
