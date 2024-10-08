import { z } from 'zod'

// Esquema para validar los datos de un rol
const rolesSchema = z.object({
  nombre: z.string().min(2).max(100),
  descripcion: z.string().min(2).max(255)

})

// Función para validar todos los campos obligatorios de un rol
export function validateRole (object) {
  return rolesSchema.safeParse(object) // Revisa si todos los campos cumplen las reglas del esquema
}

// Función para validación parcial (para actualizaciones parciales)
export function validatePartialRole (object) {
  return rolesSchema.partial().safeParse(object) // Permite que los campos no requeridos sean omitidos
}
