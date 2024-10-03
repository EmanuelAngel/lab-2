import { z } from 'zod'

const userScheme = z.object({
  email: z.string().email(),
  username: z.string().min(3),
  password_hash: z.string().min(8),
  name: z.string().min(3),
  nationality: z.string().min(3),
  phone: z.string().min(10),
})

export function validateUser(object) {
  return userScheme.safeParse(object)
}

export function validatePartialUser(object) {
  return userScheme.partial().safeParse(object)
}
