import { z } from 'zod'

// Esquema de validación para estados_turno
const estadosTurnoSchema = z.object({
  nombre_estado: z.string().min(1).max(50),
  estado_activo: z.number().int().optional() // Puede ser 0 o 1
})

// Función para validar los datos completos
export function validateEstadoTurno (object) {
  return estadosTurnoSchema.safeParse(object)
}

// Función para validación parcial
export function validatePartialEstadoTurno (object) {
  return estadosTurnoSchema.partial().safeParse(object)
}
