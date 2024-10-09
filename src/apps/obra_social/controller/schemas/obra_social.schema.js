import { z } from 'zod'

const obraSocialSchema = z.object({
  nombre: z.string()
    .min(3, { message: 'El nombre debe tener al menos 3 caracteres' })
    .max(100, { message: 'El nombre no debe superar los 100 caracteres' })
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, { message: 'El nombre solo puede contener letras y espacios' }) // Solo letras y espacios

})

export function validateObraSocial (object) {
  return obraSocialSchema.safeParse(object)
}

export function validatePartialObraSocial (object) {
  return obraSocialSchema.partial().safeParse(object)
}
