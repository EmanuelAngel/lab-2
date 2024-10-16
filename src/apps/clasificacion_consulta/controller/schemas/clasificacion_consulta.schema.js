import { z } from 'zod'

// Esquema de validación para clasificacion_consulta
const clasificacionConsultaSchema = z.object({
  nombre_clasificacion: z.string().min(2).max(50),
  descripcion: z.string().max(255).optional()
})

// Función para validar los datos completos
export function validateClasificacionConsulta (object) {
  return clasificacionConsultaSchema.safeParse(object)
}

// Función para validación parcial
export function validatePartialClasificacionConsulta (object) {
  return clasificacionConsultaSchema.partial().safeParse(object)
}
