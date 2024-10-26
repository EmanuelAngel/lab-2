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

const profesionalesWithUserSchema = z.object({
  nombre_usuario: z.string().min(3),
  nombre: z.string().min(3),
  contraseña: z.string().min(3),
  apellido: z.string().min(3),
  dni: z.string().min(3),
  telefono: z.string().min(3),
  direccion: z.string().min(3),
  email: z.string().min(3),
  especialidades: z.array(z.object({
    especialidad_id: z.number().int().positive(),
    matricula: z.string().min(3)
  }))
})

export function validateProfesionalesWithUser (object) {
  return profesionalesWithUserSchema.safeParse(object)
}

export function validatePartialProfesionalesWithUser (object) {
  return profesionalesWithUserSchema.partial().safeParse(object)
}
