import { z } from 'zod'

// Esquema para validar los datos de una relación entre profesional y especialidad
const especialidadesProfesionalSchema = z.object({
  id_profesional: z.number().int(), // Debe ser un número entero (ID del profesional)
  id_especialidad: z.number().int() // Debe ser un número entero (ID de la especialidad)

})

// Función para validar todos los campos obligatorios de una relación profesional-especialidad
export function validateEspecialidadesProfesional (object) {
  return especialidadesProfesionalSchema.safeParse(object) // Revisa si todos los campos cumplen las reglas del esquema
}

// Función para validación parcial (para actualizaciones parciales)
export function validatePartialEspecialidadesProfesional (object) {
  return especialidadesProfesionalSchema.partial().safeParse(object) // Permite que los campos no requeridos sean omitidos
}
