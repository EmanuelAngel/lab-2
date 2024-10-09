import { z } from 'zod'

const obraSocialPacienteSchema = z.object({
  id_paciente: z.number().int(),
  id_obra_social: z.number().int()

})

export function validateObraSocialPaciente (object) {
  return obraSocialPacienteSchema.safeParse(object) // Revisa si todos los campos cumplen las reglas del esquema
}

export function validatePartialObraSocialPaciente (object) {
  return obraSocialPacienteSchema.partial().safeParse(object) // Permite que los campos no requeridos sean omitidos
}
